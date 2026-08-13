export interface Event {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  category: string;
  start_date: string;
  end_date?: string;
  start_time: string;
  end_time?: string;
  timezone?: string;
  modality: 'Presencial' | 'Online' | 'Híbrido';
  location?: string;
  address?: string;
  map_url?: string;
  registration_url?: string;
  registration_deadline?: string;
  price_information?: string;
  speakers?: string;
  schedule?: string;
  additional_information?: string;
  status: 'Rascunho' | 'Publicado';
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface EventMedia {
  id: string;
  event_id: string;
  media_type: 'main' | 'story' | 'feed' | 'banner' | 'gallery' | 'video' | 'material';
  file_url: string;
  file_name: string;
  width: number;
  height: number;
  aspect_ratio: string;
  orientation: 'vertical' | 'horizontal' | 'square';
  alt_text?: string;
  caption?: string;
  credits?: string;
  focal_x?: number;
  focal_y?: number;
  zoom?: number;
  display_order: number;
}
