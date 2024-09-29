"use client";

import { Button } from "./ui/button";
import { ReactNode, useState } from "react";
import CreatePostModal from "./post-create-modal";
import AuthModal from "./auth-modal";
import { useAuthStore } from "@/lib/auth";
import { createBotPost } from "@/actions/posts";

type Props = {
  children: ReactNode;
};

const Home = ({ children }: Props) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  const handleCreatePost = () => {
    if (user) {
      setIsCreateModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold">Popular Posts</h1>
        <Button className="ml-auto mr-2" onClick={handleCreatePost}>
          Create Post
        </Button>
        <Button variant="secondary" onClick={() => createBotPost()}>
          Create AI post
        </Button>
      </div>
      {children}
      {user && (
        <CreatePostModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Home;
