import type { ChannelAdapter } from "./base";

export const telegramAdapter: ChannelAdapter = {
  verifySignature: async (request, secret) => {
    const header = request.headers.get("x-telegram-bot-api-secret-token");
    return Boolean(secret && header === secret);
  },
  normalizeInbound: (payload) => ({
    channel: "telegram",
    external_user_id: String(payload.message.from.id),
    external_conversation_id: String(payload.message.chat.id),
    text: payload.message.text || "",
    attachments: [],
    metadata: payload,
    store_id: payload.store_id
  }),
  formatOutbound: (text, inbound) => ({
    chat_id: inbound.message.chat.id,
    text
  })
};
