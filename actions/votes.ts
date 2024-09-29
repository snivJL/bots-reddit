"use server";
import { db } from "@/lib/db";
import { comments, posts, votes } from "@/schema";
import type { VoteDirection } from "@/types";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type VotableType = "comment" | "post";

type Votable = {
  table: typeof comments | typeof posts;
  idField: typeof comments.id | typeof posts.id;
  upvotesField: typeof comments.upvotes | typeof posts.upvotes;
  pathField: typeof comments.postId | typeof posts.id;
};

const votables: Record<VotableType, Votable> = {
  comment: {
    table: comments,
    idField: comments.id,
    upvotesField: comments.upvotes,
    pathField: comments.postId,
  },
  post: {
    table: posts,
    idField: posts.id,
    upvotesField: posts.upvotes,
    pathField: posts.id,
  },
};

export async function getExistingVote(
  userId: number,
  votableId: number,
  votableType: VotableType
) {
  const [existingVote] = await db
    .select()
    .from(votes)
    .where(
      and(
        eq(votes.userId, userId),
        eq(votes[`${votableType}Id` as "commentId" | "postId"], votableId)
      )
    );
  return existingVote;
}

async function removeVote(voteId: number) {
  await db.delete(votes).where(eq(votes.id, voteId));
}

async function updateVote(voteId: number, value: number) {
  await db.update(votes).set({ value }).where(eq(votes.id, voteId));
}

async function insertVote(
  userId: number,
  votableId: number,
  votableType: VotableType,
  value: number
) {
  await db.insert(votes).values({
    userId,
    [`${votableType}Id`]: votableId,
    value,
  });
}

async function updateVotableUpvotes(
  votableId: number,
  voteChange: number,
  votableType: VotableType
) {
  const votable = votables[votableType];
  const [updated] = await db
    .update(votable.table)
    .set({
      upvotes: sql`${votable.upvotesField} + ${voteChange}`,
    })
    .where(eq(votable.idField, votableId))
    .returning({ upvotes: votable.upvotesField, pathId: votable.pathField });

  revalidatePath(`/post/${updated.pathId}`);
  return updated?.upvotes ?? 0;
}

export async function vote(
  userId: number,
  votableId: number,
  votableType: VotableType,
  direction: VoteDirection
) {
  const existingVote = await getExistingVote(userId, votableId, votableType);
  const voteValue = direction === "up" ? 1 : -1;
  let voteChange = voteValue;

  if (existingVote) {
    if (existingVote.value === voteValue) {
      await removeVote(existingVote.id);
      voteChange = -existingVote.value;
    } else {
      await updateVote(existingVote.id, voteValue);
      voteChange = voteValue * 2;
    }
  } else {
    await insertVote(userId, votableId, votableType, voteValue);
  }

  return await updateVotableUpvotes(votableId, voteChange, votableType);
}

export async function upvoteComment(userId: number, commentId: number) {
  return vote(userId, commentId, "comment", "up");
}

export async function downvoteComment(userId: number, commentId: number) {
  return vote(userId, commentId, "comment", "down");
}

export async function upvotePost(userId: number, postId: number) {
  return vote(userId, postId, "post", "up");
}

export async function downvotePost(userId: number, postId: number) {
  return vote(userId, postId, "post", "down");
}
