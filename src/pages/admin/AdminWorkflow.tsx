import React, { useState, useEffect } from 'react';
import { Workflow, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface WorkflowStep {
  id: string;
  number: string;
  title: string;
  description: string;
}

const STORAGE_KEY = 'albuquerque_guerra_site_workflow';

const defaultSteps: WorkflowStep[] = [
  {
    id: 'step1',
    number: '01',
    title: 'Atendimento e Compreensão',
    description: 'Primeiro contato para entender a realidade do cliente, seus objetivos e coletar informações essenciais.'
  },
  {
    id: 'step2',
    number: '02',
    title: 'Análise e Diagnóstico',
    description: 'Estudo aprofundado dos documentos e do cenário jurídico para traçar um diagnóstico preciso de riscos e oportunidades.'
  },
  {
    id: 'step3',
    number: '03',
    title: 'Estratégia e Solução',
    description: 'Desenho de soluções jurídicas personalizadas, preventivas ou combativas, alinhadas aos objetivos do cliente.'
  },
  {
    id: 'step4',
    number: '04',
    title: 'Ação e Acompanhamento',
    description: 'Execução firme da estratégia traçada com reporte mensal e acompanhamento diário de todas as movimentações.'
  }
];

export const AdminWorkflow: React.FC = () => {
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | null, text: string }>({ type: null, text: '' });

  useEffect(() => {
    const loadSteps = async () => {
      try {
        const { data } = await supabase.from('site_workflow').select('*').order('number');
        if (data && data.length > 0) {
          setSteps(data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } else {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            setSteps(JSON.parse(stored));
          } else {
            setSteps(defaultSteps);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSteps));
          }
        }
      } catch (e) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setSteps(JSON.parse(stored));
      }
    };
    loadSteps();
  }, []);

  const handleStepChange = (idx: number, field: keyof WorkflowStep, val: string) => {
    const updated = [...steps];
    updated[idx] = { ...updated[idx], [field]: val };
    setSteps(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      for (const step of steps) {
        try {
          await supabase.from('site_workflow').upsert(step);
        } catch (err) {}
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(steps));
      setStatusMsg({ type: 'success', text: 'Fluxo de atuação atualizado com sucesso!' });
      setTimeout(() => setStatusMsg({ type: null, text: '' }), 5000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: `Erro: ${err.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (steps.length === 0) return null;

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
        <h1 className="text-3xl font-serif text-[#FFFDF8] mb-2 font-light">Forma de Atuação</h1>
        <p className="text-[#F6F3EC]/70">Edite as etapas da metodologia de atendimento e prestação de serviço jurídico.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        <div className="space-y-5">
          {steps.map((step, idx) => (
            <div key={step.id} className="p-6 bg-[#151f1f] border border-white/10 rounded-2xl space-y-4">
              <h3 className="text-sm font-semibold tracking-wider text-[#D8CBB3] uppercase border-b border-white/5 pb-2">
                Etapa {step.number}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Título da Etapa</label>
                  <input 
                    type="text"
                    value={step.title}
                    onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                    required
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Descrição Curta</label>
                  <input 
                    type="text"
                    value={step.description}
                    onChange={(e) => handleStepChange(idx, 'description', e.target.value)}
                    required
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t border-white/5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-[#D8CBB3] hover:bg-[#FFFDF8] text-[#101616] font-semibold rounded-xl text-sm transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>

    </div>
  );
};
