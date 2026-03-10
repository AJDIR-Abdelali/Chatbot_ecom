import type { ChannelAdapter } from "./base";

export const whatsappAdapter: ChannelAdapter = {
  verifySignature: async () => {
    // TODO: Verify X-Hub-Signature-256 using WHATSAPP_APP_SECRET
    return true;
  },
  normalizeInbound: (payload) => {
    const change = payload.entry?.[0]?.changes?.[0]?.value;
    const message = change?.messages?.[0];
    return {
      channel: "whatsapp",
      external_user_id: message?.from,
      external_conversation_id: message?.from,
      text: message?.text?.body || "",
      attachments: [],
      metadata: payload,
      store_id: payload.store_id
    };
  },
  formatOutbound: (text, inbound) => {
    const change = inbound.entry?.[0]?.changes?.[0]?.value;
    const to = change?.messages?.[0]?.from;
    return {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text }
    };
  }
};
