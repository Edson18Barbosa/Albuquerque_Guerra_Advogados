import React, { useEffect, useState } from 'react';
import { Scale, CheckCircle2, Award, HeartHandshake } from 'lucide-react';
import { getSiteSettings, fetchSiteSettingsAsync, SiteSettings } from '../lib/settingsHelper';
import { getImageStyle } from '../lib/mediaHelper';
import { Logo } from './Logo';

export const About: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(getSiteSettings());

  useEffect(() => {
    fetchSiteSettingsAsync().then(setSettings);
  }, []);

  const indicators = [
    {
      title: 'Contencioso',
      description: 'Rigor técnico, estratégia e acompanhamento processual sistemático para a melhor resolução.',
      icon: Scale,
    },
    {
      title: 'Consultivo',
      description: 'Orientação jurídica para relações seguras, previsíveis e com geração de valor real.',
      icon: Award,
    },
    {
      title: 'Prevenção',
      description: 'Mitigação proativa de riscos e análise detalhada de cenários antes da celebração de negócios.',
      icon: CheckCircle2,
    },
    {
      title: 'Impacto Positivo',
      description: 'A advocacia estratégica como instrumento de transformação e segurança para negócios e pessoas.',
      icon: HeartHandshake,
    },
  ];

  if (!settings) return null;

  return (
    <section id="escritorio" className="py-24 md:py-32 bg-[#151f1f] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#374544]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[#D8CBB3]/20">
          <div>
            <span className="text-[#D8CBB3] font-serif text-sm tracking-widest block mb-3">
              {settings.about_subtitle}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#FFFDF8] font-light max-w-2xl leading-tight">
              {settings.about_title}
            </h2>
          </div>
          <p className="text-[#F6F3EC]/70 text-sm md:text-base max-w-md mt-6 md:mt-0 font-light leading-relaxed">
            Unimos técnica refinada, proximidade e constante atualização para entregar resultados seguros e duradouros.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          
          {/* Left: Editorial text */}
          <div className="lg:col-span-7 space-y-6 text-[#F6F3EC]/95 text-lg md:text-xl font-light leading-relaxed">
            <p className="first-letter:text-5xl first-letter:font-serif first-letter:text-[#D8CBB3] first-letter:mr-3 first-letter:float-left text-base md:text-lg">
              {settings.about_text_1}
            </p>
            <p className="text-base md:text-lg text-[#F6F3EC]/80 font-light">
              {settings.about_text_2}
            </p>
            <div className="pt-4 flex items-center gap-6">
              <div className="flex flex-col">
                <span className="font-serif text-3xl text-[#D8CBB3] font-bold">100%</span>
                <span className="text-xs text-[#F6F3EC]/70 uppercase tracking-wider mt-1">Diligência Semanal</span>
              </div>
              <div className="w-[1px] h-12 bg-[#D8CBB3]/30" />
              <div className="flex flex-col">
                <span className="font-serif text-3xl text-[#D8CBB3] font-bold">Mensal</span>
                <span className="text-xs text-[#F6F3EC]/70 uppercase tracking-wider mt-1">Relatórios Transparentes</span>
              </div>
              <div className="w-[1px] h-12 bg-[#D8CBB3]/30 hidden sm:block" />
              <div className="hidden sm:flex flex-col">
                <span className="font-serif text-3xl text-[#D8CBB3] font-bold">Recife</span>
                <span className="text-xs text-[#F6F3EC]/70 uppercase tracking-wider mt-1">Atuação Nacional</span>
              </div>
            </div>
          </div>

          {/* Right: Office Atmosphere Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#D8CBB3]/30 shadow-2xl">
              <div className="absolute inset-0 bg-[#374544]/20 mix-blend-multiply z-10" />
              <img
                src={settings.about_image}
                alt="Escritório Albuquerque Guerra"
                className="w-full h-[380px] object-cover hover:scale-105 transition-transform duration-700 filter contrast-[1.05]"
                style={getImageStyle(settings.about_image)}
              />
              <div className="absolute bottom-4 left-4 right-4 z-20 p-4 bg-[#101616]/90 backdrop-blur-md rounded-xl border border-[#D8CBB3]/20">
                <span className="text-xs text-[#D8CBB3] font-semibold tracking-wider uppercase">Sede Principal</span>
                <p className="text-sm text-[#FFFDF8] font-serif mt-1">Empresarial Camilo Brito • Recife/PE</p>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Conceptual Indicators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {indicators.map((ind, idx) => {
            const Icon = ind.icon;
            return (
              <div
                key={ind.title}
                className="p-8 rounded-2xl bg-[#101616]/60 border border-[#D8CBB3]/15 hover:border-[#D8CBB3]/40 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#374544] border border-[#D8CBB3]/30 flex items-center justify-center text-[#D8CBB3] group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-serif text-xl text-[#D8CBB3]/40 group-hover:text-[#D8CBB3] transition-colors">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-[#FFFDF8] mb-3 group-hover:text-[#D8CBB3] transition-colors">
                    {ind.title}
                  </h3>
                  <p className="text-[#F6F3EC]/70 text-sm font-light leading-relaxed">
                    {ind.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#D8CBB3]/70">
                  <Logo variant="horizontal" className="h-5 object-contain" />
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
