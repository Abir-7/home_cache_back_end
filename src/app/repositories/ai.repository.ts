import redis from "../lib/radis";
import { openai, system_promt } from "../common/ai";
import { db } from "../db";
import { ChatMessages } from "../schema/chat_message.schema";
import { saveMessageQueue } from "../lib/bullmq/queues/saveMessage.queue";
import { string } from "zod";

const MAX_CONTEXT = 5;

async function addMessage(userId: string, role: string, content: string) {
  const key = `chat:${userId}`;
  await redis.rpush(key, JSON.stringify({ role, content }));

  await redis.ltrim(key, -MAX_CONTEXT, -1);

  await saveMessageQueue.add("save_message",{user:userId,message:content,role:role})

}
async function getContext(userId: string) {
  const key = `chat:${userId}`;
  const messages = await redis.lrange(key, 0, -1);
  return messages.map((msg) => JSON.parse(msg));
}

export const saveMessageToDataBase=async(userId: string, role: string, content: string)=>{
  await db.insert(ChatMessages).values({user_id:userId,role,content})
}

//-----------------------------Main----------------------------------//


async function chatWithAI(userId: string, userMessage: string, res: any) {
  await addMessage(userId, "user", userMessage);

  const context = await getContext(userId);

  const completion = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [{ role: "system", content: system_promt }, ...context],
  });

  const aiResponse = completion.choices[0].message?.content || "";

  console.log("AI:", aiResponse);

  await addMessage(userId, "assistant", aiResponse);

  return aiResponse;
}



export const AiRepository = {
  chatWithAI,
};
