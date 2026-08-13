import React, { useState, useEffect } from 'react';
import { Globe, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getSiteSettings, saveSiteSettings, SiteSettings } from '../../lib/settingsHelper';

export const AdminSEO: React.FC = () => {
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
      
      // Dynamically apply title tag edit to document object immediately
      document.title = settings.seo_title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', settings.seo_description);
      }

      setStatusMsg({ type: 'success', text: 'SEO e redes sociais atualizados com sucesso!' });
      setTimeout(() => setStatusMsg({ type: null, text: '' }), 5000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: `Erro: ${err.message}` });
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
        <h1 className="text-3xl font-serif text-[#FFFDF8] mb-2 font-light">SEO e Redes Sociais</h1>
        <p className="text-[#F6F3EC]/70">Otimize a indexação no Google e configure os links dos perfis corporativos do escritório.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl bg-[#151f1f] p-8 border border-white/10 rounded-2xl shadow-xl">
        
        <div className="space-y-4">
          <h3 className="text-sm font-semibold tracking-wider text-[#D8CBB3] uppercase border-b border-white/5 pb-2">Otimização (SEO)</h3>
          <div>
            <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Título da Aba no Navegador (Meta Title)</label>
            <input 
              type="text"
              value={settings.seo_title}
              onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
              required
              className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Descrição do Site (Meta Description)</label>
            <textarea 
              rows={3}
              value={settings.seo_description}
              onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
              required
              className="w-full bg-[#101616] border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC] leading-relaxed resize-none font-light"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-white/5">
          <h3 className="text-sm font-semibold tracking-wider text-[#D8CBB3] uppercase border-b border-white/5 pb-2">Redes Sociais</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Instagram</label>
              <input 
                type="text"
                value={settings.social_instagram}
                onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
                className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">LinkedIn</label>
              <input 
                type="text"
                value={settings.social_linkedin}
                onChange={(e) => setSettings({ ...settings, social_linkedin: e.target.value })}
                className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Facebook</label>
              <input 
                type="text"
                value={settings.social_facebook}
                onChange={(e) => setSettings({ ...settings, social_facebook: e.target.value })}
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
