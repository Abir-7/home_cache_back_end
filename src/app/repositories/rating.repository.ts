import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { ProvidersRating } from "../schema/providers_rating.schema";

const getProviderAverageRating = async (provider_id: string) => {
  const [result] = await db
    .select({
      avg_rating: sql<number>`COALESCE(AVG(${ProvidersRating.rating}), 0)`,
    })
    .from(ProvidersRating)
    .where(eq(ProvidersRating.provider_id, provider_id));

  return Number(result?.avg_rating ?? 0);
};

export const RatingRepository = {
  getProviderAverageRating,
};
