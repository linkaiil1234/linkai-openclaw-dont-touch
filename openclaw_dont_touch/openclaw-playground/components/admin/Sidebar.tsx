'use client';

import { LayoutGrid, Users, CheckSquare, MessageCircle, Settings, ShieldAlert, Home, CircleDollarSign } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { icon: Home, label: 'Lobby', href: '/admin' },
  { icon: LayoutGrid, label: 'Playground', href: '/admin/apps' },
  { icon: CheckSquare, label: 'Mission Control', href: '/admin/tasks' },
  { icon: Users, label: 'Team', href: '/admin/workers' },
  { icon: MessageCircle, label: 'Comms', href: '/admin/chat' },
];

const bottomItems = [
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-sm">
      <div className="p-8 border-b border-gray-100">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <span className="text-3xl">🦞</span> Link OS
        </h1>
        <p className="text-sm text-gray-400 mt-2 font-medium">CEO Cockpit</p>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-200 text-sm font-bold ${
                isActive 
                  ? 'bg-black text-white shadow-lg shadow-gray-200 scale-105' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-1">
        {bottomItems.map((item) => (
           <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-xs font-semibold ${
                pathname === item.href 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
        ))}
      </div>
    </aside>
  );
}
