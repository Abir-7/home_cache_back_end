import { pgTable } from "drizzle-orm/pg-core";
import { timestamps } from "../db/helper/columns.helpers";
import { uuid } from "drizzle-orm/pg-core";
import { Providers } from "./providers.schema";
import { UserProfiles } from "./user_profiles.schema";
import { relations } from "drizzle-orm";

export const LastServiceByProvider = pgTable("last_service_by_provider", {
  id: uuid("id").primaryKey().defaultRandom(),
  provider_id: uuid("provider_id")
    .references(() => Providers.id)
    .notNull(),
  user_id: uuid("user_id")
    .references(() => UserProfiles.user_id)
    .notNull(),
  ...timestamps,
});

export const LastServiceByProviderRelations = relations(
  LastServiceByProvider,
  ({ one }) => ({
    provider: one(Providers, {
      fields: [LastServiceByProvider.provider_id],
      references: [Providers.id],
    }),
    user: one(UserProfiles, {
      fields: [LastServiceByProvider.user_id],
      references: [UserProfiles.user_id],
    }),
  })
);
