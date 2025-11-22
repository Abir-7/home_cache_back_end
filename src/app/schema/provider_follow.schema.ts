
import { pgTable, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "../db/helper/columns.helpers";

export const FollowProviders = pgTable("follow_providers", {
  user_id: uuid("user_id").notNull(),
  provider_id: uuid("provider_id").notNull(),
  id: uuid("id").primaryKey().defaultRandom(),
...timestamps
});