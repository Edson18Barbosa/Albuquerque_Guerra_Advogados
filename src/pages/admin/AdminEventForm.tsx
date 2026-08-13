import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Image as ImageIcon, Check, X, AlertTriangle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Event } from '../../types/events';
import { getEvents, saveEvent } from '../../lib/eventsHelper';

export const AdminEventForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Find event ID from query parameters
  const eventIdParam = new URLSearchParams(location.search).get('id');
  const isEditing = !!eventIdParam;

  const [form, setForm] = useState<Partial<Event>>({
    title: '',
    short_description: '',
    full_description: '',
    category: 'Palestras',
    start_date: '',
    start_time: '',
    modality: 'Presencial',
    location: '',
    registration_url: '',
    timezone: '', // Used to store main image url
    is_featured: false,
    status: 'Rascunho'
  });

  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadEventData = async () => {
      if (isEditing && eventIdParam) {
        try {
          const events = await getEvents();
          const match = events.find(e => e.id === eventIdParam);
          if (match) {
            setForm(match);
          } else {
            setErrorMsg('Evento não encontrado.');
          }
        } catch (e) {
          setErrorMsg('Erro ao carregar dados do evento.');
        }
      }
    };

    const loadMedia = () => {
      try {
        const storedMedia = localStorage.getItem('albuquerque_guerra_media_library');
        if (storedMedia) setMediaItems(JSON.parse(storedMedia));
      } catch (e) {}
    };

    loadEventData();
    loadMedia();
  }, [isEditing, eventIdParam]);

  const handleInputChange = (field: keyof Event, val: any) => {
    setForm(prev => ({ ...prev, [field]: val }));
  };

  const handleSelectImage = (url: string) => {
    setForm(prev => ({ ...prev, timezone: url }));
    setShowPicker(false);
  };

  const handleSave = async (status: 'Rascunho' | 'Publicado') => {
    if (!form.title || !form.start_date || !form.start_time) {
      setErrorMsg('Por favor, preencha os campos obrigatórios (Título, Data e Hora).');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      const slug = form.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      const payload: Event = {
        id: form.id || `event-${Date.now()}`,
        title: form.title,
        slug: slug,
        short_description: form.short_description || '',
        full_description: form.full_description || '',
        category: form.category || 'Palestras',
        start_date: form.start_date,
        start_time: form.start_time,
        modality: form.modality || 'Presencial',
        location: form.location || '',
        registration_url: form.registration_url || '',
        timezone: form.timezone || '', // main image url
        is_featured: form.is_featured || false,
        status: status,
        is_active: true,
        display_order: form.display_order || 1,
        created_at: form.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await saveEvent(payload);
      navigate('/admin/events');
    } catch (err: any) {
      setErrorMsg(`Erro ao salvar: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-20 text-[#F6F3EC]">
      <div className="flex items-center justify-between">
        <Link to="/admin/events" className="inline-flex items-center gap-2 text-[#F6F3EC]/70 hover:text-[#D8CBB3] transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para eventos</span>
        </Link>
        <div className="flex gap-4">
          <button 
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSave('Rascunho')}
            className="px-5 py-2.5 rounded-xl border border-[#D8CBB3]/30 text-[#D8CBB3] hover:bg-[#D8CBB3]/10 font-medium transition-colors text-sm"
          >
            Salvar como Rascunho
          </button>
          <button 
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSave('Publicado')}
            className="px-5 py-2.5 rounded-xl bg-[#D8CBB3] text-[#101616] font-semibold hover:bg-[#FFFDF8] transition-colors shadow-lg flex items-center gap-2 text-sm"
          >
            <Check className="w-4 h-4" />
            Publicar no Site
          </button>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-serif text-[#FFFDF8] mb-2 font-light">
          {isEditing ? 'Editar Evento' : 'Adicionar Evento'}
        </h1>
        <p className="text-[#F6F3EC]/70">Preencha os detalhes e a arte do evento para divulgação.</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2 max-w-3xl">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">
        <div className="lg:col-span-2 space-y-8">
          {/* Dados Principais */}
          <div className="bg-[#151f1f] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <h2 className="text-xl font-serif text-[#FFFDF8] border-b border-white/10 pb-4 font-light">Dados do Evento</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Nome do Evento *</label>
                <input 
                  type="text" 
                  value={form.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Seminário de Reforma Tributária"
                  required
                  className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-4 text-[#FFFDF8] focus:border-[#D8CBB3]/50 focus:outline-none transition-colors text-sm" 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Data Inicial *</label>
                  <input 
                    type="date" 
                    value={form.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                    required
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-4 text-[#FFFDF8] focus:border-[#D8CBB3]/50 focus:outline-none transition-colors text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Horário Inicial *</label>
                  <input 
                    type="time" 
                    value={form.start_time}
                    onChange={(e) => handleInputChange('start_time', e.target.value)}
                    required
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-4 text-[#FFFDF8] focus:border-[#D8CBB3]/50 focus:outline-none transition-colors text-sm" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Modalidade</label>
                  <select 
                    value={form.modality}
                    onChange={(e) => handleInputChange('modality', e.target.value)}
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-4 text-[#FFFDF8] focus:border-[#D8CBB3]/50 focus:outline-none transition-colors text-sm"
                  >
                    <option value="Presencial">Presencial</option>
                    <option value="Online">Online</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Categoria</label>
                  <select 
                    value={form.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-4 text-[#FFFDF8] focus:border-[#D8CBB3]/50 focus:outline-none transition-colors text-sm"
                  >
                    <option value="Palestras">Palestras</option>
                    <option value="Congressos">Congressos</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Cursos">Cursos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Descrição Resumida</label>
                <textarea 
                  rows={2} 
                  value={form.short_description}
                  onChange={(e) => handleInputChange('short_description', e.target.value)}
                  placeholder="Resumo do evento exibido no card de listagem..."
                  className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-4 text-[#FFFDF8] focus:border-[#D8CBB3]/50 focus:outline-none transition-colors text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Descrição Detalhada / Conteúdo</label>
                <textarea 
                  rows={4} 
                  value={form.full_description}
                  onChange={(e) => handleInputChange('full_description', e.target.value)}
                  placeholder="Texto completo ou cronograma do evento..."
                  className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-4 text-[#FFFDF8] focus:border-[#D8CBB3]/50 focus:outline-none transition-colors text-sm resize-none font-light leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Local / Endereço</label>
                  <input 
                    type="text" 
                    value={form.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Ex: Auditório Principal, Sede Recife"
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-4 text-[#FFFDF8] focus:border-[#D8CBB3]/50 focus:outline-none transition-colors text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Link de Inscrição (Ex: Sympla)</label>
                  <input 
                    type="url" 
                    value={form.registration_url}
                    onChange={(e) => handleInputChange('registration_url', e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-4 text-[#FFFDF8] focus:border-[#D8CBB3]/50 focus:outline-none transition-colors text-sm" 
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox"
                  id="is_featured"
                  checked={form.is_featured}
                  onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                  className="w-4 h-4 rounded bg-[#101616] border-white/10 text-[#D8CBB3] focus:ring-0"
                />
                <label htmlFor="is_featured" className="text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider select-none cursor-pointer">
                  Destacar este evento no topo da página
                </label>
              </div>

            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Imagens */}
          <div className="bg-[#151f1f] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl text-center">
            <h2 className="text-xl font-serif text-[#FFFDF8] border-b border-white/10 pb-4 font-light">Capa do Evento</h2>
            
            {form.timezone ? (
              <div className="space-y-4">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                  <img src={form.timezone} alt="Capa" className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setShowPicker(true)}
                    className="flex-1 py-2 bg-[#D8CBB3]/10 hover:bg-[#D8CBB3] text-[#D8CBB3] hover:text-[#101616] rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors border border-[#D8CBB3]/25"
                  >
                    Alterar
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleInputChange('timezone', '')}
                    className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-colors border border-red-500/25"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => setShowPicker(true)}
                className="border-2 border-dashed border-[#D8CBB3]/20 rounded-2xl p-8 flex flex-col items-center justify-center hover:border-[#D8CBB3]/50 hover:bg-white/5 transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-full bg-[#D8CBB3]/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-6 h-6 text-[#D8CBB3]" />
                </div>
                <p className="text-[#FFFDF8] text-sm font-medium mb-1">Selecionar da Biblioteca</p>
                <p className="text-[10px] text-[#F6F3EC]/40">Proporção ideal: 4:3 ou 16:9</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-[#151f1f] border border-[#D8CBB3]/40 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#101616]">
              <div>
                <h3 className="text-lg font-serif text-[#FFFDF8]">Escolher Capa do Evento</h3>
                <p className="text-xs text-[#F6F3EC]/50 mt-0.5">Selecione uma imagem da biblioteca de mídia.</p>
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
                      className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-white/30 hover:scale-[1.02] transition-all"
                    >
                      <img src={item.public_url} alt={item.display_name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-[#F6F3EC]/50 font-light">Nenhuma imagem cadastrada na biblioteca.</div>
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
export default AdminEventForm;
