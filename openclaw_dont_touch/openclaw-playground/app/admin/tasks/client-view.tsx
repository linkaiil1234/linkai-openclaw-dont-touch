'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Play, Pause, CheckCircle2, Clock, Zap, Loader2, Bot } from 'lucide-react';
import { getTasks, Task, updateTaskStatus } from '@/app/actions/tasks';

function WorkingIndicator() {
  return (
    <div className="absolute -top-3 -right-3 bg-white p-1.5 rounded-full shadow-lg border border-indigo-100 flex items-center justify-center animate-bounce">
      <Bot className="w-5 h-5 text-indigo-600 animate-pulse" />
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-ping" />
    </div>
  );
}

// Kanban Column Component
function KanbanColumn({ title, icon: Icon, tasks, color, onStatusChange, isWorking = false }: any) {
  return (
    <div className="flex flex-col h-full min-w-[300px] w-full">
      <div className={`flex items-center gap-2 mb-4 px-1 ${color}`}>
        <Icon className="w-4 h-4" />
        <h3 className="font-bold text-sm tracking-wide uppercase">{title}</h3>
        <Badge variant="secondary" className="ml-auto bg-white/50 text-gray-600 border-0">
          {tasks.length}
        </Badge>
      </div>
      
      <div className="flex-1 bg-gray-50/50 rounded-2xl p-2 space-y-3 overflow-y-auto min-h-[200px]">
        {tasks.map((task: Task) => (
          <Card key={task.id} className={`relative p-4 bg-white border-gray-100 shadow-sm hover:shadow-md transition-all group ${isWorking ? 'border-indigo-200 ring-1 ring-indigo-50' : ''}`}>
            
            {/* The Robot Logic: If column is "Working" (Active), show the bot */}
            {isWorking && <WorkingIndicator />}

            <div className="flex justify-between items-start mb-2">
              <div className="flex gap-2 flex-wrap">
                {task.tags?.map(tag => (
                  <span key={tag} className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <h4 className="font-bold text-gray-900 leading-snug mb-3">{task.title}</h4>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono">#{task.id.slice(-4)}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {task.status === 'pending' && (
                  <Button size="sm" className="h-7 text-xs bg-black text-white hover:bg-gray-800" 
                    onClick={() => onStatusChange(task.id, 'in-progress')}>
                    Start
                  </Button>
                )}
                {task.status === 'in-progress' && (
                  <Button size="sm" className="h-7 text-xs bg-green-600 text-white hover:bg-green-700"
                    onClick={() => onStatusChange(task.id, 'done')}>
                    Done
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
        
        {tasks.length === 0 && (
          <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
            <span className="text-gray-300 text-sm font-medium">Empty</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function TasksClient() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const refresh = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 3000); // Faster refresh to see the robot move
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (id: string, status: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    await updateTaskStatus(id, status);
    await refresh();
  };

  const queue = tasks.filter(t => t.status === 'pending');
  const active = tasks.filter(t => t.status === 'in-progress');
  const done = tasks.filter(t => t.status === 'done');

  return (
    <div className="p-8 h-screen flex flex-col bg-white">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mission Control</h1>
          <p className="text-gray-500 font-medium">ניהול משימות זמן אמת</p>
        </div>
      </header>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {/* QUEUE Column */}
        <KanbanColumn 
          title="Queue (ממתין)" 
          icon={Clock} 
          tasks={queue} 
          color="text-gray-500" 
          onStatusChange={handleStatusChange}
        />
        
        {/* ACTIVE Column - with Robot Logic */}
        <KanbanColumn 
          title="Working (עובד עכשיו)" 
          icon={Zap} 
          tasks={active} 
          color="text-indigo-600" 
          onStatusChange={handleStatusChange}
          isWorking={true} // Activates the robot!
        />
        
        {/* DONE Column */}
        <KanbanColumn 
          title="Done (בוצע)" 
          icon={CheckCircle2} 
          tasks={done} 
          color="text-green-600" 
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}
