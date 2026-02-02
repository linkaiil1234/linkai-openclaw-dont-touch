'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Cpu, Zap } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-slate-900">Command Center</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-indigo-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Agent Status</CardTitle>
            <Activity className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-slate-500">+2 tasks in queue</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Playground Builds</CardTitle>
            <Zap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Stable</div>
            <p className="text-xs text-slate-500">v1.0.2 deployed</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">System Health</CardTitle>
            <Cpu className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-slate-500">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: 'Deployed Wizard v1', time: '2 mins ago', status: 'Success' },
            { action: 'Updated Task Manager UI', time: '15 mins ago', status: 'Success' },
            { action: 'Fixed VoiceSelector Bug', time: '1 hour ago', status: 'Success' },
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="font-medium text-sm">{log.action}</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
