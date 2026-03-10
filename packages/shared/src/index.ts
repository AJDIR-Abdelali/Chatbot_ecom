import { z } from "zod";

export const channelSchema = z.enum(["web", "telegram", "instagram", "whatsapp"]);

export const internalMessageSchema = z.object({
  channel: channelSchema,
  external_user_id: z.string(),
  external_conversation_id: z.string(),
  text: z.string().min(1),
  attachments: z.array(z.object({ type: z.string(), url: z.string().url() })).default([]),
  metadata: z.record(z.any()).default({}),
  store_id: z.string().uuid()
});

export type InternalMessage = z.infer<typeof internalMessageSchema>;

export const chatbotResponseSchema = z.object({
  answer: z.string(),
  source: z.enum(["faq", "product", "settings", "fallback"]),
  confidence: z.number().min(0).max(1),
  requires_human_handoff: z.boolean().default(false)
});

export type ChatbotResponse = z.infer<typeof chatbotResponseSchema>;

export const leadSchema = z.object({
  store_id: z.string().uuid(),
  conversation_id: z.string().uuid(),
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  message: z.string().min(1)
});

export type LeadInput = z.infer<typeof leadSchema>;
