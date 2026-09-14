import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Video, Star, Plus, Trash2, Edit2, ExternalLink, 
  CheckCircle2, X, AlertTriangle, Eye, Link as LinkIcon, Play, Save
} from 'lucide-react';
import { Article, VideoAd, GoogleReview } from '../../types/contents';
import { 
  getArticles, saveArticle, deleteArticle, ARTICLES_STORAGE_KEY,
  getVideoAds, saveVideoAd, deleteVideoAd, VIDEOS_STORAGE_KEY,
  getGoogleReviews, saveGoogleReview, deleteGoogleReview, REVIEWS_STORAGE_KEY,
  formatEmbedUrl
} from '../../lib/contentsHelper';
import { getSiteSettings, saveSiteSettings, SiteSettings, SETTINGS_STORAGE_KEY } from '../../lib/settingsHelper';

export const AdminContents: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'articles' | 'videos' | 'google_link'>('articles');
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<VideoAd[]>([]);
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoAd | null>(null);
  const [editingReview, setEditingReview] = useState<GoogleReview | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [googleUrl, setGoogleUrl] = useState('https://www.google.com/search?kgmid=/g/11p5kwclk3&hl=pt-BR&q=Advocacia+Jo%C3%A3o+Guerra#lrd=0x7ab19d61d600507:0x53f2f7602f5dc50a,1,,,,');

  const loadAll = async () => {
    try {
      const [arts, vids, revs] = await Promise.all([
        getArticles(),
        getVideoAds(),
        getGoogleReviews()
      ]);
      setArticles(arts);
      setVideos(vids);
      setReviews(revs);
      const siteSet = getSiteSettings();
      setSettings(siteSet);
      if (siteSet?.google_reviews_url) {
        setGoogleUrl(siteSet.google_reviews_url);
      }
    } catch (e) {
      console.warn('Error loading contents in admin:', e);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const notify = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: null, text: '' }), 5000);
  };

  // Article save
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    try {
      const updated = [...articles];
      const idx = updated.findIndex(a => a.id === editingArticle.id);
      if (idx !== -1) {
        updated[idx] = editingArticle;
      } else {
        updated.unshift(editingArticle);
      }
      setArticles(updated);
      localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(updated));
      setEditingArticle(null);
      notify('success', 'Artigo salvo com sucesso!');
      await saveArticle(editingArticle);
    } catch (err: any) {
      notify('error', 'Erro ao salvar artigo: ' + err.message);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Deseja excluir este artigo?')) return;
    try {
      const updated = articles.filter(a => a.id !== id);
      setArticles(updated);
      localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(updated));
      notify('success', 'Artigo excluído com sucesso.');
      await deleteArticle(id);
    } catch (err: any) {
      notify('error', 'Erro ao excluir artigo: ' + err.message);
    }
  };

  // Video save
  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;
    if (!editingVideo.video_url || !editingVideo.video_url.trim()) {
      notify('error', 'Por favor, informe o link do vídeo.');
      return;
    }
    try {
      const formatted: VideoAd = {
        ...editingVideo,
        video_url: formatEmbedUrl(editingVideo.video_url)
      };
      const updated = [...videos];
      const idx = updated.findIndex(v => v.id === formatted.id);
      if (idx !== -1) {
        updated[idx] = formatted;
      } else {
        updated.unshift(formatted);
      }
      setVideos(updated);
      localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(updated));
      setEditingVideo(null);
      notify('success', 'Vídeo salvo com sucesso! Ele agora aparecerá na aba de vídeos do site.');
      await saveVideoAd(formatted);
    } catch (err: any) {
      notify('error', 'Erro ao salvar vídeo: ' + err.message);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Deseja excluir este vídeo?')) return;
    try {
      const updated = videos.filter(v => v.id !== id);
      setVideos(updated);
      localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(updated));
      notify('success', 'Vídeo excluído com sucesso. A aba de vídeos se ajustará automaticamente.');
      await deleteVideoAd(id);
    } catch (err: any) {
      notify('error', 'Erro ao excluir vídeo: ' + err.message);
    }
  };

  // Google Review save
  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    try {
      const updated = [...reviews];
      const idx = updated.findIndex(r => r.id === editingReview.id);
      if (idx !== -1) {
        updated[idx] = editingReview;
      } else {
        updated.unshift(editingReview);
      }
      setReviews(updated);
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
      setEditingReview(null);
      notify('success', 'Avaliação salva com sucesso!');
      await saveGoogleReview(editingReview);
    } catch (err: any) {
      notify('error', 'Erro ao salvar avaliação: ' + err.message);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Deseja excluir esta avaliação?')) return;
    try {
      const updated = reviews.filter(r => r.id !== id);
      setReviews(updated);
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
      notify('success', 'Avaliação removida.');
      await deleteGoogleReview(id);
    } catch (err: any) {
      notify('error', 'Erro ao excluir avaliação: ' + err.message);
    }
  };

  // Google reviews link save
  const handleSaveGoogleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    try {
      const updatedSettings = {
        ...settings,
        google_reviews_url: googleUrl.trim()
      };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
      setSettings(updatedSettings);
      await saveSiteSettings(updatedSettings);
      notify('success', 'Link oficial das avaliações do Google salvo com sucesso!');
    } catch (err: any) {
      notify('error', 'Erro ao salvar link do Google: ' + err.message);
    } finally {
      setIsSaving(false);
    }
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
          <button onClick={() => setStatusMsg({ type: null, text: '' })} className="p-1 hover:bg-white/10 rounded cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#FFFDF8] mb-2 font-light">Gerenciar Conteúdos & Mídias</h1>
          <p className="text-[#F6F3EC]/70">Gerencie artigos, links de vídeos e o link oficial das avaliações do Google.</p>
        </div>

        <div className="flex flex-wrap gap-2 bg-[#151f1f] p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => { setActiveTab('articles'); setEditingArticle(null); setEditingVideo(null); setEditingReview(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'articles' ? 'bg-[#D8CBB3] text-[#101616]' : 'text-[#F6F3EC]/70 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Artigos ({articles.length})
          </button>

          <button
            onClick={() => { setActiveTab('videos'); setEditingArticle(null); setEditingVideo(null); setEditingReview(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'videos' ? 'bg-[#D8CBB3] text-[#101616]' : 'text-[#F6F3EC]/70 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            Vídeos ({videos.length})
          </button>

          <button
            onClick={() => { setActiveTab('google_link'); setEditingArticle(null); setEditingVideo(null); setEditingReview(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'google_link' ? 'bg-[#D8CBB3] text-[#101616]' : 'text-[#F6F3EC]/70 hover:text-white'
            }`}
          >
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            Avaliações Google ({reviews.length})
          </button>
        </div>
      </div>

      {/* ================= TAB 1: ARTIGOS ================= */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-serif text-[#FFFDF8]">Artigos e Publicações</h2>
            {!editingArticle && (
              <button
                onClick={() => setEditingArticle({
                  id: 'art-' + Date.now(),
                  title: '',
                  slug: '',
                  summary: '',
                  content: '',
                  category: 'Artigo Jurídico',
                  author: 'Dr. João Guerra',
                  published_date: new Date().toISOString().split('T')[0],
                  reading_time: '5 min',
                  cover_image: '/event-innovation.png',
                  tags: [],
                  is_featured: false,
                  is_active: true,
                  status: 'Publicado',
                  created_at: new Date().toISOString()
                })}
                className="px-4 py-2 bg-[#D8CBB3] text-[#101616] font-semibold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#FFFDF8] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Novo Artigo
              </button>
            )}
          </div>

          {editingArticle ? (
            <form onSubmit={handleSaveArticle} className="bg-[#151f1f] p-8 border border-white/10 rounded-2xl space-y-6 max-w-4xl shadow-2xl animate-fadeIn">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h3 className="text-lg font-serif text-[#FFFDF8]">
                  {articles.some(a => a.id === editingArticle.id) ? 'Editar Artigo' : 'Novo Artigo'}
                </h3>
                <button type="button" onClick={() => setEditingArticle(null)} className="p-1 hover:bg-white/10 rounded cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-[#F6F3EC]/70">Título do Artigo *</label>
                  <input
                    type="text"
                    value={editingArticle.title}
                    onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                    required
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-[#F6F3EC]/70">Autor *</label>
                  <input
                    type="text"
                    value={editingArticle.author}
                    onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                    required
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-[#F6F3EC]/70">Categoria</label>
                  <select
                    value={editingArticle.category}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value as any })}
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                  >
                    <option value="Artigo Jurídico">Artigo Jurídico</option>
                    <option value="Publicação">Publicação</option>
                    <option value="Campanha">Campanha</option>
                    <option value="Notícia">Notícia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-[#F6F3EC]/70">Data de Publicação</label>
                  <input
                    type="date"
                    value={editingArticle.published_date}
                    onChange={(e) => setEditingArticle({ ...editingArticle, published_date: e.target.value })}
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-[#F6F3EC]/70">Tempo de Leitura</label>
                  <input
                    type="text"
                    value={editingArticle.reading_time || '5 min'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, reading_time: e.target.value })}
                    placeholder="Ex: 5 min"
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-[#F6F3EC]/70">Resumo / Subtítulo *</label>
                <textarea
                  rows={2}
                  value={editingArticle.summary}
                  onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                  required
                  className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-[#F6F3EC]/70">Texto Completo do Artigo (aberto no pop-up) *</label>
                <textarea
                  rows={8}
                  value={editingArticle.content}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  required
                  placeholder="Escreva o texto completo do artigo..."
                  className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC] leading-relaxed resize-y font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-5 py-2.5 border border-white/10 hover:bg-white/5 rounded-xl text-xs uppercase cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#D8CBB3] text-[#101616] font-semibold rounded-xl text-xs uppercase hover:bg-[#FFFDF8] transition-all shadow-lg cursor-pointer"
                >
                  Salvar Artigo
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(art => (
                <div key={art.id} className="bg-[#151f1f] border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xl">
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-[#D8CBB3] uppercase">{art.category}</span>
                    <h3 className="text-base font-serif text-[#FFFDF8] font-medium line-clamp-2">{art.title}</h3>
                    <p className="text-xs text-[#F6F3EC]/60 line-clamp-2">{art.summary}</p>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-[#F6F3EC]/50">{art.author}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setEditingArticle(art)} 
                        className="p-2 hover:bg-white/10 text-[#D8CBB3] rounded-lg cursor-pointer"
                        title="Editar Artigo"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteArticle(art.id)} 
                        className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg cursor-pointer"
                        title="Excluir Artigo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: VÍDEOS ================= */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-serif text-[#FFFDF8]">Vídeos Cadastrados</h2>
              <p className="text-xs text-[#F6F3EC]/60 mt-0.5">
                Basta adicionar o link do vídeo. A aba de vídeos só aparecerá no site se houver pelo menos 1 vídeo cadastrado.
              </p>
            </div>

            {!editingVideo && (
              <button
                onClick={() => setEditingVideo({
                  id: 'vid-' + Date.now(),
                  title: '',
                  description: '',
                  video_url: '',
                  thumbnail_url: '/joao-guerra.jpg',
                  target_campaign: 'Institucional',
                  cta_text: 'Fale com o Escritório',
                  cta_link: '#contato',
                  platform: 'YouTube',
                  is_active: true,
                  is_featured: false,
                  created_at: new Date().toISOString()
                })}
                className="px-4 py-2 bg-[#D8CBB3] text-[#101616] font-semibold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#FFFDF8] transition-all shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Adicionar Vídeo
              </button>
            )}
          </div>

          {editingVideo ? (
            <form onSubmit={handleSaveVideo} className="bg-[#151f1f] p-8 border border-white/10 rounded-2xl space-y-6 max-w-2xl shadow-2xl animate-fadeIn">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h3 className="text-lg font-serif text-[#FFFDF8]">
                  {videos.some(v => v.id === editingVideo.id) ? 'Editar Vídeo' : 'Adicionar Novo Vídeo'}
                </h3>
                <button type="button" onClick={() => setEditingVideo(null)} className="p-1 hover:bg-white/10 rounded cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-[#D8CBB3]">
                    Link do Vídeo (YouTube, Vimeo ou Link Direto) *
                  </label>
                  <input
                    type="text"
                    value={editingVideo.video_url}
                    onChange={(e) => setEditingVideo({ ...editingVideo, video_url: e.target.value })}
                    required
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-[#101616] border border-[#D8CBB3]/40 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#D8CBB3] text-[#FFFDF8]"
                  />
                  <span className="text-[11px] text-[#F6F3EC]/50 mt-1 block">
                    Aceita links do YouTube (ex: youtube.com/watch?v=..., youtu.be/... ou embed).
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-[#F6F3EC]/70">
                    Título do Vídeo
                  </label>
                  <input
                    type="text"
                    value={editingVideo.title}
                    onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                    placeholder="Ex: Planejamento Sucessório na Prática"
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-[#F6F3EC]/70">
                    Descrição Breve (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={editingVideo.description}
                    onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                    placeholder="Breve explicação sobre o tema do vídeo..."
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC] resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="px-5 py-2.5 border border-white/10 hover:bg-white/5 rounded-xl text-xs uppercase cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#D8CBB3] text-[#101616] font-semibold rounded-xl text-xs uppercase hover:bg-[#FFFDF8] transition-all shadow-lg cursor-pointer"
                >
                  Salvar Vídeo
                </button>
              </div>
            </form>
          ) : (
            <div>
              {videos.length === 0 ? (
                <div className="bg-[#151f1f] border border-white/10 rounded-2xl p-10 text-center space-y-3">
                  <Video className="w-12 h-12 text-[#D8CBB3]/40 mx-auto" />
                  <h3 className="text-xl font-serif text-[#FFFDF8]">Nenhum vídeo cadastrado</h3>
                  <p className="text-xs text-[#F6F3EC]/60 max-w-md mx-auto">
                    A aba de vídeos na página inicial está oculta no momento. Clique em <strong>"Adicionar Vídeo"</strong> e cole o link do seu vídeo para exibi-la.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map(vid => (
                    <div key={vid.id} className="bg-[#151f1f] border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xl">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-[#D8CBB3]">
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Vídeo Cadastrado</span>
                        </div>
                        <h3 className="text-base font-serif text-[#FFFDF8] font-medium">{vid.title || 'Vídeo sem título'}</h3>
                        <p className="text-xs text-[#F6F3EC]/60 line-clamp-2">{vid.description || vid.video_url}</p>
                      </div>
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <a
                          href={vid.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#D8CBB3] hover:underline flex items-center gap-1.5 font-medium cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Ver link</span>
                        </a>
                        <div className="flex gap-2">
                          <button 
                            type="button"
                            onClick={() => setEditingVideo(vid)} 
                            className="p-2 hover:bg-white/10 text-[#D8CBB3] rounded-lg cursor-pointer transition-colors"
                            title="Editar Vídeo"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleDeleteVideo(vid.id)} 
                            className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg cursor-pointer transition-colors"
                            title="Excluir Vídeo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: LINK OFICIAL GOOGLE REVIEWS & AVALIAÇÕES ================= */}
      {activeTab === 'google_link' && (
        <div className="space-y-8 max-w-4xl">
          {/* Official Google Link Config Card */}
          <form onSubmit={handleSaveGoogleLink} className="bg-[#151f1f] p-8 border border-white/10 rounded-2xl space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-2 shadow-md">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-serif text-[#FFFDF8]">Link Oficial das Avaliações no Google</h3>
                <p className="text-xs text-[#F6F3EC]/60">Configure o link oficial do Google Maps onde seus clientes deixam e leem avaliações (5.0 ⭐ - 59 avaliações)</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-[#D8CBB3]">
                  URL / Link de Compartilhamento do Google *
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F6F3EC]/40" />
                    <input
                      type="url"
                      value={googleUrl}
                      onChange={(e) => setGoogleUrl(e.target.value)}
                      required
                      placeholder="https://www.google.com/search?kgmid=/g/11p5kwclk3&hl=pt-BR&q=Advocacia+Jo%C3%A3o+Guerra#lrd=0x7ab19d61d600507:0x53f2f7602f5dc50a,1,,,,"
                      className="w-full bg-[#101616] border border-[#D8CBB3]/40 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[#D8CBB3] text-[#FFFDF8] font-mono"
                    />
                  </div>
                  <a
                    href={googleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs flex items-center gap-1.5 text-[#FFFDF8] cursor-pointer"
                    title="Testar Link no Google"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Testar</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3.5 bg-[#D8CBB3] hover:bg-[#FFFDF8] text-[#101616] font-semibold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
              >
                {isSaving ? 'Salvando...' : 'Salvar Link do Google'}
              </button>
            </div>
          </form>

          {/* Reviews List & Add Form */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-serif text-[#FFFDF8]">Depoimentos do Google em Destaque</h3>
                <p className="text-xs text-[#F6F3EC]/60">Cadastre ou edite as avaliações dos clientes recebidas no perfil do Google</p>
              </div>

              {!editingReview && (
                <button
                  onClick={() => setEditingReview({
                    id: 'rev-' + Date.now(),
                    author_name: '',
                    rating: 5,
                    relative_time_description: 'recente',
                    text: '',
                    service_type: 'Atendimento Jurídico',
                    is_verified: true,
                    is_active: true,
                    created_at: new Date().toISOString()
                  })}
                  className="px-4 py-2 bg-[#D8CBB3] text-[#101616] font-semibold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#FFFDF8] transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Cadastrar Avaliação
                </button>
              )}
            </div>

            {editingReview ? (
              <form onSubmit={handleSaveReview} className="bg-[#151f1f] p-8 border border-white/10 rounded-2xl space-y-4 shadow-xl animate-fadeIn">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <h4 className="font-serif text-[#FFFDF8]">
                    {reviews.some(r => r.id === editingReview.id) ? 'Editar Avaliação' : 'Nova Avaliação'}
                  </h4>
                  <button type="button" onClick={() => setEditingReview(null)} className="p-1 hover:bg-white/10 rounded cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-[#F6F3EC]/70">Nome do Cliente *</label>
                    <input
                      type="text"
                      value={editingReview.author_name}
                      onChange={(e) => setEditingReview({ ...editingReview, author_name: e.target.value })}
                      required
                      placeholder="Ex: Hideraldo Borba"
                      className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-[#F6F3EC]/70">Classificação em Estrelas</label>
                    <select
                      value={editingReview.rating}
                      onChange={(e) => setEditingReview({ ...editingReview, rating: Number(e.target.value) })}
                      className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                    >
                      <option value="5">5 Estrelas (⭐⭐⭐⭐⭐)</option>
                      <option value="4">4 Estrelas (⭐⭐⭐⭐)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-[#F6F3EC]/70">Texto da Avaliação *</label>
                  <textarea
                    rows={3}
                    value={editingReview.text}
                    onChange={(e) => setEditingReview({ ...editingReview, text: e.target.value })}
                    required
                    placeholder="Copie ou digite o depoimento do cliente..."
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC] resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                  <button type="button" onClick={() => setEditingReview(null)} className="px-4 py-2 hover:bg-white/5 rounded-xl text-xs cursor-pointer">
                    Cancelar
                  </button>
                  <button type="submit" className="px-6 py-2.5 bg-[#D8CBB3] text-[#101616] font-semibold rounded-xl text-xs hover:bg-[#FFFDF8] cursor-pointer">
                    Salvar Avaliação
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map(rev => (
                  <div key={rev.id} className="bg-[#151f1f] border border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-3 shadow-xl">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-[#FFFDF8]">{rev.author_name}</h4>
                        <div className="flex text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#F6F3EC]/70 italic line-clamp-3">"{rev.text}"</p>
                    </div>
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Cliente Verificado Google
                      </span>
                      <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={() => setEditingReview(rev)} 
                          className="p-1.5 hover:bg-white/10 text-[#D8CBB3] rounded cursor-pointer"
                          title="Editar Avaliação"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleDeleteReview(rev.id)} 
                          className="p-1.5 hover:bg-red-500/10 text-red-400 rounded cursor-pointer"
                          title="Excluir Avaliação"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
