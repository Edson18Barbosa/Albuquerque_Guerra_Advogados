import React, { useState, useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getImageStyle } from '../lib/mediaHelper';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  span: string;
}

const STORAGE_KEY = 'albuquerque_guerra_site_gallery';

const initialDefaultGallery: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Renata Albuquerque e João Guerra • Sócios Fundadores',
    category: 'Liderança',
    image: '/gallery-founders.png',
    span: 'col-span-1 md:col-span-2 row-span-2',
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

export const Gallery: React.FC = () => {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const { data, error } = await supabase
          .from('site_gallery')
          .select('*')
          .order('id');
        
        if (error) throw error;

        if (data && data.length > 0) {
          setGalleryImages(data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } else {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            setGalleryImages(JSON.parse(stored));
          } else {
            setGalleryImages(initialDefaultGallery);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDefaultGallery));
          }
        }
      } catch (e) {
        console.warn('Failed to load gallery from supabase, loading local:', e);
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setGalleryImages(JSON.parse(stored));
        } else {
          setGalleryImages(initialDefaultGallery);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDefaultGallery));
        }
      }
    };
    loadGallery();
  }, []);

  if (galleryImages.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-[#151f1f] relative overflow-hidden">
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#D8CBB3]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[#D8CBB3]/20">
          <div>
            <span className="text-[#D8CBB3] font-serif text-sm tracking-widest block mb-3">
              08 / GALERIA INSTITUCIONAL
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#FFFDF8] font-light max-w-2xl leading-tight">
              Excelência em cada <span className="text-[#D8CBB3] italic">detalhe.</span>
            </h2>
          </div>
          <p className="text-[#F6F3EC]/70 text-sm md:text-base max-w-md mt-6 md:mt-0 font-light leading-relaxed">
            Conheça o ambiente de trabalho e a dedicação da nossa equipe na defesa dos interesses de nossos clientes.
          </p>
        </div>

        {/* Asymmetric Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
          {galleryImages.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item.image)}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer border border-[#D8CBB3]/20 shadow-xl ${item.span}`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter contrast-[1.05]"
                style={getImageStyle(item.image)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101616]/90 via-[#101616]/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#101616]/70 backdrop-blur-md border border-[#D8CBB3]/30 flex items-center justify-center text-[#D8CBB3] opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-5 h-5" />
              </div>

              <div className="absolute bottom-6 left-6 right-6 z-20">
                <span className="text-[11px] uppercase tracking-widest text-[#D8CBB3] font-semibold block mb-1">
                  {item.category}
                </span>
                <h3 className="text-xl font-serif text-[#FFFDF8]">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox / Zoom Modal */}
      {activeImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={activeImage}
            alt="Zoomed"
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl border border-white/10"
            style={getImageStyle(activeImage)}
          />
        </div>
      )}
    </section>
  );
};
