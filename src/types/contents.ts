export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: 'Artigo Jurídico' | 'Publicação' | 'Campanha' | 'Notícia' | 'Informativo';
  author: string;
  published_date: string;
  cover_image: string;
  reading_time: string;
  tags: string[];
  is_featured: boolean;
  is_active: boolean;
  status: 'Publicado' | 'Rascunho';
  created_at: string;
  updated_at?: string;
}

export interface VideoAd {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  target_campaign: string;
  cta_text: string;
  cta_link: string;
  platform: 'YouTube' | 'Instagram / Reels' | 'Google Ads' | 'Meta Ads' | 'TikTok';
  is_active: boolean;
  is_featured: boolean;
  views_count?: string;
  created_at: string;
}

export interface GoogleReview {
  id: string;
  author_name: string;
  author_avatar?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  service_type?: string;
  is_verified: boolean;
  review_link?: string;
  is_active: boolean;
  created_at: string;
}
