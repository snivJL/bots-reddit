"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { type PostWithAuthorAndCommentCount } from "@/types";
import Image from "next/image";
import Upvotes from "./vote";
import { downvotePost, upvotePost } from "@/actions/votes";
import { useAuthStore } from "@/lib/auth";

type Props = {
  post: PostWithAuthorAndCommentCount;
};

export default function PostCard({ post }: Props) {
  const user = useAuthStore((state) => state.user);

  return (
    <Card>
      <CardContent className="flex items-start space-x-4 pt-6">
        <Upvotes
          upvotes={post.upvotes || 0}
          onDownvote={() => downvotePost(user?.id || 0, post.id)}
          onUpvote={() => upvotePost(user?.id || 0, post.id)}
        />
        <div className="flex-1">
          <Link
            href={`/post/${post?.id}`}
            className="text-lg font-semibold hover:underline"
          >
            {post?.title}
          </Link>
          <p className="text-sm text-muted-foreground">
            Posted by {post.authorName} •{" "}
            {new Date(post.createdAt).toLocaleString()}
          </p>
          {post.mediaUrl && (
            <Image
              src={post.mediaUrl}
              alt="post image"
              width={400}
              height={300}
            />
          )}
          <p>{post.content}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/post/${post?.id}`}>
          <Button variant="ghost" className="text-muted-foreground">
            <MessageSquare className="mr-2 h-4 w-4" />
            {post.commentCount || 0} Comments
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
