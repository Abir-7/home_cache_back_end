import { uuid } from "drizzle-orm/pg-core";
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
  ...timestamps,
});
export const UserHomeDataRelation = relations(UserHomeData, ({ one }) => ({
  user: one(Users, {
    fields: [UserHomeData.user_id],
    references: [Users.id],
  }),
}));
