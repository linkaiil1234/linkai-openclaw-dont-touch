'use client';

import { LayoutDashboard, Brain, ListTodo, Sparkles, Settings, Bot, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
  { icon: Brain, label: 'Brain Monitor', href: '/admin/brain' },
  { icon: ListTodo, label: 'Task Manager', href: '/admin/tasks' },
  { icon: Bot, label: 'Swarm Workers', href: '/admin/workers' },
  { icon: Sparkles, label: 'Playground (Wizard)', href: '/wizard', external: true },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
          <span className="text-2xl">🦞</span> Link OS
        </h1>
        <p className="text-xs text-slate-500 mt-1">Agent Command Center</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              target={item.external ? '_blank' : undefined}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-mono text-green-400">System Online</span>
        </div>
      </div>
    </aside>
  );
}
