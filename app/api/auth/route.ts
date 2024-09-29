import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { db } from "@/lib/db";
import { users } from "@/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.firebaseUid, uid));

    if (existingUser.length === 0) {
      const newUser = await db
        .insert(users)
        .values({
          firebaseUid: uid,
          userName: email?.split("@")[0] || "",
          fullName: "",
          email: email ?? "",
        })
        .returning();

      return NextResponse.json(newUser[0]);
    } else {
      return NextResponse.json(existingUser[0]);
    }
  } catch (error) {
    console.error("Error in user sync:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
