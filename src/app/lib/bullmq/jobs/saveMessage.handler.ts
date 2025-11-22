import { saveMessageToDataBase } from "../../../repositories/ai.repository";

import { MessageJobData } from "../queues/saveMessage.queue";

export async function handleSaveMessageJob(data: MessageJobData): Promise<void> {
    console.log(`📨 Sending email to user ${data.user}...`);

  await saveMessageToDataBase(data.user,data.role,data.message)

    console.log(`✅ Email sent to user ${data.user}`);
}
