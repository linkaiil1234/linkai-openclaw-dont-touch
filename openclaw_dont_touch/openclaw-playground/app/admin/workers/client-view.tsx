'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Play, GitPullRequest, Zap, Box, Plus, Search, Code, Pen, DollarSign, Loader2 } from 'lucide-react';
import type { Worker, WorkerTemplate } from '@/app/actions/workers';
import type { Task } from '@/app/actions/tasks';
import { spawnWorker } from '@/app/actions/workers';
import { toast } from 'sonner';

interface SwarmControlClientProps {
  initialWorkers: Worker[];
  initialTasks: Task[];
  templates: WorkerTemplate[];
}

const ICONS: Record<string, any> = {
  Search: Search,
  Code: Code,
  Pen: Pen,
  DollarSign: DollarSign
};

export default function SwarmControlClient({ initialWorkers, initialTasks, templates }: SwarmControlClientProps) {
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [isPending, startTransition] = useTransition();

  const handleSpawn = (templateId: string) => {
    toast.loading('Spawning new agent instance...');
    startTransition(async () => {
      const res = await spawnWorker(templateId);
      if (res.success && res.worker) {
        toast.dismiss();
        toast.success(`Agent ${res.worker.name} is online!`);
        // Optimistic update handled by page refresh via LivePulse usually, 
        // but let's update local state for instant feel if we wanted.
        // Since we have LivePulse, we can wait 4s, or just wait for revalidatePath from server action.
      } else {
        toast.dismiss();
        toast.error('Failed to spawn agent');
      }
    });
  };

  return (
    <div className="space-y-8 text-slate-100">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Box className="h-8 w-8 text-indigo-500" /> The Foundry
          </h1>
          <p className="text-slate-500 mt-1">Scale your workforce instantly.</p>
        </div>
        <div className="flex gap-2">
           {templates.map(tpl => {
             const Icon = ICONS[tpl.icon] || Bot;
             return (
               <Button 
                 key={tpl.id} 
                 variant="outline" 
                 disabled={isPending}
                 onClick={() => handleSpawn(tpl.id)}
                 className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
               >
                 <Icon className="mr-2 h-4 w-4" /> + {tpl.role}
               </Button>
             );
           })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Workers Column (The Swarm) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-400 flex items-center gap-2">
            <Bot className="h-5 w-5" /> Active Instance Pool ({workers.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workers.map((worker) => (
              <Card key={worker.id} className={`bg-white transition-all ${worker.status === 'busy' ? 'border-indigo-500/50 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${worker.status === 'offline' ? 'bg-gray-100' : 'bg-white shadow-sm border border-gray-100'}`}>
                         <Bot className={`h-6 w-6 ${worker.status === 'busy' ? 'text-indigo-600 animate-pulse' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <CardTitle className="text-base text-gray-900">{worker.name}</CardTitle>
                        <CardDescription className="text-gray-500">{worker.role}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={worker.status === 'busy' ? 'default' : 'secondary'} className={worker.status === 'busy' ? 'bg-indigo-600' : 'bg-slate-800 text-slate-400'}>
                      {worker.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {worker.status === 'busy' && (
                    <div className="bg-indigo-50 p-3 rounded border border-indigo-100 text-xs mt-2">
                      <span className="font-bold text-indigo-700 block mb-1">PROCESSING:</span>
                      <span className="text-gray-700">{worker.currentTask}</span>
                    </div>
                  )}
                  <div className="flex gap-1 mt-3 flex-wrap">
                    {worker.capabilities.map(cap => (
                      <span key={cap} className="text-[10px] px-2 py-1 bg-gray-100 rounded text-gray-500 font-mono border border-gray-200">
                        {cap}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Task Queue Column (Q-List) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-400 flex items-center gap-2">
            <GitPullRequest className="h-5 w-5" /> The Queue
          </h2>
          <div className="space-y-3 bg-slate-900 p-4 rounded-xl h-[600px] overflow-y-auto border border-slate-800 custom-scrollbar">
            {initialTasks.filter(t => t.status === 'pending').map((task) => (
              <Card key={task.id} className="bg-slate-950 border-slate-800 hover:border-slate-700 transition-colors group">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-slate-600">#{task.id}</span>
                    <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 text-slate-400">
                      <Play className="h-3 w-3" />
                    </Button>
                  </div>
                  <h3 className="font-bold text-slate-200 leading-tight">{task.title}</h3>
                  <div className="mt-3 flex gap-2">
                     <Badge variant="outline" className="text-[10px] border-slate-800 text-slate-500">Pending</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            {initialTasks.filter(t => t.status === 'pending').length === 0 && (
               <div className="text-center text-slate-600 py-10 text-sm">
                 <div className="mb-2">🎉</div>
                 Queue Empty
               </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
