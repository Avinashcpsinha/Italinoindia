import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Server-only Supabase client (uses service role key — bypasses RLS).
 * Use ONLY inside API routes / server actions, never in client components.
 */
export function getSupabaseAdmin(): SupabaseClient<Database> | null {
  if (!url || !serviceRoleKey) return null;
  return createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

export const isSupabaseConfigured = Boolean(url && serviceRoleKey);
