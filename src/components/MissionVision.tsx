import React, { useState, useEffect } from 'react';
import { Target, Compass, Sparkles, Maximize2, X, ArrowRight } from 'lucide-react';
import { getSiteSettings, SiteSettings } from '../lib/settingsHelper';

export const MissionVision: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'missao' | 'visao'>('missao');
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setSettings(getSiteSettings());
  }, []);

  if (!settings) return null;

  return (
    <section id="missao-visao" className="py-24 md:py-32 bg-[#101616] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#D8CBB3_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#D8CBB3] font-serif text-sm tracking-widest block mb-3">
            05 / PROPÓSITO E DIREÇÃO
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#FFFDF8] font-light mb-6">
            Missão & <span className="text-[#D8CBB3] italic">Visão.</span>
          </h2>
          <p className="text-[#F6F3EC]/80 text-base md:text-lg font-light">
            O norte que orienta cada decisão, contrato e atuação processual do nosso escritório.
          </p>
        </div>

        {/* Switcher Buttons */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveMode('missao')}
            className={`px-8 py-4 rounded-2xl text-base font-medium transition-all duration-300 flex items-center gap-3 border ${
              activeMode === 'missao'
                ? 'bg-[#D8CBB3] text-[#101616] border-[#D8CBB3] shadow-lg scale-105'
                : 'bg-[#151f1f] text-[#F6F3EC] border-[#D8CBB3]/20 hover:border-[#D8CBB3]/60'
            }`}
          >
            <Target className="w-5 h-5" />
            <span>Nossa Missão</span>
          </button>

          <button
            onClick={() => setActiveMode('visao')}
            className={`px-8 py-4 rounded-2xl text-base font-medium transition-all duration-300 flex items-center gap-3 border ${
              activeMode === 'visao'
                ? 'bg-[#D8CBB3] text-[#101616] border-[#D8CBB3] shadow-lg scale-105'
                : 'bg-[#151f1f] text-[#F6F3EC] border-[#D8CBB3]/20 hover:border-[#D8CBB3]/60'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span>Nossa Visão</span>
          </button>
        </div>

        {/* Content Display Card */}
        <div className="p-8 md:p-14 rounded-3xl bg-[#151f1f]/90 border border-[#D8CBB3]/30 shadow-2xl relative overflow-hidden animate-fadeIn">
          
          {activeMode === 'missao' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-8 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#374544] text-[#D8CBB3] text-xs font-semibold tracking-wider uppercase border border-[#D8CBB3]/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Missão Institucional</span>
                </div>

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#FFFDF8] leading-tight">
                  Vantajosidade e impacto positivo para o cliente.
                </h3>

                <div className="space-y-4 text-[#F6F3EC]/90 text-base md:text-lg font-light leading-relaxed whitespace-pre-line">
                  <p>{settings.mission_text}</p>
                </div>

                <div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D8CBB3]/10 border border-[#D8CBB3]/30 text-[#D8CBB3] hover:bg-[#D8CBB3] hover:text-[#101616] text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md"
                  >
                    <Maximize2 className="w-4 h-4" />
                    Ler texto completo
                  </button>
                </div>
              </div>

              <div className="lg:col-span-4 flex items-center justify-center">
                <div className="p-8 rounded-2xl bg-[#101616] border border-[#D8CBB3]/30 text-center space-y-4 shadow-xl w-full">
                  <div className="w-16 h-16 rounded-2xl bg-[#374544] mx-auto flex items-center justify-center text-[#D8CBB3] border border-[#D8CBB3]/30">
                    <Target className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-xl text-[#FFFDF8]">Foco no Resultado</h4>
                  <p className="text-xs text-[#F6F3EC]/70 leading-relaxed">
                    Soluções jurídicas que geram valor real para negócios, pessoas e comunidades.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-8 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#374544] text-[#D8CBB3] text-xs font-semibold tracking-wider uppercase border border-[#D8CBB3]/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Visão de Futuro</span>
                </div>

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#FFFDF8] leading-tight">
                  A advocacia como instrumento de transformação positiva da sociedade.
                </h3>

                <div className="space-y-4 text-[#F6F3EC]/90 text-base md:text-lg font-light leading-relaxed whitespace-pre-line">
                  <p>{settings.vision_text}</p>
                </div>

                <div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D8CBB3]/10 border border-[#D8CBB3]/30 text-[#D8CBB3] hover:bg-[#D8CBB3] hover:text-[#101616] text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md"
                  >
                    <Maximize2 className="w-4 h-4" />
                    Ler texto completo
                  </button>
                </div>
              </div>

              <div className="lg:col-span-4 flex items-center justify-center">
                <div className="p-8 rounded-2xl bg-[#101616] border border-[#D8CBB3]/30 text-center space-y-4 shadow-xl w-full">
                  <div className="w-16 h-16 rounded-2xl bg-[#374544] mx-auto flex items-center justify-center text-[#D8CBB3] border border-[#D8CBB3]/30">
                    <Compass className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-xl text-[#FFFDF8]">Protagonismo Social</h4>
                  <p className="text-xs text-[#F6F3EC]/70 leading-relaxed">
                    Iniciativa privada forte, autônoma e engajada no desenvolvimento comunitário.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Pop-up Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#151f1f] border border-[#D8CBB3]/40 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#101616]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D8CBB3]" />
                  <h3 className="text-lg font-serif text-[#FFFDF8]">
                    {activeMode === 'missao' ? 'Nossa Missão Institucional' : 'Nossa Visão Estratégica'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-full text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 md:p-10 overflow-y-auto space-y-6 text-[#F6F3EC] custom-scrollbar">
                <h4 className="text-2xl font-serif text-[#D8CBB3] leading-snug">
                  {activeMode === 'missao'
                    ? 'Vantajosidade, ética e impacto positivo duradouro.'
                    : 'Transformação social através da excelência jurídica.'}
                </h4>

                <div className="text-base text-[#F6F3EC]/90 font-light leading-relaxed whitespace-pre-line space-y-4">
                  <p>
                    {activeMode === 'missao' ? settings.mission_text : settings.vision_text}
                  </p>
                  
                  <p>
                    {activeMode === 'missao'
                      ? 'Nossa atuação é guiada pela busca incessante pela melhor solução estratégica, combinando profundo rigor técnico, inovação contínua e atendimento dedicado e personalizado a cada cliente.'
                      : 'Acreditamos que a advocacia de vanguarda desempenha um papel fundamental no fortalecimento das instituições, no fomento ao empreendedorismo sustentável e na defesa intransigente dos direitos e do patrimônio.'}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                  <span className="text-xs text-[#D8CBB3] font-serif tracking-wider">
                    ALBUQUERQUE GUERRA ADVOGADOS
                  </span>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 bg-[#D8CBB3] text-[#101616] font-semibold rounded-xl text-xs uppercase tracking-wider hover:bg-[#FFFDF8] transition-all"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

