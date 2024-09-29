"use server";

import CommentCard from "./comment-card";
import type { CommentWithAuthorAndReplies } from "@/types";

type Props = {
  comments: CommentWithAuthorAndReplies[] | null;
};

const CommentList = ({ comments }: Props) => {
  if (!comments) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;
