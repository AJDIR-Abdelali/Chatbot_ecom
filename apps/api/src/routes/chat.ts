import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getSupabase } from "../services/supabase";
import { processMessage } from "../services/chat-service";

const chatPayloadSchema = z.object({
  store_id: z.string().uuid(),
  conversation_id: z.string(),
  visitor_id: z.string(),
  text: z.string().min(1),
  attachments: z.array(z.object({ type: z.string(), url: z.string().url() })).optional(),
  metadata: z.record(z.any()).optional()
});

export const chatRoutes = new Hono<{ Bindings: any }>();

chatRoutes.post("/message", zValidator("json", chatPayloadSchema), async (c) => {
  const body = c.req.valid("json");
  const supabase = getSupabase(c.env);
  const { reply } = await processMessage(supabase, {
    channel: "web",
    external_user_id: body.visitor_id,
    external_conversation_id: body.conversation_id,
    text: body.text,
    attachments: body.attachments ?? [],
    metadata: body.metadata ?? {},
    store_id: body.store_id
  });

  return c.json(reply);
});
