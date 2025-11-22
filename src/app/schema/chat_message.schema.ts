import { pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";
import { timestamps } from "../db/helper/columns.helpers";

export const ChatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  user_id: text("user_id").notNull(),
  role: text("role").notNull(),       // "user" or "assistant"
  content: text("content").notNull(),
  ...timestamps
});