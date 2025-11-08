import { pgTable, uuid, varchar, text, pgEnum } from "drizzle-orm/pg-core";

import { timestamps } from "../db/helper/columns.helpers";
import { Users } from "./user.schema";
import { relations } from "drizzle-orm";

export const genders = ["male", "female", "other"] as const;
export type TGender = (typeof genders)[number];
export const genderEnum = pgEnum("gender_enum", genders);

export const UserProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => Users.id, { onDelete: "cascade" })
    .unique(), // FK to users table
  first_name: varchar("first_name", { length: 100 }),
  last_name: varchar("last_name", { length: 100 }),
  user_name: varchar("user_name", { length: 50 }).unique(),
  mobile: varchar("mobile", { length: 20 }).unique(),
  address: text("address"),
  gender: genderEnum("gender"),
  image: text("image"), // URL or base64
  image_id: text("image_id"), // URL or base64
  ...timestamps,
});

export const UserProfilesRelations = relations(UserProfiles, ({ one }) => ({
  user: one(Users, {
    fields: [UserProfiles.user_id],
    references: [Users.id],
  }),
}));
