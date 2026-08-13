import React, { useState, useEffect } from 'react';
import { Briefcase, Landmark, Home, Users, ArrowUpRight } from 'lucide-react';
import { DetailModal } from './DetailModal';
import { PracticeArea } from '../types';
import { supabase } from '../lib/supabase';
import { Logo } from './Logo';

const STORAGE_KEY = 'albuquerque_guerra_practice_areas';

const initialDefaultAreas: PracticeArea[] = [
  {
    id: 'trabalhista',
    number: '01',
    title: 'Direito Trabalhista e Previdenciário',
    summary: 'Oferecemos uma ampla gama de serviços jurídicos relacionados ao Direito Trabalhista e Previdenciário, incluindo compliance trabalhista, consultoria, representação judicial e extrajudicial, negociação coletiva e individual.',
    fullContent: 'Oferecemos uma ampla gama de serviços jurídicos relacionados ao Direito Trabalhista e Previdenciário, incluindo compliance trabalhista, consultoria, representação judicial e extrajudicial, negociação coletiva e individual, entre outros.\n\nNossa abordagem combina rigor preventivo com atuação firme perante os órgãos de justiça, garantindo segurança nas relações de trabalho e proteção aos direitos previdenciários com foco na previsibilidade financeira e organizacional das empresas e clientes.',
    iconName: 'Briefcase',
  },
  {
    id: 'tributario',
    number: '02',
    title: 'Direito Tributário',
    summary: 'Oferecemos consultoria e representação jurídica em questões relacionadas ao Direito Tributário, incluindo planejamento tributário e defesa em processos administrativos e judiciais.',
    fullContent: 'Oferecemos consultoria e representação jurídica em questões relacionadas ao Direito Tributário, incluindo planejamento tributário, revisão de cargas fiscais, mitigação de riscos de autuação e defesa em processos administrativos e judiciais nas esferas municipal, estadual e federal.\n\nBuscamos otimizar a estrutura fiscal com estrita observância à legalidade, proporcionando economia legítima e segurança jurídica duradoura.',
    iconName: 'Landmark',
  },
  {
    id: 'civil',
    number: '03',
    title: 'Direito Civil, Imobiliário e do Consumidor',
    summary: 'Oferecemos consultoria e representação jurídica em questões relacionadas ao Direito Civil, Imobiliário e do Consumidor, nos Tribunais de Justiça, Juizados Especiais e unidades cartorárias.',
    fullContent: 'Oferecemos consultoria e representação jurídica em questões relacionadas ao Direito Civil, Imobiliário e do Consumidor, nos Tribunais de Justiça, Juizados Especiais e unidades cartorárias.\n\nAtuamos na estruturação e revisão de contratos, contencioso cível estratégico, regularização de imóveis, disputas possessórias e relações de consumo, sempre priorizando a resolução célere e vantajosa dos conflitos.',
    iconName: 'Home',
  },
  {
    id: 'terceiro-setor',
    number: '04',
    title: 'Terceiro Setor',
    summary: 'Fornecemos serviços jurídicos especializados para organizações do Terceiro Setor, incluindo orientação para a criação de entidades, elaboração de estatutos e obtenção de certificações.',
    fullContent: 'Fornecemos serviços jurídicos especializados para organizações do Terceiro Setor, incluindo orientação para a criação de entidades, elaboração de estatutos, obtenção de certificações (como CEBAS, utilidade pública), estruturação jurídica, parcerias com o Poder Público e acompanhamento de suas atividades estatutárias.\n\nApoiamos o ecossistema de impacto social com dedicação institucional e rigor normativo.',
    iconName: 'Users',
  },
];

export const PracticeAreas: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<PracticeArea | null>(null);
  const [areas, setAreas] = useState<PracticeArea[]>([]);

  useEffect(() => {
    const loadAreas = async () => {
      try {
        const { data, error } = await supabase
          .from('practice_areas')
          .select('*')
          .order('number', { ascending: true });
        
        if (error) throw error;

        if (data && data.length > 0) {
          setAreas(data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } else {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            setAreas(JSON.parse(stored));
          } else {
            setAreas(initialDefaultAreas);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDefaultAreas));
          }
        }
      } catch (e) {
        console.warn('Failed to load practice areas from supabase, loading local:', e);
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setAreas(JSON.parse(stored));
        } else {
          setAreas(initialDefaultAreas);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDefaultAreas));
        }
      }
    };
    loadAreas();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase': return <Briefcase className="w-6 h-6" />;
      case 'Landmark': return <Landmark className="w-6 h-6" />;
      case 'Home': return <Home className="w-6 h-6" />;
      case 'Users': return <Users className="w-6 h-6" />;
      default: return <Briefcase className="w-6 h-6" />;
    }
  };

  return (
    <section id="atuacao" className="py-24 md:py-32 bg-[#101616] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#D8CBB3_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[#D8CBB3]/20">
          <div>
            <span className="text-[#D8CBB3] font-serif text-sm tracking-widest block mb-3">
              03 / ÁREAS DE ATUAÇÃO
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#FFFDF8] font-light max-w-2xl leading-tight">
              Atuação jurídica integrada e <span className="text-[#D8CBB3] italic">estratégica.</span>
            </h2>
          </div>
          <p className="text-[#F6F3EC]/70 text-sm md:text-base max-w-md mt-6 md:mt-0 font-light leading-relaxed">
            Soluções robustas para empresas, instituições e particulares, alinhando rigor técnico e visão de negócios.
          </p>
        </div>

        {/* 4 Large Interactive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {areas.map((area) => (
            <div
              key={area.id}
              onClick={() => setSelectedArea(area)}
              className="p-8 md:p-10 rounded-2xl bg-[#151f1f]/80 border border-[#D8CBB3]/20 hover:border-[#D8CBB3]/60 transition-all duration-500 group cursor-pointer flex flex-col justify-between shadow-xl hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Subtle accent glow on hover */}
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#D8CBB3]/5 rounded-full blur-2xl group-hover:bg-[#D8CBB3]/15 transition-all pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-[#374544] border border-[#D8CBB3]/30 flex items-center justify-center text-[#D8CBB3] group-hover:scale-110 group-hover:bg-[#D8CBB3] group-hover:text-[#101616] transition-all duration-300 shadow-md">
                    {getIcon(area.iconName)}
                  </div>
                  <span className="font-serif text-3xl text-[#D8CBB3]/40 group-hover:text-[#D8CBB3] transition-colors font-light">
                    {area.number}
                  </span>
                </div>

                <h3 className="text-2xl font-serif text-[#FFFDF8] mb-4 group-hover:text-[#D8CBB3] transition-colors leading-snug">
                  {area.title}
                </h3>

                <p className="text-[#F6F3EC]/80 text-base font-light leading-relaxed mb-6">
                  {area.summary}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-sm font-medium text-[#D8CBB3] tracking-wide group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                  Ver detalhes completos
                  <ArrowUpRight className="w-4 h-4" />
                </span>
                <Logo variant="horizontal" className="h-5 object-contain opacity-50 group-hover:opacity-80 transition-opacity" />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal for practice area details */}
      <DetailModal
        isOpen={!!selectedArea}
        onClose={() => setSelectedArea(null)}
        title={selectedArea?.title || ''}
        subtitle={`Área de Atuação ${selectedArea?.number}`}
        content={selectedArea?.fullContent || ''}
      />
    </section>
  );
};
