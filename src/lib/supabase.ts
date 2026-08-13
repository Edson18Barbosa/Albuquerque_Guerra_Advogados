import { createClient } from '@supabase/supabase-js';

// Use same credentials as other local apps to connect to the common DB
const url = 'https://ascpakldxisyulyvzlgu.supabase.co';
const anonKey = 'sb_publishable_-KFfJu4wTRsa0X7kwKAImA_L-I4Vc9E';

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    storage: typeof window !== 'undefined' ? window.sessionStorage : undefined
  }
});
