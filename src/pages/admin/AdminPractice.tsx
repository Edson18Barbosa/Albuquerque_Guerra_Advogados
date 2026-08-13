import React, { useState, useEffect } from 'react';
import { Briefcase, Landmark, Home, Users, Plus, Edit, Trash2, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PracticeArea {
  id: string;
  number: string;
  title: string;
  summary: string;
  fullContent: string;
  iconName: string;
}

const STORAGE_KEY = 'albuquerque_guerra_practice_areas';

const defaultAreas: PracticeArea[] = [
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

export const AdminPractice: React.FC = () => {
  const [areas, setAreas] = useState<PracticeArea[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<PracticeArea | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | null, text: string }>({ type: null, text: '' });

  const [form, setForm] = useState({
    title: '',
    summary: '',
    fullContent: '',
    iconName: 'Briefcase'
  });

  const loadData = async () => {
    try {
      const { data } = await supabase.from('practice_areas').select('*').order('number', { ascending: true });
      if (data && data.length > 0) {
        setAreas(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setAreas(JSON.parse(stored));
        } else {
          setAreas(defaultAreas);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAreas));
        }
      }
    } catch (e) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setAreas(JSON.parse(stored));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setSelectedArea(null);
    setForm({ title: '', summary: '', fullContent: '', iconName: 'Briefcase' });
    setIsOpen(true);
  };

  const handleOpenEdit = (area: PracticeArea) => {
    setSelectedArea(area);
    setForm({
      title: area.title,
      summary: area.summary,
      fullContent: area.fullContent,
      iconName: area.iconName
    });
    setIsOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: PracticeArea = {
        id: selectedArea ? selectedArea.id : `practice-${Date.now()}`,
        number: selectedArea ? selectedArea.number : String(areas.length + 1).padStart(2, '0'),
        title: form.title,
        summary: form.summary,
        fullContent: form.fullContent,
        iconName: form.iconName
      };

      try {
        await supabase.from('practice_areas').upsert(payload);
      } catch (err) {
        console.warn('DB practice areas save failed, local storage only:', err);
      }

      let updated = [];
      if (selectedArea) {
        updated = areas.map(a => a.id === selectedArea.id ? payload : a);
      } else {
        updated = [...areas, payload];
      }

      setAreas(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      setStatusMsg({ type: 'success', text: 'Área de atuação salva com sucesso!' });
      setIsOpen(false);
      setTimeout(() => setStatusMsg({ type: null, text: '' }), 5000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: `Erro: ${err.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta área de atuação?')) return;
    try {
      try {
        await supabase.from('practice_areas').delete().eq('id', id);
      } catch (err) {
        console.warn('DB delete practice area failed:', err);
      }

      const updated = areas.filter(a => a.id !== id).map((a, idx) => ({
        ...a,
        number: String(idx + 1).padStart(2, '0')
      }));

      setAreas(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setStatusMsg({ type: 'success', text: 'Área de atuação excluída com sucesso.' });
      setTimeout(() => setStatusMsg({ type: null, text: '' }), 5000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: `Erro ao excluir: ${err.message}` });
    }
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-[#D8CBB3]" />;
      case 'Landmark': return <Landmark className="w-5 h-5 text-[#D8CBB3]" />;
      case 'Home': return <Home className="w-5 h-5 text-[#D8CBB3]" />;
      case 'Users': return <Users className="w-5 h-5 text-[#D8CBB3]" />;
      default: return <Briefcase className="w-5 h-5 text-[#D8CBB3]" />;
    }
  };

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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#FFFDF8] mb-2 font-light">Áreas de Atuação</h1>
          <p className="text-[#F6F3EC]/70">Cadastre e edite as áreas jurídicas oferecidas pelo escritório.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-6 py-3 bg-[#D8CBB3] text-[#101616] font-semibold rounded-xl hover:bg-[#FFFDF8] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shrink-0"
        >
          <Plus className="w-5 h-5" />
          Adicionar Área
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
        {areas.map((area) => (
          <div key={area.id} className="p-6 bg-[#151f1f] border border-white/10 rounded-2xl flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                    {getIcon(area.iconName)}
                  </div>
                  <span className="text-xs font-serif text-[#D8CBB3]">{area.number}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenEdit(area)}
                    className="p-2 hover:bg-white/5 text-[#D8CBB3] rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(area.id)}
                    className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-serif text-[#FFFDF8] font-medium">{area.title}</h3>
              <p className="text-xs text-[#F6F3EC]/65 leading-relaxed font-light">{area.summary}</p>
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#151f1f] border border-[#D8CBB3]/30 rounded-3xl max-w-xl w-full flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#101616]">
              <h2 className="text-xl font-serif text-[#FFFDF8]">{selectedArea ? 'Editar Área' : 'Adicionar Área'}</h2>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Título da Área</label>
                  <input 
                    type="text" 
                    value={form.title} 
                    onChange={(e) => setForm({ ...form, title: e.target.value })} 
                    required 
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Ícone</label>
                  <select 
                    value={form.iconName} 
                    onChange={(e) => setForm({ ...form, iconName: e.target.value })} 
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                  >
                    <option value="Briefcase">Maleta (Trabalhista/Comercial)</option>
                    <option value="Landmark">Tribunal (Tributário)</option>
                    <option value="Home">Casa (Imobiliário/Civil)</option>
                    <option value="Users">Pessoas (Família/Terceiro Setor)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Resumo (Para o Card)</label>
                <textarea 
                  rows={2} 
                  value={form.summary} 
                  onChange={(e) => setForm({ ...form, summary: e.target.value })} 
                  required 
                  className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC] resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Conteúdo Completo (Modal de Detalhes)</label>
                <textarea 
                  rows={5} 
                  value={form.fullContent} 
                  onChange={(e) => setForm({ ...form, fullContent: e.target.value })} 
                  required 
                  className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC] resize-none leading-relaxed font-light"
                />
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2.5 bg-transparent hover:bg-white/5 border border-white/10 rounded-xl text-sm font-semibold">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-[#D8CBB3] hover:bg-[#FFFDF8] text-[#101616] font-semibold rounded-xl text-sm transition-all">{isSubmitting ? 'Salvando...' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
