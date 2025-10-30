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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db");
const user_schema_1 = require("../schema/user.schema");
const user_home_data_1 = require("../schema/user_home_data");
const findByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const [user] = yield db_1.db.select().from(user_schema_1.Users).where((0, drizzle_orm_1.eq)(user_schema_1.Users.email, email));
    return user || null;
});
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const [user] = yield db_1.db.select().from(user_schema_1.Users).where((0, drizzle_orm_1.eq)(user_schema_1.Users.id, id));
    return user || null;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.db.select().from(user_schema_1.Users);
});
const updateUser = (id, data, trx) => __awaiter(void 0, void 0, void 0, function* () {
    const [user] = yield (trx || db_1.db)
        .update(user_schema_1.Users)
        .set(Object.assign(Object.assign({}, data), { updated_at: new Date() }))
        .where((0, drizzle_orm_1.eq)(user_schema_1.Users.id, id))
        .returning();
    return user;
});
const createUsersHomeData = (user_id, tx) => __awaiter(void 0, void 0, void 0, function* () {
    const client = tx !== null && tx !== void 0 ? tx : db_1.db;
    const created_home_data = yield client
        .insert(user_home_data_1.UserHomeData)
        .values({ user_id })
        .returning();
    return created_home_data;
});
const updateUserHomeData = (user_id, data, tx) => __awaiter(void 0, void 0, void 0, function* () {
    const client = tx || db_1.db;
    const [updated_home_data] = yield client
        .update(user_home_data_1.UserHomeData)
        .set(Object.assign(Object.assign({}, data), { updated_at: new Date() }))
        .where((0, drizzle_orm_1.eq)(user_home_data_1.UserHomeData.user_id, user_id))
        .returning();
    return updated_home_data;
});
const getUsersHomeData = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const users_home_data = yield db_1.db.query.UserHomeData.findFirst({
        where: (0, drizzle_orm_1.eq)(user_home_data_1.UserHomeData.user_id, user_id),
    });
    return users_home_data;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.db.delete(user_schema_1.Users).where((0, drizzle_orm_1.eq)(user_schema_1.Users.id, id));
    return true;
});
exports.UserRepository = {
    findByEmail,
    findById,
    getAllUsers,
    updateUser,
    createUsersHomeData,
    updateUserHomeData,
    getUsersHomeData,
    deleteUser,
};
