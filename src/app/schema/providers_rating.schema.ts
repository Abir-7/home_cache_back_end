import { text } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { Providers } from "./providers.schema";

import { numeric } from "drizzle-orm/pg-core";

import { UserProfiles } from "./user_profiles.schema";
import { timestamps } from "../db/helper/columns.helpers";

export const ProvidersRating = pgTable("providers_rating", {
  id: uuid("id").primaryKey().defaultRandom(),
  provider_id: uuid("provider_id")
    .references(() => Providers.id)
    .notNull(),
  rating: numeric("rating", { precision: 2, scale: 1 }).notNull(),
  review_text: text("review_text"),
  user_id: uuid("user_id")
    .references(() => UserProfiles.user_id)
    .notNull(),
  ...timestamps,
});
