insert into public.users (id, email, full_name)
values
  ('11111111-1111-1111-1111-111111111111', 'merchant@example.com', 'Atlas Merchant')
on conflict (id) do nothing;

insert into public.stores (id, owner_user_id, name, slug)
values
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Atlas Market', 'atlas-market')
on conflict (id) do nothing;

insert into public.store_members (store_id, user_id, role)
values
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'owner')
on conflict (store_id, user_id) do nothing;

insert into public.categories (id, store_id, name, description)
values
  ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Huile d\'argan', 'Produits bio du Maroc')
on conflict (id) do nothing;

insert into public.products (store_id, category_id, name, description, price_mad, stock_qty)
values
  ('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Argan Premium 250ml', 'Huile d\'argan cosmétique', 120.00, 42)
on conflict do nothing;

insert into public.faqs (store_id, question, answer, language, tags)
values
  ('22222222-2222-2222-2222-222222222222', 'Livraison à Casablanca?', 'Oui, livraison en 24h à Casablanca.', 'fr', '{livraison,casa}'),
  ('22222222-2222-2222-2222-222222222222', 'Kayn paiement à la livraison?', 'Iyyeh, kayn paiement 3nd taslim.', 'ary', '{paiement,cod}')
on conflict do nothing;

insert into public.store_settings (store_id, policy_summary, delivery_summary, payment_summary, human_handoff_enabled)
values
  ('22222222-2222-2222-2222-222222222222', 'Retour sous 7 jours si produit scellé.', 'Livraison 24-72h selon ville.', 'Paiement à la livraison ou virement bancaire.', true)
on conflict (store_id) do nothing;
