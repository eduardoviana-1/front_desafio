'use client';

import { useState, useEffect } from 'react';
import { ArrowLeftRight, User, Package, Hash, History, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { estoqueService } from '@/services/estoque.service';
import { usuarioService } from '@/services/usuario.service';
import { equipamentoService } from '@/services/equipamento.service';
import { Retirada, RealizarRetiradaDto } from '@/types/retirada';
import { Usuario } from '@/types/usuario';
import { Equipamento } from '@/types/equipamento';
import { Button, Input, Select, Card, PageHeader } from '@/components/ui';

export default function RetiradasPage() {
  const [retiradas, setRetiradas] = useState<Retirada[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [novaRetirada, setNovaRetirada] = useState<RealizarRetiradaDto>({
    usuarioId: '',
    equipamentoId: '',
    quantidade: 1
  });

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setIsLoading(true);
      const [resRetiradas, resUsuarios, resEquipamentos] = await Promise.all([
        estoqueService.listarRetiradas(),
        usuarioService.listarTodos(),
        equipamentoService.listarTodos()
      ]);
      
      setRetiradas(resRetiradas);
      setUsuarios(resUsuarios);
      setEquipamentos(resEquipamentos);
    } catch (error) {
      toast.error('Erro ao carregar dados de retiradas.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRealizarRetirada(e: React.FormEvent) {
    e.preventDefault();
    
    const equipamentoSelecionado = equipamentos.find(e => e.id === novaRetirada.equipamentoId);
    if (equipamentoSelecionado && equipamentoSelecionado.quantidadeEstoque < novaRetirada.quantidade) {
      toast.error(`Estoque insuficiente! Saldo atual: ${equipamentoSelecionado.quantidadeEstoque}`);
      return;
    }

    try {
      setIsSubmitting(true);
      await estoqueService.realizarRetirada(novaRetirada);
      toast.success('Retirada realizada com sucesso!');
      setShowForm(false);
      setNovaRetirada({ usuarioId: '', equipamentoId: '', quantidade: 1 });
      carregarDados();
    } catch (error: any) {
      const mensagem = error.response?.data?.error?.message || 'Erro ao realizar retirada.';
      toast.error(Array.isArray(mensagem) ? mensagem[0] : mensagem);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader 
        title="Retiradas"
        description="Registro e histórico de movimentações."
        action={
          <Button 
            variant="white"
            icon={<PlusCircle size={20} />}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancelar' : 'Nova Retirada'}
          </Button>
        }
      />

      <div className="max-w-6xl mx-auto w-full px-8 space-y-8 pb-12">
        {showForm && (
          <Card 
            variant="overlap"
            title="Registrar Nova Retirada"
            icon={<ArrowLeftRight className="text-orange-600" size={24} />}
          >
            <form onSubmit={handleRealizarRetirada} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select 
                label="Responsável"
                icon={<User size={18} />}
                required
                value={novaRetirada.usuarioId}
                onChange={e => setNovaRetirada({...novaRetirada, usuarioId: e.target.value})}
              >
                <option value="">Selecione...</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>{u.nomeCompleto}</option>
                ))}
              </Select>

              <Select 
                label="Equipamento"
                icon={<Package size={18} />}
                required
                value={novaRetirada.equipamentoId}
                onChange={e => setNovaRetirada({...novaRetirada, equipamentoId: e.target.value})}
              >
                <option value="">Selecione...</option>
                {equipamentos.map(eq => (
                  <option key={eq.id} value={eq.id} disabled={eq.quantidadeEstoque <= 0}>
                    {eq.nome} ({eq.quantidadeEstoque} disp.)
                  </option>
                ))}
              </Select>

              <Input 
                label="Qtd. Retirada"
                type="number"
                min="1"
                icon={<Hash size={18} />}
                required
                value={novaRetirada.quantidade}
                onChange={e => setNovaRetirada({...novaRetirada, quantidade: Number(e.target.value)})}
              />

              <div className="md:col-span-3 flex justify-end mt-4">
                <Button variant="secondary" type="submit" isLoading={isSubmitting}>
                  Confirmar Retirada
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className={`bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden ${!showForm ? '-mt-8 shadow-xl' : ''}`}>
          <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50 flex items-center gap-2">
            <History size={18} className="text-zinc-500" />
            <h3 className="text-sm font-bold text-zinc-700 uppercase tracking-wider">Histórico de Transações</h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-zinc-200">
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase">Colaborador</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase">Item</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase">Qtd.</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase text-right">Realizado em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-400 italic text-sm">Carregando histórico...</td>
                </tr>
              ) : retiradas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-400 italic text-sm">Nenhuma movimentação registrada.</td>
                </tr>
              ) : (
                retiradas.map((retirada) => (
                  <tr key={retirada.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-zinc-900 text-sm">
                      {retirada.usuario?.nomeCompleto || 'Usuário Removido'}
                    </td>
                    <td className="px-6 py-4 text-zinc-600 text-sm italic">
                      {retirada.equipamento?.nome || 'Equipamento Removido'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-orange-600">-{retirada.quantidade.toString().padStart(2, '0')}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-zinc-500 text-xs">
                      {new Date(retirada.realizadoEm).toLocaleString('pt-BR')}
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
