import { supabase } from './supabase';
import { Article, VideoAd, GoogleReview } from '../types/contents';

export const ARTICLES_STORAGE_KEY = 'albuquerque_guerra_articles';
export const VIDEOS_STORAGE_KEY = 'albuquerque_guerra_video_ads';
export const REVIEWS_STORAGE_KEY = 'albuquerque_guerra_google_reviews';

export const defaultArticles: Article[] = [
  {
    id: 'art-1',
    title: 'Planejamento Sucessório e Proteção Patrimonial: Como Estruturar a Transição de Bens',
    slug: 'planejamento-sucessorio-protecao-patrimonial',
    summary: 'Entenda os instrumentos jurídicos mais eficazes para garantir a preservação do patrimônio familiar e evitar conflitos societários e heranças litigiosas.',
    content: `O planejamento sucessório transcende a simples partilha de bens futuros; trata-se de um conjunto integrado de medidas jurídicas, societárias e tributárias destinadas a conferir perenidade aos negócios da família e segurança financeira aos herdeiros.

1. Instrumentos Societários e Holdings
A criação de uma holding familiar ou patrimonial permite a integralização de bens imóveis e participações sociais sob uma mesma pessoa jurídica, viabilizando regras claras de governança, cláusulas de incomunicabilidade, inalienabilidade e usufruto vitalício com reserva de poderes de gestão aos patriarcas.

2. Eficiência Tributária e Celeridade
Com a recente promulgação da Reforma Tributária e a progressividade do ITCMD nos estados, o planejamento antecipado minimiza a carga fiscal e previne a onerosidade e a morosidade do inventário tradicional.

3. Acordos de Sócios e Protocolos Familiares
O alinhamento entre as gerações por meio de acordos parassociais assegura que a entrada ou saída de herdeiros no quadro de comando da empresa ocorra sem colocar em risco as operações institucionais.`,
    category: 'Artigo Jurídico',
    author: 'Dr. João Guerra',
    published_date: '2026-08-15',
    reading_time: '5 min',
    cover_image: '/event-innovation.png',
    tags: ['Sucessões', 'Holding Familiar', 'Tributário'],
    is_featured: true,
    is_active: true,
    status: 'Publicado',
    created_at: new Date().toISOString()
  },
  {
    id: 'art-2',
    title: 'A Nova Disciplina das Relações Contratuais e o Gerenciamento de Passivos',
    slug: 'relacoes-contratuais-gerenciamento-passivos',
    summary: 'A importância da modelagem preventiva de cláusulas de resolução de conflitos, confidencialidade e limitação de responsabilidade civil em negócios contemporâneos.',
    content: `No dinamismo do mercado corporativo moderno, contratos não podem ser meras formalidades burocráticas, mas sim instrumentos estratégicos de blindagem e distribuição equilibrada de riscos operacionais.

Diligência Prévia e Análise de Cenários
A elaboração e revisão minuciosa de minutas contratuais permite antever potenciais causas de rescisão, penalidades desproporcionais e passivos ocultos. A inclusão de cláusulas escalonadas de mediação e arbitragem proporciona soluções céleres e especializadas em caso de controvérsias.`,
    category: 'Publicação',
    author: 'Dra. Renata Albuquerque',
    published_date: '2026-08-01',
    reading_time: '4 min',
    cover_image: '/about-office.png',
    tags: ['Contratos', 'Empresarial', 'Prevenção'],
    is_featured: false,
    is_active: true,
    status: 'Publicado',
    created_at: new Date().toISOString()
  },
  {
    id: 'art-3',
    title: 'Responsabilidade Civil e Conformidade Regulatória nas Atividades em Saúde e Terceiro Setor',
    slug: 'responsabilidade-civil-conformidade-saude',
    summary: 'Diretrizes legais e preventivas para instituições privadas, organizações sociais e profissionais liberais operarem com total segurança jurídica.',
    content: `A conformidade com as normas regulatórias e os princípios ético-profissionais constitui o pilar indispensável para prevenir litígios indenizatórios e garantir sustentabilidade institucional.

Nossa atuação consultiva apoia gestores e entidades na estruturação de protocolos de atendimento, termos de consentimento informado e auditorias de conformidade com a LGPD.`,
    category: 'Campanha',
    author: 'Dra. Cláudia Albuquerque',
    published_date: '2026-07-20',
    reading_time: '6 min',
    cover_image: '/gallery-founders.png',
    tags: ['Saúde', 'Terceiro Setor', 'Compliance'],
    is_featured: false,
    is_active: true,
    status: 'Publicado',
    created_at: new Date().toISOString()
  }
];

