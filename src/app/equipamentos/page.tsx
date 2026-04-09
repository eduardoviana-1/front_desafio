'use client';

import { useState, useEffect } from 'react';
import { PackagePlus, Search, Hash, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { equipamentoService } from '@/services/equipamento.service';
import { Equipamento, EntradaEquipamentoDto } from '@/types/equipamento';
import { Button, Input, Card, PageHeader } from '@/components/ui';

export default function EquipamentosPage() {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

      setIsSubmitting(true);
      await equipamentoService.entrada(novaEntrada);
      toast.success(`Entrada de "${novaEntrada.nome}" registrada com sucesso!`);
      setShowForm(false);
      setNovaEntrada({ nome: '', quantidade: 1 });
      carregarEquipamentos();
    } catch (error: any) {
      const mensagem = error.response?.data?.error?.message || 'Erro ao registrar entrada.';
      toast.error(Array.isArray(mensagem) ? mensagem[0] : mensagem);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col h-full -m-8 bg-zinc-100 min-h-screen">
      <div className="bg-white border-b border-zinc-100">
        <PageHeader 
          title="Inventário"
          description="Controle de saldo e entrada de materiais no estoque."
          action={
            <Button 
              variant={showForm ? 'white' : 'primary'}
              icon={<PackagePlus size={20} />}
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancelar' : 'Registrar Entrada'}
            </Button>
          }
        />
      </div>

      <div className="max-w-5xl mx-auto w-full px-12 py-10 space-y-8 pb-12">
        {showForm && (
          <Card 
            title="Entrada de Equipamento"
            icon={<PackagePlus className="text-emerald-700" size={24} />}
          >
            <form onSubmit={handleEntrada} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Nome do Equipamento"
                placeholder="Equipamento"
                icon={<Search size={18} />}
                required
                value={novaEntrada.nome}
                onChange={e => setNovaEntrada({...novaEntrada, nome: e.target.value})}
              />

              <Input 
                label="Quantidade"
                type="number"
                min="1"
                icon={<Hash size={18} />}
                required
                value={novaEntrada.quantidade}
                onChange={e => setNovaEntrada({...novaEntrada, quantidade: Number(e.target.value)})}
              />

              <div className="md:col-span-2 flex justify-end mt-4">
                <Button type="submit" isLoading={isSubmitting}>
                  Confirmar Entrada
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-200">
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Equipamento</th>
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Saldo Atual</th>
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-zinc-400 italic">Carregando...</td>
                </tr>
              ) : equipamentos.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-zinc-400 italic">Vazio.</td>
                </tr>
              ) : (
                equipamentos.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-zinc-900">{item.nome}</td>
                    <td className="px-6 py-4">
                      <span className={`text-lg font-mono font-bold ${item.quantidadeEstoque === 0 ? 'text-rose-600' : 'text-zinc-900'}`}>
                        {item.quantidadeEstoque.toString().padStart(2, '0')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.quantidadeEstoque === 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 uppercase border border-rose-100">
                          <AlertTriangle size={10} /> Esgotado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 uppercase border border-emerald-100">
                          <CheckCircle2 size={10} /> Disponível
                        </span>
                      )}
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
