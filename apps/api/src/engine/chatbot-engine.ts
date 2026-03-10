import type { ChatbotResponse, InternalMessage } from "@chatbot/shared";
import { fetchStoreContext } from "../db/repositories";

const scoreMatch = (query: string, corpus: string) => {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return 0;
  const hitCount = terms.filter((t) => corpus.toLowerCase().includes(t)).length;
  return hitCount / terms.length;
};

export const generateChatbotReply = async (
  supabase: any,
  message: InternalMessage
): Promise<ChatbotResponse> => {
  const context = await fetchStoreContext(supabase, message.store_id);
  const query = message.text;

  const faqHit = context.faqs
    .map((faq) => ({ faq, score: scoreMatch(query, `${faq.question} ${faq.answer} ${faq.tags.join(" ")}`) }))
    .sort((a, b) => b.score - a.score)[0];

  if (faqHit?.score >= 0.5) {
    return {
      answer: faqHit.faq.answer,
      source: "faq",
      confidence: faqHit.score,
      requires_human_handoff: false
    };
  }

  const productHit = context.products
    .map((product) => ({
      product,
      score: scoreMatch(query, `${product.name} ${product.description ?? ""} ${product.category_name ?? ""}`)
    }))
    .sort((a, b) => b.score - a.score)[0];

  if (productHit?.score >= 0.45) {
    return {
      answer: `${productHit.product.name} — ${productHit.product.description ?? "Produit disponible"} (${productHit.product.price_mad} MAD).`,
      source: "product",
      confidence: productHit.score,
      requires_human_handoff: false
    };
  }

  const policyText = [context.settings.delivery_summary, context.settings.payment_summary, context.settings.policy_summary]
    .filter(Boolean)
    .join(" ");

  const policyScore = scoreMatch(query, policyText);
  if (policyText && policyScore >= 0.4) {
    return {
      answer:
        context.settings.policy_summary ||
        context.settings.delivery_summary ||
        context.settings.payment_summary ||
        "Consultez nos politiques en boutique.",
      source: "settings",
      confidence: policyScore,
      requires_human_handoff: false
    };
  }

  return {
    answer:
      "Merci ! Je n'ai pas une réponse certaine pour le moment. Un agent humain peut vous assister rapidement.",
    source: "fallback",
    confidence: 0.2,
    requires_human_handoff: true
  };
};
