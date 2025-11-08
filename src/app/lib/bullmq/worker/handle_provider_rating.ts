import { Worker, Job } from "bullmq";
import { connection } from "..";
import {
  provider_rating_queue,
  ProviderRatingJobData,
} from "../queues/handle_mechanic_bid.queue";
import { handleMechanicBid } from "../jobs/handle_provider_rating.handler";

export const providerRating = new Worker<ProviderRatingJobData>(
  provider_rating_queue,
  async (job: Job<ProviderRatingJobData>) => {
    console.log(`👷 Processing mechanic bid job ${job.id}`);
    await handleMechanicBid(job.data);
  },
  { connection }
);

providerRating.on("completed", (job) => {
  console.log(`🎉 Mechanic bid job ${job.id} completed`);
});

providerRating.on("failed", (job, err) => {
  console.error(`❌ Mechanic bid job ${job?.id} failed: ${err.message}`);
});
