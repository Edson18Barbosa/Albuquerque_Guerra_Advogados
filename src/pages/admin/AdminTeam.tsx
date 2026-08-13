import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, X, RefreshCw, Users, AlertTriangle, 
  ArrowUp, ArrowDown, CheckCircle2, Info
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getImageStyle } from '../../lib/mediaHelper';

// Define TeamMember interface matching Team.tsx
interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  category: string;
  display_order?: number;
}

interface MediaItem {
  id: string;
  file_name: string;
  display_name: string;
  public_url: string;
}

const TEAM_STORAGE_KEY = 'albuquerque_guerra_team_members';
const MEDIA_STORAGE_KEY = 'albuquerque_guerra_media_library';

const defaultTeam: TeamMember[] = [
  {
    id: 'renata',
    name: 'Renata Albuquerque',
    role: 'Sócia Fundadora • Coordenadora Trabalhista e Previdenciária',
    bio: 'Advogada especialista em contencioso estratégico e consultoria empresarial de alto nível. Com vasta experiência em tribunais, lidera a frente trabalhista do escritório com foco em rigor técnico, prevenção de passivos e resultados sólidos.',
    image: '/renata-albuquerque.jpg',
    category: 'partner',
    display_order: 1
  },
  {
    id: 'joao',
    name: 'João Guerra',
    role: 'Sócio Fundador • Coordenador Estratégico e Institucional',
    bio: 'Sócio fundador com sólida atuação em litígios complexos e estruturação de negócios jurídicos. Combina visão estratégica refinada e dedicação integral à defesa dos interesses corporativos e individuais de nossos clientes.',
    image: '/joao-guerra.jpg',
    category: 'partner',
    display_order: 2
  },
  {
    id: 'claudia',
    name: 'Cláudia Albuquerque',
    role: 'Sócia • Coordenadora da Área Cível',
    bio: 'Sócia e coordenadora da área Cível do escritório. É formada em economia e em direito, contando com diversas pós-graduações e especializações em seu currículo que somam a uma advocacia de alta performance.',
    image: '/claudia-albuquerque.jpg',
    category: 'partner',
    display_order: 3
  }
];

