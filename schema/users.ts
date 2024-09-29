import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 32 }).notNull(),
  userName: varchar("user_name", { length: 32 }).notNull(),
  phone: varchar("phone", { length: 16 }),
  email: varchar("email", { length: 32 }),
  firebaseUid: varchar("firebase_uid").notNull().unique(),
});
