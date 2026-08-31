import React, { useState, useEffect } from 'react';
import { Award, ArrowUpRight, Scale, Shield } from 'lucide-react';
import { DetailModal } from './DetailModal';
import { TeamMember } from '../types';
import { getImageStyle } from '../lib/mediaHelper';
import { supabase } from '../lib/supabase';

const TEAM_STORAGE_KEY = 'albuquerque_guerra_team_members';

const initialDefaultTeam: TeamMember[] = [
  {
    id: 'renata',
    name: 'Renata Albuquerque',
    role: 'Sócia Fundadora • Coordenadora Trabalhista e Previdenciária',
    bio: 'Advogada especialista em contencioso estratégico e consultoria empresarial de alto nível. Com vasta experiência em tribunais, lidera a frente trabalhista do escritório com foco em rigor técnico, prevenção de passivos e resultados sólidos.',
    image: '/renata-albuquerque.jpg',
    category: 'partner',
  },
  {
    id: 'joao',
    name: 'João Guerra',
    role: 'Sócio Fundador • Coordenador Estratégico e Institucional',
    bio: 'Sócio fundador com sólida atuação em litígios complexos e estruturação de negócios jurídicos. Combina visão estratégica refinada e dedicação integral à defesa dos interesses corporativos e individuais de nossos clientes.',
    image: '/joao-guerra.jpg',
    category: 'partner',
  },
  {
    id: 'claudia',
    name: 'Cláudia Albuquerque',
    role: 'Sócia • Coordenadora da Área Cível',
    bio: 'Sócia e coordenadora da área Cível do escritório. É formada em economia e em direito, contando com diversas pós-graduações e especializações em seu currículo que somam a uma advocacia de alta performance.',
    image: '/claudia-albuquerque.jpg',
    category: 'partner',
  }
];

export const Team: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .order('display_order', { ascending: true });
        
        if (error) throw error;

        if (data && data.length > 0) {
          setTeam(data);
          localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(data));
        } else {
          const stored = localStorage.getItem(TEAM_STORAGE_KEY);
          if (stored) {
            setTeam(JSON.parse(stored));
          } else {
            setTeam(initialDefaultTeam);
            localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(initialDefaultTeam));
          }
        }
      } catch (e) {
        console.warn('Failed to load team from supabase, loading local:', e);
        const stored = localStorage.getItem(TEAM_STORAGE_KEY);
        if (stored) {
          setTeam(JSON.parse(stored));
        } else {
          setTeam(initialDefaultTeam);
          localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(initialDefaultTeam));
        }
      }
    };
    loadTeam();
  }, []);

  return (
    <section id="equipe" className="py-24 md:py-32 bg-[#101616] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#D8CBB3,1px,transparent,1px)] [background-size:28px,28px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#374544]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[#D8CBB3]/20">
          <div>
            <span className="text-[#D8CBB3] font-serif text-sm tracking-widest block mb-3">
              05 / SÓCIOS E FUNDADORES
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#FFFDF8] font-light max-w-2xl leading-tight">
              Nosso Corpo Jurídico
            </h2>
          </div>
          <p className="text-[#F6F3EC]/70 max-w-sm font-light mt-4 md:mt-0 leading-relaxed">
            Profissionais comprometidos com a excelência técnica, ética e a entrega de soluções jurídicas de alta performance.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="rounded-2xl bg-[#151f1f] border border-[#D8CBB3]/25 hover:border-[#D8CBB3]/70 transition-all duration-500 overflow-hidden flex flex-col justify-between group shadow-2xl hover:-translate-y-2 relative cursor-pointer"
            >
              {/* Glow accent on hover */}
              <div className="absolute inset-0 bg-[#D8CBB3]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              {/* Image Container */}
              <div className="relative h-96 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#151f1f] via-transparent to-transparent z-10 opacity-80" />
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover filter contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                  style={getImageStyle(member.image)}
                />
                
                {/* Floating zoom indicator */}
                <div className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full bg-[#101616]/80 backdrop-blur-md border border-[#D8CBB3]/40 flex items-center justify-center text-[#D8CBB3] opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

              {/* Content Container */}
              <div className="p-8 flex flex-col justify-between flex-grow relative z-10">
                <div>
                  <h3 className="text-2xl font-serif text-[#FFFDF8] mb-2 group-hover:text-[#D8CBB3] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-[#D8CBB3] text-xs font-semibold tracking-wider uppercase mb-4 leading-relaxed">
                    {member.role}
                  </p>
                  <p className="text-[#F6F3EC]/70 text-sm font-light leading-relaxed line-clamp-3 mb-6">
                    {member.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-sm font-medium text-[#D8CBB3] group-hover:text-[#FFFDF8] transition-colors group/btn w-full">
                  <span>Conheça a trajetória completa</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Member Bio Modal */}
      <DetailModal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        title={selectedMember?.name || ''}
        subtitle={selectedMember?.role}
        content={selectedMember?.bio || ''}
      />
    </section>
  );
};

