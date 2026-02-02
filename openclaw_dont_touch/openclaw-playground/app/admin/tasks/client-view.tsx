'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Play, Pause, CheckCircle2, Clock, Zap } from 'lucide-react';
import { getTasks, Task, updateTaskStatus } from '@/app/actions/tasks';

// Kanban Column Component
function KanbanColumn({ title, icon: Icon, tasks, color, onStatusChange }: { 
  title: string; 
  icon: any; 
  tasks: Task[]; 
  color: string;
  onStatusChange: (id: string, status: Task['status']) => void;
}) {
  return (
    <div className="flex flex-col h-full min-w-[300px] w-full">
      <div className={`flex items-center gap-2 mb-4 px-1 ${color}`}>
        <Icon className="w-4 h-4" />
        <h3 className="font-bold text-sm tracking-wide uppercase">{title}</h3>
        <Badge variant="secondary" className="ml-auto bg-white/50 text-gray-600 border-0">
          {tasks.length}
        </Badge>
      </div>
      
      <div className="flex-1 bg-gray-50/50 rounded-2xl p-2 space-y-3 overflow-y-auto">
        {tasks.map(task => (
          <Card key={task.id} className="p-4 bg-white border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-2">
              <div className="flex gap-2 flex-wrap">
                {task.tags?.map(tag => (
                  <span key={tag} className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
            
            <h4 className="font-bold text-gray-900 leading-snug mb-3">{task.title}</h4>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700">
                  {task.assignedTo ? task.assignedTo.substring(0, 2).toUpperCase() : 'AI'}
                </div>
                {task.value && (
                  <span className="text-xs font-medium text-emerald-600">{task.value}</span>
                )}
              </div>

              {/* Action Buttons based on state */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {task.status !== 'in-progress' && task.status !== 'done' && (
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600 bg-green-50 hover:bg-green-100" 
                    onClick={() => onStatusChange(task.id, 'in-progress')}>
                    <Play className="w-3.5 h-3.5" />
                  </Button>
                )}
                {task.status === 'in-progress' && (
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-500 bg-gray-100 hover:bg-gray-200"
                    onClick={() => onStatusChange(task.id, 'done')}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
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
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (id: string, status: Task['status']) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    await updateTaskStatus(id, status);
    await refresh();
  };

  // Filter tasks into columns
  const backlog = tasks.filter(t => t.status === 'pending');
  const active = tasks.filter(t => t.status === 'in-progress');
  const done = tasks.filter(t => t.status === 'done');

  // Note: We need a 'background' status in the backend to fully support the request.
  // For now, I'll map 'in-progress' with a 'Background' tag to a separate logical column if needed,
  // or we can add it to the schema later. For MVP, Active = In Progress.

  return (
    <div className="p-8 h-screen flex flex-col bg-white">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mission Control</h1>
          <p className="text-gray-500 font-medium">Strategic Overview</p>
        </div>
        <Button className="bg-black text-white hover:bg-gray-800 rounded-xl px-6 font-bold shadow-lg shadow-gray-200">
          <Plus className="w-4 h-4 mr-2" />
          New Mission
        </Button>
      </header>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        <KanbanColumn 
          title="Backlog" 
          icon={Clock} 
          tasks={backlog} 
          color="text-gray-500" 
          onStatusChange={handleStatusChange}
        />
        <KanbanColumn 
          title="Active Focus" 
          icon={Zap} 
          tasks={active} 
          color="text-blue-600" 
          onStatusChange={handleStatusChange}
        />
        <KanbanColumn 
          title="Completed" 
          icon={CheckCircle2} 
          tasks={done} 
          color="text-green-600" 
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}
