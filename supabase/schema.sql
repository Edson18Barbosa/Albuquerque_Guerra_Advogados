-- ==============================================================================
-- SCHEMA SUPABASE: ALBUQUERQUE GUERRA ADVOGADOS
-- Execute este script no SQL Editor do seu projeto Supabase para criar e 
-- inicializar todas as tabelas e políticas de acesso (RLS).
-- ==============================================================================

-- 1. TABELA DE CONFIGURAÇÕES GERAIS DO SITE (site_settings)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY,
  logo_horizontal TEXT,
  logo_vertical TEXT,
  logo_monogram TEXT,
  primary_color TEXT DEFAULT '#D8CBB3',
  hero_title_part1 TEXT,
  hero_title_italic TEXT,
  hero_subtitle TEXT,
  hero_description TEXT,
  hero_cta_text TEXT,
  hero_cta_link TEXT,
  about_title TEXT,
  about_subtitle TEXT,
  about_text_1 TEXT,
  about_text_2 TEXT,
  about_image TEXT,
  mission_text TEXT,
  vision_text TEXT,
  values_list_text TEXT,
  contact_phone TEXT,
  contact_whatsapp TEXT,
  contact_email TEXT,
  contact_notification_email TEXT,
  contact_address TEXT,
  contact_hours TEXT,
  contact_maps_url TEXT,
  google_reviews_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
  social_instagram TEXT,
  social_facebook TEXT,
  social_linkedin TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. TABELA DE AVALIAÇÕES REAIS DO GOOGLE (site_google_reviews)
CREATE TABLE IF NOT EXISTS public.site_google_reviews (
  id TEXT PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  relative_time_description TEXT,
  text TEXT NOT NULL,
  service_type TEXT,
  is_verified BOOLEAN DEFAULT TRUE,
  review_link TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. TABELA DE ARTIGOS E PUBLICAÇÕES (site_articles)
CREATE TABLE IF NOT EXISTS public.site_articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  category TEXT DEFAULT 'Artigo Jurídico',
  author TEXT DEFAULT 'Dr. João Guerra',
  published_date TEXT,
  reading_time TEXT DEFAULT '4 min',
  cover_image TEXT,
  tags TEXT[],
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'Publicado',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. TABELA DE VÍDEOS INSTITUCIONAIS E ADS (site_video_ads)
CREATE TABLE IF NOT EXISTS public.site_video_ads (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  button_text TEXT,
  button_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. TABELA DE EVENTOS DO ESCRITÓRIO (site_events)
CREATE TABLE IF NOT EXISTS public.site_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  category TEXT DEFAULT 'Palestras',
  start_date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT,
  modality TEXT DEFAULT 'Presencial',
  location TEXT,
  address TEXT,
  registration_url TEXT,
  timezone TEXT,
  status TEXT DEFAULT 'Publicado',
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. TABELA DE USUÁRIOS ADMINISTRADORES (site_admin_users)
CREATE TABLE IF NOT EXISTS public.site_admin_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT,
  role TEXT DEFAULT 'Editor',
  status TEXT DEFAULT 'Ativo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. TABELA DE MENSAGENS E LEADS DE CONTATO (site_contact_messages)
CREATE TABLE IF NOT EXISTS public.site_contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  area TEXT,
  message TEXT NOT NULL,
  sent_to_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 8. TABELA DA EQUIPE / SÓCIOS (team_members)
CREATE TABLE IF NOT EXISTS public.team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image TEXT,
  category TEXT DEFAULT 'partner',
  display_order INTEGER DEFAULT 1
);

-- 9. TABELA DE ÁREAS DE ATUAÇÃO (practice_areas)
CREATE TABLE IF NOT EXISTS public.practice_areas (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  "fullContent" TEXT,
  "iconName" TEXT
);

-- 10. TABELA DE VALORES INSTITUCIONAIS (site_values)
CREATE TABLE IF NOT EXISTS public.site_values (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  "fullContent" TEXT,
  "iconName" TEXT,
  image TEXT
);

-- 11. TABELA DA GALERIA DE FOTOS (site_gallery)
CREATE TABLE IF NOT EXISTS public.site_gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Ambiente',
  image TEXT NOT NULL,
  span TEXT DEFAULT 'col-span-1'
);

-- 12. TABELA DA FORMA DE ATUAÇÃO (site_workflow)
CREATE TABLE IF NOT EXISTS public.site_workflow (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL
);

