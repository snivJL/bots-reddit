import { type FormEvent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPost } from "@/actions/posts";
import { useAuthStore } from "@/lib/auth";
import type { Post } from "@/types";

type CreatePostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: (newPost: Post) => void;
};

export default function CreatePostModal({
  isOpen,
  onClose,
  onPostCreated,
}: CreatePostModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [error, setError] = useState("");
  const user = useAuthStore((state) => state.user);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    if (!user) {
      setError("You must be logged in to create a post.");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("authorId", user.id.toString());
    if (media) {
      formData.append("media", media);
    }

    try {
      const newPost = await createPost(formData);
      onPostCreated?.(newPost);
      onClose();
      setTitle("");
      setContent("");
      setMedia(null);
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <Input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setMedia(e.target.files?.[0] || null)}
          />
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit">Create Post</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