export const AdminTeam: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info' | null, text: string }>({ type: null, text: '' });

  // Modal states
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Form states
  const [form, setForm] = useState({
    name: '',
    role: '',
    bio: '',
    image: '',
    category: 'partner',
    display_order: 1
  });

  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const showStatus = (type: 'success' | 'error' | 'info', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: null, text: '' }), 5000);
  };

  // Load team members and media library items
  const loadData = async () => {
    setIsLoading(true);
    // 1. Fetch team members
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setMembers(data);
        localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(data));
      } else {
        const stored = localStorage.getItem(TEAM_STORAGE_KEY);
        if (stored) {
          setMembers(JSON.parse(stored));
        } else {
          setMembers(defaultTeam);
          localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(defaultTeam));
        }
      }
    } catch (err: any) {
      console.warn('Supabase team fetch failed, loading local:', err.message);
      const stored = localStorage.getItem(TEAM_STORAGE_KEY);
      if (stored) {
        setMembers(JSON.parse(stored));
      } else {
        setMembers(defaultTeam);
        localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(defaultTeam));
      }
    }

    // 2. Fetch media library for picker
    try {
      const storedMedia = localStorage.getItem(MEDIA_STORAGE_KEY);
      if (storedMedia) {
        setMediaItems(JSON.parse(storedMedia));
      } else {
        const { data } = await supabase.from('media_library').select('*');
        if (data) setMediaItems(data);
      }
    } catch (err) {
      console.warn('Could not load media library list:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setForm({
      name: '',
      role: '',
      bio: '',
      image: '/joao-guerra.jpg',
      category: 'partner',
      display_order: members.length + 1
    });
    setSelectedMember(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setForm({
      name: member.name,
      role: member.role,
      bio: member.bio,
      image: member.image,
      category: member.category,
      display_order: member.display_order || 1
    });
    setIsOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: TeamMember = {
        id: selectedMember ? selectedMember.id : (crypto.randomUUID ? crypto.randomUUID() : `team-${Date.now()}`),
        name: form.name,
        role: form.role,
        bio: form.bio,
        image: form.image,
        category: form.category,
        display_order: Number(form.display_order)
      };

      // 1. Try Supabase save
      try {
        if (selectedMember) {
          const { error } = await supabase
            .from('team_members')
            .update(payload)
            .eq('id', selectedMember.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('team_members')
            .insert(payload);
          if (error) throw error;
        }
      } catch (dbErr) {
        console.warn('DB team members save failed, writing to localStorage only:', dbErr);
      }

      // Update state and local storage
      let updatedList = [];
      if (selectedMember) {
        updatedList = members.map(m => m.id === selectedMember.id ? payload : m);
      } else {
        updatedList = [...members, payload];
      }

      // Sort by display order
      updatedList.sort((a, b) => (a.display_order || 1) - (b.display_order || 1));
      
      setMembers(updatedList);
      localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(updatedList));

      showStatus('success', selectedMember ? 'Profissional editado com sucesso!' : 'Novo profissional adicionado!');
      setIsOpen(false);
    } catch (err: any) {
      showStatus('error', `Erro ao salvar profissional: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMember) return;
    setIsSubmitting(true);

    try {
      // 1. Try Supabase delete
      try {
        const { error } = await supabase
          .from('team_members')
          .delete()
          .eq('id', selectedMember.id);
        if (error) throw error;
      } catch (dbErr) {
        console.warn('DB delete team member failed, deleting locally:', dbErr);
      }

      // Update locally
      const updatedList = members.filter(m => m.id !== selectedMember.id);
      setMembers(updatedList);
      localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(updatedList));

      showStatus('success', 'Profissional removido com sucesso.');
      setIsDeleteOpen(false);
      setSelectedMember(null);
    } catch (err: any) {
      showStatus('error', `Erro ao excluir: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reorder display order
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === members.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reorderedList = [...members];
    
    // Swap display orders
    const tempOrder = reorderedList[index].display_order || index + 1;
    reorderedList[index].display_order = reorderedList[targetIndex].display_order || targetIndex + 1;
    reorderedList[targetIndex].display_order = tempOrder;

    // Swap positions
    const tempItem = reorderedList[index];
    reorderedList[index] = reorderedList[targetIndex];
    reorderedList[targetIndex] = tempItem;

    // Persist reorder
    try {
      localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(reorderedList));
      setMembers(reorderedList);

      // Asynchronously update Supabase in background
      reorderedList.forEach(async (m) => {
        await supabase
          .from('team_members')
          .update({ display_order: m.display_order })
          .eq('id', m.id);
      });
      showStatus('success', 'Ordem de exibição atualizada!');
    } catch (err) {
      console.warn('Reorder save failed', err);
    }
  };

  return (
    <div className="space-y-8 text-[#F6F3EC]">
      
      {/* Notifications */}
      {statusMsg.type && (
        <div className={`p-4 rounded-xl border flex items-center justify-between animate-fadeIn z-50 ${
          statusMsg.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
          statusMsg.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
          'bg-blue-500/10 border-blue-500/30 text-blue-400'
        }`}>
          <div className="flex items-center gap-3">
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : 
             statusMsg.type === 'error' ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            <span className="text-sm font-medium">{statusMsg.text}</span>
          </div>
          <button onClick={() => setStatusMsg({ type: null, text: '' })} className="p-1 hover:bg-white/10 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#FFFDF8] mb-2 font-light">Gerenciar Equipe</h1>
          <p className="text-[#F6F3EC]/70">Cadastre e edite os perfis dos sócios e profissionais do escritório.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-6 py-3 bg-[#D8CBB3] text-[#101616] font-semibold rounded-xl hover:bg-[#FFFDF8] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shrink-0"
        >
          <Plus className="w-5 h-5" />
          Adicionar Profissional
        </button>
      </div>

      {/* Grid List */}
      {isLoading ? (
        <div className="py-24 text-center space-y-4">
          <RefreshCw className="w-10 h-10 text-[#D8CBB3] animate-spin mx-auto" />
          <p className="text-[#F6F3EC]/70">Carregando dados da equipe...</p>
        </div>
      ) : members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, idx) => (
            <div 
              key={member.id} 
              className="rounded-2xl border border-white/10 overflow-hidden bg-[#151f1f] shadow-lg flex flex-col justify-between"
            >
              
              {/* Photo Area */}
              <div className="relative h-[26rem] bg-[#101616] overflow-hidden flex items-center justify-center border-b border-white/10">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="max-h-full max-w-full object-contain"
                  style={getImageStyle(member.image)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151f1f] via-transparent to-transparent opacity-40 pointer-events-none" />

                {/* Reordering indicators */}
                <div className="absolute top-4 left-4 z-20 flex gap-1">
                  <button 
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 bg-[#101616]/85 hover:bg-[#101616] text-[#F6F3EC] disabled:opacity-30 rounded-lg border border-white/10"
                    title="Mover para cima"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === members.length - 1}
                    className="p-1.5 bg-[#101616]/85 hover:bg-[#101616] text-[#F6F3EC] disabled:opacity-30 rounded-lg border border-white/10"
                    title="Mover para baixo"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Contents */}
              <div className="p-6 flex-grow flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-serif text-[#FFFDF8] font-medium">{member.name}</h3>
                  <p className="text-xs text-[#D8CBB3] font-semibold tracking-wider uppercase">{member.role}</p>
                  <p className="text-xs text-[#F6F3EC]/70 line-clamp-3 leading-relaxed font-light">{member.bio}</p>
                </div>

                {/* Actions Panel */}
                <div className="flex gap-2 pt-4 border-t border-white/5">
                  <button 
                    onClick={() => handleOpenEdit(member)}
                    className="flex-1 py-2 bg-[#D8CBB3]/10 hover:bg-[#D8CBB3] text-[#D8CBB3] hover:text-[#101616] rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Edit className="w-4 h-4" /> Editar
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(member)}
                    className="py-2 px-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl text-xs font-semibold transition-all border border-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 border border-dashed border-white/10 rounded-2xl text-center">
          <Users className="w-16 h-16 text-[#D8CBB3]/20 mx-auto mb-4" />
          <h3 className="text-xl font-serif text-[#FFFDF8] mb-2 font-medium">Nenhum profissional cadastrado</h3>
          <p className="text-[#F6F3EC]/50 font-light">Adicione novos membros para exibi-los no site.</p>
        </div>
      )}

      {/* ==================================================
          MODAL: ADICIONAR / EDITAR PROFISSIONAL
          ================================================== */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#151f1f] border border-[#D8CBB3]/30 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#101616]">
              <h2 className="text-xl font-serif text-[#FFFDF8]">
                {selectedMember ? 'Editar Profissional' : 'Adicionar Profissional'}
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                
                {/* Left Photo display */}
                <div className="sm:col-span-4 space-y-2">
                  <span className="block text-xs font-semibold text-[#F6F3EC]/60 uppercase tracking-wider text-center">Foto de Perfil</span>
                  <div className="aspect-square bg-black/40 rounded-2xl border border-white/10 overflow-hidden relative flex items-center justify-center">
                    <img 
                      src={form.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      style={getImageStyle(form.image)}
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowMediaPicker(true)}
                    className="w-full py-2 bg-[#D8CBB3]/10 hover:bg-[#D8CBB3] text-[#D8CBB3] hover:text-[#101616] text-[10px] uppercase tracking-wider font-semibold rounded-lg transition-colors border border-[#D8CBB3]/30"
                  >
                    Escolher Mídia
                  </button>
                </div>

                {/* Right Form Fields */}
                <div className="sm:col-span-8 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Nome Completo</label>
                    <input 
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Cargo / Especialidade</label>
                    <input 
                      type="text"
                      placeholder="Ex: Sócio Fundador • Coordenador Cível"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
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
                        <option value="partner">Sócio Fundador</option>
                        <option value="associate">Associado</option>
                        <option value="consultant">Consultor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Ordem de Exibição</label>
                      <input 
                        type="number"
                        min="1"
                        value={form.display_order}
                        onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
                        className="w-full bg-[#101616] border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                      />
                    </div>
                  </div>
                </div>

              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Biografia / Trajetória</label>
                <textarea 
                  rows={4}
                  placeholder="Biografia detalhada do profissional para o modal de trajetória..."
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  required
                  className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC] resize-none leading-relaxed font-light"
                />
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 bg-transparent hover:bg-white/5 border border-white/10 hover:text-white rounded-xl text-sm font-semibold transition-all"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#D8CBB3] hover:bg-[#FFFDF8] text-[#101616] font-semibold rounded-xl text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar profissional'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ==================================================
          POPOVER MODAL: SELETOR DE IMAGENS DA BIBLIOTECA
          ================================================== */}
      {showMediaPicker && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#151f1f] border border-[#D8CBB3]/40 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl">
            
            {/* Picker Header */}
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#101616]">
              <div>
                <h3 className="text-lg font-serif text-[#FFFDF8]">Selecionar imagem da Biblioteca</h3>
                <p className="text-xs text-[#F6F3EC]/50 mt-0.5">Clique em uma imagem para defini-la como foto de perfil.</p>
              </div>
              <button 
                onClick={() => setShowMediaPicker(false)}
                className="p-1.5 hover:bg-white/10 rounded-full text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Picker Body Grid */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {mediaItems.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {mediaItems.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => {
                        setForm(prev => ({ ...prev, image: item.public_url }));
                        setShowMediaPicker(false);
                      }}
                      className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer border hover:scale-[1.03] transition-all ${
                        form.image === item.public_url 
                          ? 'border-[#D8CBB3] ring-2 ring-[#D8CBB3]/30' 
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <img 
                        src={item.public_url} 
                        alt={item.display_name} 
                        className="w-full h-full object-cover"
                        style={getImageStyle(item.public_url)}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                        <span className="text-[10px] font-semibold text-white truncate w-full">{item.display_name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-[#F6F3EC]/50 font-light">
                  Nenhuma imagem disponível na biblioteca. Adicione imagens na Biblioteca de Mídia primeiro.
                </div>
              )}
            </div>

            {/* Picker Footer */}
            <div className="p-4 bg-[#101616] border-t border-white/5 flex justify-end">
              <button 
                onClick={() => setShowMediaPicker(false)}
                className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-semibold hover:bg-white/10"
              >
                Voltar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==================================================
          MODAL: CONFIRMAÇÃO DE EXCLUSÃO
          ================================================== */}
      {isDeleteOpen && selectedMember && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#151f1f] border border-red-500/30 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl flex flex-col">
            <div className="p-5 border-b border-white/10 bg-red-500/10 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-serif text-[#FFFDF8] font-semibold">Excluir profissional?</h3>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-sm text-[#F6F3EC]/80 leading-relaxed">
                Tem certeza que deseja excluir permanentemente o perfil de <span className="font-semibold text-white">{selectedMember.name}</span>?
              </p>
              <p className="text-xs text-[#F6F3EC]/40 leading-relaxed">
                Esta ação irá remover o perfil do site imediatamente e não poderá ser desfeita.
              </p>
            </div>
            <div className="p-4 border-t border-white/5 bg-[#101616] flex gap-2">
              <button 
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="flex-1 py-2 bg-transparent hover:bg-white/5 border border-white/10 text-[#F6F3EC]/70 rounded-lg text-xs font-semibold transition-all"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Removendo...' : 'Confirmar exclusão'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
