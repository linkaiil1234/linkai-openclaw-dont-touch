import { getLogs } from '@/app/actions/logs';
import { getMemory } from '@/app/actions/memory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Cpu, Database, Terminal, FileText, History } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BrainPage() {
  const [logs, memories] = await Promise.all([
    getLogs(100),
    getMemory()
  ]);

  return (
    <div className="space-y-8 text-gray-900 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center gap-3 shrink-0">
        <div className="p-3 bg-white border border-gray-200 rounded-xl text-indigo-600 shadow-sm">
           <Brain className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900">Neural Interface</h1>
          <p className="text-gray-500">Live inspection of my thought process and long-term memory.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
        
        {/* Left: Thought Stream (Terminal) */}
        <div className="lg:col-span-2 flex flex-col h-full min-h-0">
           <div className="flex items-center justify-between mb-4 shrink-0">
             <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
               <Terminal className="h-5 w-5" /> Live Thought Stream
             </h2>
             <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Connected
             </Badge>
           </div>
           
           <Card className="flex-1 bg-slate-900 border-slate-800 shadow-lg overflow-hidden flex flex-col">
             <div className="p-3 border-b border-slate-800 bg-slate-950/50 flex gap-2 shrink-0">
               <div className="w-3 h-3 rounded-full bg-red-500/50" />
               <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
               <div className="w-3 h-3 rounded-full bg-green-500/50" />
             </div>
             <CardContent className="p-6 font-mono text-sm overflow-y-auto flex-1 custom-scrollbar text-slate-300">
               <div className="space-y-2">
                 {logs.map((log, i) => (
                   <div key={log.id} className="flex gap-4 hover:bg-white/5 p-1 rounded -mx-1 transition-colors">
                     <span className="text-slate-600 shrink-0 select-none w-16 text-right">
                       {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                     </span>
                     <div className="flex-1 break-words">
                       <span className={`${
                         log.status === 'Success' ? 'text-emerald-400' : 
                         log.status === 'Error' ? 'text-red-400' : 'text-blue-400'
                       }`}>❯</span>
                       <span className="ml-3 text-slate-200">
                         {log.action}
                       </span>
                     </div>
                   </div>
                 ))}
                 <div className="animate-pulse text-emerald-500 mt-2">_</div>
               </div>
             </CardContent>
           </Card>
        </div>

        {/* Right: LTM (Documentation) */}
        <div className="flex flex-col h-full min-h-0">
           <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2 mb-4 shrink-0">
             <FileText className="h-5 w-5" /> Active Memory (Documentation)
           </h2>
           <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
             {memories.map((mem, i) => (
               <Card key={i} className="border border-gray-200 shadow-sm bg-white group hover:border-indigo-200 transition-colors">
                 <CardHeader className="pb-3 border-b border-gray-50 bg-gray-50/50">
                   <div className="flex justify-between items-start">
                      <CardTitle className="text-base text-gray-900 font-semibold">{mem.title}</CardTitle>
                      <Database className="h-4 w-4 text-gray-400" />
                   </div>
                 </CardHeader>
                 <CardContent className="pt-4">
                   <ul className="space-y-3">
                     {mem.content.map((line, idx) => (
                       <li key={idx} className="text-sm text-gray-600 pl-3 border-l-2 border-indigo-100 leading-relaxed">
                         {line}
                       </li>
                     ))}
                   </ul>
                   <div className="flex flex-wrap gap-1.5 mt-4">
                     {mem.tags.map(tag => (
                       <Badge key={tag} variant="secondary" className="text-[10px] bg-gray-100 text-gray-500 border border-gray-200">
                         #{tag}
                       </Badge>
                     ))}
                   </div>
                 </CardContent>
               </Card>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
}
