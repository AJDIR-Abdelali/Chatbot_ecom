import { internalMessageSchema, type ChatbotResponse, type InternalMessage } from "@chatbot/shared";
import { createHumanHandoff, saveMessage, upsertConversation } from "../db/repositories";
import { generateChatbotReply } from "../engine/chatbot-engine";

export const processMessage = async (
  supabase: any,
  payload: unknown
): Promise<{ message: InternalMessage; reply: ChatbotResponse; conversationId: string }> => {
  const message = internalMessageSchema.parse(payload);
  const conversationId = await upsertConversation(supabase, message);

  await saveMessage(supabase, conversationId, "inbound", payload as Record<string, unknown>, message.text);

  const reply = await generateChatbotReply(supabase, message);

  await saveMessage(supabase, conversationId, "outbound", reply as Record<string, unknown>, reply.answer);

  if (reply.requires_human_handoff) {
    await createHumanHandoff(supabase, conversationId, "Low confidence fallback");
  }

  return { message, reply, conversationId };
};
