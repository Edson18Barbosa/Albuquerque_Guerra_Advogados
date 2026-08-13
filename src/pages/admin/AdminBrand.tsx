import React, { useState, useEffect } from 'react';
import { Palette, X, CheckCircle2, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { getSiteSettings, saveSiteSettings, SiteSettings } from '../../lib/settingsHelper';

interface MediaItem {
  id: string;
  file_name: string;
  display_name: string;
  public_url: string;
}

export const AdminBrand: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | null, text: string }>({ type: null, text: '' });
  
  // Picker state
  const [showPicker, setShowPicker] = useState(false);
  const [activeLogoKey, setActiveLogoKey] = useState<'logo_horizontal' | 'logo_vertical' | 'logo_monogram' | null>(null);

  useEffect(() => {
    setSettings(getSiteSettings());
    try {
      const stored = localStorage.getItem('albuquerque_guerra_media_library');
      if (stored) setMediaItems(JSON.parse(stored));
    } catch (e) {
      console.warn('Could not load media library', e);
    }
  }, []);

  const handleOpenPicker = (key: 'logo_horizontal' | 'logo_vertical' | 'logo_monogram') => {
    setActiveLogoKey(key);
    setShowPicker(true);
  };

  const handleSelectLogo = (url: string) => {
    if (!activeLogoKey || !settings) return;
    setSettings({ ...settings, [activeLogoKey]: url });
    setShowPicker(false);
    setActiveLogoKey(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSubmitting(true);
    try {
      await saveSiteSettings(settings);
      setStatusMsg({ type: 'success', text: 'Identidade visual atualizada com sucesso!' });
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
        <h1 className="text-3xl font-serif text-[#FFFDF8] mb-2 font-light">Identidade Visual</h1>
        <p className="text-[#F6F3EC]/70">Gerencie o logotipo do site nas suas variações de exibição.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Logo Horizontal */}
          <div className="p-6 bg-[#151f1f] border border-white/10 rounded-2xl flex flex-col justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-[#D8CBB3] uppercase mb-1">Logomarca Horizontal</h3>
              <p className="text-xs text-[#F6F3EC]/50 mb-4">Usada na barra de navegação principal.</p>
              <div className="h-32 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center p-4 overflow-hidden relative">
                {settings.logo_horizontal ? (
                  <img src={settings.logo_horizontal} alt="Horizontal" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-xs text-white/30">Nenhuma imagem definida</span>
                )}
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => handleOpenPicker('logo_horizontal')}
              className="w-full py-2.5 bg-[#D8CBB3]/10 hover:bg-[#D8CBB3] text-[#D8CBB3] hover:text-[#101616] rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border border-[#D8CBB3]/20"
            >
              Escolher da Biblioteca
            </button>
          </div>

          {/* Logo Vertical */}
          <div className="p-6 bg-[#151f1f] border border-white/10 rounded-2xl flex flex-col justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-[#D8CBB3] uppercase mb-1">Logomarca Vertical</h3>
              <p className="text-xs text-[#F6F3EC]/50 mb-4">Usada no rodapé e telas secundárias.</p>
              <div className="h-32 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center p-4 overflow-hidden relative">
                {settings.logo_vertical ? (
                  <img src={settings.logo_vertical} alt="Vertical" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-xs text-white/30">Nenhuma imagem definida</span>
                )}
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => handleOpenPicker('logo_vertical')}
              className="w-full py-2.5 bg-[#D8CBB3]/10 hover:bg-[#D8CBB3] text-[#D8CBB3] hover:text-[#101616] rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border border-[#D8CBB3]/20"
            >
              Escolher da Biblioteca
            </button>
          </div>

          {/* Logo Monograma */}
          <div className="p-6 bg-[#151f1f] border border-white/10 rounded-2xl flex flex-col justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-[#D8CBB3] uppercase mb-1">Monograma / Ícone</h3>
              <p className="text-xs text-[#F6F3EC]/50 mb-4">Usada em avatares e cards de valores.</p>
              <div className="h-32 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center p-4 overflow-hidden relative">
                {settings.logo_monogram ? (
                  <img src={settings.logo_monogram} alt="Monogram" className="max-h-16 max-w-16 object-contain" />
                ) : (
                  <span className="text-xs text-white/30">Nenhum ícone definido</span>
                )}
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => handleOpenPicker('logo_monogram')}
              className="w-full py-2.5 bg-[#D8CBB3]/10 hover:bg-[#D8CBB3] text-[#D8CBB3] hover:text-[#101616] rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border border-[#D8CBB3]/20"
            >
              Escolher da Biblioteca
            </button>
          </div>

        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-[#D8CBB3] hover:bg-[#FFFDF8] text-[#101616] font-semibold rounded-xl text-sm transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>

      {/* Media picker modal */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#151f1f] border border-[#D8CBB3]/40 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#101616]">
              <div>
                <h3 className="text-lg font-serif text-[#FFFDF8]">Escolher Imagem</h3>
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
                      onClick={() => handleSelectLogo(item.public_url)}
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
                <div className="text-center py-12 text-[#F6F3EC]/50 font-light">Nenhuma imagem cadastrada na Biblioteca de Mídia.</div>
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
