import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { DRIZZLE_DB_URL } from "./constants";

const sql = neon(DRIZZLE_DB_URL);
export const db = drizzle(sql);
