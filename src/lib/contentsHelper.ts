import { supabase } from './supabase';
import { Article, VideoAd, GoogleReview } from '../types/contents';

export const ARTICLES_STORAGE_KEY = 'albuquerque_guerra_articles';
export const VIDEOS_STORAGE_KEY = 'albuquerque_guerra_video_ads';
export const REVIEWS_STORAGE_KEY = 'albuquerque_guerra_google_reviews';

export const defaultArticles: Article[] = [
  {
    id: 'art-1',
    title: 'Planejamento Patrimonial e Sucessório: Como Proteger o Legado Familiar',
    slug: 'planejamento-patrimonial-sucessorio-proteger-legado',
    summary: 'Entenda os instrumentos jurídicos mais eficazes, como holdings familiares e doações com reserva de usufruto, para evitar litígios e otimizar custos tributários.',
    content: 'O planejamento sucessório e patrimonial é uma estratégia indispensável para quem busca proteger bens conquistados e garantir a continuidade harmoniosa do patrimônio entre gerações.\n\nPrincipais Vantagens:\n1. Prevenção de conflitos familiares e litígios judiciais.\n2. Economia tributária significativa através do ITCMD e custos de inventário.\n3. Estruturação societária customizada (Holdings Familiares).\n4. Manutenção do controle administrativo pelos fundadores.\n\nConsulte nossa equipe especializada para avaliar a estrutura ideal para sua família.',
    category: 'Artigo Jurídico',
    author: 'Dr. João Guerra',
    published_date: '2026-08-10',
    cover_image: '/about-office.png',
    reading_time: '4 min',
    tags: ['Direito de Família', 'Sucessões', 'Holding Familiar'],
    is_featured: true,
    is_active: true,
    status: 'Publicado',
    created_at: new Date().toISOString()
  },
  {
    id: 'art-2',
    title: 'Recuperação de Créditos Tributários para Empresas: Oportunidades em 2026',
    slug: 'recuperacao-creditos-tributarios-empresas-2026',
    summary: 'Como as recentes decisões dos tribunais superiores abriram teses sólidas para a recuperação de valores pagos a maior por pessoas jurídicas.',
    content: 'Com a constante evolução jurisprudencial nos tribunais superiores (STF e STJ), empresas de diversos segmentos têm direito a compensar e restituir valores tributários recolhidos indevidamente nos últimos 5 anos.\n\nNossa atuação inclui diagnóstico preliminar sem risco financeiro, análise documental minuciosa e ingresso com as medidas administrativas ou judiciais cabíveis.',
    category: 'Publicação',
    author: 'Dra. Cláudia Albuquerque',
    published_date: '2026-08-01',
    cover_image: '/event-innovation.png',
    reading_time: '5 min',
    tags: ['Tributário', 'Empresarial', 'Créditos Fiscais'],
    is_featured: false,
    is_active: true,
    status: 'Publicado',
    created_at: new Date().toISOString()
  },
  {
    id: 'art-3',
    title: 'Campanha Institucional: Segurança Jurídica nos Negócios Imobiliários',
    slug: 'campanha-seguranca-juridica-negocios-imobiliarios',
    summary: 'A importância do Due Diligence imobiliário para investidores, compradores e incorporadoras antes de fechar qualquer transação de alto valor.',
    content: 'A aquisição ou locação de imóveis sem uma auditoria jurídica prévia expõe as partes a riscos graves de penhora, evicção e fraudes à execução.\n\nO Albuquerque Guerra Advogados oferece suporte completo em contratos, regularização fundiária e due diligence em todo o território nacional.',
    category: 'Campanha',
    author: 'Dra. Renata Albuquerque',
    published_date: '2026-07-25',
    cover_image: '/gallery-founders.png',
    reading_time: '3 min',
    tags: ['Imobiliário', 'Due Diligence', 'Contratos'],
    is_featured: false,
    is_active: true,
    status: 'Publicado',
    created_at: new Date().toISOString()
  }
];

export const defaultVideoAds: VideoAd[] = [
  {
    id: 'vid-1',
    title: 'Como Funciona a Criação de uma Holding Familiar na Prática?',
    description: 'Dr. João Guerra explica passo a passo como proteger o patrimônio da sua família e reduzir impostos em até 80% legalmente.',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: '/joao-guerra.jpg',
    target_campaign: 'Campanha Sucessões & Holding 2026',
    cta_text: 'Falar com Dr. João Guerra no WhatsApp',
    cta_link: 'https://wa.me/5581999999999?text=Ol%C3%A1%2C+assisti+ao+v%C3%ADdeo+sobre+Holding+Familiar+e+gostaria+de+uma+consultoria.',
    platform: 'YouTube',
    is_active: true,
    is_featured: true,
    views_count: '14.2k visualizações',
    created_at: new Date().toISOString()
  },
  {
    id: 'vid-2',
    title: 'Inventário Judicial vs. Extrajudicial: Qual a Opção Mais Rápida?',
    description: 'Vídeo explicativo com respostas diretas às principais dúvidas de herdeiros e famílias sobre prazos e custos de partilha.',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: '/claudia-albuquerque.jpg',
    target_campaign: 'Campanha Inventários Ágeis',
    cta_text: 'Agendar Consulta Rápida',
    cta_link: 'https://wa.me/5581999999999?text=Ol%C3%A1%2C+preciso+de+orienta%C3%A7%C3%A3o+sobre+Invent%C3%A1rio.',
    platform: 'Google Ads',
    is_active: true,
    is_featured: false,
    views_count: '8.7k visualizações',
    created_at: new Date().toISOString()
  },
  {
    id: 'vid-3',
    title: 'Defesa e Estratégia em Contratos Empresariais de Alto Risco',
    description: 'Análise detalhada de cláusulas de confidencialidade, não-concorrência e mitigação de passivos contratuais.',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: '/renata-albuquerque.jpg',
    target_campaign: 'Campanha B2B Contratos',
    cta_text: 'Solicitar Análise Contratual',
    cta_link: 'https://wa.me/5581999999999?text=Gostaria+de+solicitar+uma+an%C3%A1lise+de+contratos+empresariais.',
    platform: 'Meta Ads',
    is_active: true,
    is_featured: false,
    views_count: '6.1k visualizações',
    created_at: new Date().toISOString()
  }
];

