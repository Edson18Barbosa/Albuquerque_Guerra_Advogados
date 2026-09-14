import { supabase } from './supabase';

export interface SiteSettings {
  // Brand / Identidade Visual
  logo_horizontal: string;
  logo_vertical: string;
  logo_monogram: string;
  primary_color: string;
  
  // Página Inicial
  hero_title_part1: string;
  hero_title_italic: string;
  hero_subtitle: string;
  hero_description: string;
  hero_cta_text: string;
  hero_cta_link: string;
  
  // O Escritório
  about_title: string;
  about_subtitle: string;
  about_text_1: string;
  about_text_2: string;
  about_image: string;
  
  // Missão e Visão
  mission_text: string;
  vision_text: string;
  values_list_text: string; // comma separated
  
  // Contato
  contact_phone: string;
  contact_whatsapp: string;
  contact_email: string;
  contact_notification_email: string; // E-mail que recebe os formulários do site
  contact_address: string;
  contact_hours: string;
  contact_maps_url: string;
  google_reviews_url: string; // Link oficial das avaliações no Google
  
  // SEO e redes sociais
  seo_title: string;
  seo_description: string;
  social_instagram: string;
  social_facebook: string;
  social_linkedin: string;
}

export const SETTINGS_STORAGE_KEY = 'albuquerque_guerra_site_settings';

export const defaultSettings: SiteSettings = {
  logo_horizontal: '/logo-horizontal.png',
  logo_vertical: '/logo-vertical.png',
  logo_monogram: '/logo-monogram.png',
  primary_color: '#D8CBB3',
  
  hero_title_part1: 'Segurança jurídica que gera',
  hero_title_italic: 'impacto positivo.',
  hero_subtitle: 'ADVOCACIA ESTRATÉGICA E CONTEMPORÂNEA',
  hero_description: 'Estratégia, proximidade e conhecimento de ponta para proteger relações, prevenir riscos e construir soluções juridicamente sólidas e duradouras.',
  hero_cta_text: 'Conheça nossa atuação',
  hero_cta_link: '#atuacao',
  
  about_title: 'Advocacia de Alta Performance',
  about_subtitle: '02 / O ESCRITÓRIO',
  about_text_1: 'Fundado com o propósito de oferecer uma advocacia altamente especializada e personalizada, o escritório Albuquerque Guerra Advogados destaca-se pela condução de demandas complexas e consultoria estratégica corporativa e individual.',
  about_text_2: 'Unimos a solidez técnica de profissionais experientes ao dinamismo exigido pelas transformações de mercado. Nossa atuação é pautada pelo rigor intelectual, agilidade e, sobretudo, por um profundo compromisso em compreender a realidade de nossos clientes.',
  about_image: '/about-office.png',
  
  mission_text: 'Prestar serviços jurídicos de alta performance com excelência técnica, ética e foco na geração de valor, oferecendo soluções inovadoras e personalizadas que tragam segurança jurídica aos nossos clientes.',
  vision_text: 'Ser referência regional em advocacia estratégica e corporativa, reconhecidos pela excelência de nossos profissionais, solidez nos resultados e proximidade no relacionamento com o cliente.',
  values_list_text: 'Rigor Técnico, Transparência Absoluta, Comprometimento Ético, Inovação Constante, Proximidade Estratégica',
  
  contact_phone: '+55 (81) 3034-9988',
  contact_whatsapp: '+55 (81) 99988-7766',
  contact_email: 'contato@albuquerqueguerra.adv.br',
  contact_notification_email: 'contato@albuquerqueguerra.adv.br',
  contact_address: 'Rua Arnóbio Marques, 253, sala 1703, Empresarial Camilo Brito, Santo Amaro, Recife - PE, CEP 50.100-130.',
  contact_hours: 'Segunda a Sexta, das 08h às 18h',
  contact_maps_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.0543789498263!2d-34.89115712415175!3d-8.112465381165683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ab1ef5bbba1b0b%3A0xe6ab1e2de66c80!2sAv.%20Eng.%20Domingos%20Ferreira%2C%20Recife%20-%20PE!5e0!3m2!1spt-BR!2sbr!4v1784767000000!5m2!1spt-BR!2sbr',
  google_reviews_url: 'https://share.google/rHwBjzhN1Mp6eJvRo',
  
  seo_title: 'Albuquerque Guerra Advogados | Advocacia Estratégica',
  seo_description: 'Escritório de advocacia estratégica e contemporânea em Recife - PE. Especialistas em contencioso, consultoria trabalhista, cível e previdenciária de alta performance.',
  social_instagram: 'https://instagram.com/albuquerqueguerra',
  social_facebook: 'https://facebook.com/albuquerqueguerra',
  social_linkedin: 'https://linkedin.com/company/albuquerqueguerra'
};

// Gets the merged settings from supabase or localStorage
export const getSiteSettings = (): SiteSettings => {
  if (typeof window === 'undefined') return defaultSettings;
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Error reading settings from localStorage:', e);
  }
  return defaultSettings;
};

// Saves the settings to localStorage and supabase
export const saveSiteSettings = async (settings: Partial<SiteSettings>): Promise<SiteSettings> => {
  const current = getSiteSettings();
  const updated = { ...current, ...settings };
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
  }
  
  // Try to write to Supabase (site_settings table, key 'global')
  try {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 'global', ...updated });
    if (error) throw error;
  } catch (err) {
    console.warn('Could not sync settings to Supabase, saved locally:', err);
  }
  
  return updated;
};
