import { createClient } from '@supabase/supabase-js';

// Change process.env to import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase Environment Variables inside Vite configuration context!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);