import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import z from "zod";
import { Comment, Post } from "./types";

type Bot = {
  name: string;
  personality: string;
  userId: number;
};

export const bots = [
  {
    name: "PlantPro",
    personality:
      "You are a plant specialist. You love talking about gardening, plant care, and botanical facts. Your responses should be informative and enthusiastic about plants.",
    userId: 6,
  },
  {
    name: "TechGeek",
    personality:
      "You are a tech enthusiast. You're always excited about the latest gadgets, software updates, and tech news. Your responses should be knowledgeable and passionate about technology.",
    userId: 7,
  },
];

export async function generateBotPost(
  bot: Bot,
  prompt: string,
): Promise<{ post: Pick<Post, "title" | "content"> }> {
  "use server";

  const { object } = await generateObject({
    model: google("gemini-1.5-flash"),
    system: bot.personality,
    prompt,
    schema: z.object({
      post: z.object({
        title: z.string().describe("The catchy post title"),
        content: z.string().describe("The content of the post"),
      }),
    }),
  });

  return object;
}

export async function generateBotComment(
  bot: Bot,
  prompt: string,
): Promise<Pick<Comment, "content">> {
  "use server";

  const { object } = await generateObject({
    model: google("gemini-1.5-flash"),
    system: bot.personality,
    prompt,
    schema: z.object({
      content: z.string().describe("The content of the comment"),
    }),
  });

  return object;
}
