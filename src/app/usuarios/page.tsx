'use client';

import { useState, useEffect } from 'react';
import { UserPlus, Search, Mail, Fingerprint, Key, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { usuarioService } from '@/services/usuario.service';
import { Usuario, CriarUsuarioDto } from '@/types/usuario';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState<CriarUsuarioDto>({
    nomeCompleto: '',
    email: '',
    cpf: '',
    senha: ''
  });

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      setIsLoading(true);
      const data = await usuarioService.listarTodos();
      setUsuarios(data);
    } catch (error) {
      toast.error('Erro ao carregar a lista de usuários.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCriarUsuario(e: React.FormEvent) {
    e.preventDefault();
    try {
      await usuarioService.criar(novoUsuario);
      toast.success('Usuário cadastrado com sucesso!');
      setShowForm(false);
      setNovoUsuario({ nomeCompleto: '', email: '', cpf: '', senha: '' });
      carregarUsuarios(); // Atualiza a lista
    } catch (error: any) {
      const mensagem = error.response?.data?.error?.message || 'Erro ao cadastrar usuário.';
      toast.error(Array.isArray(mensagem) ? mensagem[0] : mensagem);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900">Usuários</h2>
          <p className="text-zinc-500">Gerencie as pessoas que têm acesso ao sistema.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-zinc-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-zinc-800 transition-colors"
        >
          <UserPlus size={20} />
          {showForm ? 'Cancelar' : 'Novo Usuário'}
        </button>
      </div>

      {/* Formulário de Cadastro */}
      {showForm && (
        <div className="bg-white p-8 rounded-xl border border-zinc-200 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <UserPlus className="text-blue-600" />
            Cadastrar Novo Usuário
          </h3>
          <form onSubmit={handleCriarUsuario} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">Nome Completo</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-zinc-400" size={18} />
                <input 
                  required
                  type="text"
                  placeholder="Ex: João da Silva"
                  className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={novoUsuario.nomeCompleto}
                  onChange={e => setNovoUsuario({...novoUsuario, nomeCompleto: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-zinc-400" size={18} />
                <input 
                  required
                  type="email"
                  placeholder="joao@email.com"
                  className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={novoUsuario.email}
                  onChange={e => setNovoUsuario({...novoUsuario, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">CPF (apenas números)</label>
              <div className="relative">
                <Fingerprint className="absolute left-3 top-3 text-zinc-400" size={18} />
                <input 
                  required
                  maxLength={11}
                  type="text"
                  placeholder="12345678901"
                  className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={novoUsuario.cpf}
                  onChange={e => setNovoUsuario({...novoUsuario, cpf: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">Senha</label>
              <div className="relative">
                <Key className="absolute left-3 top-3 text-zinc-400" size={18} />
                <input 
                  required
                  minLength={6}
                  type="password"
                  placeholder="••••••"
                  className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={novoUsuario.senha}
                  onChange={e => setNovoUsuario({...novoUsuario, senha: e.target.value})}
                />
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button 
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-100"
              >
                Salvar Cadastro
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabela de Usuários */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="px-6 py-4 text-sm font-bold text-zinc-600">Nome</th>
              <th className="px-6 py-4 text-sm font-bold text-zinc-600">E-mail</th>
              <th className="px-6 py-4 text-sm font-bold text-zinc-600">CPF</th>
              <th className="px-6 py-4 text-sm font-bold text-zinc-600">Cadastro</th>
              <th className="px-6 py-4 text-sm font-bold text-zinc-600 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                  Carregando usuários...
                </td>
              </tr>
            ) : usuarios.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-zinc-900">{usuario.nomeCompleto}</td>
                  <td className="px-6 py-4 text-zinc-600 text-sm">{usuario.email}</td>
                  <td className="px-6 py-4 text-zinc-600 text-sm">{usuario.cpf}</td>
                  <td className="px-6 py-4 text-zinc-500 text-xs">
                    {new Date(usuario.criadoEm).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-zinc-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
