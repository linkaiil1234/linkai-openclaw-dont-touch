import { getAnalytics } from '@/app/actions/analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Users, Clock, Target, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const data = await getAnalytics();

  if (!data) return <div className="text-slate-500">Loading metrics...</div>;

  const maxTraffic = Math.max(...data.traffic);

  return (
    <div className="space-y-8 text-slate-100">
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Zap className="h-8 w-8 text-yellow-500" /> Wizard Analytics
        </h1>
        <p className="text-slate-500 mt-1">Performance metrics for the onboarding flow.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Total Visitors" value={data.overview.totalVisitors.toString()} icon={Users} trend="+12%" />
        <KpiCard title="Active Now" value={data.overview.activeNow.toString()} icon={Zap} trend="Live" color="text-green-400" />
        <KpiCard title="Conversion Rate" value={`${data.overview.conversionRate}%`} icon={Target} trend="+2.4%" color="text-yellow-400" />
        <KpiCard title="Avg. Time" value={data.overview.avgTime} icon={Clock} trend="-30s" color="text-blue-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Traffic Chart */}
        <Card className="lg:col-span-2 bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle>Traffic Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-4 px-2">
              {data.traffic.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                   <div 
                     className="w-full bg-indigo-600 rounded-t-md hover:bg-indigo-500 transition-all relative group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                     style={{ height: `${(val / maxTraffic) * 100}%` }}
                   >
                     <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700">
                       {val} visits
                     </span>
                   </div>
                   <span className="text-xs text-slate-500 font-mono">Day {i+1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Funnel */}
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {data.funnel.map((step, i) => {
               const percent = Math.round((step.count / data.funnel[0].count) * 100);
               return (
                 <div key={i} className="relative">
                   <div className="flex justify-between text-sm mb-1">
                     <span className="font-medium text-slate-300">{step.step}</span>
                     <span className="text-slate-400">{step.count} ({percent}%)</span>
                   </div>
                   <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                       style={{ width: `${percent}%` }}
                     />
                   </div>
                   {step.dropoff > 0 && (
                     <p className="text-[10px] text-red-400 mt-1 text-right flex items-center justify-end gap-1">
                       <ArrowDownRight className="h-3 w-3" /> {step.dropoff}% dropoff
                     </p>
                   )}
                 </div>
               );
            })}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

function KpiCard({ title, value, icon: Icon, trend, color = "text-white" }: any) {
  return (
    <Card className="bg-slate-900 border-slate-800 text-slate-100">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg bg-slate-800 ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full bg-slate-800 ${trend.includes('+') ? 'text-green-400' : 'text-slate-400'}`}>
            {trend}
          </span>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
