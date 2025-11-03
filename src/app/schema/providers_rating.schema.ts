import { text, uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { Providers } from "./providers.schema";
import { Users } from "./user.schema";
import { numeric } from "drizzle-orm/pg-core";

import { timestamps } from "../db/helper/columns.helpers";
import { Tasks } from "./task.schema";

export const ProvidersRating = pgTable("prodivers_rating", {
  id: uuid("id").primaryKey().defaultRandom(),
  provider_id: uuid("provider_id").notNull(),
  rated_by: uuid("rated_by").notNull(), // user id
  task_id: uuid("task_id")
    .notNull()
    .references(() => Tasks.id, { onDelete: "cascade" }),
  rating: numeric("rating", { precision: 2, scale: 1 }).notNull(), // e.g., 4.5
  review: text("review"),
  ...timestamps,
});