// Empty by default so the video tab on site only appears if a video link is added
export const defaultVideoAds: VideoAd[] = [];

export const defaultGoogleReviews: GoogleReview[] = [
  {
    "id": "rev-hideraldo-borba",
    "author_name": "Hideraldo Borba",
    "author_avatar": "",
    "rating": 5,
    "relative_time_description": "2 anos atrás",
    "text": "Das experiências que tive e ainda tenho com outros escritórios este escritório é diferenciado, com emissão de relatórios de acompanhamento dos processos. Sem falar no retorno das ligações e atendimentos via mídias. A equipe muito atenciosa e competente. Parabéns a todos que fazem a Advocacia João Guerra.",
    "service_type": "Relatórios & Acompanhamento de Processos",
    "is_verified": true,
    "review_link": "https://www.google.com/search?kgmid=/g/11p5kwclk3&hl=pt-BR&q=Advocacia+Jo%C3%A3o+Guerra#lrd=0x7ab19d61d600507:0x53f2f7602f5dc50a,1,,,,",
    "is_active": true,
    "created_at": "2024-05-10T10:00:00Z"
  },
  {
    "id": "rev-messias-santos",
    "author_name": "Messias Santos",
    "author_avatar": "",
    "rating": 5,
    "relative_time_description": "2 anos atrás",
    "text": "Um homem trabalhador e um profissional dedicado, em tempos de muita criatividade nos negócios na política e no mundo, ele através da sua incansável militância e saber jurídico nos dá a segurança para seguir a nossa justa caminhada! Muito agradecido por me aceitar ser seu cliente!",
    "service_type": "Segurança Jurídica & Atuação Estratégica",
    "is_verified": true,
    "review_link": "https://www.google.com/search?kgmid=/g/11p5kwclk3&hl=pt-BR&q=Advocacia+Jo%C3%A3o+Guerra#lrd=0x7ab19d61d600507:0x53f2f7602f5dc50a,1,,,,",
    "is_active": true,
    "created_at": "2024-06-15T14:30:00Z"
  },
  {
    "id": "rev-suzam-kelle",
    "author_name": "Suzam Kelle Cristovao",
    "author_avatar": "",
    "rating": 5,
    "relative_time_description": "2 anos atrás",
    "text": "Equipe super competente, sempre me deixaram ciente de tudo que estava acontecendo sobre o processo,só tenho elogios a toda equipe .",
    "service_type": "Acompanhamento & Transparência Processual",
    "is_verified": true,
    "review_link": "https://www.google.com/search?kgmid=/g/11p5kwclk3&hl=pt-BR&q=Advocacia+Jo%C3%A3o+Guerra#lrd=0x7ab19d61d600507:0x53f2f7602f5dc50a,1,,,,",
    "is_active": true,
    "created_at": "2024-07-20T11:00:00Z"
  },
  {
    "id": "rev-fabio-gomes",
    "author_name": "Fabio Gomes",
    "author_avatar": "",
    "rating": 5,
    "relative_time_description": "um ano atrás",
    "text": "Extremamente satisfeito com o trabalho prestado pelos profissionais da Advocacia João Guerra! Presteza no atendimento, clareza nos processos, idoneidade e transparência são adjetivos que descrevem o trabalho dessa equipe!",
    "service_type": "Presteza, Idoneidade & Rigor Técnico",
    "is_verified": true,
    "review_link": "https://www.google.com/search?kgmid=/g/11p5kwclk3&hl=pt-BR&q=Advocacia+Jo%C3%A3o+Guerra#lrd=0x7ab19d61d600507:0x53f2f7602f5dc50a,1,,,,",
    "is_active": true,
    "created_at": "2025-04-18T16:20:00Z"
  },
  {
    "id": "rev-marina-reis",
    "author_name": "Marina Reis",
    "author_avatar": "",
    "rating": 5,
    "relative_time_description": "2 anos atrás",
    "text": "Pessoas muito competentes e compromissadas em fazer o melhor para atender seus clientes de forma muito transparente. Recomendo demais!",
    "service_type": "Comprometimento & Excelência no Atendimento",
    "is_verified": true,
    "review_link": "https://www.google.com/search?kgmid=/g/11p5kwclk3&hl=pt-BR&q=Advocacia+Jo%C3%A3o+Guerra#lrd=0x7ab19d61d600507:0x53f2f7602f5dc50a,1,,,,",
    "is_active": true,
    "created_at": "2024-08-05T09:15:00Z"
  },
  {
    "id": "rev-rodrigo-albuquerque",
    "author_name": "Rodrigo Albuquerque",
    "author_avatar": "",
    "rating": 5,
    "relative_time_description": "2 anos atrás",
    "text": "Excelente atendimento! Profissionais altamente qualificados, atendimento humanizado, ágil e com soluções jurídicas precisas e seguras. Recomendo com total confiança!",
    "service_type": "Atendimento Humanizado & Segurança Jurídica",
    "is_verified": true,
    "review_link": "https://www.google.com/search?kgmid=/g/11p5kwclk3&hl=pt-BR&q=Advocacia+Jo%C3%A3o+Guerra#lrd=0x7ab19d61d600507:0x53f2f7602f5dc50a,1,,,,",
    "is_active": true,
    "created_at": "2024-09-12T15:45:00Z"
  }
];

