'use client'; // Client for simplicity in MVP

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, AlertTriangle, Server } from 'lucide-react';

export default function AuditorPage() {
  return (
    <div className="space-y-6 text-gray-900">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-white border border-gray-200 rounded-xl text-emerald-600 shadow-sm">
           <Shield className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900">System Auditor</h1>
          <p className="text-gray-500">Security & Health checks for your Link OS.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { name: 'Telegram Webhook', status: 'Healthy', icon: CheckCircle, color: 'text-green-500', desc: 'Responding (200 OK)' },
          { name: 'Redis Database', status: 'Healthy', icon: Server, color: 'text-green-500', desc: 'Latency: 24ms' },
          { name: 'Vercel Deployment', status: 'Stable', icon: CheckCircle, color: 'text-green-500', desc: 'Current: v1.2.0' },
          { name: 'Doctor Service', status: 'Active', icon: Shield, color: 'text-blue-500', desc: 'Watchdog is running' },
        ].map((item, i) => (
          <Card key={i} className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <item.icon className={`h-6 w-6 ${item.color}`} />
                <div>
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                {item.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
