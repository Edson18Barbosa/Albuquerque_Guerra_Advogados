import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Eye, Trash2, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Event } from '../../types/events';
import { getEvents, deleteEvent } from '../../lib/eventsHelper';

export const AdminEvents: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | null, text: string }>({ type: null, text: '' });
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Deseja realmente excluir o evento "${title}"?`)) return;
    try {
      await deleteEvent(id);
      setStatusMsg({ type: 'success', text: 'Evento excluído com sucesso!' });
      fetchEvents();
      setTimeout(() => setStatusMsg({ type: null, text: '' }), 4000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: `Erro ao excluir: ${err.message}` });
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/events/new?id=${id}`);
  };

  // Filtered list
  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (e.short_description && e.short_description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'Todas' || e.category === categoryFilter;
    const matchesStatus = statusFilter === 'Todos' || e.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Stats calculation
  const now = new Date();
  const totalCount = events.length;
  const upcomingCount = events.filter(e => new Date(e.start_date) >= now && e.status === 'Publicado').length;
  const pastCount = events.filter(e => new Date(e.start_date) < now && e.status === 'Publicado').length;
  const draftCount = events.filter(e => e.status === 'Rascunho').length;

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
          <h1 className="text-3xl font-serif text-[#FFFDF8] mb-2 font-light">Gerenciar Eventos</h1>
          <p className="text-[#F6F3EC]/70">Cadastre, edite e acompanhe os eventos do escritório.</p>
        </div>
        <Link to="/admin/events/new" className="px-6 py-3 bg-[#D8CBB3] text-[#101616] font-semibold rounded-xl hover:bg-[#FFFDF8] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shadow-lg shrink-0">
          <Plus className="w-5 h-5" />
          Adicionar Evento
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total" value={totalCount.toString()} />
        <StatCard title="Próximos" value={upcomingCount.toString()} highlight />
        <StatCard title="Realizados" value={pastCount.toString()} />
        <StatCard title="Rascunhos" value={draftCount.toString()} />
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#F6F3EC]/40" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome do evento..." 
            className="w-full bg-[#151f1f] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-[#F6F3EC] focus:outline-none focus:border-[#D8CBB3]/50 transition-colors placeholder:text-white/20 text-sm"
          />
        </div>
        <div className="flex gap-4">
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#151f1f] border border-white/10 rounded-xl py-3 px-4 text-[#F6F3EC] focus:outline-none focus:border-[#D8CBB3]/50 text-sm"
          >
            <option value="Todas">Todas as categorias</option>
            <option value="Palestras">Palestras</option>
            <option value="Workshops">Workshops</option>
            <option value="Congressos">Congressos</option>
            <option value="Cursos">Cursos</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#151f1f] border border-white/10 rounded-xl py-3 px-4 text-[#F6F3EC] focus:outline-none focus:border-[#D8CBB3]/50 text-sm"
          >
            <option value="Todos">Todos os status</option>
            <option value="Publicado">Publicado</option>
            <option value="Rascunho">Rascunho</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#151f1f] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-[#F6F3EC]/50 font-light">Carregando eventos...</div>
          ) : filteredEvents.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-4 text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider">Evento</th>
                  <th className="p-4 text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider">Data</th>
                  <th className="p-4 text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider">Categoria</th>
                  <th className="p-4 text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map(event => (
                  <tr key={event.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black/40 rounded-lg overflow-hidden flex-shrink-0 relative border border-white/10">
                          {event.timezone ? (
                            <img src={event.timezone} alt="Arte" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#D8CBB3]/10 flex items-center justify-center text-[10px] text-[#D8CBB3]">AGY</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-[#FFFDF8] line-clamp-1">{event.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {event.is_featured && <span className="text-[9px] font-bold uppercase bg-[#D8CBB3]/20 text-[#D8CBB3] px-2 py-0.5 rounded">Destaque</span>}
                            <span className="text-xs text-[#F6F3EC]/50">{event.modality}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-[#F6F3EC]/80 whitespace-nowrap font-light">
                      {new Date(event.start_date).toLocaleDateString('pt-BR')} {event.start_time}
                    </td>
                    <td className="p-4 text-sm text-[#F6F3EC]/80 whitespace-nowrap font-light">
                      {event.category}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                        event.status === 'Publicado' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(event.id)}
                          className="p-2 text-[#F6F3EC]/50 hover:text-[#D8CBB3] hover:bg-[#D8CBB3]/10 rounded-lg transition-colors" 
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(event.id, event.title)}
                          className="p-2 text-[#F6F3EC]/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" 
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-[#F6F3EC]/50 font-light">Nenhum evento encontrado.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, highlight = false }: { title: string, value: string, highlight?: boolean }) => (
  <div className={`p-5 rounded-2xl border ${highlight ? 'bg-[#D8CBB3]/10 border-[#D8CBB3]/30' : 'bg-[#151f1f] border-white/10'} shadow-lg`}>
    <p className="text-xs font-semibold text-[#F6F3EC]/55 uppercase tracking-wider mb-1.5">{title}</p>
    <p className={`text-3xl font-serif ${highlight ? 'text-[#D8CBB3] font-normal' : 'text-[#FFFDF8] font-light'}`}>{value}</p>
  </div>
);
