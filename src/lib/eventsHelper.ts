import { supabase } from './supabase';
import { Event } from '../types/events';

export const EVENTS_STORAGE_KEY = 'albuquerque_guerra_site_events';

export const defaultEvents: Event[] = [
  {
    id: '1',
    title: 'Inovação e Direito: O Futuro da Advocacia',
    slug: 'inovacao-e-direito-o-futuro-da-advocacia',
    short_description: 'Uma palestra sobre como a tecnologia e a IA estão transformando a prática jurídica.',
    full_description: 'Neste encontro exclusivo, discutiremos os impactos das novas tecnologias, automação e inteligência artificial no dia a dia dos escritórios de advocacia, além dos desafios éticos e práticos dessa adoção.',
    category: 'Palestras',
    start_date: '2027-08-15',
    start_time: '19:00',
    end_time: '21:00',
    modality: 'Presencial',
    location: 'Auditório Principal Albuquerque Guerra',
    address: 'Av. Conselheiro Aguiar, 1472 - Boa Viagem, Recife - PE',
    status: 'Publicado',
    is_featured: true,
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Workshop de Planejamento Sucessório',
    slug: 'workshop-planejamento-sucessorio',
    short_description: 'Aprenda as melhores estratégias para proteger seu patrimônio e garantir uma transição tranquila.',
    full_description: 'O planejamento sucessório é essencial para empresas familiares e detentores de patrimônio. Neste workshop prático, abordaremos ferramentas como holdings, testamentos e doações em vida.',
    category: 'Workshops',
    start_date: '2026-05-10',
    start_time: '09:00',
    end_time: '12:00',
    modality: 'Híbrido',
    location: 'Sede e Transmissão Online',
    status: 'Publicado',
    is_featured: false,
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Congresso de Direito Trabalhista',
    slug: 'congresso-direito-trabalhista',
    short_description: 'Um congresso reunindo grandes nomes para discutir as recentes atualizações trabalhistas.',
    full_description: 'Os sócios do Albuquerque Guerra participarão de painéis debatendo a reforma trabalhista, as novas formas de contratação e as tendências jurisprudenciais.',
    category: 'Congressos',
    start_date: '2025-11-20',
    start_time: '08:00',
    modality: 'Presencial',
    location: 'Centro de Convenções',
    status: 'Publicado',
    is_featured: false,
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const getEvents = async (): Promise<Event[]> => {
  try {
    const { data, error } = await supabase
      .from('site_events')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) throw error;

    if (data && data.length > 0) {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(data));
      return data;
    }
  } catch (e) {
    console.warn('Failed to fetch events from Supabase, checking local storage:', e);
  }

  const stored = localStorage.getItem(EVENTS_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }

  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(defaultEvents));
  return defaultEvents;
};

export const saveEvent = async (event: Event): Promise<void> => {
  // Save local
  const currentEvents = await getEvents();
  const index = currentEvents.findIndex(e => e.id === event.id);
  
  if (index !== -1) {
    currentEvents[index] = event;
  } else {
    currentEvents.push(event);
  }
  
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(currentEvents));

  // Sync Supabase
  try {
    const { error } = await supabase.from('site_events').upsert(event);
    if (error) throw error;
  } catch (e) {
    console.warn('Could not sync event update to Supabase:', e);
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  // Save local
  const currentEvents = await getEvents();
  const filtered = currentEvents.filter(e => e.id !== id);
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(filtered));

  // Sync Supabase
  try {
    const { error } = await supabase.from('site_events').delete().eq('id', id);
    if (error) throw error;
  } catch (e) {
    console.warn('Could not sync event deletion to Supabase:', e);
  }
};
