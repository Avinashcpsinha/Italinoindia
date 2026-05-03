import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Public Supabase client — uses the anon key, respects RLS policies.
 * Safe to use in server components and (if you ever need it) the browser.
 * Returns null when Supabase is not configured.
 */
export function getSupabasePublic(): SupabaseClient<Database> | null {
  if (!url || !anonKey) return null;
  return createClient<Database>(url, anonKey, {
    auth: { persistSession: false },
  });
}
