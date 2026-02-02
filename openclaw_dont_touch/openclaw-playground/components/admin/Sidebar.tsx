'use client';

import { LayoutDashboard, Brain, ListTodo, Bot, Settings, LayoutGrid, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { icon: LayoutGrid, label: 'Capabilities', href: '/admin/apps' },
  { icon: MessageSquare, label: 'Comms (Live)', href: '/admin/chat' },
  { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
  { icon: Bot, label: 'Workers', href: '/admin/workers' },
  { icon: Brain, label: 'Brain', href: '/admin/brain' },
  { icon: ListTodo, label: 'Tasks', href: '/admin/tasks' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <span className="text-2xl">🦞</span> Link OS
        </h1>
        <p className="text-xs text-gray-500 mt-1">Agent Platform</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-200 text-sm font-medium ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-md border border-gray-100">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-gray-600">System Stable</span>
        </div>
      </div>
    </aside>
  );
}
