import React, { useState, useEffect } from 'react';
import { ArrowUp, Phone, Mail, MapPin } from 'lucide-react';
import { Logo } from './Logo';
import { getSiteSettings, SiteSettings } from '../lib/settingsHelper';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    setSettings(getSiteSettings());
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0a0e0e] text-[#F6F3EC] pt-20 pb-12 border-t border-[#D8CBB3]/20 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Col 1: Brand */}
          <div className="lg:col-span-4 space-y-6">
            <Logo />

            <p className="text-[#F6F3EC]/70 text-sm font-light leading-relaxed">
              Albuquerque Guerra Advogados — estratégia, diligência, transparência e conhecimento a serviço de relações juridicamente mais seguras.
            </p>

            <div className="pt-2">
              <span className="text-xs text-[#D8CBB3] font-semibold uppercase tracking-wider block mb-1">
                Recife • Pernambuco
              </span>
              <p className="text-xs text-[#F6F3EC]/60">
                Atuação em tribunais estaduais, federais e superiores.
              </p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-lg text-[#FFFDF8] tracking-wide">Navegação</h4>
            <ul className="space-y-2.5 text-sm font-light">
              <li>
                <a href="#escritorio" className="text-[#F6F3EC]/70 hover:text-[#D8CBB3] transition-colors">
                  O Escritório
                </a>
              </li>
              <li>
                <a href="#atuacao" className="text-[#F6F3EC]/70 hover:text-[#D8CBB3] transition-colors">
                  Áreas de Atuação
                </a>
              </li>
              <li>
                <a href="#valores" className="text-[#F6F3EC]/70 hover:text-[#D8CBB3] transition-colors">
                  Tríade de Valores
                </a>
              </li>
              <li>
                <a href="#missao-visao" className="text-[#F6F3EC]/70 hover:text-[#D8CBB3] transition-colors">
                  Missão e Visão
                </a>
              </li>
              <li>
                <a href="#equipe" className="text-[#F6F3EC]/70 hover:text-[#D8CBB3] transition-colors">
                  Equipe
                </a>
              </li>
              <li>
                <a href="#contato" className="text-[#F6F3EC]/70 hover:text-[#D8CBB3] transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Practice Areas */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif text-lg text-[#FFFDF8] tracking-wide">Áreas</h4>
            <ul className="space-y-2.5 text-sm font-light">
              <li className="text-[#F6F3EC]/70">Trabalhista e Previdenciário</li>
              <li className="text-[#F6F3EC]/70">Tributário</li>
              <li className="text-[#F6F3EC]/70">Civil e Imobiliário</li>
              <li className="text-[#F6F3EC]/70">Consumidor</li>
              <li className="text-[#F6F3EC]/70">Terceiro Setor</li>
            </ul>
          </div>

          {/* Col 4: Contact info */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-lg text-[#FFFDF8] tracking-wide">Contato</h4>
            <div className="space-y-3 text-sm font-light text-[#F6F3EC]/70">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D8CBB3] flex-shrink-0 mt-1" />
                <span className="leading-relaxed">{settings ? settings.contact_address : 'Rua Arnóbio Marques, 253, Sl 1703, Recife - PE'}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D8CBB3] flex-shrink-0" />
                <span>{settings ? settings.contact_phone : '(81) 3071-8988'}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D8CBB3] flex-shrink-0" />
                <span>{settings ? settings.contact_email : 'contato@albuquerqueguerra.adv.br'}</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F6F3EC]/50">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-center sm:text-left">
            <p>
              © {new Date().getFullYear()} Albuquerque Guerra Advogados. Todos os direitos reservados.
            </p>
            <span className="hidden sm:inline text-white/15">|</span>
            <p className="text-[11px] text-[#F6F3EC]/40">
              Desenvolvido por{' '}
              <a 
                href="https://www.instagram.com/edsonrosaa/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#D8CBB3] underline transition-colors"
              >
                Evro Soluções
              </a>
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#D8CBB3] transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="hover:text-[#D8CBB3] transition-colors">
              Termos de Uso
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="p-3 bg-[#151f1f] hover:bg-[#D8CBB3] text-[#D8CBB3] hover:text-[#101616] rounded-xl border border-[#D8CBB3]/30 transition-all shadow-lg flex items-center justify-center group"
            aria-label="Voltar ao topo"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};
