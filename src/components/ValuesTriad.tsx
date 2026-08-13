import React, { useState, useEffect } from 'react';
import { ShieldCheck, Eye, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { DetailModal } from './DetailModal';
import { ValueItem } from '../types';
import { Logo } from './Logo';
import { supabase } from '../lib/supabase';
import { getImageStyle } from '../lib/mediaHelper';

const STORAGE_KEY = 'albuquerque_guerra_site_values';

const initialDefaultValues: ValueItem[] = [
  {
    id: 'diligencia',
    number: '01',
    title: 'Diligência',
    subtitle: 'Acompanhamento sistemático e constante',
    summary: 'Acompanhamento sistemático e constante para que aquilo que está sob o nosso controle contribua para o andamento do processo.',
    fullContent: `Desde o início, sempre fizemos questão de sistematizar nossa abordagem no impulsionamento dos processos que nos são confiados. Não admitimos que as ações fiquem soltas, à disposição da boa vontade do Órgão Julgador. Afinal, se o interessado no andamento do feito é o nosso cliente, não poderíamos deixá-lo à mercê da justiça.

Quando a celeridade é o interesse, as diligências são realizadas semanalmente.

Em cada processo em que advogamos, do primeiro ao último dia de tramitação, realizamos diligências semanais em busca do próximo passo. A cada semana, em cada processo, promovemos um novo contato com os serventuários da justiça, auxiliares, chefes de secretaria, assessores e magistrados, sempre de forma sistematizada e mediante procedimentos padronizados.

Com isso, minimizam-se as chances de o processo ficar parado. Se muitas são as variáveis que podem interferir negativamente no andamento processual, como a sobrecarga da justiça ou a postura adotada pela parte contrária, nossa atuação não pode ser mais uma delas. Aquilo que está sob o nosso controle deve contribuir, nunca prejudicar.

Com essa postura, formamos o primeiro de nossos valores: a diligência. Conhecemos o valor do tempo e sabemos da importância de maximizar o seu aproveitamento.`,
    iconName: 'ShieldCheck',
    image: '/event-innovation.png',
  },
  {
    id: 'transparencia',
    number: '02',
    title: 'Transparência',
    subtitle: 'Informação constante para preservar a confiança',
    summary: 'Informação constante para preservar a confiança e permitir que o cliente acompanhe e planeje os próximos passos.',
    fullContent: `Sem exceção, cada cliente que nos demanda recebe mensalmente relatórios com os últimos andamentos e com as providências pendentes. A cada mês, o destinatário de nossos serviços é espontaneamente informado, ainda que não venha a perguntar, sobre aquilo que foi realizado e sobre aquilo que deverá ser feito.

Dessa forma, mantemos os nossos clientes sempre informados, evitando o elemento surpresa e viabilizando o planejamento de suas decisões.

Além disso, permanecemos à disposição para responder aos questionamentos e pedidos de informação apresentados.

Com essa postura, evidenciamos o segundo de nossos valores: a transparência.

Trata-se de um valor necessário para retribuir a confiança que nossos clientes depositam em nossos serviços. Afinal, enquanto a confiança está sempre presente no ato da contratação, sem transparência não pode haver confiança.

A diligência orienta o monitoramento e o impulsionamento semanal dos processos. A transparência, por sua vez, orienta a apresentação de relatórios mensais e garante disponibilidade constante para os destinatários de nossas atividades. Tudo em prol da retribuição e da preservação da confiança depositada na contratação de nossos serviços.`,
    iconName: 'Eye',
    image: '/gallery-founders.png',
  },
  {
    id: 'conhecimento',
    number: '03',
    title: 'Compromisso com o Conhecimento',
    subtitle: 'Aprendizado constante e atualização contínua',
    summary: 'O conhecimento jurídico está em constante transformação. Por isso, aprender, pesquisar e se atualizar fazem parte da nossa forma de atuar.',
    fullContent: `Nossa atividade está em constante transformação. Lidamos diariamente com as mais variadas normas produzidas, alteradas ou revogadas e com as mais diversas decisões proferidas ou reformadas pelos julgadores e tribunais.

Um entendimento que existia ontem pode já não existir hoje e talvez volte a existir amanhã. Existe uma lógica jurídica e uma ciência por trás dessa dinâmica, mas o conhecimento com o qual trabalhamos está em constante mutação.

Por isso, a vontade de aprender, pesquisar e se atualizar é uma característica necessária e sempre presente em nossa atuação. A sede pelo conhecimento, que constitui o terceiro de nossos valores, dirige e orienta nossa atividade, sempre com o propósito de construir e entregar a melhor solução ao destinatário de nossos serviços: o cliente.

Buscamos também acompanhar a evolução tecnológica e os impactos que ela produz em nossas atividades. Da padronização de procedimentos e sistemas operacionais ao uso adequado e supervisionado da inteligência artificial, nossas escolhas são sempre voltadas à entrega do melhor resultado.

O passar do tempo nunca poderá permitir que fiquemos satisfeitos com o conhecimento até então adquirido. Não admitimos a estagnação.

Com isso, completamos a tríade de valores que orienta nossa atuação: diligência, transparência e compromisso com o conhecimento.`,
    iconName: 'BookOpen',
    image: '/about-office.png',
  }
];

export const ValuesTriad: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedModalValue, setSelectedModalValue] = useState<ValueItem | null>(null);
  const [values, setValues] = useState<ValueItem[]>([]);

  useEffect(() => {
    const loadValues = async () => {
      try {
        const { data, error } = await supabase
          .from('site_values')
          .select('*')
          .order('id');
        
        if (error) throw error;

        if (data && data.length > 0) {
          // Map icon based on id
          const mapped = data.map((d: any) => ({
            ...d,
            number: d.id === 'diligencia' ? '01' : d.id === 'transparencia' ? '02' : '03'
          }));
          setValues(mapped);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
        } else {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            setValues(JSON.parse(stored));
          } else {
            setValues(initialDefaultValues);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDefaultValues));
          }
        }
      } catch (e) {
        console.warn('Failed to load values from supabase, loading local:', e);
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setValues(JSON.parse(stored));
        } else {
          setValues(initialDefaultValues);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDefaultValues));
        }
      }
    };
    loadValues();
  }, []);

  if (values.length === 0) return null;

  const currentVal = values[activeTab];

  return (
    <section id="valores" className="py-24 md:py-32 bg-[#151f1f] relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#D8CBB3]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#D8CBB3] font-serif text-sm tracking-widest block mb-3">
            04 / TRÍADE DE VALORES
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#FFFDF8] font-light mb-6 leading-tight">
            Transparência, diligência e sede pelo <span className="text-[#D8CBB3] italic">conhecimento.</span>
          </h2>
          <p className="text-[#F6F3EC]/80 text-base md:text-lg font-light leading-relaxed">
            Pautamos nossos procedimentos nesta tríade de valores por entendermos que, dessa forma, conseguimos entregar o melhor resultado.
          </p>
        </div>

        {/* Tab Buttons Selector */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-12">
          {values.map((val, idx) => (
            <button
              key={val.id}
              onClick={() => setActiveTab(idx)}
              className={`px-6 py-4 rounded-2xl text-sm md:text-base font-medium transition-all duration-300 flex items-center gap-3 border ${
                activeTab === idx
                  ? 'bg-[#D8CBB3] text-[#101616] border-[#D8CBB3] shadow-lg scale-105'
                  : 'bg-[#101616]/60 text-[#F6F3EC] border-[#D8CBB3]/20 hover:border-[#D8CBB3]/60'
              }`}
            >
              <span className={`text-xs px-2 py-0.5 rounded ${activeTab === idx ? 'bg-[#101616]/20 text-[#101616]' : 'bg-[#374544] text-[#D8CBB3]'}`}>
                {val.number}
              </span>
              <span>{val.title}</span>
            </button>
          ))}
        </div>

        {/* Active Value Showcase Card */}
        <div className="p-8 md:p-12 rounded-3xl bg-[#101616]/90 border border-[#D8CBB3]/30 shadow-2xl relative overflow-hidden animate-fadeIn">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-[#D8CBB3] pointer-events-none hidden md:block">
            <span className="font-serif text-9xl font-bold">{currentVal.number}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#374544] text-[#D8CBB3] text-xs font-semibold tracking-wider uppercase border border-[#D8CBB3]/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Valor Fundamental {currentVal.number}</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-serif text-[#FFFDF8]">
                {currentVal.title}
              </h3>

              <p className="text-xl font-serif italic text-[#D8CBB3]">
                "{currentVal.subtitle}"
              </p>

              <p className="text-[#F6F3EC]/90 text-lg font-light leading-relaxed">
                {currentVal.summary}
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setSelectedModalValue(currentVal)}
                  className="px-7 py-3.5 rounded-xl bg-[#D8CBB3] hover:bg-[#FFFDF8] text-[#101616] font-semibold text-sm transition-all shadow-lg flex items-center gap-3 group"
                >
                  <span>Conheça este valor em detalhes</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 flex items-center justify-center">
              <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden relative border border-[#D8CBB3]/30 shadow-inner">
                <img
                  src={currentVal.image}
                  alt={currentVal.title}
                  className="w-full h-full object-cover filter contrast-[1.05]"
                  style={getImageStyle(currentVal.image)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101616] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 text-center flex flex-col items-center justify-center">
                  <Logo variant="monogram" className="w-6 h-6 mb-1 opacity-70" />
                  <span className="text-[10px] text-[#D8CBB3] font-serif uppercase tracking-widest">
                    Albuquerque Guerra Advogados
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Modal for full value content */}
      <DetailModal
        isOpen={!!selectedModalValue}
        onClose={() => setSelectedModalValue(null)}
        title={selectedModalValue?.title || ''}
        subtitle={selectedModalValue?.subtitle}
        content={selectedModalValue?.fullContent || ''}
      />
    </section>
  );
};
