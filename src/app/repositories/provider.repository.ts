import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Providers } from "../schema/providers.schema";
import { db, schema } from "../db";
import { eq } from "drizzle-orm";

const createProvider = async (
  data: typeof Providers.$inferInsert,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;
  const [created_provider] = await client
    .insert(Providers)
    .values(data)
    .returning();

  return created_provider;
};

const updateProvider = async (
  data: any,
  provider_id: string,
  tx?: NodePgDatabase<typeof schema>
) => {
  const client = tx ?? db;

  const [updated] = await client
    .update(Providers)
    .set(data)
    .where(eq(Providers.id, provider_id))
    .returning();

  return updated;
};

const getProviderById = async (id: string) => {
  const [provider] = await db
    .select()
    .from(Providers)
    .where(eq(Providers.id, id))
    .limit(1);

  return provider; // returns single Provider | undefined
};

const getAllProviders = async () => {
  const providers = await db.select().from(Providers);

  return providers; // returns Provider[]
};

export const ProviderRepository = {
  createProvider,
  updateProvider,
  getAllProviders,
  getProviderById,
};
