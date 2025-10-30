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
import * as LastServiceByProviders from "../schema/last_service_by_provider.schema";
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
  ...LastServiceByProviders,
};
export const db = drizzle(pool, {
  schema: schema,
});
