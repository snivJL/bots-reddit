"use server";

import { comments, posts, users } from "@/schema";
import { eq, desc, count, sql } from "drizzle-orm";
import { uploadMedia } from "@/lib/upload-media";
import { bots, generateBotPost } from "@/bots";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { VoteDirection } from "@/types";

export async function getAllPosts() {
  try {
    const allPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        upvotes: posts.upvotes,
        authorId: posts.authorId,
        content: posts.content,
        mediaType: posts.mediaType,
        mediaUrl: posts.mediaUrl,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        authorName: users.fullName,
        commentCount: count(posts.upvotes),
      })
      .from(posts)
      .leftJoin(users, eq(users.id, posts.authorId))
      .leftJoin(comments, eq(comments.postId, posts.id))
      .groupBy(posts.id, users.fullName)
      .orderBy(desc(posts.upvotes));

    return allPosts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return null;
  }
}

export async function getPostById(id: number) {
  try {
    const postResult = await db
      .select({
        post: posts,
        author: users,
      })
      .from(posts)
      .leftJoin(users, eq(users.id, posts.authorId))
      .where(eq(posts.id, id))
      .limit(1);

    if (postResult.length === 0) {
      return null;
    }

    const result = await db
      .select({
        comments,
        author: users,
      })
      .from(comments)
      .leftJoin(users, eq(users.id, comments.authorId))
      .where(eq(comments.postId, id));

    return {
      ...postResult[0].post,
      author: postResult[0].author,
      comments: result.map((c) => ({
        ...c.comments,
        author: c.author,
      })),
    };
  } catch (error) {
    console.error(`Error fetching post with id ${id}:`, error);
    return null;
  }
}

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const mediaFile = formData.get("media") as File | null;
  const authorId = formData.get("authorId") as string;

  let mediaUrl = null;
  let mediaType = null;

  if (mediaFile) {
    mediaUrl = await uploadMedia(mediaFile);
    mediaType = mediaFile.type.startsWith("image/") ? "image" : "video";
  }

  try {
    const [newPost] = await db
      .insert(posts)
      .values({
        title,
        content,
        mediaUrl,
        mediaType,
        upvotes: 0,
        authorId: +authorId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath("/");
    return newPost;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }
}

export async function createBotPost() {
  const bot = bots[Math.floor(Math.random() * bots.length)];
  const res = await generateBotPost(
    bot,
    "Generate a Reddit post related to your expertise with a catchy title and a contnet expanding on the title"
  );
  const { title, content } = res.post;

  await db.insert(posts).values({
    title,
    content,
    authorId: bot.userId,
    createdAt: new Date(),
  });

  revalidatePath("/");
}
