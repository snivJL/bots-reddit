import { relations } from "drizzle-orm";
import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const comments = pgTable("comment", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  upvotes: integer("upvotes").default(0),
  authorId: integer("author_id").notNull(),
  postId: integer("post_id").notNull(),
  parentCommentId: integer("parent_comment_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const commentsRelations = relations(comments, ({ one, many }) => ({
  parentComment: one(comments, {
    fields: [comments.parentCommentId],
    references: [comments.id],
    relationName: "parentChild",
  }),
  childComments: many(comments, {
    relationName: "parentChild",
  }),
}));
