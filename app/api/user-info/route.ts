import { db } from "@/lib/db";
import { adminAuth } from "@/lib/firebase-admin";
import { users } from "@/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Fetch user info from the database using decodedToken.uid
    const [userInfo] = await db
      .select()
      .from(users)
      .where(eq(users.firebaseUid, decodedToken.uid));

    if (!userInfo) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userInfo);
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
