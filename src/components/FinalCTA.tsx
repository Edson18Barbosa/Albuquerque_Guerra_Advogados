import React from 'react';
import { ArrowRight, Mail, Phone } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-[#101616] relative overflow-hidden text-center">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#151f1f] via-[#101616] to-[#151f1f] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-[#374544]/30 rounded-full blur-3xl pointer-events-none" />

      {/* Giant 3D Monogram Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <span className="font-serif text-[18vw] font-bold text-[#D8CBB3] tracking-tighter">AG</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
        
        <span className="text-[#D8CBB3] font-serif text-sm tracking-widest block mb-4">
          09 / INICIE SUA JORNADA JURÍDICA
        </span>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif text-[#FFFDF8] font-light leading-tight mb-6">
          Decisões mais seguras começam com orientação jurídica <span className="text-[#D8CBB3] italic">estratégica.</span>
        </h2>

        <p className="text-[#F6F3EC]/80 text-lg md:text-xl font-light max-w-2xl mx-auto mb-12 leading-relaxed">
          Converse com nossa equipe e apresente as necessidades da sua empresa, organização ou relação jurídica.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#contato"
            className="px-8 py-4 rounded-xl bg-[#D8CBB3] hover:bg-[#FFFDF8] text-[#101616] font-semibold text-base transition-all shadow-xl flex items-center gap-3 group"
          >
            <span>Fale com o escritório</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="mailto:contato@albuquerqueguerra.adv.br"
            className="px-8 py-4 rounded-xl bg-[#374544]/60 hover:bg-[#374544] text-[#F6F3EC] font-medium text-base transition-all border border-[#D8CBB3]/30 flex items-center gap-3"
          >
            <Mail className="w-5 h-5 text-[#D8CBB3]" />
            <span>Enviar um e-mail</span>
          </a>

          <a
            href="tel:8130718988"
            className="px-8 py-4 rounded-xl bg-transparent hover:bg-white/5 text-[#D8CBB3] font-medium text-base transition-all border border-white/10 flex items-center gap-3"
          >
            <Phone className="w-5 h-5" />
            <span>Ligar (81) 3071-8988</span>
          </a>
        </div>

      </div>
    </section>
  );
};
