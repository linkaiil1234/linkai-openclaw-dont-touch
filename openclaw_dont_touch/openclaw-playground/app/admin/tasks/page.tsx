import { getTasks } from '@/app/actions/tasks';
import TaskManagerClient from './client-view';

export const dynamic = 'force-dynamic';

export default async function TaskManagerPage() {
  const tasks = await getTasks();
  return (
    <div className="p-8 bg-slate-950 min-h-screen font-sans text-slate-100">
      <div className="max-w-5xl mx-auto">
        <TaskManagerClient initialTasks={tasks} />
      </div>
    </div>
  );
}
