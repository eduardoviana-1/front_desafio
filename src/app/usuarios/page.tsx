'use client';

import { useState, useEffect } from 'react';
import { UserPlus, Search, Mail, Fingerprint, Key, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { usuarioService } from '@/services/usuario.service';
import { Usuario, CriarUsuarioDto } from '@/types/usuario';
import { Button, Input, Card, PageHeader } from '@/components/ui';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  async function handleDeletarUsuario(id: string) {
    if (!confirm('Tem certeza que deseja remover este usuário?')) return;
    
    try {
      await usuarioService.remover(id);
      toast.success('Usuário removido com sucesso!');
      carregarUsuarios();
    } catch (error) {
      toast.error('Erro ao remover usuário. Verifique se ele possui retiradas vinculadas.');
    }
  }

  async function handleCriarUsuario(e: React.FormEvent) {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await usuarioService.criar(novoUsuario);
      toast.success('Usuário cadastrado com sucesso!');
      setShowForm(false);
      setNovoUsuario({ nomeCompleto: '', email: '', cpf: '', senha: '' });
      carregarUsuarios();
    } catch (error: any) {
      const mensagem = error.response?.data?.error?.message || 'Erro ao cadastrar usuário.';
      toast.error(Array.isArray(mensagem) ? mensagem[0] : mensagem);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col h-full -m-8 bg-zinc-100 min-h-screen">
      <div className="bg-white border-b border-zinc-100">
        <PageHeader 
          title="Usuários"
          description="Gerenciamento de colaboradores e acessos do sistema."
          action={
            <Button 
              variant={showForm ? 'white' : 'primary'}
              icon={<UserPlus size={20} />}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancelar' : 'Novo Usuário'}
            </Button>
          }
        />
      </div>

      <div className="max-w-5xl mx-auto w-full px-12 py-10 space-y-8 pb-12">
        {showForm && (
          <Card 
            title="Cadastrar Novo Usuário"
            icon={<UserPlus className="text-emerald-700" size={24} />}
          >
            <form onSubmit={handleCriarUsuario} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Nome Completo"
                placeholder="Nome"
                icon={<Search size={18} />}
                required
                value={novoUsuario.nomeCompleto}
                onChange={e => setNovoUsuario({...novoUsuario, nomeCompleto: e.target.value})}
              />
              
              <Input 
                label="E-mail Corporativo"
                type="email"
                placeholder="E-mail"
                icon={<Mail size={18} />}
                required
                value={novoUsuario.email}
                onChange={e => setNovoUsuario({...novoUsuario, email: e.target.value})}
              />

              <Input 
                label="CPF (apenas números)"
                maxLength={11}
                placeholder="CPF"
                icon={<Fingerprint size={18} />}
                required
                value={novoUsuario.cpf}
                onChange={e => setNovoUsuario({...novoUsuario, cpf: e.target.value})}
              />

              <Input 
                label="Senha de Acesso"
                type="password"
                placeholder="••••••"
                icon={<Key size={18} />}
                required
                minLength={6}
                value={novoUsuario.senha}
                onChange={e => setNovoUsuario({...novoUsuario, senha: e.target.value})}
              />

              <div className="md:col-span-2 flex justify-end mt-4">
                <Button type="submit" isLoading={isSubmitting}>
                  Confirmar e Salvar
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-zinc-900">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-200 text-zinc-900">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500">Colaborador</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500">Identificação (CPF)</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-zinc-400 italic">Carregando...</td>
                </tr>
              ) : usuarios.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-zinc-400 italic">Nenhum registro encontrado.</td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-900">{usuario.nomeCompleto}</span>
                        <span className="text-xs text-zinc-500 font-medium">{usuario.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600 font-mono text-sm">{usuario.cpf}</td>
                    <td className="px-6 py-4 text-center">
                      <Button 
                        variant="danger" 
                        icon={<Trash2 size={18} />}
                        onClick={() => handleDeletarUsuario(usuario.id)}
                        className="px-2 py-2 shadow-none mx-auto"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
