import { defineConfig } from "drizzle-kit";
import { DRIZZLE_DB_URL } from "./lib/constants";

export default defineConfig({
  schema: "./schema/*",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: DRIZZLE_DB_URL,
  },
});
