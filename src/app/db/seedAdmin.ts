import "dotenv/config";
import { db } from ".";
import { eq } from "drizzle-orm";
import { Users } from "../schema/user.schema";
import getHashedPassword from "../utils/helper/getHashedPassword";
import { UserProfiles } from "../schema/user_profiles.schema";
import { logger } from "../utils/serverTools/logger";

export async function seedAdmin() {
  const email = "admin@site.com";
  const plainPassword = "Admin@123";

  // Check if admin already exists
  const exists = await db.query.Users.findFirst({
    where: eq(Users.email, email),
  });

  if (exists) {
    logger.info("Admin already exists");
  } else {
    try {
      await db.transaction(async (tx) => {
        const password_hash = await getHashedPassword(plainPassword);

        const [user] = await tx
          .insert(Users)
          .values({
            email,
            password_hash,
            role: "super_admin",
            is_verified: true,
            status: "active",
          })
          .returning({ id: Users.id });

        await tx.insert(UserProfiles).values({
          user_id: user.id,
          first_name: "Super Admin",
          user_name: "admin",
          mobile: "01234567890",
          address: "Head Office",
          gender: "male",
        });

        logger.info("Admin user inserted");
      });
    } catch (error) {
      logger.error("Failed to seed admin");
      throw new Error("Failed to seed Admin");
    }
  }
}
