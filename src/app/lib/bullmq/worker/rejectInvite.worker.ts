import { Worker, Job } from "bullmq";
import { connection } from "..";

import { RejectInviteJobData } from "../queues/rejectOtherInvites.queues";
import { handleRejectOtherInvites } from "../jobs/rejectOtherInvites";

export const rejectInviteWorker = new Worker<RejectInviteJobData>(
  "emailQueue",
  async (job: Job<RejectInviteJobData>) => {
    console.log(`👷 Processing job ${job.id}`);
    await handleRejectOtherInvites(job.data);
  },
  { connection: connection }
);

rejectInviteWorker.on("completed", (job) => {
  console.log(`🎉 Job ${job.id} completed`);
});

rejectInviteWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed: ${err.message}`);
});
