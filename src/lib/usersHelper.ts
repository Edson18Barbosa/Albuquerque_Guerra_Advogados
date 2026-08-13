import { supabase } from './supabase';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'Administrador' | 'Editor';
  status: 'Ativo' | 'Inativo';
  created_at: string;
}

export const USERS_STORAGE_KEY = 'albuquerque_guerra_admin_users';

export const defaultAdminUsers: AdminUser[] = [
  {
    id: '1',
    name: 'Edson Barbosa',
    email: 'edsonrb.barbosa@gmail.com',
    password: '123456',
    role: 'Administrador',
    status: 'Ativo',
    created_at: new Date().toISOString()
  }
];

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  try {
    const { data, error } = await supabase
      .from('site_admin_users')
      .select('*')
      .order('name');

    if (error) throw error;

    if (data && data.length > 0) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(data));
      return data;
    }
  } catch (e) {
    console.warn('Failed to fetch admin users from Supabase, loading local:', e);
  }

  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultAdminUsers));
  return defaultAdminUsers;
};

export const saveAdminUser = async (user: AdminUser): Promise<void> => {
  const current = await getAdminUsers();
  const index = current.findIndex(u => u.id === user.id);
  
  if (index !== -1) {
    current[index] = user;
  } else {
    current.push(user);
  }

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(current));

  try {
    const { error } = await supabase.from('site_admin_users').upsert(user);
    if (error) throw error;
  } catch (e) {
    console.warn('Could not sync user to Supabase:', e);
  }
};

export const deleteAdminUser = async (id: string): Promise<void> => {
  const current = await getAdminUsers();
  const filtered = current.filter(u => u.id !== id);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered));

  try {
    const { error } = await supabase.from('site_admin_users').delete().eq('id', id);
    if (error) throw error;
  } catch (e) {
    console.warn('Could not delete user from Supabase:', e);
  }
};
