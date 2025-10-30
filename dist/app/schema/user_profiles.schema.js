"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfilesRelations = exports.UserProfiles = exports.genderEnum = exports.genders = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const columns_helpers_1 = require("../db/helper/columns.helpers");
const user_schema_1 = require("./user.schema");
const drizzle_orm_1 = require("drizzle-orm");
// Optional: Gender enum
exports.genders = ["male", "female", "other"];
exports.genderEnum = (0, pg_core_1.pgEnum)("gender_enum", exports.genders);
// UserProfiles table
exports.UserProfiles = (0, pg_core_1.pgTable)("user_profiles", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), user_id: (0, pg_core_1.uuid)("user_id")
        .notNull()
        .references(() => user_schema_1.Users.id, { onDelete: "cascade" }), full_name: (0, pg_core_1.varchar)("full_name", { length: 100 }).notNull(), user_name: (0, pg_core_1.varchar)("user_name", { length: 50 }).notNull().unique(), mobile: (0, pg_core_1.varchar)("mobile", { length: 20 }).notNull().unique(), address: (0, pg_core_1.text)("address").notNull(), gender: (0, exports.genderEnum)("gender").notNull(), image: (0, pg_core_1.text)("image") }, columns_helpers_1.timestamps));
exports.UserProfilesRelations = (0, drizzle_orm_1.relations)(exports.UserProfiles, ({ one }) => ({
    user: one(user_schema_1.Users, {
        fields: [exports.UserProfiles.user_id],
        references: [user_schema_1.Users.id],
    }),
}));
