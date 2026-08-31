import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Phone, User } from 'lucide-react';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'O Escritório', href: '#escritorio' },
    { name: 'Áreas de Atuação', href: '#atuacao' },
    { name: 'Nossos Valores', href: '#valores' },
    { name: 'Missão e Visão', href: '#missao-visao' },
    { name: 'Equipe', href: '#equipe' },
    { name: 'Eventos', href: '#eventos' },
    { name: 'Conteúdos', href: '#conteudos' },
    { name: 'Contato', href: '#contato' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#101616]/90 backdrop-blur-md py-4 border-b border-[#D8CBB3]/15 shadow-2xl'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-[1920px] w-full mx-auto px-6 md:px-10 lg:px-12 xl:px-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="group shrink-0">
          <Logo />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-5 2xl:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-[#F6F3EC]/80 hover:text-[#D8CBB3] transition-colors tracking-wide relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#D8CBB3] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Button */}
        <div className="hidden xl:flex items-center justify-end gap-5 shrink-0">
          <a
            href="#contato"
            className="min-h-[44px] px-[22px] inline-flex items-center justify-center gap-3 border border-[#D8CBB3]/70 rounded-full text-[#D8CBB3] text-[13px] font-semibold whitespace-nowrap transition-all duration-300 hover:bg-[#D8CBB3] hover:text-[#263231] hover:-translate-y-0.5"
          >
            Fale conosco
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="/admin/login"
            className="inline-flex items-center gap-2 text-[#D8CBB3] text-[12px] font-medium opacity-80 hover:opacity-100 transition-opacity leading-tight"
          >
            <span className="grid place-items-center w-8 h-8 border border-[#D8CBB3]/35 rounded-full shrink-0">
              <User className="w-4 h-4" />
            </span>
            <span className="flex flex-col text-left">
              <span>Acesso</span>
              <span>Administrativo</span>
            </span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 text-[#F6F3EC] hover:text-[#D8CBB3] transition-colors rounded-lg bg-white/5 border border-white/10"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Full-screen Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-0 z-50 bg-[#101616]/98 backdrop-blur-xl flex flex-col justify-between p-8 xl:hidden animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <Logo />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-[#F6F3EC] hover:text-[#D8CBB3] rounded-full bg-white/5"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-6 py-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-2xl text-[#F6F3EC] hover:text-[#D8CBB3] transition-colors flex items-center justify-between group"
              >
                <span>{link.name}</span>
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-[#D8CBB3]" />
              </a>
            ))}
            
            <a
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="font-serif text-2xl text-[#F6F3EC] hover:text-[#D8CBB3] transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-[#D8CBB3]" />
                <span>Acesso Administrativo</span>
              </div>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-[#D8CBB3]" />
            </a>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-sm text-[#F6F3EC]/80">
              <Phone className="w-4 h-4 text-[#D8CBB3]" />
              <span>(81) 3071-8988</span>
            </div>
            <a
              href="#contato"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full min-h-[44px] bg-[#D8CBB3] text-[#101616] flex items-center justify-center gap-2 font-semibold rounded-full hover:bg-[#FFFDF8] transition-colors shadow-lg mt-2"
            >
              Fale conosco
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
