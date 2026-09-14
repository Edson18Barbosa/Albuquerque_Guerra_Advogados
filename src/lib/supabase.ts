import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://ascpakldxisyulyvzlgu.supabase.co';
const DEFAULT_KEY = 'sb_publishable_-KFfJu4wTRsa0X7kwKAImA_L-I4Vc9E';

export const getSupabaseConfig = () => {
  let customUrl = '';
  let customKey = '';
  
  if (typeof window !== 'undefined') {
    try {
      customUrl = localStorage.getItem('albuquerque_guerra_supabase_url') || '';
      customKey = localStorage.getItem('albuquerque_guerra_supabase_anon_key') || '';
    } catch (e) {}
  }

  const url = customUrl || (import.meta.env && import.meta.env.VITE_SUPABASE_URL) || DEFAULT_URL;
  const anonKey = customKey || (import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || DEFAULT_KEY;

  return { url, anonKey };
};

const config = getSupabaseConfig();

export const supabase: SupabaseClient = createClient(config.url, config.anonKey, {
  auth: {
    persistSession: true,
    storage: typeof window !== 'undefined' ? window.sessionStorage : undefined
  }
});

export const updateSupabaseCredentials = (url: string, anonKey: string) => {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem('albuquerque_guerra_supabase_url', url.trim());
    else localStorage.removeItem('albuquerque_guerra_supabase_url');

    if (anonKey) localStorage.setItem('albuquerque_guerra_supabase_anon_key', anonKey.trim());
    else localStorage.removeItem('albuquerque_guerra_supabase_anon_key');
  }
};
