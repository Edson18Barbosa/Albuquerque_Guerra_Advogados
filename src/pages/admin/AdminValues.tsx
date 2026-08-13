import React, { useState, useEffect } from 'react';
import { Heart, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getImageStyle } from '../../lib/mediaHelper';

interface ValueItem {
  id: string;
  title: string;
  summary: string;
  fullContent: string;
  iconName: string;
  image: string;
}

const STORAGE_KEY = 'albuquerque_guerra_site_values';

const defaultValues: ValueItem[] = [
  {
    id: 'diligencia',
    title: 'Diligência',
    summary: 'Rigor técnico, atenção aos detalhes e acompanhamento sistemático de cada processo para garantir a máxima segurança.',
    fullContent: 'Acreditamos que o rigor técnico e a atenção aos detalhes são fundamentais para o sucesso. Nosso compromisso é com o acompanhamento sistemático e detalhado de cada demanda, prevenindo riscos e buscando as melhores soluções.',
    iconName: 'ShieldCheck',
    image: '/event-innovation.png',
  },
  {
    id: 'transparencia',
    title: 'Transparência',
    summary: 'Comunicação clara, honesta e relatórios periódicos para que você esteja sempre ciente do andamento do seu caso.',
    fullContent: 'A transparência é a base da confiança em nossa relação com o cliente. Mantemos canais de comunicação sempre abertos e fornecemos relatórios mensais detalhados, garantindo clareza absoluta sobre o andamento e a estratégia de cada caso.',
    iconName: 'Eye',
    image: '/gallery-founders.png',
  },
  {
    id: 'conhecimento',
    title: 'Compromisso com o Conhecimento',
    summary: 'Estudo constante, especializações e equipe altamente qualificada para oferecer uma advocacia de ponta.',
    fullContent: 'A complexidade das leis exige atualização constante. Nossa equipe participa ativamente de cursos, pós-graduações e grupos de pesquisa, aplicando o conhecimento jurídico mais recente e inovador na defesa e consultoria dos nossos clientes.',
    iconName: 'BookOpen',
    image: '/about-office.png',
  }
];

export const AdminValues: React.FC = () => {
  const [values, setValues] = useState<ValueItem[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | null, text: string }>({ type: null, text: '' });
  
  const [showPicker, setShowPicker] = useState(false);

  const loadData = async () => {
    try {
      const { data } = await supabase.from('site_values').select('*').order('id');
      if (data && data.length > 0) {
        setValues(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setValues(JSON.parse(stored));
        } else {
          setValues(defaultValues);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultValues));
        }
      }
    } catch (e) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setValues(JSON.parse(stored));
    }

    try {
      const storedMedia = localStorage.getItem('albuquerque_guerra_media_library');
      if (storedMedia) setMediaItems(JSON.parse(storedMedia));
    } catch (e) {}
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFieldChange = (idx: number, field: keyof ValueItem, val: string) => {
    const updated = [...values];
    updated[idx] = { ...updated[idx], [field]: val };
    setValues(updated);
  };

  const handleOpenPicker = (tabIdx: number) => {
    setActiveTab(tabIdx);
    setShowPicker(true);
  };

  const handleSelectImage = (url: string) => {
    const updated = [...values];
    updated[activeTab] = { ...updated[activeTab], image: url };
    setValues(updated);
    setShowPicker(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Try Supabase write
      for (const val of values) {
        try {
          await supabase.from('site_values').upsert(val);
        } catch (dbErr) {}
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      setStatusMsg({ type: 'success', text: 'Valores institucionais atualizados com sucesso!' });
      setTimeout(() => setStatusMsg({ type: null, text: '' }), 5000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: `Erro ao salvar: ${err.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (values.length === 0) return null;

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
        <h1 className="text-3xl font-serif text-[#FFFDF8] mb-2 font-light">Valores Institucionais</h1>
        <p className="text-[#F6F3EC]/70">Edite as informações e imagens da Tríade de Valores do escritório.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
        <div className="space-y-6">
          {values.map((val, idx) => (
            <div key={val.id} className="p-6 bg-[#151f1f] border border-white/10 rounded-2xl space-y-4">
              <h3 className="text-lg font-serif text-[#D8CBB3] border-b border-white/5 pb-2">
                Valor 0{idx + 1}: {val.title}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Left Inputs */}
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Título do Valor</label>
                    <input 
                      type="text"
                      value={val.title}
                      onChange={(e) => handleFieldChange(idx, 'title', e.target.value)}
                      required
                      className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Resumo Curto (Exibido no Card)</label>
                    <textarea 
                      rows={2}
                      value={val.summary}
                      onChange={(e) => handleFieldChange(idx, 'summary', e.target.value)}
                      required
                      className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Descrição Completa (Modal de Detalhes)</label>
                    <textarea 
                      rows={3}
                      value={val.fullContent}
                      onChange={(e) => handleFieldChange(idx, 'fullContent', e.target.value)}
                      required
                      className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC] leading-relaxed font-light"
                    />
                  </div>
                </div>

                {/* Right Image Picker */}
                <div className="md:col-span-4 space-y-2">
                  <span className="block text-xs font-semibold text-[#F6F3EC]/60 uppercase tracking-wider text-center">Foto do Card</span>
                  <div className="aspect-[4/3] bg-black/40 rounded-xl border border-white/5 overflow-hidden relative">
                    <img 
                      src={val.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      style={getImageStyle(val.image)}
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleOpenPicker(idx)}
                    className="w-full py-2 bg-[#D8CBB3]/10 hover:bg-[#D8CBB3] text-[#D8CBB3] hover:text-[#101616] text-[10px] uppercase tracking-wider font-semibold rounded-lg transition-colors border border-[#D8CBB3]/30"
                  >
                    Escolher Imagem
                  </button>
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

      {/* Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-[#151f1f] border border-[#D8CBB3]/40 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#101616]">
              <div>
                <h3 className="text-lg font-serif text-[#FFFDF8]">Escolher Imagem do Valor</h3>
                <p className="text-xs text-[#F6F3EC]/50 mt-0.5">Selecione uma imagem da sua biblioteca.</p>
              </div>
              <button onClick={() => setShowPicker(false)} className="p-1.5 hover:bg-white/10 rounded-full text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {mediaItems.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {mediaItems.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => handleSelectImage(item.public_url)}
                      className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-white/30 hover:scale-[1.03] transition-all"
                    >
                      <img src={item.public_url} alt={item.display_name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                        <span className="text-[10px] font-semibold text-white truncate w-full">{item.display_name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-[#F6F3EC]/50 font-light">Nenhuma imagem cadastrada.</div>
              )}
            </div>
            <div className="p-4 bg-[#101616] border-t border-white/5 flex justify-end">
              <button 
                onClick={() => setShowPicker(false)}
                className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-semibold hover:bg-white/10"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
