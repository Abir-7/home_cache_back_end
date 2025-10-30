"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = seedAdmin;
require("dotenv/config");
const _1 = require(".");
const drizzle_orm_1 = require("drizzle-orm");
const user_schema_1 = require("../schema/user.schema");
const getHashedPassword_1 = __importDefault(require("../utils/helper/getHashedPassword"));
const user_profiles_schema_1 = require("../schema/user_profiles.schema");
const logger_1 = require("../utils/serverTools/logger");
function seedAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        const email = "admin@site.com";
        const plainPassword = "Admin@123";
        // Check if admin already exists
        const exists = yield _1.db.query.Users.findFirst({
            where: (0, drizzle_orm_1.eq)(user_schema_1.Users.email, email),
        });
        if (exists) {
            logger_1.logger.info("Admin already exists");
        }
        else {
            try {
                yield _1.db.transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const password_hash = yield (0, getHashedPassword_1.default)(plainPassword);
                    const [user] = yield tx
                        .insert(user_schema_1.Users)
                        .values({
                        email,
                        password_hash,
                        role: "super_admin",
                        is_verified: true,
                        status: "active",
                    })
                        .returning({ id: user_schema_1.Users.id });
                    yield tx.insert(user_profiles_schema_1.UserProfiles).values({
                        user_id: user.id,
                        full_name: "Super Admin",
                        user_name: "admin",
                        mobile: "01234567890",
                        address: "Head Office",
                        gender: "male",
                    });
                    logger_1.logger.info("Admin user inserted");
                }));
            }
            catch (error) {
                logger_1.logger.error("Failed to seed admin");
                throw new Error("Failed to seed Admin");
            }
        }
    });
}
