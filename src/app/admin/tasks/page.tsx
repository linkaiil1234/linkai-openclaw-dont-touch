'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Power, RefreshCw, Terminal, Cpu, HardDrive } from 'lucide-react';

export default function TaskManager() {
  // REAL DATA from Agent Link
  const [tasks, setTasks] = useState([
    { id: 'rapid-crustacean', name: 'The Wizard (Dev Server)', command: 'npm run dev', status: 'Running', time: '18m', cpu: '12%', mem: '240MB' },
    { id: 'doctor-service', name: 'The Doctor 🚑', command: './doctor.sh', status: 'Running', time: '1h 20m', cpu: '0.1%', mem: '10MB' },
    { id: 'rapid-lagoon', name: 'Old Server', command: 'npm run dev', status: 'Killed', time: '25m', cpu: '0%', mem: '0MB' },
  ]);

  const killTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'Killed', cpu: '0%', mem: '0MB' } : t));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans text-gray-900">
      
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-green-500 shadow-sm">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full text-green-700"><Activity className="h-6 w-6" /></div>
              <div>
                <p className="text-sm font-medium text-gray-500">System Status</p>
                <h3 className="text-2xl font-bold">Healthy</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500 shadow-sm">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full text-blue-700"><Cpu className="h-6 w-6" /></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Active Processes</p>
                <h3 className="text-2xl font-bold">2 Running</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500 shadow-sm">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full text-purple-700"><HardDrive className="h-6 w-6" /></div>
              <div>
                <p className="text-sm font-medium text-gray-500">Memory Usage</p>
                <h3 className="text-2xl font-bold">250 MB</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Process Table */}
        <Card className="shadow-lg border-t-0">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-white rounded-t-xl">
            <div>
              <CardTitle className="text-xl">Active Missions</CardTitle>
              <CardDescription>Real-time control over Agent Link's tasks</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-500"><RefreshCw className="h-4 w-4 mr-2" /> Auto-refresh</Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-6 bg-white hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-5">
                    <div className={`p-2 rounded-lg ${task.status === 'Running' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                      <Terminal className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-base">{task.name}</p>
                        <Badge variant={task.status === 'Running' ? 'default' : 'secondary'} className={task.status === 'Running' ? 'bg-green-500 hover:bg-green-600' : ''}>
                          {task.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 font-mono mt-1">{task.command} • ID: {task.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-gray-400 font-medium uppercase">Uptime</p>
                      <p className="font-mono text-sm">{task.time}</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-gray-400 font-medium uppercase">CPU</p>
                      <p className="font-mono text-sm">{task.cpu}</p>
                    </div>
                    
                    {task.status === 'Running' && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="shadow-red-100 shadow-lg hover:bg-red-600"
                        onClick={() => killTask(task.id)}
                      >
                        <Power className="h-4 w-4 mr-2" /> Terminate
                      </Button>
                    )}
                    {task.status !== 'Running' && (
                         <Button variant="outline" size="sm" disabled className="opacity-50">Terminated</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
