"use server";

import { bots, generateBotComment } from "@/bots";
import { db } from "@/lib/db";
import { posts, comments, users, votes } from "@/schema";
import type { CommentWithAuthorAndReplies } from "@/types";
import { sql, eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createBotComment() {
  const bot = bots[Math.floor(Math.random() * bots.length)];

  const randomPost = await db
    .select()
    .from(posts)
    .orderBy(sql`RANDOM()`)
    .limit(1);

  if (randomPost.length > 0) {
    const post = randomPost[0];
    const { content } = await generateBotComment(
      bot,
      `Write a short comment on this Reddit post: "${post.title}"`,
    );

    await db.insert(comments).values({
      content,
      authorId: bot.userId,
      postId: post.id,
      createdAt: new Date(),
    });
  }
}

export async function getAllComments(postId: number) {
  try {
    const result = await db
      .select({
        id: comments.id,
        content: comments.content,
        upvotes: comments.upvotes,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        author: {
          id: users.id,
          fullName: users.fullName,
          userName: users.userName,
          phone: users.phone,
          email: users.email,
        },
      })
      .from(comments)
      .leftJoin(users, eq(comments.authorId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.upvotes));

    return result;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return { comments: null, error: "Failed to fetch comments" };
  }
}

export async function getCommentsWithReplies(postId: number) {
  const allComments = await db
    .select({
      id: comments.id,
      content: comments.content,
      upvotes: comments.upvotes,
      parentCommentId: comments.parentCommentId,
      createdAt: comments.createdAt,
      updatedAt: comments.updatedAt,
      author: {
        id: users.id,
        fullName: users.fullName,
        userName: users.userName,
        phone: users.phone,
        email: users.email,
      },
      userVote: {
        commentId: votes.commentId,
        userId: votes.userId,
        value: votes.value,
      },
    })
    .from(comments)
    .innerJoin(users, eq(users.id, comments.authorId))
    .leftJoin(votes, and(eq(votes.commentId, comments.id), eq(votes.userId, 4)))
    .where(eq(comments.postId, postId))
    .orderBy(desc(comments.createdAt));

  function buildCommentTree(
    parentId: number | null,
  ): CommentWithAuthorAndReplies[] {
    return allComments
      .filter((c) => c.parentCommentId === parentId)
      .map((c) => ({
        ...c,
        replies: buildCommentTree(c.id),
      }));
  }

  const commentTree = buildCommentTree(null);

  return commentTree;
}

export async function addComment(
  postId: number,
  content: string,
  authorId: number,
) {
  try {
    const [newComment] = await db
      .insert(comments)
      .values({
        content,
        postId,
        authorId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    if (!newComment) {
      throw new Error("Failed to add comment");
    }

    revalidatePath(`/post/${postId}`);

    return { success: true, comment: newComment, error: null };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { success: false, comment: null, error: "Failed to add comment" };
  }
}

export async function addCommentReply(commentId: number, content: string) {
  try {
    const [parentComment] = await db
      .select({
        id: comments.id,
        postId: comments.postId,
        authorId: comments.authorId,
      })
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);

    const [newComment] = await db
      .insert(comments)
      .values({
        content,
        postId: parentComment.postId,
        authorId: parentComment.authorId,
        parentCommentId: parentComment.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    if (!newComment) {
      throw new Error("Failed to add comment");
    }

    revalidatePath(`/post/${parentComment.postId}}`);

    return { success: true, comment: newComment, error: null };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { success: false, comment: null, error: "Failed to add comment" };
  }
}
