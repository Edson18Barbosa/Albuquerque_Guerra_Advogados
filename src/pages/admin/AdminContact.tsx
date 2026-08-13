import React, { useState, useEffect } from 'react';
import { Phone, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getSiteSettings, saveSiteSettings, SiteSettings } from '../../lib/settingsHelper';

export const AdminContact: React.FC = () => {
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
      setStatusMsg({ type: 'success', text: 'Informações de contato salvas com sucesso!' });
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
        <h1 className="text-3xl font-serif text-[#FFFDF8] mb-2 font-light">Gerenciar Contato</h1>
        <p className="text-[#F6F3EC]/70">Edite os números de telefone, e-mails, endereço físico e localização do Google Maps.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl bg-[#151f1f] p-8 border border-white/10 rounded-2xl shadow-xl">
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Telefone Fixo</label>
              <input 
                type="text"
                value={settings.contact_phone}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                required
                className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">WhatsApp / Celular</label>
              <input 
                type="text"
                value={settings.contact_whatsapp}
                onChange={(e) => setSettings({ ...settings, contact_whatsapp: e.target.value })}
                required
                className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">E-mail de Contato</label>
              <input 
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                required
                className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Horário de Atendimento</label>
              <input 
                type="text"
                value={settings.contact_hours}
                onChange={(e) => setSettings({ ...settings, contact_hours: e.target.value })}
                required
                className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Endereço Comercial</label>
            <input 
              type="text"
              value={settings.contact_address}
              onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
              required
              className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Link de Incorporação do Google Maps (iframe src)</label>
            <textarea 
              rows={3}
              value={settings.contact_maps_url}
              onChange={(e) => setSettings({ ...settings, contact_maps_url: e.target.value })}
              required
              className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC] leading-normal font-mono resize-none"
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
      </form>

    </div>
  );
};
