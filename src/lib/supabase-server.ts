import { createClient } from '@supabase/supabase-js';

export function getSupabaseServer() {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseServiceRole = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRole) {
    throw new Error('Missing Supabase server variables');
  }

  return createClient(supabaseUrl, supabaseServiceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

let cachedSupabase: any = null;

export function supabaseServer() {
  if (!cachedSupabase) {
    cachedSupabase = getSupabaseServer();
  }
  return cachedSupabase;
}
