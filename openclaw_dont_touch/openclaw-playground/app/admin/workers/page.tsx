import { getWorkers } from '@/app/actions/workers';
import { getTasks } from '@/app/actions/tasks';
import SwarmControlClient from './client-view';

export const dynamic = 'force-dynamic';

export default async function SwarmControlPage() {
  const [workers, tasks] = await Promise.all([
    getWorkers(),
    getTasks()
  ]);

  return <SwarmControlClient initialWorkers={workers} initialTasks={tasks} />;
}
