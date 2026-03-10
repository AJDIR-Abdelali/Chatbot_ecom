# Multi-tenant Omnichannel Commerce Chatbot SaaS (Morocco MVP)

This repository provides an MVP-ready architecture for Moroccan merchants to manage product knowledge and answer customer questions from one central chatbot engine across:

- Website chat widget
- Telegram bot
- Instagram messaging
- WhatsApp Business

## Stack

- **Frontend dashboard**: Next.js App Router + TypeScript + Tailwind
- **Backend/API/webhooks**: Hono on Cloudflare Workers
- **Database/Auth/Storage**: Supabase
- **Validation**: Zod
- **Monorepo**: npm workspaces with minimal dependencies

## Project structure

```txt
apps/
  api/                     # Hono API + channel webhooks + chatbot engine
  dashboard/               # Next.js merchant dashboard + unified inbox UI
packages/
  shared/                  # Internal shared schemas/types (Zod)
supabase/
  schema.sql               # Full DB schema including required tables
  seed.sql                 # Sample seed data
scripts/
  seed.ts                  # Seed helper/check
widget/
  chat-widget.js           # Embeddable website chat widget
.env.example
README.md
```

## Core architecture

### 1) Central Chatbot Engine

`apps/api/src/engine/chatbot-engine.ts`

Flow:
1. Normalize inbound message to internal model.
2. Search FAQ corpus first.
3. Search product catalog second.
4. Search policy/settings third.
5. Fallback response + `requires_human_handoff=true` when confidence is low.

Internal model (`packages/shared/src/index.ts`):

```ts
{
  channel,
  external_user_id,
  external_conversation_id,
  text,
  attachments,
  metadata,
  store_id
}
```

### 2) Channel adapters

`apps/api/src/adapters/*`

Implemented adapters:
- `web-widget.ts`
- `telegram.ts`
- `instagram.ts`
- `whatsapp.ts`

Each adapter includes:
- inbound payload normalization
- signature verification placeholder/implementation hook
- outbound payload formatter

### 3) Unified inbox

- API: `GET /api/dashboard/inbox` (`apps/api/src/routes/dashboard.ts`)
- UI: `apps/dashboard/app/dashboard/inbox/page.tsx`

Filters supported in API query params:
- `store_id`
- `channel`
- `status`

### 4) Multi-tenant isolation

- Store-centric schema with `store_id` on business tables
- `store_members` join for role-based tenant membership
- RLS scaffold in `supabase/schema.sql`

## Required feature mapping

- Merchant authentication scaffold: `apps/dashboard/app/auth/page.tsx` + Supabase deps
- CRUD sections:
  - stores: `/dashboard/stores`
  - products/categories: `/dashboard/products`
  - FAQs: `/dashboard/faqs`
  - delivery/payment/opening/policy: `/dashboard/settings`
- Conversation history: `conversations` + `messages`
- Lead capture table: `leads`
- Human handoff tracking: `human_handoffs`
- Basic analytics page scaffold: `/dashboard/analytics`
- French + Darija-ready content fields (`language`, localized texts)

## Local setup

1. Copy env file:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Apply Supabase schema + seed:
- Open Supabase SQL editor
- Run `supabase/schema.sql`
- Run `supabase/seed.sql`

4. Run apps:

```bash
npm run dev:api
npm run dev:dashboard
```

- Dashboard: `http://localhost:3000`
- API: `http://localhost:8787`

## Deployment

### Frontend (Vercel)
- Root: `apps/dashboard`
- Build command: `npm run build`
- Required env vars:
  - `NEXT_PUBLIC_WIDGET_API_URL`
  - Supabase public values

### API (Cloudflare Workers)
- Root: `apps/api`
- Deploy:

```bash
npm --workspace apps/api run build
npm --workspace apps/api exec wrangler deploy
```

- Add Worker secrets for Supabase + channel tokens.

### Widget embedding

Host `widget/chat-widget.js` on a static URL and embed:

```html
<script src="https://your-domain.com/widget/chat-widget.js" data-store-id="STORE_UUID"></script>
```

Optional attributes:
- `data-api-url="https://api.your-domain.com/api/chat/message"`

## Webhook endpoints

- `POST /api/webhooks/telegram`
- `GET|POST /api/webhooks/instagram`
- `GET|POST /api/webhooks/whatsapp`

All inbound events are stored in `webhook_events` for audit/replay.

## MVP next steps

- Real outbound channel delivery (Telegram/Meta API calls)
- Strong signature verification implementations
- RAG/vector search for better answer confidence
- Agent assignment workflow in unified inbox
- Full CRUD forms + server actions
