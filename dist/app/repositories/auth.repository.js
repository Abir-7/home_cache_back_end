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
exports.AuthRepository = void 0;
const user_schema_1 = require("../schema/user.schema");
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db");
const user_profiles_schema_1 = require("../schema/user_profiles.schema");
const user_authentication_schema_1 = require("../schema/user_authentication.schema");
const createUser = (data, trx) => __awaiter(void 0, void 0, void 0, function* () {
    const [user] = yield (trx || db_1.db).insert(user_schema_1.Users).values(data).returning();
    return user;
});
//-----------PROFILE
const createProfile = (data, trx) => __awaiter(void 0, void 0, void 0, function* () {
    const [profile] = yield (trx || db_1.db)
        .insert(user_profiles_schema_1.UserProfiles)
        .values(data)
        .returning();
    return profile;
});
//---------Authentication
const createAuthentication = (data, trx) => __awaiter(void 0, void 0, void 0, function* () {
    const [auth] = yield (trx || db_1.db)
        .insert(user_authentication_schema_1.UserAuthentications)
        .values(data)
        .returning();
    return auth;
});
const getAuthenticationByUserIdAndCode = (user_id, code) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = yield db_1.db.query.UserAuthentications.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(user_authentication_schema_1.UserAuthentications.user_id, user_id), (0, drizzle_orm_1.eq)(user_authentication_schema_1.UserAuthentications.otp, code)),
    });
    return auth || null;
});
const getAuthenticationByUserIdAndToken = (user_id, token) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = yield db_1.db.query.UserAuthentications.findFirst({
        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(user_authentication_schema_1.UserAuthentications.user_id, user_id), (0, drizzle_orm_1.eq)(user_authentication_schema_1.UserAuthentications.token, token)),
    });
    return auth || null;
});
const getAuthenticationByUserId = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = yield db_1.db.query.UserAuthentications.findFirst({
        where: (0, drizzle_orm_1.eq)(user_authentication_schema_1.UserAuthentications.user_id, user_id),
        orderBy: (0, drizzle_orm_1.desc)(user_authentication_schema_1.UserAuthentications.created_at),
    });
    return auth || null;
});
const setAuthenticationSuccess = (authId_1, ...args_1) => __awaiter(void 0, [authId_1, ...args_1], void 0, function* (authId, value = true, trx) {
    const [data] = yield (trx || db_1.db)
        .update(user_authentication_schema_1.UserAuthentications)
        .set({ is_success: value, updated_at: new Date() })
        .where((0, drizzle_orm_1.eq)(user_authentication_schema_1.UserAuthentications.id, authId))
        .returning();
    return data;
});
exports.AuthRepository = {
    createUser,
    createProfile,
    createAuthentication,
    getAuthenticationByUserIdAndCode,
    getAuthenticationByUserIdAndToken,
    getAuthenticationByUserId,
    setAuthenticationSuccess,
};
