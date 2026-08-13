import React, { useState, useEffect } from 'react';
import { ArrowRight, Calendar, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { Event } from '../types/events';
import { getEvents } from '../lib/eventsHelper';
import { getImageStyle } from '../lib/mediaHelper';

export const EventsSection: React.FC = () => {
  const [filter, setFilter] = useState('Todos');
  const [events, setEvents] = useState<Event[]>([]);

  const categories = ['Todos', 'Próximos eventos', 'Eventos realizados', 'Palestras', 'Congressos', 'Cursos', 'Workshops'];

  useEffect(() => {
    const loadEventsData = async () => {
      try {
        const data = await getEvents();
        // Filter only active events
        setEvents(data.filter(e => e.is_active));
      } catch (e) {
        console.warn('Failed to load events in public section:', e);
      }
    };
    loadEventsData();
  }, []);

  const now = new Date();

  // Filter out published events
  const publishedEvents = events.filter(e => e.status === 'Publicado');

  // Sorting: Upcoming first, then past
  const sortedEvents = [...publishedEvents].sort((a, b) => {
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    const isPastA = dateA < now;
    const isPastB = dateB < now;
    
    if (isPastA && !isPastB) return 1;
    if (!isPastA && isPastB) return -1;
    if (!isPastA && !isPastB) return dateA.getTime() - dateB.getTime(); // nearest first
    return dateB.getTime() - dateA.getTime(); // most recent past first
  });

  const filteredEvents = sortedEvents.filter(event => {
    if (filter === 'Todos') return true;
    if (filter === 'Próximos eventos') return new Date(event.start_date) >= now;
    if (filter === 'Eventos realizados') return new Date(event.start_date) < now;
    return event.category === filter;
  });

  const featuredEvent = sortedEvents.find(e => e.is_featured);

  return (
    <section id="eventos" className="py-32 bg-[#101616] relative border-t border-[#D8CBB3]/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-[#FFFDF8] mb-6">Eventos e conhecimento em movimento.</h2>
          <p className="text-[#F6F3EC]/70 text-lg max-w-2xl font-light">
            Encontros, palestras e iniciativas que conectam conhecimento jurídico, inovação e impacto positivo.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-16">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm transition-all ${
                filter === cat 
                  ? 'bg-[#D8CBB3] text-[#101616] font-medium' 
                  : 'bg-transparent border border-[#D8CBB3]/30 text-[#F6F3EC]/80 hover:border-[#D8CBB3] hover:text-[#D8CBB3]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredEvents.length === 0 ? (
          <div className="bg-[#151f1f] border border-[#D8CBB3]/20 rounded-3xl p-12 text-center max-w-2xl mx-auto space-y-4">
            <AlertTriangle className="w-12 h-12 text-[#D8CBB3] mx-auto opacity-80" />
            <h3 className="text-2xl font-serif text-[#FFFDF8]">Nenhum Evento Publicado</h3>
            <p className="text-[#F6F3EC]/70 text-sm leading-relaxed max-w-md mx-auto font-light">
              No momento, não temos eventos agendados ou publicados para esta categoria. Acompanhe nossas redes sociais para atualizações em tempo real.
            </p>
          </div>
        ) : (
          <>
            {/* Featured Event */}
            {featuredEvent && filter === 'Todos' && (
              <FeaturedEvent event={featuredEvent} />
            )}

            {/* Event Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.filter(e => e.id !== featuredEvent?.id || filter !== 'Todos').map(event => {
                return (
                  <div key={event.id} className="col-span-1">
                    <EventCard event={event} />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

const FeaturedEvent = ({ event }: { event: Event }) => {
  const isPast = new Date(event.start_date) < new Date();
  const imageUrl = event.timezone || '/gallery-founders.png';

  return (
    <div className="mb-16 bg-[#151f1f] border border-[#D8CBB3]/20 rounded-3xl overflow-hidden flex flex-col lg:flex-row group relative shadow-2xl">
      <div className="w-full lg:w-1/2 aspect-[4/3] lg:aspect-auto relative overflow-hidden bg-black/30">
        <img 
          src={imageUrl} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 filter contrast-[1.05]"
          style={getImageStyle(imageUrl)}
        />
      </div>

      <div className="p-8 lg:p-12 flex flex-col justify-center flex-1 relative z-10 bg-[#151f1f]">
        <div className="flex items-center gap-4 mb-6">
          <span className={`text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full ${isPast ? 'bg-white/10 text-[#F6F3EC]/70' : 'bg-[#D8CBB3]/20 text-[#D8CBB3]'}`}>
            {isPast ? 'Evento Realizado' : 'Próximo Evento'}
          </span>
          <span className="text-[#F6F3EC]/50 text-sm font-light">{event.category}</span>
        </div>
        
        <h3 className="text-3xl font-serif text-[#FFFDF8] mb-4 group-hover:text-[#D8CBB3] transition-colors">{event.title}</h3>
        <p className="text-[#F6F3EC]/70 mb-8 leading-relaxed max-w-xl font-light">{event.short_description}</p>
        
        <div className="flex flex-col sm:flex-row gap-6 mb-10 text-sm text-[#F6F3EC]/80 font-light">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#D8CBB3]" />
            <span>{new Date(event.start_date).toLocaleDateString('pt-BR')} {event.start_time && `às ${event.start_time}`}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D8CBB3]" />
            <span>{event.modality} • {event.location || 'Local a definir'}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-auto">
          {event.registration_url && !isPast ? (
            <a 
              href={event.registration_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-8 py-3.5 rounded-xl bg-[#D8CBB3] hover:bg-[#FFFDF8] text-[#101616] font-semibold text-sm transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              Inscrever-se no Evento
            </a>
          ) : (
            <span className="text-xs text-[#F6F3EC]/50 font-serif italic">Inscrições encerradas ou indisponíveis</span>
          )}
        </div>
      </div>
    </div>
  );
};

const EventCard = ({ event }: { event: Event }) => {
  const isPast = new Date(event.start_date) < new Date();
  const imageUrl = event.timezone || '/about-office.png';

  return (
    <div className="group flex flex-col bg-[#151f1f] border border-[#D8CBB3]/15 rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 h-full">
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-black/20">
        <img 
          src={imageUrl} 
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-10"
          style={getImageStyle(imageUrl)}
        />
        
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <span className={`text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full backdrop-blur-md ${isPast ? 'bg-black/50 text-[#F6F3EC]/90 border border-white/10' : 'bg-[#D8CBB3]/90 text-[#101616]'}`}>
            {isPast ? 'Realizado' : 'Próximo'}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1 relative z-10 bg-[#151f1f]">
        <span className="text-[#D8CBB3] text-xs font-semibold tracking-wide uppercase mb-3">{event.category}</span>
        <h3 className="text-xl font-serif text-[#FFFDF8] mb-3 group-hover:text-[#D8CBB3] transition-colors line-clamp-2">{event.title}</h3>
        <p className="text-[#F6F3EC]/70 text-sm font-light leading-relaxed mb-6 line-clamp-3">{event.short_description}</p>
        
        <div className="space-y-2 mt-auto pt-6 border-t border-white/10 text-sm text-[#F6F3EC]/70 font-light">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#D8CBB3]/70" />
            <span>{new Date(event.start_date).toLocaleDateString('pt-BR')} {event.start_time && `às ${event.start_time}`}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D8CBB3]/70" />
            <span className="truncate">{event.modality} • {event.location || 'Local a definir'}</span>
          </div>
        </div>

        {event.registration_url && !isPast && (
          <a 
            href={event.registration_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-4 text-center py-2.5 bg-[#D8CBB3]/10 hover:bg-[#D8CBB3] text-[#D8CBB3] hover:text-[#101616] rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border border-[#D8CBB3]/30"
          >
            Fazer Inscrição
          </a>
        )}
      </div>
    </div>
  );
};
