'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Power, RefreshCw, Terminal, Cpu, HardDrive, Play, Loader2 } from 'lucide-react';
import { Task } from '@/app/actions/tasks';
import { terminateTask } from '@/app/actions/control';
import { toast } from 'sonner';

export default function TaskManagerClient({ initialTasks }: { initialTasks: Task[] }) {
  const [isPending, startTransition] = useTransition();

  const handleTerminate = (id: string) => {
    toast.loading('Terminating process...');
    startTransition(async () => {
      const result = await terminateTask(id);
      if (result.success) {
        toast.dismiss();
        toast.success('Process terminated successfully');
      } else {
        toast.dismiss();
        toast.error('Failed to terminate process');
      }
    });
  };

  return (
    <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-green-500 shadow-sm bg-slate-900 border-slate-800 text-slate-100">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-green-900/50 rounded-full text-green-400"><Activity className="h-6 w-6" /></div>
              <div>
                <p className="text-sm font-medium text-slate-400">System Status</p>
                <h3 className="text-2xl font-bold">Healthy</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-blue-500 shadow-sm bg-slate-900 border-slate-800 text-slate-100">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-blue-900/50 rounded-full text-blue-400"><Cpu className="h-6 w-6" /></div>
              <div>
                <p className="text-sm font-medium text-slate-400">Active Processes</p>
                <h3 className="text-2xl font-bold">{initialTasks.filter(t => t.status === 'in-progress').length} Running</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-purple-500 shadow-sm bg-slate-900 border-slate-800 text-slate-100">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-purple-900/50 rounded-full text-purple-400"><HardDrive className="h-6 w-6" /></div>
              <div>
                <p className="text-sm font-medium text-slate-400">Memory Usage</p>
                <h3 className="text-2xl font-bold">Dynamic</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Process Table */}
        <Card className="shadow-lg border-slate-800 bg-slate-900 text-slate-100">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800">
            <div>
              <CardTitle className="text-xl">Active Missions</CardTitle>
              <CardDescription className="text-slate-400">Real-time control over Agent Link's tasks</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                {isPending && <Loader2 className="h-4 w-4 animate-spin text-slate-500" />}
                <Badge variant="outline" className="text-xs font-mono text-slate-500 border-slate-700">
                    Auto-refresh: ON (4s)
                </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-800">
              {initialTasks.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No active tasks found in Redis.</div>
              ) : initialTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-6 hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-5">
                    <div className={`p-2 rounded-lg ${task.status === 'in-progress' ? 'bg-green-900/30 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
                      <Terminal className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-base">{task.title}</p>
                        <Badge variant={task.status === 'in-progress' ? 'default' : 'secondary'} 
                               className={task.status === 'in-progress' ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-700'}>
                          {task.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-1">ID: {task.id} • Assigned: {task.assignedTo || 'Unassigned'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {task.status === 'in-progress' && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        disabled={isPending}
                        className="bg-red-900/50 text-red-200 hover:bg-red-800 border border-red-900"
                        onClick={() => handleTerminate(task.id)}
                      >
                        <Power className="h-4 w-4 mr-2" /> Terminate
                      </Button>
                    )}
                     {task.status === 'pending' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-slate-700 text-slate-300 hover:bg-slate-800"
                      >
                        <Play className="h-4 w-4 mr-2" /> Start
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