// Helper to format YouTube and video links to embed format
export const formatEmbedUrl = (url: string): string => {
  if (!url) return '';
  const trimmed = url.trim();
  
  // YouTube watch?v= format
  if (trimmed.includes('youtube.com/watch?v=')) {
    const videoId = trimmed.split('v=')[1]?.split('&')[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // YouTube youtu.be/ format
  if (trimmed.includes('youtu.be/')) {
    const videoId = trimmed.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }

  // YouTube shorts format
  if (trimmed.includes('youtube.com/shorts/')) {
    const videoId = trimmed.split('shorts/')[1]?.split('?')[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }

  return trimmed;
};

// ================= ARTICLES CRUD =================
export const getArticles = async (): Promise<Article[]> => {
  try {
    const { data, error } = await supabase.from('site_articles').select('*').order('published_date', { ascending: false });
    if (!error && data && data.length > 0) {
      localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(data));
      return data;
    }
  } catch (e) {
    console.warn('Error fetching articles from Supabase:', e);
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
    console.warn('Error syncing article to Supabase:', e);
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
  const current = await getArticles();
  const filtered = current.filter(a => a.id !== id);
  localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(filtered));
  try {
    await supabase.from('site_articles').delete().eq('id', id);
  } catch (e) {
    console.warn('Error deleting article from Supabase:', e);
  }
};

// ================= VIDEOS CRUD =================
export const getVideoAds = async (): Promise<VideoAd[]> => {
  try {
    const { data, error } = await supabase.from('site_video_ads').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(data));
      return data;
    }
  } catch (e) {
    console.warn('Error fetching video ads from Supabase:', e);
  }
  const stored = localStorage.getItem(VIDEOS_STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(defaultVideoAds));
  return defaultVideoAds;
};

export const saveVideoAd = async (video: VideoAd): Promise<void> => {
  const current = await getVideoAds();
  const formattedVideo: VideoAd = {
    ...video,
    video_url: formatEmbedUrl(video.video_url)
  };
  const index = current.findIndex(v => v.id === formattedVideo.id);
  if (index !== -1) {
    current[index] = formattedVideo;
  } else {
    current.unshift(formattedVideo);
  }
  localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(current));
  try {
    await supabase.from('site_video_ads').upsert(formattedVideo);
  } catch (e) {
    console.warn('Error syncing video ad to Supabase:', e);
  }
};

export const deleteVideoAd = async (id: string): Promise<void> => {
  const current = await getVideoAds();
  const filtered = current.filter(v => v.id !== id);
  localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(filtered));
  try {
    await supabase.from('site_video_ads').delete().eq('id', id);
  } catch (e) {
    console.warn('Error deleting video ad from Supabase:', e);
  }
};

// ================= GOOGLE REVIEWS CRUD =================
export const getGoogleReviews = async (): Promise<GoogleReview[]> => {
  try {
    const { data, error } = await supabase.from('site_google_reviews').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(data));
      return data;
    }
  } catch (e) {
    console.warn('Error fetching reviews from Supabase:', e);
  }
  const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
  if (stored) {
    const parsed: GoogleReview[] = JSON.parse(stored);
    const cleaned = parsed.filter(r => !['Carlos Eduardo Menezes', 'Mariana Vasconcelos', 'Roberto Figueiredo Cavalcanti', 'Luciana Queiroz'].includes(r.author_name));
    if (cleaned.length >= 6) {
      return cleaned;
    }
  }
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
    console.warn('Error syncing review to Supabase:', e);
  }
};

export const deleteGoogleReview = async (id: string): Promise<void> => {
  const current = await getGoogleReviews();
  const filtered = current.filter(r => r.id !== id);
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(filtered));
  try {
    await supabase.from('site_google_reviews').delete().eq('id', id);
  } catch (e) {
    console.warn('Error deleting review from Supabase:', e);
  }
};
