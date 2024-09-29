import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, signUp } from "@/lib/auth";
import { FirebaseError } from "firebase/app";
type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
};

const isFirebaseError = (error: unknown): error is FirebaseError => {
  return typeof error === "object" && error !== null && "code" in error;
};

const getErrorMessage = (errorCode: string) => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "Email already in use. Please try logging in.";
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/weak-password":
      return "Password is too weak. Please use a stronger password.";
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password.";
    default:
      return "An error occurred. Please try again.";
  }
};

export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
}: AuthModalProps) {
  const [authState, setAuthState] = useState({
    email: "",
    password: "",
    isSignUp: false,
    error: "",
    isLoading: false,
  });
  const { email, password, isSignUp, error, isLoading } = authState;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthState((prev) => ({ ...prev, error: "", isLoading: true }));
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      onAuthSuccess?.();
      onClose();
    } catch (error) {
      if (isFirebaseError(error)) {
        setAuthState((prev) => ({
          ...prev,
          error: getErrorMessage(error.code),
        }));
      } else {
        console.error("Unexpected error:", error);
        setAuthState((prev) => ({
          ...prev,
          error: "An unexpected error occurred. Please try again.",
        }));
      }
    } finally {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isSignUp ? "Sign Up" : "Log In"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setAuthState((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setAuthState((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          <Button isLoading={isLoading} className="relative" type="submit">
            {isSignUp ? "Sign Up" : "Log In"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setAuthState((prev) => ({
                ...prev,
                isSignUp: !prev.isSignUp,
              }))
            }
          >
            {isSignUp
              ? "Already have an account? Log In"
              : "Need an account? Sign Up"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
