import React, { useState, useEffect } from 'react';
import { Logo } from '../../components/Logo';
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from 'lucide-react';
import { getAdminUsers, AdminUser } from '../../lib/usersHelper';

export const AdminLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [usersList, setUsersList] = useState<AdminUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const list = await getAdminUsers();
        setUsersList(list);
      } catch (e) {
        console.warn('Error loading users on login mount:', e);
      }
    };
    fetchUsers();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check if there is an active user matching email and password
    const matched = usersList.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (matched) {
      if (matched.status === 'Inativo') {
        setError('Este usuário administrativo está inativo.');
        return;
      }
      window.location.href = '/admin';
    } else {
      setError('E-mail ou senha incorretos. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-[#101616] text-[#F6F3EC] flex flex-col items-center justify-center p-6 selection:bg-[#D8CBB3] selection:text-[#101616]">
      <div className="absolute top-8 left-8">
        <a href="/" className="flex items-center gap-2 text-[#F6F3EC]/70 hover:text-[#D8CBB3] transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar ao site</span>
        </a>
      </div>

      <div className="w-full max-w-md bg-[#151f1f] border border-[#D8CBB3]/20 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D8CBB3] to-transparent opacity-30" />
        
        <div className="flex justify-center mb-10">
          <Logo className="scale-90" />
        </div>

        <h1 className="text-2xl font-serif text-center mb-8 text-[#FFFDF8]">Acesso Administrativo</h1>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-[#F6F3EC]/80 ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#F6F3EC]/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#101616] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-[#F6F3EC] focus:outline-none focus:border-[#D8CBB3]/50 transition-colors"
                placeholder="admin@albuquerqueguerra.com.br"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm text-[#F6F3EC]/80">Senha</label>
              <button type="button" className="text-xs text-[#D8CBB3] hover:underline">
                Recuperar senha
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#F6F3EC]/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#101616] border border-white/10 rounded-xl py-3 pl-12 pr-12 text-[#F6F3EC] focus:outline-none focus:border-[#D8CBB3]/50 transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F6F3EC]/40 hover:text-[#D8CBB3] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-1">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 rounded border-white/20 bg-[#101616] accent-[#D8CBB3]"
            />
            <label htmlFor="remember" className="text-sm text-[#F6F3EC]/80">
              Manter conectado
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#D8CBB3] text-[#101616] font-semibold rounded-xl hover:bg-[#FFFDF8] transition-colors shadow-lg mt-4"
          >
            Entrar no painel
          </button>
        </form>
      </div>
    </div>
  );
};
