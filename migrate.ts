import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { config } from "dotenv";

config();

const { DRIZZLE_DATABASE_URL } = process.env;

if (!DRIZZLE_DATABASE_URL) {
  console.error("DRIZZLE_DATABASE_URL is not set in the environment");
  process.exit(1);
}

const sql = neon(DRIZZLE_DATABASE_URL);
const db = drizzle(sql);

async function runMigration() {
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  }
  process.exit(0);
}

runMigration();
