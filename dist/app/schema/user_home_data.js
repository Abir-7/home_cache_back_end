"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserHomeDataRelation = exports.UserHomeData = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const pg_core_2 = require("drizzle-orm/pg-core");
const user_schema_1 = require("./user.schema");
const columns_helpers_1 = require("../db/helper/columns.helpers");
const pg_core_3 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.UserHomeData = (0, pg_core_2.pgTable)("user_home_data", Object.assign({ id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(), user_id: (0, pg_core_1.uuid)("user_id")
        .notNull()
        .references(() => user_schema_1.Users.id, { onDelete: "cascade" }), home_type: (0, pg_core_3.varchar)("home_type"), home_address: (0, pg_core_3.varchar)("home_address"), home_power_type: (0, pg_core_3.varchar)("home_power_type").array(), home_water_supply_type: (0, pg_core_3.varchar)("home_power_type").array(), home_utilities: (0, pg_core_3.varchar)("home_power_type").array() }, columns_helpers_1.timestamps));
exports.UserHomeDataRelation = (0, drizzle_orm_1.relations)(exports.UserHomeData, ({ one }) => ({
    user: one(user_schema_1.Users, {
        fields: [exports.UserHomeData.user_id],
        references: [user_schema_1.Users.id],
    }),
}));
