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
import * as Task_Assignment from "../schema/task_assignment.schema";
import * as Task_Instance from "../schema/task_instance.schema";
import * as Task_Schedules from "../schema/task_schedules.schema";
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
  ...Task_Assignment,
  ...Task_Instance,
  ...Task_Schedules,
  ...Provider_Rating,
};

export const db = drizzle(pool, {
  schema: schema,
});
