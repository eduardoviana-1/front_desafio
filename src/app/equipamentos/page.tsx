'use client';

import { useState, useEffect } from 'react';
import { PackagePlus, Search, Hash, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { equipamentoService } from '@/services/equipamento.service';
import { Equipamento, EntradaEquipamentoDto } from '@/types/equipamento';

export default function EquipamentosPage() {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [novaEntrada, setNovaEntrada] = useState<EntradaEquipamentoDto>({
    nome: '',
    quantidade: 1
  });

  useEffect(() => {
    carregarEquipamentos();
  }, []);

  async function carregarEquipamentos() {
    try {
      setIsLoading(true);
      const data = await equipamentoService.listarTodos();
      setEquipamentos(data);
    } catch (error) {
      toast.error('Erro ao carregar o inventário.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleEntrada(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (novaEntrada.quantidade <= 0) {
        toast.error('A quantidade deve ser maior que zero.');
        return;
      }

      await equipamentoService.entrada(novaEntrada);
      toast.success(`Entrada de "${novaEntrada.nome}" registrada com sucesso!`);
      setShowForm(false);
      setNovaEntrada({ nome: '', quantidade: 1 });
      carregarEquipamentos(); // Atualiza a lista
    } catch (error: any) {
      const mensagem = error.response?.data?.error?.message || 'Erro ao registrar entrada.';
      toast.error(Array.isArray(mensagem) ? mensagem[0] : mensagem);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900">Inventário</h2>
          <p className="text-zinc-500">Controle o saldo e a entrada de equipamentos.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-zinc-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-zinc-800 transition-colors"
        >
          <PackagePlus size={20} />
          {showForm ? 'Cancelar' : 'Registrar Entrada'}
        </button>
      </div>

      {/* Formulário de Entrada */}
      {showForm && (
        <div className="bg-white p-8 rounded-xl border border-zinc-200 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-600">
            <PackagePlus />
            Entrada de Equipamento
          </h3>
          <form onSubmit={handleEntrada} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">Nome do Equipamento</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-zinc-400" size={18} />
                <input 
                  required
                  type="text"
                  placeholder="Ex: Caminhão Coletor, Notebook, Pá..."
                  className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={novaEntrada.nome}
                  onChange={e => setNovaEntrada({...novaEntrada, nome: e.target.value})}
                />
              </div>
              <p className="text-xs text-zinc-400">Se o nome já existir, a quantidade será somada ao estoque atual.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">Quantidade</label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 text-zinc-400" size={18} />
                <input 
                  required
                  type="number"
                  min="1"
                  placeholder="1"
                  className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={novaEntrada.quantidade}
                  onChange={e => setNovaEntrada({...novaEntrada, quantidade: Number(e.target.value)})}
                />
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button 
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-100"
              >
                Confirmar Entrada
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabela de Equipamentos */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="px-6 py-4 text-sm font-bold text-zinc-600">Equipamento</th>
              <th className="px-6 py-4 text-sm font-bold text-zinc-600">Saldo em Estoque</th>
              <th className="px-6 py-4 text-sm font-bold text-zinc-600">Status</th>
              <th className="px-6 py-4 text-sm font-bold text-zinc-600">Última Atualização</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                  Carregando inventário...
                </td>
              </tr>
            ) : equipamentos.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                  Nenhum equipamento cadastrado no estoque.
                </td>
              </tr>
            ) : (
              equipamentos.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-900">{item.nome}</td>
                  <td className="px-6 py-4">
                    <span className={`text-lg font-bold ${item.quantidadeEstoque === 0 ? 'text-red-600' : 'text-zinc-900'}`}>
                      {item.quantidadeEstoque}
                    </span>
                    <span className="ml-1 text-xs text-zinc-400 uppercase font-medium">unid</span>
                  </td>
                  <td className="px-6 py-4">
                    {item.quantidadeEstoque === 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertTriangle size={12} />
                        Sem Estoque
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        <CheckCircle2 size={12} />
                        Disponível
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-zinc-500 text-xs">
                    {new Date(item.atualizadoEm).toLocaleString('pt-BR')}
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
