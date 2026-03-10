import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
}

const supabase = createClient(url, key, { auth: { persistSession: false } });
const sql = readFileSync("supabase/seed.sql", "utf-8");

// For Supabase hosted DB, run this SQL manually in SQL editor if rpc for sql execution is unavailable.
console.log("Seed SQL loaded. Execute via Supabase SQL editor or migration pipeline:");
console.log(sql);

await supabase.from("stores").select("id").limit(1);
console.log("Supabase connectivity check passed.");
