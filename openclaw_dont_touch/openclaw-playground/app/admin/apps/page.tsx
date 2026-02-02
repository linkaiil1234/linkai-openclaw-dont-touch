'use client';

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Brain, Globe, FileText, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';

const apps = [
  {
    id: 'deep-research',
    name: 'Deep Research',
    description: 'Autonomous multi-step research agent inspired by Perplexity Pro.',
    icon: Brain,
    color: 'bg-purple-100 text-purple-600',
    status: 'beta',
    href: '/admin/apps/research'
  },
  {
    id: 'crm',
    name: 'Leads CRM',
    description: 'Auto-populated table of potential customers and deals.',
    icon: Users,
    color: 'bg-blue-100 text-blue-600',
    status: 'live',
    href: '/admin/apps/crm'
  },
  {
    id: 'writer',
    name: 'Ghost Writer',
    description: 'Content generation for LinkedIn/Twitter.',
    icon: FileText,
    color: 'bg-orange-100 text-orange-600',
    status: 'live',
    href: '/admin/apps/writer'
  },
  {
    id: 'auditor',
    name: 'System Auditor',
    description: 'Health checks and log analysis.',
    icon: Activity,
    color: 'bg-green-100 text-green-600',
    status: 'live',
    href: '/admin/apps/auditor'
  }
];

import { Activity, Users } from "lucide-react";

export default function AppsPage() {
  return (
    <div className="p-8 h-screen bg-gray-50 overflow-y-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <span className="text-4xl">🧩</span> Playground
        </h1>
        <p className="text-xl text-gray-500 mt-2">Active Capabilities & Agents</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <Link key={app.id} href={app.href} className="block group">
            <Card className="h-full p-6 bg-white border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden">
                <div className={`absolute top-0 right-0 p-3 rounded-bl-2xl ${app.status === 'live' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    <span className="text-xs font-bold uppercase tracking-wider">{app.status}</span>
                </div>
                
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${app.color}`}>
                    <app.icon className="w-7 h-7" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{app.name}</h3>
                <p className="text-gray-500 leading-relaxed">{app.description}</p>
            </Card>
          </Link>
        ))}
        
        {/* Coming Soon Placeholder */}
        <Card className="p-6 bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center opacity-60">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-400">Install New Skill</h3>
        </Card>
      </div>
    </div>
  );
}

import { Plus } from 'lucide-react';
