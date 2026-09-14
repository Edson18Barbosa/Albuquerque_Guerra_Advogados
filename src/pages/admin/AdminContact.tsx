import React, { useState, useEffect } from 'react';
import { 
  Phone, X, CheckCircle2, AlertTriangle, Mail, MapPin, 
  Clock, Inbox, Trash2, Eye, Calendar, User, MessageSquare
} from 'lucide-react';
import { getSiteSettings, saveSiteSettings, SiteSettings } from '../../lib/settingsHelper';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  area: string;
  message: string;
  sent_to_email: string;
  created_at: string;
}

export const AdminContact: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [activeTab, setActiveTab] = useState<'settings' | 'inbox'>('settings');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | null, text: string }>({ type: null, text: '' });

  const loadData = () => {
    setSettings(getSiteSettings());
    try {
      const stored = localStorage.getItem('albuquerque_guerra_contact_messages');
      if (stored) {
        setMessages(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Error loading messages:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSubmitting(true);
    try {
      await saveSiteSettings(settings);
      setStatusMsg({ type: 'success', text: 'Configurações e e-mail de recebimento salvos com sucesso!' });
      setTimeout(() => setStatusMsg({ type: null, text: '' }), 5000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: 'Erro: ' + err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMessage = (id: string) => {
    if (!confirm('Deseja excluir esta mensagem recebida?')) return;
    const updated = messages.filter(m => m.id !== id);
    setMessages(updated);
    localStorage.setItem('albuquerque_guerra_contact_messages', JSON.stringify(updated));
    setStatusMsg({ type: 'success', text: 'Mensagem excluída.' });
    setTimeout(() => setStatusMsg({ type: null, text: '' }), 4000);
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#FFFDF8] mb-2 font-light">Gerenciar Contato & E-mail de Recebimento</h1>
          <p className="text-[#F6F3EC]/70">Defina o e-mail dinâmico que receberá os envios do site e acompanhe as mensagens recebidas.</p>
        </div>

        <div className="flex gap-2 bg-[#151f1f] p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'settings' ? 'bg-[#D8CBB3] text-[#101616]' : 'text-[#F6F3EC]/70 hover:text-white'
            }`}
          >
            Configurações & E-mail
          </button>
          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'inbox' ? 'bg-[#D8CBB3] text-[#101616]' : 'text-[#F6F3EC]/70 hover:text-white'
            }`}
          >
            <Inbox className="w-4 h-4" />
            Caixa de Entrada ({messages.length})
          </button>
        </div>
      </div>

      {activeTab === 'settings' && (
        <form onSubmit={handleSave} className="space-y-6 max-w-4xl bg-[#151f1f] p-8 border border-white/10 rounded-2xl shadow-xl">
          {/* Highlighted Notification Email Box */}
          <div className="p-6 rounded-2xl bg-[#D8CBB3]/10 border border-[#D8CBB3]/30 space-y-3">
            <div className="flex items-center gap-2.5 text-[#D8CBB3]">
              <Mail className="w-5 h-5" />
              <h3 className="font-serif text-lg text-[#FFFDF8] font-medium">E-mail Dinâmico para Receber Envios do Formulário</h3>
            </div>
            <p className="text-xs text-[#F6F3EC]/80 leading-relaxed font-light">
              Informe abaixo o endereço de e-mail que receberá as mensagens preenchidas pelos visitantes no formulário do site. Você pode alterar esse e-mail a qualquer momento e todos os novos envios serão encaminhados para ele.
            </p>
            <div className="pt-2">
              <label className="block text-xs font-semibold text-[#D8CBB3] uppercase tracking-wider mb-1.5">
                E-mail de Notificação (Destino das Mensagens)
              </label>
              <input 
                type="email"
                value={settings.contact_notification_email || settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_notification_email: e.target.value })}
                required
                placeholder="contato@albuquerqueguerra.adv.br"
                className="w-full bg-[#101616] border border-[#D8CBB3]/40 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#D8CBB3] text-[#FFFDF8] font-medium"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h4 className="text-base font-serif text-[#FFFDF8] border-b border-white/10 pb-2">Informações Institucionais de Contato</h4>

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
                <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">E-mail Público do Rodapé</label>
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
              <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Link de Incorporação Google Maps (iframe)</label>
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
              className="px-8 py-3.5 bg-[#D8CBB3] hover:bg-[#FFFDF8] text-[#101616] font-semibold rounded-xl text-sm transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações e E-mail'}
            </button>
          </div>
        </form>
      )}

      {activeTab === 'inbox' && (
        <div className="space-y-6 max-w-5xl">
          {messages.length === 0 ? (
            <div className="bg-[#151f1f] border border-white/10 rounded-2xl p-12 text-center space-y-3">
              <Inbox className="w-12 h-12 text-[#D8CBB3]/40 mx-auto" />
              <h3 className="text-xl font-serif text-[#FFFDF8]">Nenhuma mensagem recebida ainda</h3>
              <p className="text-xs text-[#F6F3EC]/60 max-w-md mx-auto">
                Quando os visitantes preencherem o formulário no site, as mensagens aparecerão aqui e serão enviadas para: <strong className="text-[#D8CBB3]">{settings.contact_notification_email || settings.contact_email}</strong>.
              </p>
            </div>
          ) : (
            <div className="bg-[#151f1f] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="p-4 text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider">Nome</th>
                      <th className="p-4 text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider">Contato</th>
                      <th className="p-4 text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider">Área</th>
                      <th className="p-4 text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider">Data</th>
                      <th className="p-4 text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map(msg => (
                      <tr key={msg.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="font-medium text-[#FFFDF8]">{msg.name}</div>
                          <span className="text-xs text-[#F6F3EC]/50 line-clamp-1">{msg.message}</span>
                        </td>
                        <td className="p-4 text-xs text-[#F6F3EC]/80">
                          <div>{msg.email}</div>
                          <div className="text-[#D8CBB3]">{msg.phone}</div>
                        </td>
                        <td className="p-4 text-xs text-[#D8CBB3] font-medium">{msg.area}</td>
                        <td className="p-4 text-xs text-[#F6F3EC]/60">{new Date(msg.created_at).toLocaleString('pt-BR')}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedMessage(msg)}
                              className="p-2 text-[#F6F3EC]/50 hover:text-[#D8CBB3] hover:bg-[#D8CBB3]/10 rounded-lg transition-colors"
                              title="Ver Detalhes"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="p-2 text-[#F6F3EC]/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                              title="Excluir"
                            >
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

          {/* Modal: View Message Details */}
          {selectedMessage && (
            <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
              <div className="bg-[#151f1f] border border-[#D8CBB3]/30 rounded-3xl max-w-lg w-full p-8 shadow-2xl relative space-y-6">
                <div className="flex justify-between items-start border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-xl font-serif text-[#FFFDF8]">{selectedMessage.name}</h3>
                    <p className="text-xs text-[#F6F3EC]/60">{new Date(selectedMessage.created_at).toLocaleString('pt-BR')}</p>
                  </div>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-1.5 hover:bg-white/10 rounded-full text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#101616] border border-white/5 space-y-1">
                    <p><strong className="text-[#D8CBB3]">E-mail:</strong> {selectedMessage.email}</p>
                    <p><strong className="text-[#D8CBB3]">Telefone:</strong> {selectedMessage.phone}</p>
                    <p><strong className="text-[#D8CBB3]">Área de Interesse:</strong> {selectedMessage.area}</p>
                    <p><strong className="text-[#D8CBB3]">Encaminhado para:</strong> {selectedMessage.sent_to_email}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1">Mensagem Completa</label>
                    <div className="p-4 rounded-xl bg-[#101616] border border-white/10 text-[#F6F3EC] leading-relaxed text-sm whitespace-pre-line">
                      {selectedMessage.message}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <a
                    href={`https://wa.me/${selectedMessage.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-all"
                  >
                    Responder no WhatsApp
                  </a>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="px-5 py-2 bg-[#D8CBB3] text-[#101616] font-semibold rounded-xl text-xs"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
