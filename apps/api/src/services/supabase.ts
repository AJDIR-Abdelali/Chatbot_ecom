import { createClient } from "@supabase/supabase-js";
import type { Env } from "../types/env";

export const getSupabase = (env: Env) =>
  createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
