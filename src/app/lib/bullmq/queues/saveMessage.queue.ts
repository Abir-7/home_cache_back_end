import { Queue } from "bullmq";
import { connection } from "..";
import { queue_name } from "./queue.const";

export interface MessageJobData {
  user:string,role:string,message:string
}

export const saveMessageQueue = new Queue<MessageJobData>(queue_name.save_message, {
  connection: connection,
});
