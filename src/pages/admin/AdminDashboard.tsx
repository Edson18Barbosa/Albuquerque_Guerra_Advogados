import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Logo } from '../../components/Logo';
import { 
  LayoutDashboard, Palette, Home, Building2, Briefcase, 
  Heart, Target, Workflow, Users, Image as ImageIcon, 
  Phone, Globe, FolderOpen, Settings, LogOut, Menu, X, Calendar as CalendarIcon, UserCheck
} from 'lucide-react';
import { AdminEvents } from './AdminEvents';
import { AdminEventForm } from './AdminEventForm';
import { AdminMedia } from './AdminMedia';
import { AdminTeam } from './AdminTeam';
import { AdminBrand } from './AdminBrand';
import { AdminHome } from './AdminHome';
import { AdminAbout } from './AdminAbout';
import { AdminPractice } from './AdminPractice';
import { AdminValues } from './AdminValues';
import { AdminMission } from './AdminMission';
import { AdminWorkflow } from './AdminWorkflow';
import { AdminGallery } from './AdminGallery';
import { AdminContact } from './AdminContact';
import { AdminSEO } from './AdminSEO';
import { AdminSettings } from './AdminSettings';
import { AdminUsers } from './AdminUsers';

export const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'Visão geral', path: '/admin', icon: LayoutDashboard },
    { name: 'Identidade visual', path: '/admin/brand', icon: Palette },
    { name: 'Página inicial', path: '/admin/home', icon: Home },
    { name: 'O escritório', path: '/admin/about', icon: Building2 },
    { name: 'Áreas de atuação', path: '/admin/practice', icon: Briefcase },
    { name: 'Valores', path: '/admin/values', icon: Heart },
    { name: 'Missão e Visão', path: '/admin/mission', icon: Target },
    { name: 'Forma de atuação', path: '/admin/workflow', icon: Workflow },
    { name: 'Equipe', path: '/admin/team', icon: Users },
    { name: 'Eventos', path: '/admin/events', icon: CalendarIcon },
    { name: 'Galeria', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Contato', path: '/admin/contact', icon: Phone },
    { name: 'SEO e redes sociais', path: '/admin/seo', icon: Globe },
    { name: 'Biblioteca de mídia', path: '/admin/media', icon: FolderOpen },
    { name: 'Gestão de usuários', path: '/admin/users', icon: UserCheck },
    { name: 'Configurações', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#101616] text-[#F6F3EC] flex selection:bg-[#D8CBB3] selection:text-[#101616]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#151f1f] border-r border-[#D8CBB3]/15 z-50 transform transition-transform duration-300 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Logo className="scale-75 origin-left" />
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[#F6F3EC]/70 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-[#D8CBB3]/10 text-[#D8CBB3] font-medium' 
                    : 'text-[#F6F3EC]/70 hover:bg-white/5 hover:text-[#FFFDF8]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Sair do painel</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-[#151f1f]/80 backdrop-blur-md border-b border-[#D8CBB3]/15 flex items-center justify-between px-6 lg:px-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-[#F6F3EC]/70 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-serif text-[#FFFDF8] hidden sm:block">Painel Administrativo</h2>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="/" 
              target="_blank"
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-colors"
            >
              Visualizar site
            </a>
            <div className="w-10 h-10 rounded-full bg-[#D8CBB3] text-[#101616] flex items-center justify-center font-bold text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={
                <div className="space-y-8 animate-fadeIn">
                  <div>
                    <h1 className="text-3xl font-serif text-[#FFFDF8] mb-2">Bem-vindo, Administrador</h1>
                    <p className="text-[#F6F3EC]/70">Gerencie todo o conteúdo do seu site de forma simples e segura.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DashboardCard title="Status do Site" value="Online" icon={Globe} highlight />
                    <DashboardCard title="Profissionais" value="3" icon={Users} />
                    <DashboardCard title="Áreas de Atuação" value="4" icon={Briefcase} />
                    <DashboardCard title="Imagens na Galeria" value="4" icon={ImageIcon} />
                  </div>

                  <div className="p-8 border border-[#D8CBB3]/20 rounded-2xl bg-white/5 mt-8">
                    <h3 className="text-xl font-serif text-[#FFFDF8] mb-4">Módulos do Sistema</h3>
                    <p className="text-[#F6F3EC]/70 text-sm leading-relaxed mb-6">
                      A interface inicial foi criada. Na próxima etapa, integraremos o painel com o banco de dados (Supabase/Firebase) 
                      para permitir o armazenamento real das informações, o upload de mídias e a edição de todas as seções.
                    </p>
                    <Link to="/admin/home" className="px-6 py-3 bg-[#D8CBB3] text-[#101616] font-semibold rounded-xl hover:bg-[#FFFDF8] transition-colors inline-block">
                      Editar página inicial
                    </Link>
                  </div>
                </div>
              } />
              
              <Route path="/events" element={<AdminEvents />} />
              <Route path="/events/new" element={<AdminEventForm />} />
              <Route path="/media" element={<AdminMedia />} />
              <Route path="/team" element={<AdminTeam />} />
              <Route path="/brand" element={<AdminBrand />} />
              <Route path="/home" element={<AdminHome />} />
              <Route path="/about" element={<AdminAbout />} />
              <Route path="/practice" element={<AdminPractice />} />
              <Route path="/values" element={<AdminValues />} />
              <Route path="/mission" element={<AdminMission />} />
              <Route path="/workflow" element={<AdminWorkflow />} />
              <Route path="/gallery" element={<AdminGallery />} />
              <Route path="/contact" element={<AdminContact />} />
              <Route path="/seo" element={<AdminSEO />} />
              <Route path="/users" element={<AdminUsers />} />
              <Route path="/settings" element={<AdminSettings />} />

              <Route path="*" element={
                <div className="flex flex-col items-center justify-center h-[60vh] text-center border border-white/10 rounded-3xl bg-white/5">
                  <Settings className="w-16 h-16 text-[#D8CBB3]/40 mb-4 animate-[spin_3s_linear_infinite]" />
                  <h2 className="text-2xl font-serif text-[#FFFDF8] mb-2">Módulo em construção</h2>
                  <p className="text-[#F6F3EC]/70 max-w-md mx-auto">
                    A interface administrativa está sendo preparada. A conexão com o banco de dados será realizada na próxima etapa.
                  </p>
                </div>
              } />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
};

const DashboardCard = ({ title, value, icon: Icon, highlight = false }: any) => (
  <div className={`p-6 rounded-2xl border ${highlight ? 'bg-[#D8CBB3]/10 border-[#D8CBB3]/30' : 'bg-[#151f1f] border-white/10'} flex items-center justify-between`}>
    <div>
      <p className="text-sm text-[#F6F3EC]/70 mb-1">{title}</p>
      <p className={`text-2xl font-semibold ${highlight ? 'text-[#D8CBB3]' : 'text-[#FFFDF8]'}`}>{value}</p>
    </div>
    <div className={`p-3 rounded-full ${highlight ? 'bg-[#D8CBB3]/20 text-[#D8CBB3]' : 'bg-white/5 text-[#F6F3EC]/50'}`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);
