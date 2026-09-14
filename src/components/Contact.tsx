import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { getSiteSettings, SiteSettings } from '../lib/settingsHelper';

export const Contact: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    setSettings(getSiteSettings());
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    area: 'Trabalhista e Previdenciário',
    message: '',
    privacy: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if (!formData.privacy) {
      setError('Você deve aceitar a política de privacidade.');
      return;
    }
    setError('');

    // Save lead submission locally with the dynamically configured notification email
    try {
      const destinationEmail = (settings && (settings.contact_notification_email || settings.contact_email)) || 'contato@albuquerqueguerra.adv.br';
      const newSubmission = {
        id: 'msg-' + Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        area: formData.area,
        message: formData.message,
        sent_to_email: destinationEmail,
        created_at: new Date().toISOString()
      };

      const existing = localStorage.getItem('albuquerque_guerra_contact_messages');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newSubmission);
      localStorage.setItem('albuquerque_guerra_contact_messages', JSON.stringify(list));
    } catch (err) {
      console.warn('Error recording message:', err);
    }

    setSubmitted(true);
  };

  return (
    <section id="contato" className="py-24 md:py-32 bg-[#151f1f] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#374544]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[#D8CBB3]/20">
          <div>
            <span className="text-[#D8CBB3] font-serif text-sm tracking-widest block mb-3">
              10 / CONTATO E LOCALIZAÇÃO
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#FFFDF8] font-light max-w-2xl leading-tight">
              Inicie uma conversa com nossa <span className="text-[#D8CBB3] italic">equipe.</span>
            </h2>
          </div>
          <p className="text-[#F6F3EC]/70 text-sm md:text-base max-w-md mt-6 md:mt-0 font-light leading-relaxed">
            Estamos à disposição para receber sua demanda com discrição, diligência e rigor técnico.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-8 rounded-2xl bg-[#101616] border border-[#D8CBB3]/20 space-y-6 shadow-xl">
              <h3 className="text-2xl font-serif text-[#FFFDF8]">Informações de Contato</h3>
              <div className="w-12 h-[1px] bg-[#D8CBB3]/40" />

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#374544] flex items-center justify-center text-[#D8CBB3] flex-shrink-0 border border-[#D8CBB3]/30">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#FFFDF8] uppercase tracking-wider mb-1">Endereço</h4>
                    <p className="text-sm text-[#F6F3EC]/80 font-light leading-relaxed">
                      {settings ? settings.contact_address : 'Rua Arnóbio Marques, 253, sala 1703, Empresarial Camilo Brito, Santo Amaro, Recife - PE, CEP 50.100-130.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#374544] flex items-center justify-center text-[#D8CBB3] flex-shrink-0 border border-[#D8CBB3]/30">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#FFFDF8] uppercase tracking-wider mb-1">Telefone</h4>
                    <a href={`tel:${settings ? settings.contact_phone.replace(/\D/g, '') : '8130349988'}`} className="text-sm text-[#D8CBB3] hover:underline font-light">
                      {settings ? settings.contact_phone : '+55 (81) 3034-9988'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#374544] flex items-center justify-center text-[#D8CBB3] flex-shrink-0 border border-[#D8CBB3]/30">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#FFFDF8] uppercase tracking-wider mb-1">E-mail</h4>
                    <a href={`mailto:${settings ? settings.contact_email : 'contato@albuquerqueguerra.adv.br'}`} className="text-sm text-[#D8CBB3] hover:underline font-light">
                      {settings ? settings.contact_email : 'contato@albuquerqueguerra.adv.br'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#374544] flex items-center justify-center text-[#D8CBB3] flex-shrink-0 border border-[#D8CBB3]/30">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#FFFDF8] uppercase tracking-wider mb-1">Horário de Atendimento</h4>
                    <p className="text-sm text-[#F6F3EC]/80 font-light">
                      {settings ? settings.contact_hours : 'Segunda a Sexta, das 08h às 18h.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 md:p-12 rounded-3xl bg-[#101616] border border-[#D8CBB3]/30 shadow-2xl relative">
              
              {submitted ? (
                <div className="py-16 text-center space-y-6 animate-fadeIn">
                  <div className="w-20 h-20 rounded-full bg-[#374544] text-[#D8CBB3] mx-auto flex items-center justify-center border border-[#D8CBB3]/40 shadow-xl">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-serif text-[#FFFDF8]">Mensagem Enviada com Sucesso</h3>
                  <p className="text-[#F6F3EC]/80 text-base max-w-md mx-auto font-light leading-relaxed">
                    Agradecemos o seu contato. Nossa equipe analisará as informações enviadas e retornará em breve.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', area: 'Trabalhista e Previdenciário', message: '', privacy: false });
                    }}
                    className="px-8 py-3.5 bg-[#D8CBB3] text-[#101616] font-semibold rounded-xl hover:bg-[#FFFDF8] transition-colors"
                  >
                    Enviar nova mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-serif text-[#FFFDF8] mb-2">Envie sua Mensagem</h3>
                    <p className="text-[#F6F3EC]/70 text-sm font-light">
                      Preencha o formulário abaixo para iniciar o atendimento.
                    </p>
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-[#F6F3EC]/80 uppercase tracking-wider mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full bg-[#151f1f] border border-[#D8CBB3]/20 rounded-xl py-3 px-4 text-[#F6F3EC] focus:outline-none focus:border-[#D8CBB3] transition-colors"
                        placeholder="Seu nome"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#F6F3EC]/80 uppercase tracking-wider mb-2">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full bg-[#151f1f] border border-[#D8CBB3]/20 rounded-xl py-3 px-4 text-[#F6F3EC] focus:outline-none focus:border-[#D8CBB3] transition-colors"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-[#F6F3EC]/80 uppercase tracking-wider mb-2">
                        Telefone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#151f1f] border border-[#D8CBB3]/20 rounded-xl py-3 px-4 text-[#F6F3EC] focus:outline-none focus:border-[#D8CBB3] transition-colors"
                        placeholder="(81) 99999-9999"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#F6F3EC]/80 uppercase tracking-wider mb-2">
                        Área de Interesse
                      </label>
                      <select
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="w-full bg-[#151f1f] border border-[#D8CBB3]/20 rounded-xl py-3 px-4 text-[#F6F3EC] focus:outline-none focus:border-[#D8CBB3] transition-colors"
                      >
                        <option value="Trabalhista e Previdenciário">Trabalhista e Previdenciário</option>
                        <option value="Tributário">Tributário</option>
                        <option value="Civil e Imobiliário">Civil e Imobiliário</option>
                        <option value="Consumidor">Consumidor</option>
                        <option value="Terceiro Setor">Terceiro Setor</option>
                        <option value="Outro assunto">Outro assunto</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#F6F3EC]/80 uppercase tracking-wider mb-2">
                      Mensagem *
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="w-full bg-[#151f1f] border border-[#D8CBB3]/20 rounded-xl py-3 px-4 text-[#F6F3EC] focus:outline-none focus:border-[#D8CBB3] transition-colors resize-none"
                      placeholder="Descreva brevemente a sua necessidade jurídica..."
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="privacy"
                      checked={formData.privacy}
                      onChange={(e) => setFormData({ ...formData, privacy: e.target.checked })}
                      className="mt-1 rounded border-white/20 bg-[#151f1f] text-[#D8CBB3] focus:ring-0 accent-[#D8CBB3]"
                    />
                    <label htmlFor="privacy" className="text-xs text-[#F6F3EC]/70 leading-relaxed">
                      Concordo com o tratamento dos meus dados pessoais fornecidos para fins de contato e atendimento jurídico, em conformidade com a LGPD.
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#D8CBB3] hover:bg-[#FFFDF8] text-[#101616] font-semibold rounded-xl text-sm transition-all duration-300 shadow-xl flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Enviar mensagem</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
