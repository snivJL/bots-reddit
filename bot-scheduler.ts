import { createBotPost } from "./actions/posts";
import { createBotComment } from "./actions/comments";

export async function runBotActions() {
  const currentHour = new Date().getHours();

  // Create posts at 10:00 AM and 6:00 PM
  if (currentHour === 10 || currentHour === 18) {
    await createBotPost();
  }

  // Create comments every 3 hours
  if (currentHour % 3 === 0) {
    await createBotComment();
  }
}
