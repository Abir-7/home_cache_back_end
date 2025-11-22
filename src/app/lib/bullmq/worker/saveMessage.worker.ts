import { Worker, Job } from "bullmq";
import { connection } from "..";
import { MessageJobData } from "../queues/saveMessage.queue";
import { queue_name } from "../queues/queue.const";
import { handleSaveMessageJob } from "../jobs/saveMessage.handler";


export const sendMessageWorker = new Worker<MessageJobData>(
  queue_name.save_message,
  async (job: Job<MessageJobData>) => {
    console.log(`👷 Processing job ${job.id}`);
    await handleSaveMessageJob(job.data);
  },
  { connection: connection }
);

sendMessageWorker.on("completed", (job) => {
  console.log(`🎉 Job ${job.id} completed`);
});

sendMessageWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed: ${err.message}`);
});
