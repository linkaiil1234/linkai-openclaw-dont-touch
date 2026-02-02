'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, Clock, Zap, Bot, User } from 'lucide-react';
import { getTasks, Task, updateTaskStatus, getWorkers } from '@/app/actions/tasks';

// 🛡️ Safety: Default worker to prevent crashes
const DEFAULT_WORKER = { id: 'bot', name: 'Link AI', avatar: '🤖', role: 'System' };

function getWorkerForTask(task: Task | null, workers: any[]) {
  if (!task) return DEFAULT_WORKER;
  if (!workers || !Array.isArray(workers) || workers.length === 0) return DEFAULT_WORKER;

  try {
    // 1. Match by ID
    if (task.assignedTo) {
      const match = workers.find(w => w.id === task.assignedTo);
      if (match) return match;
    }
    
    // 2. Match by Role/Keywords (Heuristic)
    const title = (task.title || '').toLowerCase();
    if (title.includes('design')) return workers.find(w => w.role?.includes('Design')) || DEFAULT_WORKER;
    if (title.includes('dev') || title.includes('fix')) return workers.find(w => w.role?.includes('Engineer')) || DEFAULT_WORKER;
    if (title.includes('recruit') || title.includes('hiring')) return workers.find(w => w.role?.includes('Assistant')) || DEFAULT_WORKER;

    return workers[0] || DEFAULT_WORKER;
  } catch (e) {
    return DEFAULT_WORKER;
  }
}

function KanbanColumn({ title, icon: Icon, tasks = [], color, onStatusChange, isWorking = false, workers = [] }: any) {
  // 🛡️ Safety: Ensure tasks is always an array
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const safeWorkers = Array.isArray(workers) ? workers : [];

  return (
    <div className="flex flex-col h-full min-w-[300px] w-full">
      <div className={`flex items-center gap-2 mb-4 px-1 ${color}`}>
        <Icon className="w-4 h-4" />
        <h3 className="font-bold text-sm tracking-wide uppercase">{title}</h3>
        <Badge variant="secondary" className="ml-auto bg-white/50 text-gray-600 border-0">
          {safeTasks.length}
        </Badge>
      </div>
      
      <div className="flex-1 bg-gray-50/50 rounded-2xl p-2 space-y-3 overflow-y-auto min-h-[200px]">
        {safeTasks.map((task: Task) => {
          if (!task) return null; // Skip broken records
          const worker = getWorkerForTask(task, safeWorkers);
          
          return (
            <Card key={task.id || Math.random()} className={`relative p-4 bg-white border-gray-100 shadow-sm hover:shadow-md transition-all group ${isWorking ? 'border-indigo-200 ring-1 ring-indigo-50' : ''}`}>
              
              {/* Active Worker Animation */}
              {isWorking && (
                <div className="absolute -top-3 -right-3 bg-white p-1 rounded-full shadow-lg border border-indigo-100 flex items-center justify-center animate-bounce z-10" title={`Working: ${worker.name}`}>
                  <span className="text-2xl filter drop-shadow-sm">{worker.avatar || '🤖'}</span>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-ping" />
                </div>
              )}

              <div className="flex justify-between items-start mb-2">
                <div className="flex gap-2 flex-wrap">
                  {Array.isArray(task.tags) && task.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <h4 className="font-bold text-gray-900 leading-snug mb-3">{task.title || 'Untitled Task'}</h4>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div className="flex items-center gap-2">
                   {/* Static Avatar */}
                   {!isWorking && (
                     <span className="text-sm opacity-50 grayscale group-hover:grayscale-0 transition-all" title={worker.name}>
                        {worker.avatar || <User className="w-4 h-4"/>}
                     </span>
                   )}
                   <span className="text-xs text-gray-400 font-mono">#{task.id ? task.id.slice(-4) : '???'}</span>
                </div>

                {/* Buttons */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {task.status !== 'in-progress' && task.status !== 'done' && (
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
          );
        })}
        
        {safeTasks.length === 0 && (
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
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
        const [tData, wData] = await Promise.all([getTasks(), getWorkers()]);
        setTasks(Array.isArray(tData) ? tData : []);
        setWorkers(Array.isArray(wData) ? wData : []);
    } catch (e) {
        console.error("Refresh failed", e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (id: string, status: Task['status']) => {
    if (!id) return;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    await updateTaskStatus(id, status);
    await refresh();
  };

  if (loading && tasks.length === 0) {
      return <div className="p-8 text-gray-400">Loading Mission Control...</div>;
  }

  // Safe Filtering
  const queue = tasks.filter(t => t && t.status !== 'in-progress' && t.status !== 'done');
  const active = tasks.filter(t => t && t.status === 'in-progress');
  const done = tasks.filter(t => t && t.status === 'done');

  return (
    <div className="p-8 h-screen flex flex-col bg-white">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mission Control</h1>
          <p className="text-gray-500 font-medium">ניהול משימות זמן אמת</p>
        </div>
      </header>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        <KanbanColumn 
          title="Queue (ממתין)" 
          icon={Clock} 
          tasks={queue} 
          workers={workers}
          color="text-gray-500" 
          onStatusChange={handleStatusChange}
        />
        
        <KanbanColumn 
          title="Working (עובד עכשיו)" 
          icon={Zap} 
          tasks={active} 
          workers={workers}
          color="text-indigo-600" 
          onStatusChange={handleStatusChange}
          isWorking={true} 
        />
        
        <KanbanColumn 
          title="Done (בוצע)" 
          icon={CheckCircle2} 
          tasks={done} 
          workers={workers}
          color="text-green-600" 
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}
