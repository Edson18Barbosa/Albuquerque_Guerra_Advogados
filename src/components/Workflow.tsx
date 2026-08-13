import React, { useState, useEffect } from 'react';
import { Search, FileText, CheckSquare, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'albuquerque_guerra_site_workflow';

interface WorkflowStep {
  id: string;
  number: string;
  title: string;
  description: string;
}

const initialDefaultSteps: WorkflowStep[] = [
  {
    id: 'step1',
    number: '01',
    title: 'Compreender',
    description: 'Analisamos o contexto, as necessidades, os riscos e os objetivos envolvidos.'
  },
  {
    id: 'step2',
    number: '02',
    title: 'Planejar',
    description: 'Construímos uma estratégia jurídica clara, responsável e adequada à realidade apresentada.'
  },
  {
    id: 'step3',
    number: '03',
    title: 'Atuar',
    description: 'Aplicamos o conhecimento técnico de forma diligente, estratégica e organizada.'
  },
  {
    id: 'step4',
    number: '04',
    title: 'Acompanhar',
    description: 'Monitoramos os próximos passos e mantemos o cliente informado durante toda a atuação.'
  }
];

export const Workflow: React.FC = () => {
  const [steps, setSteps] = useState<WorkflowStep[]>([]);

  useEffect(() => {
    const loadSteps = async () => {
      try {
        const { data, error } = await supabase
          .from('site_workflow')
          .select('*')
          .order('number');
        
        if (error) throw error;

        if (data && data.length > 0) {
          setSteps(data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } else {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            setSteps(JSON.parse(stored));
          } else {
            setSteps(initialDefaultSteps);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDefaultSteps));
          }
        }
      } catch (e) {
        console.warn('Failed to load steps from supabase, loading local:', e);
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setSteps(JSON.parse(stored));
        } else {
          setSteps(initialDefaultSteps);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDefaultSteps));
        }
      }
    };
    loadSteps();
  }, []);

  const getIcon = (number: string) => {
    switch (number) {
      case '01': return Search;
      case '02': return FileText;
      case '03': return CheckSquare;
      case '04': return TrendingUp;
      default: return Search;
    }
  };

  if (steps.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-[#151f1f] relative overflow-hidden">
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-[#374544]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[#D8CBB3] font-serif text-sm tracking-widest block mb-3">
            06 / MÉTODO DE TRABALHO
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#FFFDF8] font-light mb-6">
            Nossa forma de <span className="text-[#D8CBB3] italic">atuação.</span>
          </h2>
          <p className="text-[#F6F3EC]/80 text-base md:text-lg font-light">
            Um processo estruturado em quatro etapas para garantir segurança, previsibilidade e excelência em cada caso.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {steps.map((step) => {
            const Icon = getIcon(step.number);
            return (
              <div
                key={step.number}
                className="p-8 rounded-2xl bg-[#101616]/80 border border-[#D8CBB3]/20 hover:border-[#D8CBB3]/60 transition-all duration-300 group flex flex-col justify-between shadow-xl relative"
              >
                {/* Accent border highlight on hover */}
                <div className="absolute inset-0 bg-[#D8CBB3]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-[#151f1f] rounded-xl border border-white/5 text-[#D8CBB3] group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-serif text-3xl text-white/10 font-bold group-hover:text-[#D8CBB3]/10 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-serif font-medium text-[#FFFDF8] group-hover:text-[#D8CBB3] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#F6F3EC]/70 leading-relaxed font-light">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
