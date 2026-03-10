import type { ChannelAdapter } from "./base";

export const webWidgetAdapter: ChannelAdapter = {
  verifySignature: async () => true,
  normalizeInbound: (payload) => ({
    channel: "web",
    external_user_id: payload.visitor_id,
    external_conversation_id: payload.conversation_id,
    text: payload.text,
    attachments: payload.attachments ?? [],
    metadata: payload.metadata ?? {},
    store_id: payload.store_id
  }),
  formatOutbound: (text) => ({ text })
};
