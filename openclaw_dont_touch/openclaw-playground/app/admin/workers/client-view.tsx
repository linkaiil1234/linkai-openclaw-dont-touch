'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getWorkers } from '@/app/actions/tasks';
import { Users, Code, Globe, MessageSquare, Terminal } from 'lucide-react';

export function WorkersClient() {
  const [workers, setWorkers] = useState<any[]>([]);

  useEffect(() => {
    getWorkers().then(setWorkers);
  }, []);

  // Collect all unique skills
  const allSkills = Array.from(new Set(workers.flatMap(w => w.capabilities || [])));

  return (
    <div className="p-8 h-screen bg-gray-50 overflow-y-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <span className="text-4xl">👥</span> The Team
        </h1>
        <p className="text-xl text-gray-500 mt-2">Active Agents & Capabilities</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {workers.map((worker) => (
          <Card key={worker.id} className="p-6 bg-white border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-${worker.color || 'gray'}-100`}>
                {worker.avatar}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{worker.name}</h3>
                <p className="text-sm font-medium text-gray-500">{worker.role}</p>
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap mt-4">
                {worker.capabilities?.map((cap: string) => (
                    <Badge key={cap} variant="secondary" className="bg-gray-100 text-gray-600">
                        {cap}
                    </Badge>
                ))}
            </div>
          </Card>
        ))}
      </div>

      {/* SKILLS SECTION */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Terminal className="w-6 h-6 text-indigo-600" />
            Installed Skills Library
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allSkills.map(skill => (
                <div key={skill} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-3 shadow-sm hover:border-indigo-300 transition-colors cursor-default">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="font-mono text-sm font-bold text-gray-700">{skill}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
