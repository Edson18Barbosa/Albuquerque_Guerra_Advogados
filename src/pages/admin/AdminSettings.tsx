import React, { useState, useEffect } from 'react';
import { Settings, X, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { getSiteSettings, saveSiteSettings, SiteSettings, defaultSettings, SETTINGS_STORAGE_KEY } from '../../lib/settingsHelper';
import { supabase } from '../../lib/supabase';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'error' | 'testing'>('testing');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | null, text: string }>({ type: null, text: '' });

  const testConnection = async () => {
    setDbStatus('testing');
    try {
      // Query a simple select to test connection
      const { error } = await supabase.from('media_library').select('count', { count: 'exact', head: true });
      if (error && error.code !== 'PGRST116') throw error;
      setDbStatus('connected');
    } catch (e) {
      console.warn('Supabase ping test failed:', e);
      setDbStatus('error');
    }
  };

  useEffect(() => {
    setSettings(getSiteSettings());
    testConnection();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSubmitting(true);
    try {
      await saveSiteSettings(settings);
      setStatusMsg({ type: 'success', text: 'Configurações gerais salvas!' });
      setTimeout(() => setStatusMsg({ type: null, text: '' }), 5000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: `Erro: ${err.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAll = async () => {
    if (!confirm('ATENÇÃO: Isso irá redefinir todos os textos institucionais e logos para o padrão de fábrica. Deseja prosseguir?')) return;
    setIsSubmitting(true);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
      setSettings(defaultSettings);
      
      // Update Supabase if possible
      try {
        await supabase.from('site_settings').upsert({ id: 'global', ...defaultSettings });
      } catch (err) {}

      setStatusMsg({ type: 'success', text: 'Todo o site foi restaurado para as configurações padrão!' });
      setTimeout(() => setStatusMsg({ type: null, text: '' }), 5000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: `Erro ao resetar: ${err.message}` });
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
        <h1 className="text-3xl font-serif text-[#FFFDF8] mb-2 font-light">Configurações Gerais</h1>
        <p className="text-[#F6F3EC]/70">Gerencie a paleta de cores primária, conexões de dados e redefinição do sistema.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-4xl">
        
        {/* Left Form: Preferences */}
        <form onSubmit={handleSave} className="lg:col-span-8 bg-[#151f1f] p-8 border border-white/10 rounded-2xl shadow-xl space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-[#D8CBB3] uppercase border-b border-white/5 pb-2">Aparência do Site</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5 font-sans">Cor de Destaque Primária (Hexadecimal)</label>
                <div className="flex gap-2.5">
                  <input 
                    type="text"
                    value={settings.primary_color}
                    onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    required
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC] font-mono"
                  />
                  <div 
                    className="w-10 h-10 rounded-xl border border-white/10 shrink-0" 
                    style={{ backgroundColor: settings.primary_color }} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#D8CBB3] hover:bg-[#FFFDF8] text-[#101616] font-semibold rounded-xl text-sm transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        </form>

        {/* Right Info: DB Status and System Reset */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Database Connection Info */}
          <div className="bg-[#151f1f] p-6 border border-white/10 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-xs font-semibold tracking-wider text-[#D8CBB3] uppercase">Conexão de Banco de Dados</h3>
            <div className="flex items-center gap-2.5">
              <div className={`w-3.5 h-3.5 rounded-full ${
                dbStatus === 'connected' ? 'bg-green-500 animate-pulse' :
                dbStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500 animate-spin'
              }`} />
              <span className="text-xs font-medium">
                {dbStatus === 'connected' ? 'Supabase Conectado' :
                 dbStatus === 'error' ? 'Usando Fallback Local' : 'Testando Conectividade...'}
              </span>
            </div>
            <button 
              onClick={testConnection}
              className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold transition-all border border-white/10"
            >
              Testar Conexão Novamente
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-[#151f1f] p-6 border border-red-500/20 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-xs font-semibold tracking-wider text-red-400 uppercase">Zona de Risco</h3>
            <p className="text-[11px] text-[#F6F3EC]/50 leading-relaxed">
              Restaura todo o site para os textos padrão iniciais. Use com cuidado.
            </p>
            <button 
              onClick={handleResetAll}
              disabled={isSubmitting}
              className="w-full py-2.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-xs font-semibold transition-all border border-red-500/20"
            >
              Redefinir Todo o Site
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
