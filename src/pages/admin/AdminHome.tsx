import React, { useState, useEffect } from 'react';
import { Home, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getSiteSettings, saveSiteSettings, SiteSettings } from '../../lib/settingsHelper';

export const AdminHome: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | null, text: string }>({ type: null, text: '' });

  useEffect(() => {
    setSettings(getSiteSettings());
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSubmitting(true);
    try {
      await saveSiteSettings(settings);
      setStatusMsg({ type: 'success', text: 'Página inicial atualizada com sucesso!' });
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
        <h1 className="text-3xl font-serif text-[#FFFDF8] mb-2 font-light">Editar Página Inicial</h1>
        <p className="text-[#F6F3EC]/70">Altere os títulos, slogans e botões principais de chamada para ação.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl bg-[#151f1f] p-8 border border-white/10 rounded-2xl shadow-xl">
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Slogan Superior (Tagline)</label>
            <input 
              type="text"
              value={settings.hero_subtitle}
              onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
              required
              className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Título Principal - Parte 1</label>
              <input 
                type="text"
                value={settings.hero_title_part1}
                onChange={(e) => setSettings({ ...settings, hero_title_part1: e.target.value })}
                required
                className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Título Principal - Parte Itálica / Destaque</label>
              <input 
                type="text"
                value={settings.hero_title_italic}
                onChange={(e) => setSettings({ ...settings, hero_title_italic: e.target.value })}
                required
                className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Descrição Principal</label>
            <textarea 
              rows={4}
              value={settings.hero_description}
              onChange={(e) => setSettings({ ...settings, hero_description: e.target.value })}
              required
              className="w-full bg-[#101616] border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC] leading-relaxed resize-none font-light"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div>
              <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Texto do Botão Principal</label>
              <input 
                type="text"
                value={settings.hero_cta_text}
                onChange={(e) => setSettings({ ...settings, hero_cta_text: e.target.value })}
                required
                className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Link do Botão Principal (Âncora / URL)</label>
              <input 
                type="text"
                value={settings.hero_cta_link}
                onChange={(e) => setSettings({ ...settings, hero_cta_link: e.target.value })}
                required
                className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
              />
            </div>
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
      </form>

    </div>
  );
};
