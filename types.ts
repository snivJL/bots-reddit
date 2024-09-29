import { InferSelectModel } from "drizzle-orm";
import { users, posts, comments, votes } from "@/schema";
import { getPostById } from "./actions/posts";

export type User = InferSelectModel<typeof users>;
export type Post = InferSelectModel<typeof posts>;
export type Comment = InferSelectModel<typeof comments>;
export type Vote = InferSelectModel<typeof votes>;

export type PostDetail = Awaited<ReturnType<typeof getPostById>>;

export type PostWithAuthorAndCommentCount = Post & {
  authorName: string | null;
  commentCount: number;
};

export type CommentWithAuthor = Omit<Comment, "authorId" | "postId"> & {
  author: Omit<User, "firebaseUid">;
};

export type CommentWithAuthorAndReplies = CommentWithAuthor & {
  replies: CommentWithAuthorAndReplies[];
};

export type VoteDirection = "up" | "down";
