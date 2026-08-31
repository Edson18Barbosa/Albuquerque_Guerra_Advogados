import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Video, Star, Plus, Edit, Trash2,
  CheckCircle2, AlertTriangle, X, ExternalLink, Flame, MessageSquare
} from 'lucide-react';
import { Article, VideoAd, GoogleReview } from '../../types/contents';
import { 
  getArticles, saveArticle, deleteArticle,
  getVideoAds, saveVideoAd, deleteVideoAd,
  getGoogleReviews, saveGoogleReview, deleteGoogleReview
} from '../../lib/contentsHelper';

export const AdminContents: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'articles' | 'videos' | 'reviews'>('articles');
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<VideoAd[]>([]);
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | null, text: string }>({ type: null, text: '' });
  const [loading, setLoading] = useState(true);

  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articleForm, setArticleForm] = useState<Partial<Article>>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category: 'Artigo Jurídico',
    author: 'Dr. João Guerra',
    published_date: new Date().toISOString().split('T')[0],
    cover_image: '/about-office.png',
    reading_time: '4 min',
    tags: ['Direito Civil'],
    is_featured: false,
    is_active: true,
    status: 'Publicado'
  });

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoAd | null>(null);
  const [videoForm, setVideoForm] = useState<Partial<VideoAd>>({
    title: '',
    description: '',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: '/joao-guerra.jpg',
    target_campaign: 'Campanha 2026',
    cta_text: 'Falar no WhatsApp',
    cta_link: 'https://wa.me/5581999999999',
    platform: 'YouTube',
    is_active: true,
    is_featured: false,
    views_count: '1.2k visualizações'
  });

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<GoogleReview | null>(null);
  const [reviewForm, setReviewForm] = useState<Partial<GoogleReview>>({
    author_name: '',
    author_avatar: '',
    rating: 5,
    relative_time_description: 'há poucos dias',
    text: '',
    service_type: 'Direito Empresarial',
    is_verified: true,
    review_link: 'https://maps.google.com',
    is_active: true
  });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [arts, vids, revs] = await Promise.all([
        getArticles(),
        getVideoAds(),
        getGoogleReviews()
      ]);
      setArticles(arts);
      setVideos(vids);
      setReviews(revs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: null, text: '' }), 4000);
  };

  const handleOpenAddArticle = () => {
    setSelectedArticle(null);
    setArticleForm({
      title: '',
      slug: '',
      summary: '',
      content: '',
      category: 'Artigo Jurídico',
      author: 'Dr. João Guerra',
      published_date: new Date().toISOString().split('T')[0],
      cover_image: '/about-office.png',
      reading_time: '4 min',
      tags: ['Direito Civil'],
      is_featured: false,
      is_active: true,
      status: 'Publicado'
    });
    setArticleModalOpen(true);
  };

  const handleOpenEditArticle = (art: Article) => {
    setSelectedArticle(art);
    setArticleForm({ ...art });
    setArticleModalOpen(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title || !articleForm.content) {
      showFeedback('error', 'Título e Conteúdo são obrigatórios.');
      return;
    }

    const payload: Article = {
      id: selectedArticle ? selectedArticle.id : 'art-' + Date.now(),
      title: articleForm.title || '',
      slug: (articleForm.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      summary: articleForm.summary || '',
      content: articleForm.content || '',
      category: (articleForm.category as any) || 'Artigo Jurídico',
      author: articleForm.author || 'Dr. João Guerra',
      published_date: articleForm.published_date || new Date().toISOString().split('T')[0],
      cover_image: articleForm.cover_image || '/about-office.png',
      reading_time: articleForm.reading_time || '4 min',
      tags: Array.isArray(articleForm.tags) ? articleForm.tags : [(articleForm.tags as any) || 'Geral'],
      is_featured: Boolean(articleForm.is_featured),
      is_active: articleForm.is_active !== undefined ? articleForm.is_active : true,
      status: (articleForm.status as any) || 'Publicado',
      created_at: selectedArticle ? selectedArticle.created_at : new Date().toISOString()
    };

    await saveArticle(payload);
    showFeedback('success', 'Artigo salvo com sucesso!');
    setArticleModalOpen(false);
    fetchAll();
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (!confirm(`Deseja realmente excluir o artigo "${title}"?`)) return;
    await deleteArticle(id);
    showFeedback('success', 'Artigo excluído.');
    fetchAll();
  };

  const handleOpenAddVideo = () => {
    setSelectedVideo(null);
    setVideoForm({
      title: '',
      description: '',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail_url: '/joao-guerra.jpg',
      target_campaign: 'Campanha 2026',
      cta_text: 'Falar no WhatsApp',
      cta_link: 'https://wa.me/5581999999999',
      platform: 'YouTube',
      is_active: true,
      is_featured: false,
      views_count: '1.2k visualizações'
    });
    setVideoModalOpen(true);
  };

  const handleOpenEditVideo = (vid: VideoAd) => {
    setSelectedVideo(vid);
    setVideoForm({ ...vid });
    setVideoModalOpen(true);
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title || !videoForm.video_url) {
      showFeedback('error', 'Título e URL do Vídeo são obrigatórios.');
      return;
    }

    const payload: VideoAd = {
      id: selectedVideo ? selectedVideo.id : 'vid-' + Date.now(),
      title: videoForm.title || '',
      description: videoForm.description || '',
      video_url: videoForm.video_url || '',
      thumbnail_url: videoForm.thumbnail_url || '/joao-guerra.jpg',
      target_campaign: videoForm.target_campaign || 'Campanha Ads',
      cta_text: videoForm.cta_text || 'Falar no WhatsApp',
      cta_link: videoForm.cta_link || 'https://wa.me/5581999999999',
      platform: (videoForm.platform as any) || 'YouTube',
      is_active: videoForm.is_active !== undefined ? videoForm.is_active : true,
      is_featured: Boolean(videoForm.is_featured),
      views_count: videoForm.views_count || '1.0k visualizações',
      created_at: selectedVideo ? selectedVideo.created_at : new Date().toISOString()
    };

    await saveVideoAd(payload);
    showFeedback('success', 'Vídeo / Campanha salvo com sucesso!');
    setVideoModalOpen(false);
    fetchAll();
  };

  const handleDeleteVideo = async (id: string, title: string) => {
    if (!confirm(`Deseja realmente excluir o vídeo "${title}"?`)) return;
    await deleteVideoAd(id);
    showFeedback('success', 'Vídeo excluído.');
    fetchAll();
  };

  const handleOpenAddReview = () => {
    setSelectedReview(null);
    setReviewForm({
      author_name: '',
      author_avatar: '',
      rating: 5,
      relative_time_description: 'há poucos dias',
      text: '',
      service_type: 'Direito Empresarial',
      is_verified: true,
      review_link: 'https://maps.google.com',
      is_active: true
    });
    setReviewModalOpen(true);
  };

  const handleOpenEditReview = (rev: GoogleReview) => {
    setSelectedReview(rev);
    setReviewForm({ ...rev });
    setReviewModalOpen(true);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.author_name || !reviewForm.text) {
      showFeedback('error', 'Nome do autor e depoimento são obrigatórios.');
      return;
    }

    const payload: GoogleReview = {
      id: selectedReview ? selectedReview.id : 'rev-' + Date.now(),
      author_name: reviewForm.author_name || '',
      author_avatar: reviewForm.author_avatar || '',
      rating: Number(reviewForm.rating) || 5,
      relative_time_description: reviewForm.relative_time_description || 'recentemente',
      text: reviewForm.text || '',
      service_type: reviewForm.service_type || 'Atendimento Jurídico',
      is_verified: reviewForm.is_verified !== undefined ? reviewForm.is_verified : true,
      review_link: reviewForm.review_link || 'https://maps.google.com',
      is_active: reviewForm.is_active !== undefined ? reviewForm.is_active : true,
      created_at: selectedReview ? selectedReview.created_at : new Date().toISOString()
    };

    await saveGoogleReview(payload);
    showFeedback('success', 'Avaliação do Google salva com sucesso!');
    setReviewModalOpen(false);
    fetchAll();
  };

  const handleDeleteReview = async (id: string, name: string) => {
    if (!confirm(`Deseja realmente excluir a avaliação de "${name}"?`)) return;
    await deleteGoogleReview(id);
    showFeedback('success', 'Avaliação excluída.');
    fetchAll();
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#F6F3EC]">
      {statusMsg.type && (
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          statusMsg.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <div className="flex items-center gap-2">
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span className="text-sm font-medium">{statusMsg.text}</span>
          </div>
          <button onClick={() => setStatusMsg({ type: null, text: '' })} className="p-1 hover:bg-white/10 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#FFFDF8] mb-2 font-light">Conteúdos, Vídeos Ads & Avaliações</h1>
          <p className="text-[#F6F3EC]/70">Gerencie artigos informativos, vídeos de campanhas de tráfego pago e avaliações do Google.</p>
        </div>

        {activeTab === 'articles' && (
          <button
            onClick={handleOpenAddArticle}
            className="flex items-center gap-2 px-6 py-3 bg-[#D8CBB3] text-[#101616] font-semibold rounded-xl hover:bg-[#FFFDF8] transition-all shadow-lg shrink-0"
          >
            <Plus className="w-5 h-5" />
            Novo Artigo / Publicação
          </button>
        )}

        {activeTab === 'videos' && (
          <button
            onClick={handleOpenAddVideo}
            className="flex items-center gap-2 px-6 py-3 bg-[#D8CBB3] text-[#101616] font-semibold rounded-xl hover:bg-[#FFFDF8] transition-all shadow-lg shrink-0"
          >
            <Plus className="w-5 h-5" />
            Novo Vídeo / Campanha Ads
          </button>
        )}

        {activeTab === 'reviews' && (
          <button
            onClick={handleOpenAddReview}
            className="flex items-center gap-2 px-6 py-3 bg-[#D8CBB3] text-[#101616] font-semibold rounded-xl hover:bg-[#FFFDF8] transition-all shadow-lg shrink-0"
          >
            <Plus className="w-5 h-5" />
            Nova Avaliação Google
          </button>
        )}
      </div>

      <div className="flex gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('articles')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'articles'
              ? 'bg-[#D8CBB3] text-[#101616] font-semibold'
              : 'text-[#F6F3EC]/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Artigos & Publicações ({articles.length})
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'videos'
              ? 'bg-[#D8CBB3] text-[#101616] font-semibold'
              : 'text-[#F6F3EC]/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Video className="w-4 h-4" />
          Vídeos & Campanhas Ads ({videos.length})
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'reviews'
              ? 'bg-[#D8CBB3] text-[#101616] font-semibold'
              : 'text-[#F6F3EC]/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          Avaliações Google ({reviews.length})
        </button>
      </div>

      {activeTab === 'articles' && (
        <div className="bg-[#151f1f] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-4 text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider">Título & Capa</th>
                  <th className="p-4 text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider">Categoria</th>
                  <th className="p-4 text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider">Autor</th>
                  <th className="p-4 text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider">Data</th>
                  <th className="p-4 text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {articles.map(art => (
                  <tr key={art.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={art.cover_image || '/about-office.png'} alt="" className="w-12 h-10 object-cover rounded-lg bg-black" />
                        <div>
                          <div className="font-medium text-[#FFFDF8] flex items-center gap-2">
                            {art.title}
                            {art.is_featured && <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                          </div>
                          <span className="text-xs text-[#F6F3EC]/50 font-light">{art.reading_time}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-[#D8CBB3] font-medium">{art.category}</td>
                    <td className="p-4 text-xs text-[#F6F3EC]/80">{art.author}</td>
                    <td className="p-4 text-xs text-[#F6F3EC]/60">{new Date(art.published_date).toLocaleDateString('pt-BR')}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                        art.status === 'Publicado' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {art.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenEditArticle(art)} className="p-2 text-[#F6F3EC]/50 hover:text-[#D8CBB3] hover:bg-[#D8CBB3]/10 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteArticle(art.id, art.title)} className="p-2 text-[#F6F3EC]/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(vid => (
            <div key={vid.id} className="bg-[#151f1f] border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-[#D8CBB3] font-semibold">
                    {vid.platform}
                  </span>
                  <span className="text-xs text-[#D8CBB3]">{vid.target_campaign}</span>
                </div>
                <h3 className="font-serif text-[#FFFDF8] text-base font-medium">{vid.title}</h3>
                <p className="text-xs text-[#F6F3EC]/70 line-clamp-2">{vid.description}</p>
                <div className="p-2 bg-black/40 rounded-xl text-xs text-[#D8CBB3] flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5" />
                  CTA: {vid.cta_text}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <a href={vid.cta_link} target="_blank" rel="noopener noreferrer" className="text-xs text-[#D8CBB3] hover:underline flex items-center gap-1">
                  Testar link Ads <ExternalLink className="w-3 h-3" />
                </a>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenEditVideo(vid)} className="p-1.5 text-[#F6F3EC]/50 hover:text-[#D8CBB3] rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteVideo(vid.id, vid.title)} className="p-1.5 text-[#F6F3EC]/50 hover:text-red-400 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map(rev => (
            <div key={rev.id} className="bg-[#151f1f] border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D8CBB3]/20 text-[#D8CBB3] flex items-center justify-center font-bold">
                      {rev.author_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#FFFDF8]">{rev.author_name}</h4>
                      <span className="text-[11px] text-[#F6F3EC]/50">{rev.relative_time_description}</span>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[#F6F3EC]/80 italic">"{rev.text}"</p>
                <div className="text-xs text-[#D8CBB3] font-medium">{rev.service_type}</div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Avaliação Verificada
                </span>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenEditReview(rev)} className="p-1.5 text-[#F6F3EC]/50 hover:text-[#D8CBB3] rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteReview(rev.id, rev.author_name)} className="p-1.5 text-[#F6F3EC]/50 hover:text-red-400 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {articleModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#151f1f] border border-[#D8CBB3]/30 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#101616]">
              <h2 className="text-lg font-serif text-[#FFFDF8]">
                {selectedArticle ? 'Editar Artigo / Publicação' : 'Adicionar Novo Artigo'}
              </h2>
              <button onClick={() => setArticleModalOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
              <div>
                <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1">Título do Artigo</label>
                <input
                  type="text"
                  value={articleForm.title}
                  onChange={e => setArticleForm({ ...articleForm, title: e.target.value })}
                  required
                  placeholder="Ex: Planejamento Sucessório em 2026"
                  className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1">Categoria</label>
                  <select
                    value={articleForm.category}
                    onChange={e => setArticleForm({ ...articleForm, category: e.target.value as any })}
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                  >
                    <option value="Artigo Jurídico">Artigo Jurídico</option>
                    <option value="Publicação">Publicação</option>
                    <option value="Campanha">Campanha</option>
                    <option value="Notícia">Notícia</option>
                    <option value="Informativo">Informativo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1">Autor Responsável</label>
                  <input
                    type="text"
                    value={articleForm.author}
                    onChange={e => setArticleForm({ ...articleForm, author: e.target.value })}
                    required
                    placeholder="Dr. João Guerra"
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1">Data de Publicação</label>
                  <input
                    type="date"
                    value={articleForm.published_date}
                    onChange={e => setArticleForm({ ...articleForm, published_date: e.target.value })}
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1">Tempo de Leitura</label>
                  <input
                    type="text"
                    value={articleForm.reading_time}
                    onChange={e => setArticleForm({ ...articleForm, reading_time: e.target.value })}
                    placeholder="4 min"
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1">URL da Imagem de Capa</label>
                <input
                  type="text"
                  value={articleForm.cover_image}
                  onChange={e => setArticleForm({ ...articleForm, cover_image: e.target.value })}
                  placeholder="/about-office.png ou link da imagem"
                  className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1">Resumo</label>
                <textarea
                  rows={2}
                  value={articleForm.summary}
                  onChange={e => setArticleForm({ ...articleForm, summary: e.target.value })}
                  placeholder="Breve resumo do artigo..."
                  className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1">Conteúdo Completo</label>
                <textarea
                  rows={6}
                  value={articleForm.content}
                  onChange={e => setArticleForm({ ...articleForm, content: e.target.value })}
                  placeholder="Texto integral do artigo..."
                  className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm text-[#F6F3EC]/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={articleForm.is_featured}
                    onChange={e => setArticleForm({ ...articleForm, is_featured: e.target.checked })}
                    className="accent-[#D8CBB3]"
                  />
                  Destacar Artigo
                </label>

                <label className="flex items-center gap-2 text-sm text-[#F6F3EC]/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={articleForm.status === 'Publicado'}
                    onChange={e => setArticleForm({ ...articleForm, status: e.target.checked ? 'Publicado' : 'Rascunho' })}
                    className="accent-[#D8CBB3]"
                  />
                  Publicado Imediatamente
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button type="button" onClick={() => setArticleModalOpen(false)} className="px-4 py-2 hover:bg-white/5 rounded-xl text-xs">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 bg-[#D8CBB3] text-[#101616] font-semibold rounded-xl text-xs">
                  Salvar Artigo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {videoModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#151f1f] border border-[#D8CBB3]/30 rounded-3xl max-w-xl w-full flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#101616]">
              <h2 className="text-lg font-serif text-[#FFFDF8]">
                {selectedVideo ? 'Editar Vídeo / Campanha Ads' : 'Adicionar Vídeo de Campanha'}
              </h2>
              <button onClick={() => setVideoModalOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1">Título do Vídeo</label>
                <input
                  type="text"
                  value={videoForm.title}
                  onChange={e => setVideoForm({ ...videoForm, title: e.target.value })}
                  required
                  placeholder="Ex: Como funciona a Holding Familiar"
                  className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1">URL do Vídeo (Embed / YouTube)</label>
                <input
                  type="text"
                  value={videoForm.video_url}
                  onChange={e => setVideoForm({ ...videoForm, video_url: e.target.value })}
                  required
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1">Nome da Campanha</label>
                  <input
                    type="text"
                    value={videoForm.target_campaign}
                    onChange={e => setVideoForm({ ...videoForm, target_campaign: e.target.value })}
                    placeholder="Campanha Ads 2026"
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1">Plataforma</label>
                  <select
                    value={videoForm.platform}
                    onChange={e => setVideoForm({ ...videoForm, platform: e.target.value as any })}
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                  >
                    <option value="YouTube">YouTube</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="TikTok">TikTok</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1">Texto do Botão CTA</label>
                  <input
                    type="text"
                    value={videoForm.cta_text}
                    onChange={e => setVideoForm({ ...videoForm, cta_text: e.target.value })}
                    placeholder="Falar no WhatsApp"
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1">Link de Destino CTA</label>
                  <input
                    type="text"
                    value={videoForm.cta_link}
                    onChange={e => setVideoForm({ ...videoForm, cta_link: e.target.value })}
                    placeholder="https://wa.me/..."
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={videoForm.description}
                  onChange={e => setVideoForm({ ...videoForm, description: e.target.value })}
                  placeholder="Explicação sobre o vídeo..."
                  className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button type="button" onClick={() => setVideoModalOpen(false)} className="px-4 py-2 hover:bg-white/5 rounded-xl text-xs">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 bg-[#D8CBB3] text-[#101616] font-semibold rounded-xl text-xs">
                  Salvar Vídeo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {reviewModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#151f1f] border border-[#D8CBB3]/30 rounded-3xl max-w-md w-full flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#101616]">
              <h2 className="text-lg font-serif text-[#FFFDF8]">
                {selectedReview ? 'Editar Avaliação do Google' : 'Adicionar Avaliação do Google'}
              </h2>
              <button onClick={() => setReviewModalOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1">Nome do Cliente</label>
                <input
                  type="text"
                  value={reviewForm.author_name}
                  onChange={e => setReviewForm({ ...reviewForm, author_name: e.target.value })}
                  required
                  placeholder="Nome do cliente"
                  className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1">Nota (Estrelas)</label>
                  <select
                    value={reviewForm.rating}
                    onChange={e => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5 Estrelas</option>
                    <option value={4}>⭐⭐⭐⭐ 4 Estrelas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1">Tempo Relativo</label>
                  <input
                    type="text"
                    value={reviewForm.relative_time_description}
                    onChange={e => setReviewForm({ ...reviewForm, relative_time_description: e.target.value })}
                    placeholder="Ex: há 2 semanas"
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1">Serviço Jurídico Prestado</label>
                <input
                  type="text"
                  value={reviewForm.service_type}
                  onChange={e => setReviewForm({ ...reviewForm, service_type: e.target.value })}
                  placeholder="Ex: Planejamento Sucessório & Holding"
                  className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1">Depoimento do Cliente</label>
                <textarea
                  rows={4}
                  value={reviewForm.text}
                  onChange={e => setReviewForm({ ...reviewForm, text: e.target.value })}
                  required
                  placeholder="Texto do comentário no Google..."
                  className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button type="button" onClick={() => setReviewModalOpen(false)} className="px-4 py-2 hover:bg-white/5 rounded-xl text-xs">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 bg-[#D8CBB3] text-[#101616] font-semibold rounded-xl text-xs">
                  Salvar Avaliação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
