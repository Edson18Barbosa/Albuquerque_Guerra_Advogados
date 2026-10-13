import React, { useState, useEffect } from 'react';
import { Workflow, X, CheckCircle2, AlertTriangle, Plus, Trash2 } from 'lucide-react';
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
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
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

  const handleAddStep = () => {
    const nextNum = String(steps.length + 1).padStart(2, '0');
    const newStep: WorkflowStep = {
      id: `step_${Date.now()}`,
      number: nextNum,
      title: '',
      description: ''
    };
    setSteps([...steps, newStep]);
  };

  const handleRemoveStep = (id: string) => {
    if (steps.length <= 1) {
      alert('É necessário manter ao menos 1 etapa no fluxo de atuação.');
      return;
    }
    if (!confirm('Deseja excluir esta etapa do fluxo de atuação?')) return;
    setDeletedIds(prev => [...prev, id]);
    const filtered = steps.filter(s => s.id !== id).map((s, idx) => ({
      ...s,
      number: String(idx + 1).padStart(2, '0')
    }));
    setSteps(filtered);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Sync all current steps to Supabase
      for (const step of steps) {
        const { error } = await supabase.from('site_workflow').upsert(step);
        if (error) throw error;
      }

      // 2. Delete removed steps from Supabase
      for (const delId of deletedIds) {
        const { error } = await supabase.from('site_workflow').delete().eq('id', delId);
        if (error) console.warn('Erro ao remover etapa do Supabase:', error);
      }
      setDeletedIds([]);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(steps));
      setStatusMsg({ type: 'success', text: 'Forma de Atuação salva e sincronizada com sucesso!' });
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#FFFDF8] mb-2 font-light">Forma de Atuação</h1>
          <p className="text-[#F6F3EC]/70">Edite, adicione ou remova etapas da metodologia de atendimento e prestação de serviço jurídico.</p>
        </div>
        <button
          type="button"
          onClick={handleAddStep}
          className="px-5 py-2.5 bg-[#D8CBB3] hover:bg-[#FFFDF8] text-[#101616] font-semibold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Etapa</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        <div className="space-y-5">
          {steps.map((step, idx) => (
            <div key={step.id} className="p-6 bg-[#151f1f] border border-white/10 rounded-2xl space-y-4 relative group">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-sm font-semibold tracking-wider text-[#D8CBB3] uppercase">
                  Etapa {step.number}
                </h3>
                {steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(step.id)}
                    className="p-1.5 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs"
                    title="Excluir esta etapa"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Excluir</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Título da Etapa</label>
                  <input 
                    type="text"
                    value={step.title}
                    onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                    placeholder="Ex: Diagnóstico Inicial"
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
                    placeholder="Ex: Análise aprofundada dos documentos e do cenário jurídico..."
                    required
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <button
            type="button"
            onClick={handleAddStep}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-[#D8CBB3] font-medium rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 border border-white/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Mais Uma Etapa</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-[#D8CBB3] hover:bg-[#FFFDF8] text-[#101616] font-semibold rounded-xl text-sm transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>

    </div>
  );
};
