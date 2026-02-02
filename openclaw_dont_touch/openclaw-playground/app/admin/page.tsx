'use client';

import Link from 'next/link';
import { Card } from "@/components/ui/card";
import { Mic, Activity, CheckCircle2, Users, ArrowRight } from 'lucide-react';

// Idiot-proof card component
function BigButton({ title, subtitle, icon: Icon, color, href, big = false }: any) {
  return (
    <Link href={href} className={`group relative overflow-hidden rounded-3xl p-8 transition-all hover:scale-[1.02] hover:shadow-xl ${big ? 'col-span-2 row-span-2' : ''} ${color}`}>
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
          <p className="text-white/80 font-medium">{subtitle}</p>
        </div>
      </div>
      {/* Decorative background circle */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
    </Link>
  );
}

export default function CEODashboard() {
  return (
    <div className="p-8 h-screen bg-gray-50 flex flex-col">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">בוקר טוב, אורי.</h1>
        <p className="text-xl text-gray-500 mt-2">המערכת יציבה. אני מוכן לעבודה.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
        
        {/* 1. TALK (Main Action) */}
        <BigButton 
          title="דבר איתי" 
          subtitle="שלח פקודה קולית או טקסט" 
          icon={Mic} 
          color="bg-black" 
          href="/admin/chat" 
          big={true}
        />

        {/* 2. PLAN (Kanban) */}
        <BigButton 
          title="התוכנית" 
          subtitle="3 משימות פתוחות" 
          icon={CheckCircle2} 
          color="bg-blue-600" 
          href="/admin/tasks"
        />

        {/* 3. TEAM (Workers) */}
        <BigButton 
          title="הצוות שלי" 
          subtitle="סוכנים פעילים" 
          icon={Users} 
          color="bg-indigo-600" 
          href="/admin/workers"
        />

        {/* 4. HEALTH (System) */}
        <BigButton 
          title="מצב מערכת" 
          subtitle="100% תקין" 
          icon={Activity} 
          color="bg-emerald-500" 
          href="/admin/brain"
        />

        {/* 5. FINOPS (Cost) */}
        <div className="group relative overflow-hidden rounded-3xl p-8 transition-all hover:scale-[1.02] hover:shadow-xl bg-white border border-gray-200">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div className="bg-green-100 w-12 h-12 rounded-2xl flex items-center justify-center">
                <span className="text-xl">💰</span>
              </div>
              <span className="text-xs font-bold bg-green-50 text-green-700 px-2 py-1 rounded-full">LIVE</span>
            </div>
            <div>
              <h3 className="text-3xl font-black text-gray-900 mb-1">$4.20</h3>
              <p className="text-gray-500 font-medium text-sm">עלות משוערת (החודש)</p>
              <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-green-500 h-full w-[15%]" />
              </div>
            </div>
          </div>
        </div>

        {/* 6. PLAYGROUND (Apps) */}
        <Link href="/admin/apps" className="col-span-1 md:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all group flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">חנות האפליקציות</h3>
            <p className="text-gray-500">התקן יכולות חדשות</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
            <ArrowRight className="w-6 h-6 text-gray-900" />
          </div>
        </Link>

      </div>
    </div>
  );
}
