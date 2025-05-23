
import { createClient } from '@supabase/supabase-js';

// The API keys are stored securely in Lovable's environment
// and injected at build time
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials not found. Please make sure they are properly set in the environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
