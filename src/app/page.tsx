import { 
  Users, 
  Package, 
  ArrowUpRight, 
  History,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { usuarioService } from '@/services/usuario.service';
import { equipamentoService } from '@/services/equipamento.service';
import { estoqueService } from '@/services/estoque.service';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  description: string;
}

function StatCard({ title, value, icon: Icon, color, description }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} p-2.5 rounded-lg text-white`}>
          <Icon size={20} />
        </div>
        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
          <TrendingUp size={12} />
          Ativo
        </span>
      </div>
      <div>
        <p className="text-sm text-zinc-500 font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-zinc-900 mt-1">{value}</h3>
        <p className="text-xs text-zinc-400 mt-2">{description}</p>
      </div>
    </div>
  );
}

export default async function Home() {
  let usuarios = [];
  let equipamentos = [];
  let retiradas = [];

  try {
    const [resUsuarios, resEquipamentos, resRetiradas] = await Promise.all([
      usuarioService.listarTodos(),
      equipamentoService.listarTodos(),
      estoqueService.listarRetiradas()
    ]);
    usuarios = resUsuarios;
    equipamentos = resEquipamentos;
    retiradas = resRetiradas;
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
  }

  const totalItensEstoque = equipamentos.reduce((acc, eq) => acc + eq.quantidadeEstoque, 0);
  const ultimasRetiradas = retiradas.slice(0, 8);

  return (
    <div className="flex flex-col h-full -m-8">
      {/* Cabeçalho Escuro */}
      <div className="bg-zinc-900 px-8 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Dashboard</h2>
            <p className="text-zinc-400 mt-1">Visão geral do sistema de controle de inventário.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-zinc-500 italic">Sistema Online</span>
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-6xl mx-auto w-full px-8 -mt-8 space-y-8 pb-12">
        {/* Grid de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Saldo em Estoque" 
            value={totalItensEstoque} 
            icon={Package} 
            color="bg-blue-600"
            description="Total de unidades disponíveis"
          />
          <StatCard 
            title="Colaboradores" 
            value={usuarios.length} 
            icon={Users} 
            color="bg-violet-600"
            description="Usuários cadastrados"
          />
          <StatCard 
            title="Retiradas Totais" 
            value={retiradas.length} 
            icon={ArrowUpRight} 
            color="bg-orange-600"
            description="Movimentações registradas"
          />
        </div>

        {/* Histórico Centralizado */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <History size={18} className="text-zinc-400" />
              Retiradas Recentes
            </h3>
            <Link href="/retiradas" className="text-xs font-bold text-blue-600 hover:underline">Ver histórico completo</Link>
          </div>
          <div className="p-0">
            {ultimasRetiradas.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-zinc-400 italic">Nenhuma movimentação registrada.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-100">
                {ultimasRetiradas.map((retirada) => (
                  <div key={retirada.id} className="px-6 py-4 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 font-bold text-xs uppercase">
                        {retirada.usuario?.nomeCompleto.substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900">{retirada.equipamento?.nome}</p>
                        <p className="text-xs text-zinc-500">{retirada.usuario?.nomeCompleto}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-orange-600">-{retirada.quantidade}</p>
                      <p className="text-[10px] text-zinc-400 font-medium">
                        {new Date(retirada.realizadoEm).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
