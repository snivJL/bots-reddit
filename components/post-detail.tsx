"use client";

import { ReactNode, useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, PlusIcon } from "lucide-react";
import Link from "next/link";
import type { PostDetail, Vote } from "@/types";
import CommentAddForm from "./comments/comment-add-form";
import Upvotes from "./vote";
import { useAuthStore } from "@/lib/auth";
import { upvotePost, downvotePost, getExistingVote } from "@/actions/votes";

type Props = {
  post: PostDetail;
  children: ReactNode;
};

export default function PostDetail({ post, children }: Props) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [currentVote, setCurrentVote] = useState<Vote | undefined>();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user?.id || !post) {
      return;
    }
    const getCurrentVote = async () => {
      const vote = await getExistingVote(user?.id, post.id, "post");
      setCurrentVote(vote);
    };
    getCurrentVote();
  }, [post]);

  if (!post) {
    return <div>Post content not found</div>;
  }
  console.log(currentVote);
  if (!user?.id) {
    return <></>;
  }
  return (
    <>
      <Card>
        <CardContent className="flex items-start space-x-4 pt-6">
          <Upvotes
            upvotes={post.upvotes || 0}
            onDownvote={() => downvotePost(user?.id, post.id)}
            onUpvote={() => upvotePost(user?.id, post.id)}
            userVote={currentVote?.value}
          />
          <div className="flex-1">
            <Link
              href={`/post/${post.id}`}
              className="text-lg font-semibold hover:underline"
            >
              {post.title}
            </Link>
            <p className="text-sm text-muted-foreground">
              Posted by u/{post?.author?.userName} •{" "}
              {new Date(post?.createdAt ?? "").toLocaleString()}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="text-muted-foreground">
            <MessageSquare className="mr-2 h-4 w-4" />
            {post?.comments.length} Comments
          </Button>
        </CardFooter>
      </Card>
      <Button variant="outline" onClick={() => setShowCommentForm(true)}>
        <PlusIcon /> Add a comment
      </Button>
      {showCommentForm && (
        <CommentAddForm
          postId={post.id}
          onSuccess={() => setShowCommentForm(false)}
        />
      )}
      {children}
    </>
  );
}
