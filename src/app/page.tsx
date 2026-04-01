import { 
  Users, 
  Package, 
  ArrowUpRight, 
  PlusCircle, 
  ArrowDownCircle 
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
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4">
      <div className={`${color} p-3 rounded-lg text-white`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-zinc-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-zinc-900">{value}</h3>
      </div>
    </div>
  );
}

export default async function Home() {
  // Busca dados reais do backend para o dashboard
  // Em um ambiente real, poderíamos usar Promise.all para performance
  let totalUsuarios = 0;
  let totalEquipamentos = 0;
  let totalRetiradas = 0;

  try {
    const [usuarios, equipamentos, retiradas] = await Promise.all([
      usuarioService.listarTodos(),
      equipamentoService.listarTodos(),
      estoqueService.listarRetiradas()
    ]);

    totalUsuarios = usuarios.length;
    totalEquipamentos = equipamentos.reduce((acc, eq) => acc + eq.quantidadeEstoque, 0);
    totalRetiradas = retiradas.length;
  } catch (error) {
    console.error("Erro ao carregar dados do dashboard:", error);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-zinc-900">Olá, Bem-vindo!</h2>
        <p className="text-zinc-500">Aqui está o que está acontecendo no seu inventário hoje.</p>
      </div>

      {/* Grid de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total de Equipamentos" 
          value={totalEquipamentos} 
          icon={Package} 
          color="bg-blue-600"
        />
        <StatCard 
          title="Usuários Ativos" 
          value={totalUsuarios} 
          icon={Users} 
          color="bg-emerald-600"
        />
        <StatCard 
          title="Retiradas Realizadas" 
          value={totalRetiradas} 
          icon={ArrowUpRight} 
          color="bg-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ações Rápidas */}
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Ações Rápidas</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              href="/equipamentos"
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <PlusCircle className="text-zinc-400 group-hover:text-blue-600 mb-2" size={32} />
              <span className="text-sm font-semibold text-zinc-600 group-hover:text-blue-600">Entrada</span>
            </Link>
            
            <Link 
              href="/retiradas"
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group"
            >
              <ArrowDownCircle className="text-zinc-400 group-hover:text-orange-600 mb-2" size={32} />
              <span className="text-sm font-semibold text-zinc-600 group-hover:text-orange-600">Retirada</span>
            </Link>
          </div>
        </div>

        {/* Informação do Sistema */}
        <div className="bg-zinc-900 text-white p-8 rounded-xl shadow-lg flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-4">Sistema de Gestão</h3>
          <p className="text-zinc-400 mb-6 leading-relaxed">
            Controle de inventário simplificado. Gerencie usuários, equipamentos e o fluxo de 
            retiradas em um único lugar, com transparência e agilidade.
          </p>
          <div className="flex gap-4">
            <div className="h-2 w-12 bg-blue-600 rounded-full"></div>
            <div className="h-2 w-4 bg-zinc-700 rounded-full"></div>
            <div className="h-2 w-4 bg-zinc-700 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
