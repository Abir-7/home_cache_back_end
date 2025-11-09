import { jsonb, uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { Users } from "./user.schema";
import { timestamps } from "../db/helper/columns.helpers";
import { varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const UserHomeData = pgTable("user_home_data", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => Users.id, { onDelete: "cascade" }),
  home_type: varchar("home_type"),
  home_address: varchar("home_address"),
  home_power_type: varchar("home_power_type").array(),
  home_water_supply_type: varchar("home_water_supply_type").array(),
  home_utilities: varchar("home_utilities").array(),
  home_heating_type: varchar("home_heating_type").array(),
  home_heating_power: varchar("home_heating_power"),
  home_cooling_type: varchar("home_cooling_type").array(),
  responsible_for: varchar("responsible_for").array(),
  ...timestamps,
  want_to_track: varchar("want_to_track").array(),
  last_service_data: jsonb("last_service_data"),
});

export const UserHomeDataRelation = relations(UserHomeData, ({ one }) => ({
  user: one(Users, {
    fields: [UserHomeData.user_id],
    references: [Users.id],
  }),
}));
