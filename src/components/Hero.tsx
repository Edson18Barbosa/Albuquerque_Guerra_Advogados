import React, { useEffect, useState } from 'react';
import { ArrowDown, Shield, ChevronRight } from 'lucide-react';
import { Monogram3D } from './Monogram3D';
import { getSiteSettings, SiteSettings } from '../lib/settingsHelper';

export const Hero: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    setSettings(getSiteSettings());
  }, []);

  if (!settings) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-gradient-to-b from-[#101616] via-[#151f1f] to-[#101616]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-[#374544]/40 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-[#D8CBB3]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid overlay pattern */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#D8CBB3_1.5px,transparent_1.5px)] [background-size:36px_36px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            


            {/* Subtitle / Support Text */}
            <span className="text-[#D8CBB3] text-xs md:text-sm font-semibold tracking-[0.3em] uppercase mb-4">
              {settings.hero_subtitle}
            </span>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-light text-[#FFFDF8] tracking-tight leading-[1.08] mb-6">
              {settings.hero_title_part1}{' '}
              <span className="text-[#D8CBB3] italic font-normal bg-gradient-to-r from-[#D8CBB3] via-[#FFFDF8] to-[#D8CBB3] bg-clip-text text-transparent">
                {settings.hero_title_italic}
              </span>
            </h1>

            {/* Description */}
            <p className="text-[#F6F3EC]/85 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-2xl mb-10">
              {settings.hero_description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <a
                href={settings.hero_cta_link}
                className="px-7 py-4 rounded-xl bg-[#D8CBB3] text-[#101616] font-semibold text-sm tracking-wide hover:bg-[#FFFDF8] transition-all duration-300 shadow-2xl hover:scale-105 flex items-center justify-center gap-3 group"
              >
                <span>{settings.hero_cta_text}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#valores"
                className="px-7 py-4 rounded-xl bg-[#374544]/60 hover:bg-[#374544] text-[#F6F3EC] font-medium text-sm tracking-wide transition-all duration-300 border border-[#D8CBB3]/30 hover:border-[#D8CBB3] shadow-lg flex items-center justify-center"
              >
                Nossa essência
              </a>

              <a
                href="#contato"
                className="px-6 py-4 rounded-xl bg-transparent hover:bg-white/5 text-[#D8CBB3] font-medium text-sm tracking-wide transition-all duration-300 flex items-center justify-center border border-white/10"
              >
                Fale com o escritório
              </a>
            </div>

            {/* Bottom badges */}
            <div className="grid grid-cols-2 gap-6 mt-14 pt-10 border-t border-white/15 w-full">
              <div className="flex flex-col">
                <span className="text-[#D8CBB3] font-serif text-2xl md:text-3xl font-bold">Contencioso</span>
                <span className="text-[#F6F3EC]/70 text-xs mt-1">Estratégia e rigor processual</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[#D8CBB3] font-serif text-2xl md:text-3xl font-bold">Consultivo</span>
                <span className="text-[#F6F3EC]/70 text-xs mt-1">Prevenção e segurança</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive 3D Monogram & Cinematic Visual Showcase */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            
            {/* Interactive 3D Monogram Showcase */}
            <Monogram3D />

            {/* Secondary Professional Atmosphere Card */}
            <div className="w-full mt-6 p-6 rounded-2xl bg-[#101616]/80 backdrop-blur-xl border border-[#D8CBB3]/30 shadow-2xl flex items-center justify-between group hover:border-[#D8CBB3] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#374544] border border-[#D8CBB3]/40 flex items-center justify-center text-[#D8CBB3] shadow-md">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-serif text-[#FFFDF8] font-semibold text-lg">Advocacia de Excelência</h4>
                  <p className="text-xs text-[#F6F3EC]/70">Recife • Pernambuco • Brasil</p>
                </div>
              </div>
              <a
                href="#escritorio"
                className="w-10 h-10 rounded-full bg-[#D8CBB3]/20 hover:bg-[#D8CBB3] text-[#D8CBB3] hover:text-[#101616] transition-all flex items-center justify-center shadow-md"
                aria-label="Saiba mais"
              >
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>

          </div>

        </div>

        {/* Scroll indicator & Ética combined block */}
        <div className="w-full flex flex-col items-center justify-center text-center mt-16 h-auto opacity-80 hover:opacity-100 transition-opacity">
          <span className="text-[#D8CBB3] font-serif text-2xl md:text-3xl font-bold mb-3">Ética</span>
          
          <div className="flex flex-col items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D8CBB3]">Role para explorar</span>
            <ArrowDown className="w-4 h-4 text-[#D8CBB3] animate-bounce" />
            <span className="text-[#F6F3EC]/70 text-xs">Transparência constante</span>
          </div>
        </div>

      </div>
    </section>
  );
};
