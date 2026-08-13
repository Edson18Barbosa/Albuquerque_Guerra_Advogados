import React, { useState, useEffect } from 'react';
import { Building2, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getSiteSettings, saveSiteSettings, SiteSettings } from '../../lib/settingsHelper';
import { getImageStyle } from '../../lib/mediaHelper';

interface MediaItem {
  id: string;
  file_name: string;
  display_name: string;
  public_url: string;
}

export const AdminAbout: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | null, text: string }>({ type: null, text: '' });
  
  // Picker state
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    setSettings(getSiteSettings());
    try {
      const stored = localStorage.getItem('albuquerque_guerra_media_library');
      if (stored) setMediaItems(JSON.parse(stored));
    } catch (e) {
      console.warn('Could not load media library', e);
    }
  }, []);

  const handleSelectImage = (url: string) => {
    if (!settings) return;
    setSettings({ ...settings, about_image: url });
    setShowPicker(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSubmitting(true);
    try {
      await saveSiteSettings(settings);
      setStatusMsg({ type: 'success', text: 'Seção O Escritório atualizada com sucesso!' });
      setTimeout(() => setStatusMsg({ type: null, text: '' }), 5000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: `Erro ao salvar: ${err.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!settings) return null;

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

      <div>
        <h1 className="text-3xl font-serif text-[#FFFDF8] mb-2 font-light">Editar Seção O Escritório</h1>
        <p className="text-[#F6F3EC]/70">Gerencie a história, os textos institucionais e a foto em destaque da sede.</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl">
        
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-8 space-y-6 bg-[#151f1f] p-8 border border-white/10 rounded-2xl shadow-xl">
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Índice / Subtítulo</label>
                <input 
                  type="text"
                  value={settings.about_subtitle}
                  onChange={(e) => setSettings({ ...settings, about_subtitle: e.target.value })}
                  required
                  className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Título Principal</label>
                <input 
                  type="text"
                  value={settings.about_title}
                  onChange={(e) => setSettings({ ...settings, about_title: e.target.value })}
                  required
                  className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Parágrafo de Introdução (Destaque)</label>
              <textarea 
                rows={4}
                value={settings.about_text_1}
                onChange={(e) => setSettings({ ...settings, about_text_1: e.target.value })}
                required
                className="w-full bg-[#101616] border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC] leading-relaxed resize-none font-light"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Parágrafo Secundário (Histórico)</label>
              <textarea 
                rows={5}
                value={settings.about_text_2}
                onChange={(e) => setSettings({ ...settings, about_text_2: e.target.value })}
                required
                className="w-full bg-[#101616] border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC] leading-relaxed resize-none font-light"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#D8CBB3] hover:bg-[#FFFDF8] text-[#101616] font-semibold rounded-xl text-sm transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>

        </div>

        {/* Right Column: Image display and trigger */}
        <div className="lg:col-span-4 bg-[#151f1f] p-6 border border-white/10 rounded-2xl shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="block text-xs font-semibold text-[#F6F3EC]/60 uppercase tracking-wider text-center">Foto do Escritório</span>
            <div className="aspect-[4/3] bg-black/40 rounded-xl border border-white/5 overflow-hidden relative flex items-center justify-center">
              <img 
                src={settings.about_image} 
                alt="Escritório" 
                className="w-full h-full object-cover"
                style={getImageStyle(settings.about_image)}
              />
            </div>
            <p className="text-[11px] text-[#F6F3EC]/50 text-center leading-normal">
              Esta foto representa a sede física ou o ambiente institucional do escritório.
            </p>
          </div>
          <button 
            type="button"
            onClick={() => setShowPicker(true)}
            className="w-full py-3 bg-[#D8CBB3]/10 hover:bg-[#D8CBB3] text-[#D8CBB3] hover:text-[#101616] text-xs font-semibold uppercase tracking-wider rounded-xl transition-all border border-[#D8CBB3]/30"
          >
            Escolher da Biblioteca
          </button>
        </div>

      </form>

      {/* Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#151f1f] border border-[#D8CBB3]/40 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#101616]">
              <div>
                <h3 className="text-lg font-serif text-[#FFFDF8]">Escolher Foto do Escritório</h3>
                <p className="text-xs text-[#F6F3EC]/50 mt-0.5">Selecione uma imagem da sua biblioteca.</p>
              </div>
              <button onClick={() => setShowPicker(false)} className="p-1.5 hover:bg-white/10 rounded-full text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {mediaItems.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {mediaItems.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => handleSelectImage(item.public_url)}
                      className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-white/30 hover:scale-[1.03] transition-all"
                    >
                      <img src={item.public_url} alt={item.display_name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                        <span className="text-[10px] font-semibold text-white truncate w-full">{item.display_name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-[#F6F3EC]/50 font-light">Nenhuma imagem cadastrada.</div>
              )}
            </div>
            <div className="p-4 bg-[#101616] border-t border-white/5 flex justify-end">
              <button 
                onClick={() => setShowPicker(false)}
                className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-semibold hover:bg-white/10"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
