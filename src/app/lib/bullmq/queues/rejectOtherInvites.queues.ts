import { Queue } from "bullmq";
import { connection } from "..";

export interface RejectInviteJobData {
  accepted_invite_id: string;
  receiver_id: string;
}

export const reject_invite_queue = "reject_invite";

export const rejectInviteQueue = new Queue<RejectInviteJobData>(
  reject_invite_queue,
  {
    connection: connection,
  }
);
