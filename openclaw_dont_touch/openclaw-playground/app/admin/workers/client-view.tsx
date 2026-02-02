'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Play, Pause, GitPullRequest, Zap, Box } from 'lucide-react';
import type { Worker } from '@/app/actions/workers';
import type { Task } from '@/app/actions/tasks';

interface SwarmControlClientProps {
  initialWorkers: Worker[];
  initialTasks: Task[];
}

export default function SwarmControlClient({ initialWorkers, initialTasks }: SwarmControlClientProps) {
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Todo: Connect this to Server Action later for real updates
  const assignTask = (taskId: string, workerId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(tasks.map(t => t.id === taskId ? { ...t, assignedTo: workerId, status: 'in-progress' } : t));
    setWorkers(workers.map(w => w.id === workerId ? { ...w, status: 'busy', currentTask: task.title } : w));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Box className="h-8 w-8 text-indigo-600" /> Swarm Orchestrator
          </h1>
          <p className="text-slate-500 mt-1">Manage specialized agents and assign tasks.</p>
        </div>
        <Button className="bg-indigo-600"><Zap className="mr-2 h-4 w-4" /> Auto-Assign</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Workers Column */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <Bot className="h-5 w-5" /> Active Workers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workers.map((worker) => (
              <Card key={worker.id} className={`border-2 transition-all ${worker.status === 'busy' ? 'border-indigo-100 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${worker.status === 'offline' ? 'bg-slate-200' : 'bg-white shadow-sm'}`}>
                         <Bot className={`h-6 w-6 ${worker.status === 'busy' ? 'text-indigo-600 animate-pulse' : 'text-slate-600'}`} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{worker.name}</CardTitle>
                        <CardDescription>{worker.role}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={worker.status === 'busy' ? 'default' : worker.status === 'offline' ? 'destructive' : 'secondary'}>
                      {worker.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {worker.status === 'busy' && (
                    <div className="bg-white p-3 rounded border border-indigo-100 text-xs mt-2">
                      <span className="font-bold text-indigo-700 block mb-1">WORKING ON:</span>
                      {worker.currentTask}
                    </div>
                  )}
                  <div className="flex gap-1 mt-3 flex-wrap">
                    {worker.capabilities.map(cap => (
                      <span key={cap} className="text-[10px] px-2 py-1 bg-slate-100 rounded text-slate-500 font-mono">
                        {cap}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Task Queue Column */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <GitPullRequest className="h-5 w-5" /> Unassigned Tasks
          </h2>
          <div className="space-y-3 bg-slate-100 p-4 rounded-xl h-[600px] overflow-y-auto">
            {tasks.filter(t => t.status === 'pending').map((task) => (
              <Card key={task.id} className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-slate-400">#{task.id}</span>
                    <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                      <Play className="h-3 w-3" />
                    </Button>
                  </div>
                  <h3 className="font-bold text-slate-800 leading-tight">{task.title}</h3>
                  
                  <div className="mt-4 pt-3 border-t flex gap-2">
                    {workers.filter(w => w.status === 'idle').map(w => (
                      <Button 
                        key={w.id} 
                        variant="outline" 
                        size="sm" 
                        className="text-[10px] h-6 px-2"
                        onClick={() => assignTask(task.id, w.id)}
                      >
                        Assign {w.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            {tasks.filter(t => t.status === 'pending').length === 0 && (
               <div className="text-center text-slate-400 py-10 text-sm">No pending tasks</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
