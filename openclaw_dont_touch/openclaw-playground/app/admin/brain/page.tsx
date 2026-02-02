import { getLogs } from '@/app/actions/logs';
import { getMemory } from '@/app/actions/memory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Cpu, Database, Terminal, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BrainPage() {
  const [logs, memories] = await Promise.all([
    getLogs(50), // Get more logs for the terminal feel
    getMemory()
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
           <Brain className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900">Neural Network</h1>
          <p className="text-slate-500">Real-time thought process and long-term memory access.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
        
        {/* Left: Thought Stream (Terminal) */}
        <div className="lg:col-span-2 flex flex-col h-full">
           <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
               <Terminal className="h-5 w-5" /> Thought Stream
             </h2>
             <Badge variant="outline" className="animate-pulse bg-green-50 text-green-700 border-green-200">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2" /> Live
             </Badge>
           </div>
           
           <Card className="flex-1 bg-slate-950 border-slate-800 shadow-2xl overflow-hidden flex flex-col">
             <div className="p-2 border-b border-slate-800 bg-slate-900/50 flex gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500/50" />
               <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
               <div className="w-3 h-3 rounded-full bg-green-500/50" />
             </div>
             <CardContent className="p-6 font-mono text-sm overflow-y-auto flex-1 custom-scrollbar">
               <div className="space-y-3">
                 {logs.map((log, i) => (
                   <div key={log.id} className="flex gap-4 group">
                     <span className="text-slate-600 shrink-0 select-none">
                       {new Date(log.timestamp).toLocaleTimeString()}
                     </span>
                     <div className="flex-1 break-words">
                       <span className={`${
                         log.status === 'Success' ? 'text-green-400' : 
                         log.status === 'Error' ? 'text-red-400' : 'text-blue-400'
                       }`}>❯</span>
                       <span className="ml-2 text-slate-300 group-hover:text-white transition-colors">
                         {log.action}
                       </span>
                       {log.status !== 'Success' && (
                         <span className="ml-2 text-[10px] px-1 rounded bg-slate-800 text-slate-400 uppercase">
                           {log.status}
                         </span>
                       )}
                     </div>
                   </div>
                 ))}
                 <div className="animate-pulse text-green-500 mt-4">_</div>
               </div>
             </CardContent>
           </Card>
        </div>

        {/* Right: LTM (Memory Cards) */}
        <div className="h-full overflow-y-auto pr-2">
           <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2 mb-4">
             <Database className="h-5 w-5" /> Core Memories
           </h2>
           <div className="space-y-4">
             {memories.map((mem, i) => (
               <Card key={i} className="hover:shadow-md transition-all cursor-default group border-slate-200">
                 <CardHeader className="pb-3">
                   <CardTitle className="text-base flex justify-between items-start">
                      {mem.title}
                      <Sparkles className="h-4 w-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <ul className="space-y-2 mb-4">
                     {mem.content.map((line, idx) => (
                       <li key={idx} className="text-sm text-slate-600 pl-3 border-l-2 border-slate-100">
                         {line}
                       </li>
                     ))}
                   </ul>
                   <div className="flex flex-wrap gap-1">
                     {mem.tags.map(tag => (
                       <Badge key={tag} variant="secondary" className="text-[10px] bg-slate-100 text-slate-500 hover:bg-slate-200">
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
