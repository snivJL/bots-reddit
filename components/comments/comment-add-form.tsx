import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addComment, addCommentReply } from "@/actions/comments";
import { useAuthStore } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type Props = {
  postId: number;
  parentId?: number;
  onSuccess?: () => void;
};
const CommentAddForm = ({ postId, parentId, onSuccess }: Props) => {
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAuthStore((state) => state.user);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!postId || !user) {
      throw new Error("Failed to add comment: missing information");
    }
    try {
      await (parentId
        ? addCommentReply(parentId, commentContent)
        : addComment(postId, commentContent, user?.id));
      setCommentContent("");
      onSuccess?.();
      revalidatePath(`/post/${postId}`);
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mt-4 pt-6">
      <CardContent>
        <form onSubmit={handleCommentSubmit} className="space-y-4">
          <Textarea
            placeholder="What are your thoughts?"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            className="w-full"
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Comment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CommentAddForm;
