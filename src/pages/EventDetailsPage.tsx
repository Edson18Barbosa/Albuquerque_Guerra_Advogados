import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockEvents, mockMedia } from '../data/mockEvents';
import { ArrowLeft, Calendar, Clock, MapPin, Share2, Plus, Users, Map as MapIcon } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const EventDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const event = mockEvents.find(e => e.slug === slug);
  
  if (!event) {
    return (
      <div className="min-h-screen bg-[#101616] text-[#F6F3EC] flex flex-col items-center justify-center selection:bg-[#D8CBB3] selection:text-[#101616]">
        <h1 className="text-3xl font-serif text-[#FFFDF8] mb-4">Evento não encontrado</h1>
        <Link to="/" className="text-[#D8CBB3] hover:underline">Voltar para a página inicial</Link>
      </div>
    );
  }

  const media = mockMedia.find(m => m.event_id === event.id && m.media_type === 'main');
  const isPast = new Date(event.start_date) < new Date();

  return (
    <div className="min-h-screen bg-[#101616] text-[#F6F3EC] flex flex-col selection:bg-[#D8CBB3] selection:text-[#101616]">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          
          <Link to="/#eventos" className="inline-flex items-center gap-2 text-[#F6F3EC]/70 hover:text-[#D8CBB3] transition-colors mb-10 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Voltar aos eventos</span>
          </Link>

          {/* Main Media */}
          {media && (
            <div className="mb-12 rounded-3xl overflow-hidden bg-black/20 border border-white/5 relative">
              <img 
                src={media.file_url} 
                alt={media.alt_text || event.title}
                className="w-full max-h-[80vh] object-contain"
              />
            </div>
          )}

          {/* Header */}
          <div className="mb-12">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full ${isPast ? 'bg-white/10 text-[#F6F3EC]/70' : 'bg-[#D8CBB3]/20 text-[#D8CBB3]'}`}>
                {isPast ? 'Evento Realizado' : 'Próximo Evento'}
              </span>
              <span className="text-sm text-[#F6F3EC]/60">{event.category}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#FFFDF8] mb-8 leading-tight">
              {event.title}
            </h1>
            
            <div className="flex flex-wrap gap-x-8 gap-y-4 text-[#F6F3EC]/80 bg-[#151f1f] p-6 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D8CBB3]/10 flex items-center justify-center text-[#D8CBB3]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#F6F3EC]/50 uppercase tracking-wider mb-0.5">Data</p>
                  <p className="font-medium">{new Date(event.start_date).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              
              {event.start_time && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D8CBB3]/10 flex items-center justify-center text-[#D8CBB3]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#F6F3EC]/50 uppercase tracking-wider mb-0.5">Horário</p>
                    <p className="font-medium">{event.start_time} {event.end_time && `às ${event.end_time}`}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D8CBB3]/10 flex items-center justify-center text-[#D8CBB3]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#F6F3EC]/50 uppercase tracking-wider mb-0.5">Local</p>
                  <p className="font-medium">{event.modality} • {event.location || 'A definir'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <div className="prose prose-invert prose-p:text-[#F6F3EC]/80 prose-headings:text-[#FFFDF8] prose-headings:font-serif">
                <h2 className="text-2xl font-serif text-[#FFFDF8] mb-4">Sobre o evento</h2>
                <p className="text-lg leading-relaxed">{event.full_description || event.short_description}</p>
              </div>

              {event.address && (
                <div>
                  <h3 className="text-xl font-serif text-[#FFFDF8] mb-4 flex items-center gap-2">
                    <MapIcon className="w-5 h-5 text-[#D8CBB3]" /> Endereço
                  </h3>
                  <p className="text-[#F6F3EC]/80">{event.address}</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                {!isPast && event.registration_url && (
                  <a 
                    href={event.registration_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full py-4 bg-[#D8CBB3] text-[#101616] font-semibold rounded-xl hover:bg-[#FFFDF8] transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    Fazer Inscrição
                  </a>
                )}
                
                <div className="flex gap-4">
                  <button className="flex-1 py-3 border border-[#D8CBB3]/30 rounded-xl text-[#D8CBB3] hover:bg-[#D8CBB3]/10 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                    <Plus className="w-4 h-4" />
                    Agenda
                  </button>
                  <button className="flex-1 py-3 border border-[#D8CBB3]/30 rounded-xl text-[#D8CBB3] hover:bg-[#D8CBB3]/10 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                    <Share2 className="w-4 h-4" />
                    Compartilhar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};
