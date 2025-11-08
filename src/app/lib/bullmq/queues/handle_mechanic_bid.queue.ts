import { Queue } from "bullmq";
import { connection } from "..";

export interface ProviderRatingJobData {
  bid_id: string;
}

export const provider_rating_queue = "provider_rating";

export const mechanicBidQueue = new Queue<ProviderRatingJobData>(
  provider_rating_queue,
  {
    connection: connection,
  }
);
