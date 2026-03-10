import type { InternalMessage } from "@chatbot/shared";

export type ChannelAdapter = {
  verifySignature: (request: Request, secret?: string) => Promise<boolean>;
  normalizeInbound: (payload: any) => InternalMessage;
  formatOutbound: (text: string, inboundPayload: any) => Record<string, unknown>;
};
