import { appConfig } from "./src/app/config/appConfig";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: ["./src/app/schema"],
  dbCredentials: {
    url: appConfig.database.dataBase_uri as string,
  },
});
