import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Cpu, Zap, RefreshCw } from 'lucide-react';
import { getLogs, addLog } from '@/app/actions/logs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic'; // Always fetch fresh data

export default async function AdminDashboard() {
  const logs = await getLogs(10);

  async function createLogAction(formData: FormData) {
    'use server';
    const action = formData.get('action') as string;
    if (action) {
      await addLog(action);
      revalidatePath('/admin');
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-900">Command Center</h1>
        <form action={async () => {
          'use server';
          revalidatePath('/admin');
        }}>
           <Button variant="outline" size="sm">
             <RefreshCw className="mr-2 h-4 w-4" /> Refresh
           </Button>
        </form>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-indigo-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Agent Status</CardTitle>
            <Activity className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-slate-500">Connected to Redis</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Playground Builds</CardTitle>
            <Zap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Stable</div>
            <p className="text-xs text-slate-500">v1.1.0 (Live)</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">System Health</CardTitle>
            <Cpu className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-slate-500">Upstash Online</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Logs Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-bold mb-4">Live System Logs (Redis)</h2>
          {logs.length === 0 ? (
             <p className="text-slate-400 text-sm italic">No logs found. System is quiet.</p>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${log.status === 'Success' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="font-medium text-sm">{log.action}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
           <Card>
             <CardHeader>
               <CardTitle className="text-sm">Quick Actions</CardTitle>
             </CardHeader>
             <CardContent>
               <form action={createLogAction} className="flex gap-2">
                 <Input name="action" placeholder="Log event..." required />
                 <Button type="submit" size="sm">Log</Button>
               </form>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
