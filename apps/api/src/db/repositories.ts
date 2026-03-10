import type { InternalMessage } from "@chatbot/shared";

export type StoreContext = {
  faqs: Array<{ question: string; answer: string; tags: string[] }>;
  products: Array<{ name: string; description: string; price_mad: number; category_name: string | null }>;
  settings: {
    delivery_summary?: string;
    payment_summary?: string;
    policy_summary?: string;
  };
};

export const fetchStoreContext = async (
  supabase: any,
  storeId: string
): Promise<StoreContext> => {
  const [{ data: faqs }, { data: products }, { data: settings }] = await Promise.all([
    supabase.from("faqs").select("question,answer,tags").eq("store_id", storeId).eq("is_active", true),
    supabase
      .from("products")
      .select("name,description,price_mad,categories(name)")
      .eq("store_id", storeId)
      .eq("is_active", true),
    supabase.from("store_settings").select("delivery_summary,payment_summary,policy_summary").eq("store_id", storeId).single()
  ]);

  return {
    faqs: (faqs ?? []).map((f: any) => ({ ...f, tags: f.tags ?? [] })),
    products: (products ?? []).map((p: any) => ({
      name: p.name,
      description: p.description,
      price_mad: p.price_mad,
      category_name: p.categories?.name ?? null
    })),
    settings: settings ?? {}
  };
};

export const upsertConversation = async (supabase: any, message: InternalMessage) => {
  const { data } = await supabase
    .from("conversations")
    .upsert(
      {
        store_id: message.store_id,
        channel: message.channel,
        external_conversation_id: message.external_conversation_id,
        external_user_id: message.external_user_id,
        status: "open",
        last_message_at: new Date().toISOString()
      },
      { onConflict: "store_id,channel,external_conversation_id" }
    )
    .select("id")
    .single();

  return data?.id as string;
};

export const saveMessage = async (
  supabase: any,
  conversationId: string,
  direction: "inbound" | "outbound",
  payload: Record<string, unknown>,
  text: string
) => {
  await supabase.from("messages").insert({
    conversation_id: conversationId,
    direction,
    text,
    payload
  });
};

export const saveWebhookEvent = async (supabase: any, channel: string, payload: unknown) => {
  await supabase.from("webhook_events").insert({ channel, payload });
};

export const createHumanHandoff = async (supabase: any, conversationId: string, reason: string) => {
  await supabase.from("human_handoffs").insert({
    conversation_id: conversationId,
    reason,
    status: "pending"
  });
};