-- 13. TABELA DA BIBLIOTECA DE MÍDIA (media_library)
CREATE TABLE IF NOT EXISTS public.media_library (
  id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  public_url TEXT NOT NULL,
  focal_x NUMERIC DEFAULT 50,
  focal_y NUMERIC DEFAULT 50,
  zoom NUMERIC DEFAULT 1.0,
  assigned_section TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- HABILITAR ROW LEVEL SECURITY (RLS) COM POLÍTICAS DE ACESSO
-- ==============================================================================

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_google_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_video_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_workflow ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN 
    SELECT unnest(ARRAY[
      'site_settings', 'site_google_reviews', 'site_articles', 
      'site_video_ads', 'site_events', 'site_admin_users', 
      'site_contact_messages', 'team_members', 'practice_areas', 
      'site_values', 'site_gallery', 'site_workflow', 'media_library'
    ])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public Full Access on %I" ON public.%I', tbl, tbl);
    EXECUTE format('CREATE POLICY "Public Full Access on %I" ON public.%I FOR ALL USING (true) WITH CHECK (true)', tbl, tbl);
  END LOOP;
END $$;

-- ==============================================================================
-- POPULAR DADOS INICIAIS (SEED)
-- ==============================================================================

INSERT INTO public.site_settings (
  id, logo_horizontal, logo_vertical, logo_monogram, primary_color,
  hero_title_part1, hero_title_italic, hero_subtitle, hero_description,
  hero_cta_text, hero_cta_link,
  about_title, about_subtitle, about_text_1, about_text_2, about_image,
  mission_text, vision_text, values_list_text,
  contact_phone, contact_whatsapp, contact_email, contact_notification_email,
  contact_address, contact_hours, contact_maps_url, google_reviews_url,
  seo_title, seo_description, social_instagram, social_facebook, social_linkedin
) VALUES (
  'global', '/logo-horizontal.png', '/logo-vertical.png', '/logo-monogram.png', '#D8CBB3',
  'Segurança jurídica que gera', 'impacto positivo.', 'ADVOCACIA ESTRATÉGICA E CONTEMPORÂNEA',
  'Estratégia, proximidade e conhecimento de ponta para proteger relações, prevenir riscos e construir soluções juridicamente sólidas e duradouras.',
  'Conheça nossa atuação', '#atuacao',
  'Advocacia de Alta Performance', '02 / O ESCRITÓRIO',
  'Fundado com o propósito de oferecer uma advocacia altamente especializada e personalizada, o escritório Albuquerque Guerra Advogados destaca-se pela condução de demandas complexas e consultoria estratégica corporativa e individual.',
  'Unimos a solidez técnica de profissionais experientes ao dinamismo exigido pelas transformações de mercado. Nossa atuação é pautada pelo rigor intelectual, agilidade e, sobretudo, por um profundo compromisso em compreender a realidade de nossos clientes.',
  '/about-office.png',
  'Prestar serviços jurídicos de alta performance com excelência técnica, ética e foco na geração de valor, oferecendo soluções inovadoras e personalizadas que tragam segurança jurídica aos nossos clientes.',
  'Ser referência regional em advocacia estratégica e corporativa, reconhecidos pela excelência de nossos profissionais, solidez nos resultados e proximidade no relacionamento com o cliente.',
  'Rigor Técnico, Transparência Absoluta, Comprometimento Ético, Inovação Constante, Proximidade Estratégica',
  '+55 (81) 3034-9988', '+55 (81) 99988-7766', 'contato@albuquerqueguerra.adv.br', 'contato@albuquerqueguerra.adv.br',
  'Rua Arnóbio Marques, 253, sala 1703, Empresarial Camilo Brito, Santo Amaro, Recife - PE, CEP 50.100-130.',
  'Segunda a Sexta, das 08h às 18h',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.0543789498263!2d-34.89115712415175!3d-8.112465381165683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ab1ef5bbba1b0b%3A0xe6ab1e2de66c80!2sAv.%20Eng.%20Domingos%20Ferreira%2C%20Recife%20-%20PE!5e0!3m2!1spt-BR!2sbr!4v1784767000000!5m2!1spt-BR!2sbr',
  'https://www.google.com/search?kgmid=/g/11p5kwclk3&hl=pt-BR&q=Advocacia+Jo%C3%A3o+Guerra#lrd=0x7ab19d61d600507:0x53f2f7602f5dc50a,1,,,,',
  'Albuquerque Guerra Advogados | Advocacia Estratégica',
  'Escritório de advocacia estratégica e contemporânea em Recife - PE. Especialistas em contencioso, consultoria trabalhista, cível e previdenciária de alta performance.',
  'https://instagram.com/albuquerqueguerra', 'https://facebook.com/albuquerqueguerra', 'https://linkedin.com/company/albuquerqueguerra'
) ON CONFLICT (id) DO UPDATE SET updated_at = timezone('utc'::text, now());

INSERT INTO public.site_google_reviews (id, author_name, rating, text, service_type, is_verified, review_link, is_active) VALUES
('rev-hideraldo-borba', 'Hideraldo Borba', 5, 'Das experiências que tive e ainda tenho com outros escritórios este escritório é diferenciado, com emissão de relatórios de acompanhamento dos processos. Sem falar no retorno das ligações e atendimentos via mídias. A equipe muito atenciosa e competente. Parabéns a todos que fazem a Advocacia João Guerra.', 'Relatórios & Acompanhamento de Processos', true, 'https://www.google.com/search?kgmid=/g/11p5kwclk3&hl=pt-BR&q=Advocacia+Jo%C3%A3o+Guerra#lrd=0x7ab19d61d600507:0x53f2f7602f5dc50a,1,,,,', true),
('rev-messias-santos', 'Messias Santos', 5, 'Um homem trabalhador e um profissional dedicado, em tempos de muita criatividade nos negócios na política e no mundo, ele através da sua incansável militância e saber jurídico nos dá a segurança para seguir a nossa justa caminhada! Muito agradecido por me aceitar ser seu cliente!', 'Segurança Jurídica & Atuação Estratégica', true, 'https://www.google.com/search?kgmid=/g/11p5kwclk3&hl=pt-BR&q=Advocacia+Jo%C3%A3o+Guerra#lrd=0x7ab19d61d600507:0x53f2f7602f5dc50a,1,,,,', true),
('rev-suzam-kelle', 'Suzam Kelle Cristovao', 5, 'Equipe super competente, sempre me deixaram ciente de tudo que estava acontecendo sobre o processo,só tenho elogios a toda equipe .', 'Acompanhamento & Transparência Processual', true, 'https://www.google.com/search?kgmid=/g/11p5kwclk3&hl=pt-BR&q=Advocacia+Jo%C3%A3o+Guerra#lrd=0x7ab19d61d600507:0x53f2f7602f5dc50a,1,,,,', true),
('rev-fabio-gomes', 'Fabio Gomes', 5, 'Extremamente satisfeito com o trabalho prestado pelos profissionais da Advocacia João Guerra! Presteza no atendimento, clareza nos processos, idoneidade e transparência são adjetivos que descrevem o trabalho dessa equipe!', 'Presteza, Idoneidade & Rigor Técnico', true, 'https://www.google.com/search?kgmid=/g/11p5kwclk3&hl=pt-BR&q=Advocacia+Jo%C3%A3o+Guerra#lrd=0x7ab19d61d600507:0x53f2f7602f5dc50a,1,,,,', true),
('rev-marina-reis', 'Marina Reis', 5, 'Pessoas muito competentes e compromissadas em fazer o melhor para atender seus clientes de forma muito transparente. Recomendo demais!', 'Comprometimento & Excelência no Atendimento', true, 'https://www.google.com/search?kgmid=/g/11p5kwclk3&hl=pt-BR&q=Advocacia+Jo%C3%A3o+Guerra#lrd=0x7ab19d61d600507:0x53f2f7602f5dc50a,1,,,,', true),
('rev-rodrigo-albuquerque', 'Rodrigo Albuquerque', 5, 'Excelente atendimento! Profissionais altamente qualificados, atendimento humanizado, ágil e com soluções jurídicas precisas e seguras. Recomendo com total confiança!', 'Atendimento Humanizado & Segurança Jurídica', true, 'https://www.google.com/search?kgmid=/g/11p5kwclk3&hl=pt-BR&q=Advocacia+Jo%C3%A3o+Guerra#lrd=0x7ab19d61d600507:0x53f2f7602f5dc50a,1,,,,', true)
ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;

INSERT INTO public.site_admin_users (id, name, email, password, role, status) VALUES
('1', 'Edson Barbosa', 'edsonrb.barbosa@gmail.com', 'Maedson@862274', 'Administrador', 'Ativo'),
('2', 'João Guerra', 'joao.guerra@albuquerqueguerra.com.br', 'advogados@2026', 'Administrador', 'Ativo')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.team_members (id, name, role, bio, image, category, display_order) VALUES
('renata', 'Renata Albuquerque', 'Sócia Fundadora • Coordenadora Trabalhista e Previdenciária', 'Advogada especialista em contencioso estratégico e consultoria empresarial de alto nível. Com vasta experiência em tribunais, lidera a frente trabalhista do escritório com foco em rigor técnico, prevenção de passivos e resultados sólidos.', '/renata-albuquerque.jpg', 'partner', 1),
('joao', 'João Guerra', 'Sócio Fundador • Coordenador Estratégico e Institucional', 'Sócio fundador com sólida atuação em litígios complexos e estruturação de negócios jurídicos. Combina visão estratégica refinada e dedicação integral à defesa dos interesses corporativos e individuais de nossos clientes.', '/joao-guerra.jpg', 'partner', 2),
('claudia', 'Cláudia Albuquerque', 'Sócia • Coordenadora da Área Cível', 'Sócia e coordenadora da área Cível do escritório. É formada em economia e em direito, contando com diversas pós-graduações e especializações em seu currículo que somam a uma advocacia de alta performance.', '/claudia-albuquerque.jpg', 'partner', 3)
ON CONFLICT (id) DO NOTHING;
