import React from 'react';
import { X } from 'lucide-react';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  content: string;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  content,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#101616] border border-[#D8CBB3]/30 rounded-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[#F6F3EC]/70 hover:text-[#D8CBB3] transition-colors rounded-full hover:bg-white/5"
          aria-label="Fechar"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <span className="text-[#D8CBB3] text-xs font-semibold tracking-widest uppercase">
            Albuquerque Guerra Advogados
          </span>
          <h3 className="text-2xl md:text-3xl font-serif text-[#FFFDF8] mt-2">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[#F6F3EC]/70 text-sm italic mt-1 font-serif">
              {subtitle}
            </p>
          )}
        </div>

        <div className="w-16 h-[1px] bg-[#D8CBB3]/40 mb-6" />

        <div className="text-[#F6F3EC]/90 text-base md:text-lg leading-relaxed whitespace-pre-line font-light">
          {content}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#374544] hover:bg-[#4D5D5D] text-[#F6F3EC] text-sm font-medium rounded-lg transition-colors border border-[#D8CBB3]/20"
          >
            Fechar janela
          </button>
        </div>
      </div>
    </div>
  );
};
