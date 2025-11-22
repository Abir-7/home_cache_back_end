import { Queue } from "bullmq";
import { connection } from "..";
import { queue_name } from "./queue.const";

export interface RejectInviteJobData {
  accepted_invite_id: string;
  receiver_id: string;
}



export const rejectInviteQueue = new Queue<RejectInviteJobData>(
  queue_name.reject_invite,
  {
    connection: connection,
  }
);
