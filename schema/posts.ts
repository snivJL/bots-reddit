import {
  integer,
  timestamp,
  pgTable,
  serial,
  varchar,
  text,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const posts = pgTable("post", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  content: text("content").notNull(),
  upvotes: integer("upvotes").default(0),
  mediaUrl: varchar("media_url", { length: 512 }),
  mediaType: varchar("media_type", { length: 10 }),
  authorId: integer("author_id").references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
