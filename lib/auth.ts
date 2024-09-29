import { auth } from "@/lib/firebase";
import { users } from "@/schema";
import { User } from "@/types";
import { eq } from "drizzle-orm";
import { getAuth } from "firebase-admin/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type User as FirebaseUser,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { db } from "./db";

type AuthStore = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: "user-info",
    }
  )
);

export function initializeAuth() {
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const userInfo = await fetchUserInfo(firebaseUser);
        useAuthStore.getState().setUser(userInfo);
      } catch (error) {
        console.error("Error fetching user info:", error);
        useAuthStore.getState().setUser(null);
      }
    } else {
      useAuthStore.getState().setUser(null);
    }
  });
}

async function fetchUserInfo(firebaseUser: FirebaseUser): Promise<User> {
  const token = await firebaseUser.getIdToken();
  const response = await fetch("/api/user-info", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }
  return response.json();
}

export async function signUp(email: string, password: string): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const userInfo = await fetchUserInfo(userCredential.user);
  useAuthStore.getState().setUser(userInfo);
  return userInfo;
}

export async function signIn(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const userInfo = await fetchUserInfo(userCredential.user);
  useAuthStore.getState().setUser(userInfo);
  return userInfo;
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
    useAuthStore.getState().setUser(null);
  } catch (error) {
    console.error("Error in signOut:", error);
    throw error;
  }
}