export const defaultGoogleReviews: GoogleReview[] = [
  {
    id: 'rev-1',
    author_name: 'Carlos Eduardo Menezes',
    author_avatar: '',
    rating: 5,
    relative_time_description: 'há 2 semanas',
    text: 'Excelente atendimento e competência ímpar! O Dr. João Guerra nos orientou em todo o processo de planejamento sucessório da nossa família com extrema clareza, transparência e segurança jurídica. Recomendo de olhos fechados.',
    service_type: 'Planejamento Sucessório & Holding',
    is_verified: true,
    review_link: 'https://maps.google.com',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'rev-2',
    author_name: 'Mariana Vasconcelos',
    author_avatar: '',
    rating: 5,
    relative_time_description: 'há 1 mês',
    text: 'Escritório de altíssimo nível. A equipe demonstrou agilidade e profundo domínio técnico em nossa demanda empresarial. Estrutura impecável e atendimento humanizado.',
    service_type: 'Direito Empresarial & Contratos',
    is_verified: true,
    review_link: 'https://maps.google.com',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'rev-3',
    author_name: 'Roberto Figueiredo Cavalcanti',
    author_avatar: '',
    rating: 5,
    relative_time_description: 'há 3 semanas',
    text: 'Profissionais éticos, rápidos e que realmente entendem as dores do cliente. A Dra. Cláudia e o Dr. João resolveram uma questão tributária complexa da nossa empresa em tempo recorde.',
    service_type: 'Consultoria Tributária',
    is_verified: true,
    review_link: 'https://maps.google.com',
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'rev-4',
    author_name: 'Luciana Queiroz',
    author_avatar: '',
    rating: 5,
    relative_time_description: 'há 2 meses',
    text: 'Atendimento impecável desde a recepção até a condução do caso pelos advogados. Transmitem total tranquilidade em momentos delicados. Nota 10!',
    service_type: 'Direito Civil & Família',
    is_verified: true,
    review_link: 'https://maps.google.com',
    is_active: true,
    created_at: new Date().toISOString()
  }
];

// Articles CRUD
export const getArticles = async (): Promise<Article[]> => {
  try {
    const { data, error } = await supabase.from('site_articles').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(data));
      return data;
    }
  } catch (e) {
    console.warn('Supabase articles fetch fallback:', e);
  }
  const stored = localStorage.getItem(ARTICLES_STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(defaultArticles));
  return defaultArticles;
};

export const saveArticle = async (article: Article): Promise<void> => {
  const current = await getArticles();
  const index = current.findIndex(a => a.id === article.id);
  if (index !== -1) {
    current[index] = article;
  } else {
    current.unshift(article);
  }
  localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(current));
  try {
    await supabase.from('site_articles').upsert(article);
  } catch (e) {
    console.warn('Supabase save article fallback:', e);
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
  const current = await getArticles();
  const filtered = current.filter(a => a.id !== id);
  localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(filtered));
  try {
    await supabase.from('site_articles').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase delete article fallback:', e);
  }
};

// Video Ads CRUD
export const getVideoAds = async (): Promise<VideoAd[]> => {
  try {
    const { data, error } = await supabase.from('site_video_ads').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(data));
      return data;
    }
  } catch (e) {
    console.warn('Supabase video ads fetch fallback:', e);
  }
  const stored = localStorage.getItem(VIDEOS_STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(defaultVideoAds));
  return defaultVideoAds;
};

export const saveVideoAd = async (video: VideoAd): Promise<void> => {
  const current = await getVideoAds();
  const index = current.findIndex(v => v.id === video.id);
  if (index !== -1) {
    current[index] = video;
  } else {
    current.unshift(video);
  }
  localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(current));
  try {
    await supabase.from('site_video_ads').upsert(video);
  } catch (e) {
    console.warn('Supabase save video ad fallback:', e);
  }
};

export const deleteVideoAd = async (id: string): Promise<void> => {
  const current = await getVideoAds();
  const filtered = current.filter(v => v.id !== id);
  localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(filtered));
  try {
    await supabase.from('site_video_ads').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase delete video ad fallback:', e);
  }
};

// Google Reviews CRUD
export const getGoogleReviews = async (): Promise<GoogleReview[]> => {
  try {
    const { data, error } = await supabase.from('site_google_reviews').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(data));
      return data;
    }
  } catch (e) {
    console.warn('Supabase google reviews fetch fallback:', e);
  }
  const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(defaultGoogleReviews));
  return defaultGoogleReviews;
};

export const saveGoogleReview = async (review: GoogleReview): Promise<void> => {
  const current = await getGoogleReviews();
  const index = current.findIndex(r => r.id === review.id);
  if (index !== -1) {
    current[index] = review;
  } else {
    current.unshift(review);
  }
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(current));
  try {
    await supabase.from('site_google_reviews').upsert(review);
  } catch (e) {
    console.warn('Supabase save review fallback:', e);
  }
};

export const deleteGoogleReview = async (id: string): Promise<void> => {
  const current = await getGoogleReviews();
  const filtered = current.filter(r => r.id !== id);
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(filtered));
  try {
    await supabase.from('site_google_reviews').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase delete review fallback:', e);
  }
};
