'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ArrowLeftRight,
  Settings
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Usuários', icon: Users, href: '/usuarios' },
  { name: 'Equipamentos', icon: Package, href: '/equipamentos' },
  { name: 'Retiradas', icon: ArrowLeftRight, href: '/retiradas' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2.5">
          <div className="bg-emerald-800 p-1.5 rounded-lg shadow-lg shadow-emerald-900/10">
            <Package size={20} className="text-white" />
          </div>
          Gestão
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-100/50' 
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 font-medium'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-emerald-700' : ''} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-100">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 rounded-lg transition-colors font-medium">
          <Settings size={20} />
          <span className="text-sm">Configurações</span>
        </button>
      </div>
    </aside>
  );
}
