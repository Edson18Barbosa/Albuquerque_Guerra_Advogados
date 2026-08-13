import React, { useState, useEffect } from 'react';
import { UserPlus, Edit, Trash2, Eye, EyeOff, X, CheckCircle2, AlertTriangle, UserCheck } from 'lucide-react';
import { AdminUser, getAdminUsers, saveAdminUser, deleteAdminUser } from '../../lib/usersHelper';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Editor' as 'Administrador' | 'Editor',
    status: 'Ativo' as 'Ativo' | 'Inativo'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | null, text: string }>({ type: null, text: '' });
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAdd = () => {
    setSelectedUser(null);
    setForm({ name: '', email: '', password: '', role: 'Editor', status: 'Ativo' });
    setShowPassword(false);
    setIsOpen(true);
  };

  const handleOpenEdit = (user: AdminUser) => {
    setSelectedUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: user.password || '',
      role: user.role,
      status: user.status
    });
    setShowPassword(false);
    setIsOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || (!selectedUser && !form.password)) {
      setStatusMsg({ type: 'error', text: 'Por favor, preencha todos os campos obrigatórios.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: AdminUser = {
        id: selectedUser ? selectedUser.id : `user-${Date.now()}`,
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        status: form.status,
        created_at: selectedUser ? selectedUser.created_at : new Date().toISOString()
      };

      await saveAdminUser(payload);
      setStatusMsg({ type: 'success', text: 'Usuário administrativo salvo com sucesso!' });
      setIsOpen(false);
      fetchUsers();
      setTimeout(() => setStatusMsg({ type: null, text: '' }), 5000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: `Erro ao salvar: ${err.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (users.length <= 1) {
      alert('Não é possível excluir o único usuário administrativo ativo.');
      return;
    }
    if (!confirm(`Deseja realmente excluir o acesso do usuário "${name}"?`)) return;

    try {
      await deleteAdminUser(id);
      setStatusMsg({ type: 'success', text: 'Acesso do usuário excluído.' });
      fetchUsers();
      setTimeout(() => setStatusMsg({ type: null, text: '' }), 4000);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: `Erro: ${err.message}` });
    }
  };

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
          <h1 className="text-3xl font-serif text-[#FFFDF8] mb-2 font-light">Usuários Administrativos</h1>
          <p className="text-[#F6F3EC]/70">Gerencie quem tem autorização para editar o conteúdo do site corporativo.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-6 py-3 bg-[#D8CBB3] text-[#101616] font-semibold rounded-xl hover:bg-[#FFFDF8] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shrink-0"
        >
          <UserPlus className="w-5 h-5" />
          Novo Usuário
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-[#151f1f] border border-white/10 rounded-2xl overflow-hidden shadow-xl max-w-5xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-[#F6F3EC]/50 font-light">Carregando usuários...</div>
          ) : users.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="p-4 text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider">Nome</th>
                  <th className="p-4 text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider">E-mail</th>
                  <th className="p-4 text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider">Nível de Acesso</th>
                  <th className="p-4 text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#D8CBB3]/10 border border-[#D8CBB3]/30 flex items-center justify-center text-[#D8CBB3] font-bold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-[#FFFDF8]">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-[#F6F3EC]/80 font-light">
                      {user.email}
                    </td>
                    <td className="p-4 text-sm text-[#F6F3EC]/80 font-light">
                      {user.role}
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                        user.status === 'Ativo' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEdit(user)}
                          className="p-2 text-[#F6F3EC]/50 hover:text-[#D8CBB3] hover:bg-[#D8CBB3]/10 rounded-lg transition-colors" 
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id, user.name)}
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
            <div className="text-center py-12 text-[#F6F3EC]/50 font-light">Nenhum usuário cadastrado.</div>
          )}
        </div>
      </div>

      {/* modal overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#151f1f] border border-[#D8CBB3]/30 rounded-3xl max-w-md w-full flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#101616]">
              <h2 className="text-lg font-serif text-[#FFFDF8]">
                {selectedUser ? 'Editar Usuário Admin' : 'Adicionar Usuário Admin'}
              </h2>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Nome Completo</label>
                <input 
                  type="text" 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  required 
                  placeholder="Nome do operador"
                  className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">E-mail de Login</label>
                <input 
                  type="email" 
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  required 
                  placeholder="operador@albuquerqueguerra.com"
                  className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">
                  Senha {selectedUser && '(Deixe em branco para não alterar)'}
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={form.password} 
                    onChange={(e) => setForm({ ...form, password: e.target.value })} 
                    required={!selectedUser} 
                    placeholder="••••••••"
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 pl-3 pr-10 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Nível de Acesso</label>
                  <select 
                    value={form.role} 
                    onChange={(e) => setForm({ ...form, role: e.target.value as 'Administrador' | 'Editor' })} 
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Editor">Editor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#F6F3EC]/70 uppercase tracking-wider mb-1.5">Status</label>
                  <select 
                    value={form.status} 
                    onChange={(e) => setForm({ ...form, status: e.target.value as 'Ativo' | 'Inativo' })} 
                    className="w-full bg-[#101616] border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#D8CBB3]/50 text-[#F6F3EC]"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-transparent hover:bg-white/5 border border-white/10 rounded-xl text-xs font-semibold">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-[#D8CBB3] hover:bg-[#FFFDF8] text-[#101616] font-semibold rounded-xl text-xs transition-all">
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
