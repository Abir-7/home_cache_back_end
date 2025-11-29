import { AiRepository } from "../repositories/ai.repository";

const aiResponse = async (user_id: string, user_ques: string, res: any) => {
  return await AiRepository.chatWithAI(user_id, `${user_ques}. In Short`, res);
};

const get_message = async (user_id: string) => {
  const messages = await AiRepository.getChatMessage(user_id);
  return messages;
};

export const AiService = {
  aiResponse,
  get_message,
};
