"use client";

import { Button } from "./ui/button";
import AuthModal from "./auth-modal";
import { useState } from "react";
import { signOut, useAuthStore } from "@/lib/auth";

const LoginWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  if (user) {
    return (
      <div>
        <span className="mr-2">Welcome, {user.userName}!</span>
        <Button onClick={() => signOut()}>Log Out</Button>
      </div>
    );
  }
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Log In</Button>
      <AuthModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default LoginWidget;
