import { AiRepository } from "../repositories/ai.repository";

const aiResponse = async (user_id: string, user_ques: string, res: any) => {
  return await AiRepository.chatWithAI(user_id, `${user_ques}. In Short`, res);
};

export const AiService = {
  aiResponse,
};
