// Make sure to install the 'pg' package
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { appConfig } from "../config/appConfig";

import * as User from "../schema/user.schema";
import * as UserProfile from "../schema/user_profiles.schema";
import * as UserAuthentication from "../schema/user_authentication.schema";
import * as UserHomeData from "../schema/user_home_data";
import * as Providers from "../schema/providers.schema";
import * as ProviderRating from "../schema/providers_rating.schema";

import * as Documents from "../schema/documents.schema";
import * as Task from "../schema/task.schema";
import * as TaskAssignments from "../schema/task_assignment.schema";
import * as ViewByRooms from "../schema/vew_by_room.schema";
import * as ViewByType from "../schema/view_by_types.schema";
import * as RoomInvite from "../schema/home_room_invite.schema";
import * as RoomMembers from "../schema/home_room_member.schema";

import * as Provider_Rating from "../schema/providers_rating.schema";
const pool = new Pool({
  connectionString: appConfig.database.dataBase_uri,
});

export const schema = {
  ...User,
  ...UserProfile,
  ...UserAuthentication,
  ...UserHomeData,
  ...ProviderRating,
  ...Providers,
  ...Documents,
  ...Task,
  ...TaskAssignments,
  ...Provider_Rating,
  ...ViewByRooms,
  ...ViewByType,
  ...RoomInvite,
  ...RoomMembers,
};

export const db = drizzle(pool, {
  schema: schema,
});
