import { Hono } from "hono";
import { getSupabase } from "../services/supabase";

export const dashboardRoutes = new Hono<{ Bindings: any }>();

dashboardRoutes.get("/inbox", async (c) => {
  const supabase = getSupabase(c.env);
  const storeId = c.req.query("store_id");
  const channel = c.req.query("channel");
  const status = c.req.query("status");

  let query = supabase
    .from("conversations")
    .select("id,store_id,channel,status,last_message_at,external_user_id,messages(text,created_at,direction),human_handoffs(status)")
    .order("last_message_at", { ascending: false })
    .limit(100);

  if (storeId) query = query.eq("store_id", storeId);
  if (channel) query = query.eq("channel", channel);
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return c.json({ error: error.message }, 400);

  return c.json({ conversations: data });
});
