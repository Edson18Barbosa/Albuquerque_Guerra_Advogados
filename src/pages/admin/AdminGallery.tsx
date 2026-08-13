import React, { useState, useEffect } from 'react';
import { ImageIcon, Plus, Edit, Trash2, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getImageStyle } from '../../lib/mediaHelper';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  span: string;
}

const STORAGE_KEY = 'albuquerque_guerra_site_gallery';

const defaultGallery: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Renata Albuquerque e João Guerra • Sócios Fundadores',
    category: 'Liderança',
    image: '/gallery-founders.png',
    span: 'col-span-1 md:col-span-2',
  },
  {
    id: 'g2',
    title: 'Escritório em Recife • Pernambuco',
    category: 'Ambiente',
    image: '/about-office.png',
    span: 'col-span-1',
  },
  {
    id: 'g3',
    title: 'Atendimento Consultivo Especializado',
    category: 'Atuação',
    image: '/event-innovation.png',
    span: 'col-span-1',
  },
  {
    id: 'g4',
    title: 'Contencioso Estratégico e Governança',
    category: 'Excelência',
    image: '/gallery-founders.png',
    span: 'col-span-1 md:col-span-2',
  },
];

export const AdminGallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | null, text: string }>({ type: null, text: '' });
  
  const [showPicker, setShowPicker] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'Ambiente',
    image: '/about-office.png',
    span: 'col-span-1'
  });

  const loadData = async () => {
    try {
      const { data } = await supabase.from('site_gallery').select('*').order('id');
      if (data && data.length > 0) {
        setItems(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setItems(JSON.parse(stored));
        } else {
          setItems(defaultGallery);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultGallery));
        }
      }
    } catch (e) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    }

    try {
      const storedMedia = localStorage.getItem('albuquerque_guerra_media_library');
      if (storedMedia) setMediaItems(JSON.parse(storedMedia));
    } catch (e) {}
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setForm({ title: '', category: 'Ambiente', image: '/about-office.png', span: 'col-span-1' });
    setIsOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setSelectedItem(item);
    setForm({
      title: item.title,
      category: item.category,
      image: item.image,
      span: item.span
    });
    setIsOpen(true);
  };

  const handleSelectImage = (url: string) => {
    setForm(prev => ({ ...prev, image: url }));
    setShowPicker(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: GalleryItem = {
        id: selectedItem ? selectedItem.id : `gallery-${Date.now()}`,
        title: form.title,
        category: form.category,
        image: form.image,
        span: form.span
      };

      try {
        await supabase.from('site_gallery').upsert(payload);
      } catch (err) {}

      let updated = [];
      if (selectedItem) {
        updated = items.map(i => i.id === selectedItem.id ? payload : i);
      } else {
        updated = [...items, payload];
      }

      setItems(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      setStatusMsg({ type: 'success', text: 'Item da galeria salvo com sucesso!' });
      setIsOpen(false);
      setTimeout(() => setStatusMsg({ type: null, text: '' }), 5000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: `Erro: ${err.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta imagem da galeria?')) return;
    try {
      try {
        await supabase.from('site_gallery').delete().eq('id', id);
      } catch (err) {}

      const updated = items.filter(i => i.id !== id);
      setItems(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setStatusMsg({ type: 'success', text: 'Imagem removida da galeria.' });
      setTimeout(() => setStatusMsg({ type: null, text: '' }), 5000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: `Erro: ${err.message}` });
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
          <h1 className="text-3xl font-serif text-[#FFFDF8] mb-2 font-light">Galeria Institucional</h1>
          <p className="text-[#F6F3EC]/70">Gerencie os itens e fotos exibidos no painel da galeria institucional do escritório.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-6 py-3 bg-[#D8CBB3] text-[#101616] font-semibold rounded-xl hover:bg-[#FFFDF8] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shrink-0"
        >
          <Plus className="w-5 h-5" />
          Adicionar Imagem
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/10 overflow-hidden bg-[#151f1f] shadow-lg flex flex-col justify-between">
            <div className="relative h-48 bg-black/40 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover" 
                style={getImageStyle(item.image)}
              />
              <div className="absolute top-3 left-3 bg-[#101616]/80 text-[#D8CBB3] text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border border-[#D8CBB3]/30">
                {item.category}
              </div>
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between gap-4">
              <div>
                <h3 className="text-sm font-serif text-[#FFFDF8] font-medium line-clamp-1">{item.title}</h3>
                <span className="text-[10px] text-[#F6F3EC]/40">Largura: {item.span === 'col-span-1' ? 'Normal' : 'Dupla'}</span>
              </div>
              <div className="flex gap-2 pt-3 border-t border-white/5">
                <button 
                  onClick={() => handleOpenEdit(item)}
                  className="flex-1 py-1.5 bg-[#D8CBB3]/10 hover:bg-[#D8CBB3] text-[#D8CBB3] hover:text-[#101616] rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" /> Editar
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors border border-red-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#151f1f] border border-[#D8CBB3]/30 rounded-3xl max-w-xl w-full flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#101616]">
              <h2 className="text-xl font-serif text-[#FFFDF8]">{selectedItem ? 'Editar Imagem da Galeria' : 'Adicionar Imagem à Galeria'}</h2>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                <div className="md:col-span-4 space-y-2">
                  <span className="block text-xs font-semibold text-[#F6F3EC]/60 uppercase tracking-wider text-center">Imagem</span>
                  <div className="aspect-square bg-black/40 rounded-xl border border-white/10 overflow-hidden relative">
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowPicker(true)}
                    className="w-full py-1.5 bg-[#D8CBB3]/10 hover:bg-[#D8CBB3] text-[#D8CBB3] hover:text-[#101616] text-[10px] uppercase tracking-wider font-semibold rounded-lg transition-colors border border-[#D8CBB3]/30"
                  >
                    Selecionar
                  </button>
                </div>
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Título / Legenda</label>
                    <input 
                      type="text" 
                      value={form.title} 
                      onChange={(e) => setForm({ ...form, title: e.target.value })} 
                      required 
                      className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Categoria</label>
                      <select 
                        value={form.category} 
                        onChange={(e) => setForm({ ...form, category: e.target.value })} 
                        className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                      >
                        <option value="Ambiente">Ambiente</option>
                        <option value="Liderança">Liderança</option>
                        <option value="Atuação">Atuação</option>
                        <option value="Excelência">Excelência</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Largura da Grade</label>
                      <select 
                        value={form.span} 
                        onChange={(e) => setForm({ ...form, span: e.target.value })} 
                        className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                      >
                        <option value="col-span-1">Normal (1 coluna)</option>
                        <option value="col-span-1 md:col-span-2">Duplo (2 colunas)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2.5 bg-transparent hover:bg-white/5 border border-white/10 rounded-xl text-sm font-semibold">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-[#D8CBB3] hover:bg-[#FFFDF8] text-[#101616] font-semibold rounded-xl text-sm transition-all">{isSubmitting ? 'Salvando...' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-[#151f1f] border border-[#D8CBB3]/40 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#101616]">
              <div>
                <h3 className="text-lg font-serif text-[#FFFDF8]">Escolher Imagem</h3>
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
