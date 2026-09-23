import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Video, Star, ArrowRight, ExternalLink, 
  Calendar, Clock, User, CheckCircle2, Play, Eye, X
} from 'lucide-react';
import { Article, VideoAd, GoogleReview } from '../types/contents';
import { getArticles, getVideoAds, getGoogleReviews } from '../lib/contentsHelper';
import { getSiteSettings, SiteSettings } from '../lib/settingsHelper';

export const ContentSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'articles' | 'videos' | 'reviews'>('articles');
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<VideoAd[]>([]);
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeVideoModal, setActiveVideoModal] = useState<VideoAd | null>(null);
  const [articleCategoryFilter, setArticleCategoryFilter] = useState('Todos');

  useEffect(() => {
    const loadAllContents = async () => {
      try {
        const [arts, vids, revs] = await Promise.all([
          getArticles(),
          getVideoAds(),
          getGoogleReviews()
        ]);
        setArticles(arts.filter(a => a.is_active && a.status === 'Publicado'));
        // Only keep active videos that have a valid link
        const validVideos = vids.filter(v => v.is_active && v.video_url && v.video_url.trim() !== '');
        setVideos(validVideos);
        setReviews(revs.filter(r => r.is_active));
        setSettings(getSiteSettings());
      } catch (err) {
        console.warn('Error loading contents in public section:', err);
      }
    };
    loadAllContents();
  }, []);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveVideoModal(null);
        setSelectedArticle(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const articleCategories = ['Todos', 'Artigo Jurídico', 'Publicação', 'Campanha', 'Notícia'];

  const filteredArticles = articles.filter(a => {
    if (articleCategoryFilter === 'Todos') return true;
    return a.category === articleCategoryFilter;
  });

  const hasVideos = videos.length > 0;
  const googleReviewsLink = settings?.google_reviews_url || 'https://www.google.com/search?kgmid=/g/11p5kwclk3&hl=pt-BR&q=Advocacia+Jo%C3%A3o+Guerra#lrd=0x7ab19d61d600507:0x53f2f7602f5dc50a,1,,,,';

  return (
    <section id="conteudos" className="py-32 bg-[#101616] relative border-t border-[#D8CBB3]/10 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#D8CBB3]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D8CBB3]/10 border border-[#D8CBB3]/30 text-[#D8CBB3] text-xs font-semibold tracking-wider uppercase mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              Conteúdos & Avaliações
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-[#FFFDF8] max-w-2xl leading-tight">
              Artigos, análises jurídicas e a voz de quem confia em nosso trabalho.
            </h2>
          </div>

          {/* Tab Switcher */}
          <div className="flex flex-wrap gap-2 bg-[#151f1f] p-1.5 rounded-2xl border border-white/10 shrink-0">
            <button
              onClick={() => setActiveTab('articles')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'articles'
                  ? 'bg-[#D8CBB3] text-[#101616] shadow-lg font-semibold'
                  : 'text-[#F6F3EC]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Artigos & Publicações
            </button>

            {/* Vídeos tab ONLY appears when there are videos added */}
            {hasVideos && (
              <button
                onClick={() => setActiveTab('videos')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'videos'
                    ? 'bg-[#D8CBB3] text-[#101616] shadow-lg font-semibold'
                    : 'text-[#F6F3EC]/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Video className="w-4 h-4" />
                Vídeos
              </button>
            )}

            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'reviews'
                  ? 'bg-[#D8CBB3] text-[#101616] shadow-lg font-semibold'
                  : 'text-[#F6F3EC]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              Avaliações Google (5.0 ⭐)
            </button>
          </div>
        </div>

        {/* TAB 1: ARTIGOS & PUBLICAÇÕES (Clean without tags) */}
        {activeTab === 'articles' && (
          <div className="space-y-10 animate-fadeIn">
            {/* Categories filter */}
            <div className="flex flex-wrap gap-2.5">
              {articleCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setArticleCategoryFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    articleCategoryFilter === cat
                      ? 'bg-[#D8CBB3] text-[#101616]'
                      : 'bg-white/5 border border-white/10 text-[#F6F3EC]/70 hover:border-[#D8CBB3]/50 hover:text-[#D8CBB3]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map(article => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="bg-[#151f1f] border border-white/10 rounded-3xl overflow-hidden hover:border-[#D8CBB3]/40 transition-all duration-300 flex flex-col group hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
                >
                  <div className="relative h-56 overflow-hidden bg-[#101616]">
                    <img
                      src={article.cover_image || '/about-office.png'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151f1f] via-transparent to-transparent opacity-80" />
                  </div>

                  <div className="p-6 md:p-8 flex flex-col flex-grow justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-xs text-[#F6F3EC]/50 font-light">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#D8CBB3]" />
                          {new Date(article.published_date).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#D8CBB3]" />
                          {article.reading_time || '4 min'}
                        </span>
                      </div>

                      <h3 className="text-xl font-serif text-[#FFFDF8] group-hover:text-[#D8CBB3] transition-colors leading-snug line-clamp-2 font-medium">
                        {article.title}
                      </h3>

                      <p className="text-[#F6F3EC]/70 text-sm font-light leading-relaxed line-clamp-3">
                        {article.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs text-[#D8CBB3]/80 font-medium flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        {article.author}
                      </span>

                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D8CBB3] group-hover:text-[#FFFDF8] transition-colors">
                        Ler artigo completo
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: VÍDEOS */}
        {activeTab === 'videos' && hasVideos && (
          <div className="space-y-10 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map(video => (
                <div
                  key={video.id}
                  onClick={() => setActiveVideoModal(video)}
                  className="bg-[#151f1f] border border-white/10 rounded-3xl overflow-hidden hover:border-[#D8CBB3]/40 transition-all duration-300 flex flex-col group hover:-translate-y-1 shadow-xl cursor-pointer"
                >
                  <div className="relative h-60 bg-black overflow-hidden">
                    <img
                      src={video.thumbnail_url || '/joao-guerra.jpg'}
                      alt={video.title}
                      className="w-full h-full object-cover opacity-75 group-hover:scale-105 group-hover:opacity-90 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-[#D8CBB3] text-[#101616] flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-[#FFFDF8] transition-transform">
                        <Play className="w-7 h-7 fill-[#101616] translate-x-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 flex flex-col flex-grow justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-serif text-[#FFFDF8] font-medium leading-snug group-hover:text-[#D8CBB3] transition-colors">
                        {video.title || 'Vídeo Institucional'}
                      </h3>
                      {video.description && (
                        <p className="text-[#F6F3EC]/70 text-sm font-light leading-relaxed line-clamp-3">
                          {video.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#D8CBB3] font-medium">
                      <span>Assistir vídeo</span>
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: AVALIAÇÕES DO GOOGLE */}
        {activeTab === 'reviews' && (
          <div className="space-y-10 animate-fadeIn">
            {/* Google Verified Official Showcase Box */}
            <div className="bg-gradient-to-r from-[#151f1f] via-[#1b2727] to-[#151f1f] border border-[#D8CBB3]/30 rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                {/* Official Google G icon */}
                <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center p-3 shadow-xl shrink-0">
                  <svg className="w-12 h-12" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-center sm:justify-start gap-2.5">
                    <span className="text-3xl font-bold text-[#FFFDF8]">5,0</span>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-[#D8CBB3] font-medium ml-1">(59 avaliações)</span>
                  </div>

                  <h3 className="text-2xl font-serif text-[#FFFDF8]">
                    Albuquerque Guerra Advogados
                  </h3>

                  <p className="text-xs text-[#F6F3EC]/80 flex items-center justify-center sm:justify-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Perfil Oficial • Avaliações Verificadas no Google
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full lg:w-auto">
                <a
                  href={googleReviewsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-[#D8CBB3] hover:bg-[#FFFDF8] text-[#101616] font-semibold rounded-xl text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Star className="w-4 h-4 text-[#101616] fill-[#101616]" />
                  <span>Ver Avaliações no Google</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <a
                  href={googleReviewsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/15 text-[#FFFDF8] font-semibold rounded-xl text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
                >
                  <span>Deixar Avaliação</span>
                  <ExternalLink className="w-4 h-4 text-[#D8CBB3]" />
                </a>
              </div>
            </div>

            {/* Google Reviews Cards Grid */}
            {reviews.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map(review => (
                  <div
                    key={review.id}
                    className="bg-[#151f1f] border border-white/10 rounded-3xl p-7 hover:border-[#D8CBB3]/30 transition-all flex flex-col justify-between space-y-5 shadow-xl"
                  >
                    <div className="space-y-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#D8CBB3]/15 border border-[#D8CBB3]/30 flex items-center justify-center text-[#D8CBB3] font-bold text-sm">
                            {review.author_name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-[#FFFDF8] font-medium text-sm">{review.author_name}</h4>
                          </div>
                        </div>

                        <div className="flex text-amber-400">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>

                      <p className="text-[#F6F3EC]/80 text-xs font-light leading-relaxed italic">
                        "{review.text}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Cliente Verificado Google
                      </span>

                      <a
                        href={googleReviewsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#D8CBB3] hover:underline flex items-center gap-1"
                      >
                        Ver no Google
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal: Full Article Reading */}
        {selectedArticle && (
          <div 
            onClick={() => setSelectedArticle(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-pointer animate-fadeIn"
          >
            <div 
              onClick={e => e.stopPropagation()}
              className="bg-[#151f1f] border border-[#D8CBB3]/30 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden cursor-default"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#101616]">
                <span className="text-xs font-semibold text-[#D8CBB3] uppercase tracking-wider">
                  {selectedArticle.category}
                </span>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  <span>Fechar</span>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 md:p-10 overflow-y-auto space-y-6 custom-scrollbar text-[#F6F3EC]">
                <h1 className="text-2xl md:text-3xl font-serif text-[#FFFDF8] leading-snug">
                  {selectedArticle.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#F6F3EC]/60 pb-6 border-b border-white/10">
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#D8CBB3]" />
                    Por {selectedArticle.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#D8CBB3]" />
                    {new Date(selectedArticle.published_date).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#D8CBB3]" />
                    {selectedArticle.reading_time} de leitura
                  </span>
                </div>

                <div className="prose prose-invert max-w-none text-[#F6F3EC]/85 font-light leading-relaxed space-y-4 whitespace-pre-line text-base">
                  {selectedArticle.content}
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="px-5 py-3 border border-white/10 hover:bg-white/5 rounded-xl text-xs uppercase tracking-wider text-[#F6F3EC] cursor-pointer"
                  >
                    Fechar
                  </button>
                  <a
                    href="#contato"
                    onClick={() => setSelectedArticle(null)}
                    className="px-6 py-3 bg-[#D8CBB3] text-[#101616] font-semibold rounded-xl text-xs uppercase tracking-wider hover:bg-[#FFFDF8] transition-all"
                  >
                    Fale com o Escritório
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Video Player with Prominent Red Close Button */}
        {activeVideoModal && (
          <div 
            onClick={() => setActiveVideoModal(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-pointer animate-fadeIn"
          >
            <div 
              onClick={e => e.stopPropagation()}
              className="bg-[#151f1f] border border-[#D8CBB3]/40 rounded-3xl max-w-4xl w-full flex flex-col shadow-2xl overflow-hidden cursor-default relative"
            >
              <div className="p-4 md:p-5 border-b border-white/10 flex justify-between items-center bg-[#101616]">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D8CBB3]" />
                  <h3 className="text-sm md:text-base font-serif text-[#FFFDF8] line-clamp-1">
                    {activeVideoModal.title || 'Vídeo Institucional'}
                  </h3>
                </div>
                
                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500 hover:text-white transition-all text-xs font-semibold uppercase tracking-wider shadow-lg shrink-0 cursor-pointer"
                  aria-label="Fechar Vídeo"
                >
                  <X className="w-4 h-4" />
                  <span>Fechar Vídeo</span>
                </button>
              </div>

              <div className="aspect-video w-full bg-black relative">
                <iframe
                  src={activeVideoModal.video_url}
                  title={activeVideoModal.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="p-5 md:p-6 bg-[#151f1f] flex items-center justify-between gap-4 border-t border-white/10">
                <p className="text-xs text-[#F6F3EC]/70 line-clamp-2">{activeVideoModal.description}</p>
                
                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="px-6 py-2.5 bg-[#D8CBB3] hover:bg-[#FFFDF8] text-[#101616] font-semibold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shrink-0 cursor-pointer"
                >
                  Fechar Vídeo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
