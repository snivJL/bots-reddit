import { runBotActions } from "@/bot-scheduler";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await runBotActions();
    return NextResponse.json({ message: "Bot actions executed successfully" });
  } catch (error) {
    console.error("Error executing bot actions:", error);
    return NextResponse.json(
      { error: "Failed to execute bot actions" },
      { status: 500 },
    );
  }
}
