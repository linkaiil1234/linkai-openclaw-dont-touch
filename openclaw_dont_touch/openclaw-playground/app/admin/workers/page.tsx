import { getWorkers, getTemplates } from '@/app/actions/workers';
import { getTasks } from '@/app/actions/tasks';
import SwarmControlClient from './client-view';

export const dynamic = 'force-dynamic';

export default async function SwarmControlPage() {
  const [workers, tasks, templates] = await Promise.all([
    getWorkers(),
    getTasks(),
    getTemplates()
  ]);

  return <SwarmControlClient initialWorkers={workers} initialTasks={tasks} templates={templates} />;
}
