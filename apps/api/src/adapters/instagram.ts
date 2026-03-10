import type { ChannelAdapter } from "./base";

export const instagramAdapter: ChannelAdapter = {
  verifySignature: async () => {
    // TODO: Verify X-Hub-Signature-256 using INSTAGRAM_APP_SECRET
    return true;
  },
  normalizeInbound: (payload) => {
    const messaging = payload.entry?.[0]?.messaging?.[0];
    return {
      channel: "instagram",
      external_user_id: messaging.sender.id,
      external_conversation_id: messaging.sender.id,
      text: messaging.message?.text || "",
      attachments: [],
      metadata: payload,
      store_id: payload.store_id
    };
  },
  formatOutbound: (text, inbound) => ({
    recipient: { id: inbound.entry[0].messaging[0].sender.id },
    message: { text }
  })
};
