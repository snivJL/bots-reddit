"use client";

import { MoreHorizontalIcon, MessageSquareIcon } from "lucide-react";
import type { CommentWithAuthorAndReplies, Vote } from "@/types";
import Upvotes from "../vote";
import { Button } from "../ui/button";
import { downvoteComment, upvoteComment } from "@/actions/votes";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CommentAddForm from "./comment-add-form";
import { useAuthStore } from "@/lib/auth";

type Props = {
  comment: CommentWithAuthorAndReplies;
};

const CommentCard = ({ comment }: Props) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const params = useParams();
  const user = useAuthStore((state) => state.user);

  if (!user?.id) {
    return <></>;
  }

  // const currentVote = comment.votes.find((vote) => vote.userId === user.id);
  // console.log(comment.userVote);
  return (
    <div className="flex space-x-3 p-4 rounded-lg shadow-sm text-sm">
      <Upvotes
        upvotes={comment.upvotes || 0}
        onDownvote={() => downvoteComment(user?.id, comment.id)}
        onUpvote={() => upvoteComment(user?.id, comment.id)}
        // userVote={comment.userVote?.value}
      />
      <div className="flex-grow">
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-gray-300 flex-shrink-0"></div>
          <span className="text-sm font-semibold ">
            {comment.author.userName}
          </span>
          <span className="text-xs ">
            {comment.createdAt
              ? new Date(comment.createdAt).toLocaleString()
              : new Date().toLocaleString()}
          </span>
        </div>
        <p className="mb-2">{comment.content}</p>

        <div className="flex items-center space-x-4 text-xs ">
          <Button variant="ghost" onClick={() => setShowReplyForm(true)}>
            <MessageSquareIcon className="w-4 h-4 mr-2" />
            <span>Reply</span>
            {comment.parentCommentId}
          </Button>
          <Button variant="ghost">
            <MoreHorizontalIcon className="w-4 h-4 mr-2" />
            <span>More</span>
          </Button>
        </div>
        {showReplyForm && (
          <CommentAddForm postId={Number(params.id)} parentId={comment.id} />
        )}
        {comment.replies &&
          comment.replies.map((reply) => (
            <CommentCard key={reply.id} comment={reply} />
          ))}
      </div>
    </div>
  );
};

export default CommentCard;
