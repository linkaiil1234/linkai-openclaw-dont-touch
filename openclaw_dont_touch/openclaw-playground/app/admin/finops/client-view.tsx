'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { getCosts } from '@/app/actions/finops';
import { TrendingUp, DollarSign, Zap, PieChart } from 'lucide-react';

function StatCard({ title, value, subtext, icon: Icon, color, trend }: any) {
  return (
    <Card className="p-6 bg-white border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className="text-xs font-bold bg-green-50 text-green-700 px-2 py-1 rounded-full flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-black text-gray-900 mb-1">{value}</h3>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {subtext && <p className="text-xs text-gray-400 mt-2">{subtext}</p>}
    </Card>
  );
}

export function FinOpsClient() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getCosts().then(setData);
  }, []);

  if (!data) return <div className="p-8">Loading Financial Data...</div>;

  return (
    <div className="p-8 h-screen bg-gray-50 flex flex-col">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <span className="text-4xl">💸</span> FinOps
        </h1>
        <p className="text-xl text-gray-500 mt-2">מעקב עלויות ותקציב</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="סה״כ החודש" 
          value={`$${data.monthlyTotal.toFixed(2)}`} 
          subtext="מתוך תקציב $50.00"
          icon={DollarSign} 
          color="bg-green-500" 
        />
        <StatCard 
          title="עלות יומית" 
          value={`$${data.dailyTotal.toFixed(2)}`} 
          subtext="מתעדכן בזמן אמת"
          icon={TrendingUp} 
          color="bg-blue-500" 
          trend="+2%"
        />
        <StatCard 
          title="ניצול טוקנים" 
          value={(data.tokens.input + data.tokens.output).toLocaleString()} 
          subtext={`Input: ${data.tokens.input.toLocaleString()}`}
          icon={Zap} 
          color="bg-amber-500" 
        />
        <StatCard 
          title="צפי סוף חודש" 
          value={`$${data.projected.toFixed(2)}`} 
          subtext="לפי קצב נוכחי"
          icon={PieChart} 
          color="bg-indigo-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-8 border-gray-100 shadow-sm bg-white">
          <h3 className="font-bold text-gray-900 mb-6">התפלגות עלויות (Live)</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-600">Gemini Pro (Main Brain)</span>
              <span className="font-bold text-gray-900">$3.80</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: '80%' }}></div>
            </div>

            <div className="flex justify-between items-center text-sm mt-4">
              <span className="font-medium text-gray-600">Vercel (Hosting)</span>
              <span className="font-bold text-gray-900">$0.40</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-gray-400 h-full rounded-full" style={{ width: '10%' }}></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
