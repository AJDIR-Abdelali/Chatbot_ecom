import { Hono } from "hono";
import { getSupabase } from "../services/supabase";
import { processMessage } from "../services/chat-service";
import { saveWebhookEvent } from "../db/repositories";
import { telegramAdapter } from "../adapters/telegram";
import { instagramAdapter } from "../adapters/instagram";
import { whatsappAdapter } from "../adapters/whatsapp";

export const webhookRoutes = new Hono<{ Bindings: any }>();

webhookRoutes.post("/telegram", async (c) => {
  const payload = await c.req.json();
  const supabase = getSupabase(c.env);
  await saveWebhookEvent(supabase, "telegram", payload);

  if (!(await telegramAdapter.verifySignature(c.req.raw, c.env.TELEGRAM_WEBHOOK_SECRET))) {
    return c.json({ error: "invalid_signature" }, 401);
  }

  const normalized = telegramAdapter.normalizeInbound(payload);
  const { reply } = await processMessage(supabase, normalized);

  return c.json(telegramAdapter.formatOutbound(reply.answer, payload));
});

webhookRoutes.get("/instagram", (c) => {
  const mode = c.req.query("hub.mode");
  const token = c.req.query("hub.verify_token");
  const challenge = c.req.query("hub.challenge");

  if (mode === "subscribe" && token === c.env.INSTAGRAM_VERIFY_TOKEN) {
    return c.text(challenge || "", 200);
  }
  return c.text("Forbidden", 403);
});

webhookRoutes.post("/instagram", async (c) => {
  const payload = await c.req.json();
  const supabase = getSupabase(c.env);
  await saveWebhookEvent(supabase, "instagram", payload);
  if (!(await instagramAdapter.verifySignature(c.req.raw, c.env.INSTAGRAM_APP_SECRET))) {
    return c.json({ error: "invalid_signature" }, 401);
  }
  const normalized = instagramAdapter.normalizeInbound(payload);
  const { reply } = await processMessage(supabase, normalized);
  return c.json(instagramAdapter.formatOutbound(reply.answer, payload));
});

webhookRoutes.get("/whatsapp", (c) => {
  const mode = c.req.query("hub.mode");
  const token = c.req.query("hub.verify_token");
  const challenge = c.req.query("hub.challenge");

  if (mode === "subscribe" && token === c.env.WHATSAPP_VERIFY_TOKEN) {
    return c.text(challenge || "", 200);
  }
  return c.text("Forbidden", 403);
});

webhookRoutes.post("/whatsapp", async (c) => {
  const payload = await c.req.json();
  const supabase = getSupabase(c.env);
  await saveWebhookEvent(supabase, "whatsapp", payload);

  if (!(await whatsappAdapter.verifySignature(c.req.raw, c.env.WHATSAPP_APP_SECRET))) {
    return c.json({ error: "invalid_signature" }, 401);
  }

  const normalized = whatsappAdapter.normalizeInbound(payload);
  const { reply } = await processMessage(supabase, normalized);
  return c.json(whatsappAdapter.formatOutbound(reply.answer, payload));
});
