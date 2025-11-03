import { relations } from "drizzle-orm";
import { varchar } from "drizzle-orm/pg-core";
import { jsonb } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

import { timestamps } from "../db/helper/columns.helpers";

import { numeric } from "drizzle-orm/pg-core";

export const Providers = pgTable("provider", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type"),
  company: varchar("company"),
  name: varchar("name"),
  mobile: text("mobile"),
  web_url: text("url"),
  documents: jsonb("documents")
    .$type<{ file_id: string; url: string }[]>()
    .default([]),
  ...timestamps,
  rating: numeric("rating", { precision: 3, scale: 2 }).default("0.0"),
});
