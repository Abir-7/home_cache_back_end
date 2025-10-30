import { relations } from "drizzle-orm";
import { varchar } from "drizzle-orm/pg-core";
import { jsonb } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { ProvidersRating } from "./providers_rating.schema";
import { timestamps } from "../db/helper/columns.helpers";
import { LastServiceByProvider } from "./last_service_by_provider.schema";

export const Providers = pgTable("provider", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type"),
  company: varchar("company"),
  name: varchar("name"),
  mobile: text("mobile"),
  url: text("url"),
  documents: jsonb("documents")
    .$type<{ file_id: string; url: string }[]>()
    .default([]),
  ...timestamps,
});

export const ProviderRelation = relations(Providers, ({ many }) => ({
  ratings: many(ProvidersRating),
  last_services: many(LastServiceByProvider),
}));
