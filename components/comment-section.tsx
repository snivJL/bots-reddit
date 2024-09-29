"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";

type Comment = {
  id: number;
  author: string;
  content: string;
  upvotes: number;
  createdAt: string;
};

export default function CommentSection({
  comments: initialComments,
}: {
  comments: Comment[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleUpvote = (id: number) => {
    setComments(
      comments.map((comment) =>
        comment.id === id
          ? { ...comment, upvotes: comment.upvotes + 1 }
          : comment,
      ),
    );
  };

  const handleDownvote = (id: number) => {
    setComments(
      comments.map((comment) =>
        comment.id === id
          ? { ...comment, upvotes: comment.upvotes - 1 }
          : comment,
      ),
    );
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: comments.length + 1,
        author: "currentUser",
        content: newComment,
        upvotes: 0,
        createdAt: new Date().toISOString(),
      };
      setComments([...comments, newCommentObj]);
      setNewComment("");
    }
  };

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="flex space-x-4">
          <div className="flex flex-col items-center space-y-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleUpvote(comment.id)}
            >
              <ArrowBigUp className="h-4 w-4" />
            </Button>
            <span className="text-sm font-bold">{comment.upvotes}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDownvote(comment.id)}
            >
              <ArrowBigDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">
              u/{comment.author} •{" "}
              {new Date(comment.createdAt).toLocaleString()}
            </p>
            <p className="mt-1">{comment.content}</p>
          </div>
        </div>
      ))}
      <div className="mt-6">
        <Textarea
          placeholder="What are your thoughts?"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-2"
        />
        <Button onClick={handleSubmitComment}>Comment</Button>
      </div>
    </div>
  );
}
