'use client';

import { useState } from 'react';
import { ArrowRight, Check, Sparkles, Tag, Plus, Mail } from 'lucide-react';
import { suggestCategories, runSortTest } from './actions';

// Types & Config
type Category = { id: string; name: string; desc: string; color: string; isDefault?: boolean };
const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#6b7280', '#000000'];

const DEFAULTS: Category[] = [
  { id: 'invoices', name: '01 Invoices', desc: 'Receipts & Billing', color: '#3b82f6', isDefault: true },
  { id: 'security', name: '03 Security', desc: '2FA & Login Alerts', color: '#ef4444', isDefault: true },
  { id: 'meta', name: '09 Meta', desc: 'Social Notifications', color: '#a855f7', isDefault: true },
  { id: 'newsletters', name: 'Newsletters', desc: 'Marketing & Updates', color: '#10b981', isDefault: true },
  { id: 'travel', name: 'Travel', desc: 'Flights & Booking', color: '#f59e0b', isDefault: true },
  { id: 'events', name: 'Events', desc: 'Webinars & Meetups', color: '#8b5cf6', isDefault: true },
  { id: 'finance', name: 'Finance', desc: 'Bank & Tax Updates', color: '#22c55e', isDefault: true },
  { id: 'legal', name: 'Legal', desc: 'Contracts & Terms', color: '#6b7280', isDefault: true },
  { id: 'hr', name: 'HR/Team', desc: 'Internal Updates', color: '#ec4899', isDefault: true },
  { id: 'support', name: 'Support', desc: 'Tickets & Help', color: '#0ea5e9', isDefault: true }
];

export default function EmailSorterPage() {
  const [step, setStep] = useState(1);
  const [manifesto, setManifesto] = useState('');
  const [aiCats, setAiCats] = useState<Category[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(DEFAULTS.map(c => c.id)));
  const [loadingAi, setLoadingAi] = useState(false);
  const [error, setError] = useState('');
  const [liveLog, setLiveLog] = useState<any[]>([]);
  
  // Timing
  const [timingType, setTimingType] = useState('realtime');
  const [batchInterval, setBatchInterval] = useState(4);
  const [dailyTime, setDailyTime] = useState('08:00');

  // Color Picker
  const [colorPickerTarget, setColorPickerTarget] = useState<string | null>(null);

  const handleNext = async () => {
    if (step === 1) {
      if (!manifesto.trim()) return setError('Please describe your work.');
      setLoadingAi(true);
      setError('');
      if (aiCats.length === 0) {
        await fetchMore();
      } else {
          setLoadingAi(false);
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const fetchMore = async () => {
    setLoadingAi(true);
    const existing = [...aiCats.map(c => c.id), ...DEFAULTS.map(c => c.id)];
    const res = await suggestCategories(manifesto, existing);
    if (res.success) setAiCats(prev => [...prev, ...res.data]);
    setLoadingAi(false);
  };

  const toggleCat = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const updateColor = (color: string) => {
    if (!colorPickerTarget) return;
    setAiCats(prev => prev.map(c => c.id === colorPickerTarget ? { ...c, color } : c));
    setColorPickerTarget(null);
  };

  const handleConnect = async () => {
    // Simulate Connect
    setTimeout(async () => {
        setStep(5);
        const res = await runSortTest(manifesto, []);
        if (res.success) setLiveLog(res.results);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white flex flex-col">
      <div className="w-full h-1 bg-gray-100 sticky top-0 z-50">
        <div className="h-full bg-black transition-all duration-500 ease-out" style={{ width: `${(step / 5) * 100}%` }} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        
        {/* STEP 1 */}
        {step === 1 && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl font-semibold mb-3 tracking-tight">Who are you?</h1>
            <p className="text-gray-500 mb-8 text-lg">What is your job or occupation? We'll tailor the sorting logic to your needs.</p>
            <textarea 
              value={manifesto}
              onChange={e => setManifesto(e.target.value)}
              className="w-full h-48 bg-gray-50 border border-gray-200 rounded-2xl p-6 text-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none resize-none shadow-sm placeholder-gray-400" 
              placeholder="e.g. I'm a startup founder. I need to see investor updates and legal docs immediately. I hate newsletters..."
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <div className="mt-8 flex justify-end">
              <button onClick={handleNext} disabled={loadingAi} className="bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition flex items-center gap-2 text-lg shadow-xl hover:shadow-2xl disabled:opacity-50">
                {loadingAi ? 'Thinking...' : <>Next <ArrowRight className="w-5 h-5" /></>}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-semibold mb-2">Your Buckets</h1>
            <p className="text-gray-500 mb-8">Select the categories you want to use.</p>

            <div className="space-y-10">
              <div>
                <div className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Suggested for you
                </div>
                {loadingAi && aiCats.length === 0 ? (
                  <div className="py-12 text-center border border-dashed border-gray-200 rounded-xl">
                    <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-black rounded-full mx-auto mb-3"></div>
                    <span className="text-sm text-gray-400">Analyzing your manifesto...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {aiCats.map(cat => (
                      <CategoryCard key={cat.id} cat={cat} isSelected={selectedIds.has(cat.id)} onToggle={() => toggleCat(cat.id)} onColorClick={() => setColorPickerTarget(cat.id)} />
                    ))}
                  </div>
                )}
                <div className="mt-4 text-center">
                  <button onClick={fetchMore} disabled={loadingAi} className="text-sm font-medium text-gray-500 hover:text-black transition flex items-center gap-2 mx-auto bg-gray-50 px-5 py-2.5 rounded-full border border-gray-100 hover:border-gray-300">
                    {loadingAi ? <span className="animate-spin w-3 h-3 border-2 border-gray-400 border-t-black rounded-full"></span> : <Plus className="w-4 h-4" />}
                    More Suggestions
                  </button>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Default Categories</div>
                <div className="grid grid-cols-2 gap-3">
                  {DEFAULTS.map(cat => (
                    <CategoryCard key={cat.id} cat={cat} isSelected={selectedIds.has(cat.id)} onToggle={() => toggleCat(cat.id)} onColorClick={() => {}} small />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-between items-center">
              <button onClick={() => setStep(1)} className="text-gray-400 hover:text-black font-medium px-4 py-2">Back</button>
              <button onClick={handleNext} className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition shadow-lg">Next</button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h1 className="text-3xl font-semibold mb-3">When to run?</h1>
             <div className="space-y-4 mt-8">
                <label className={`flex items-center gap-5 p-6 border rounded-2xl cursor-pointer transition-all ${timingType === 'realtime' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="timing" value="realtime" checked={timingType === 'realtime'} onChange={() => setTimingType('realtime')} className="w-6 h-6 accent-black" />
                  <div><div className="font-medium text-lg">Real-time</div><div className="text-gray-500">Sorts immediately as emails arrive.</div></div>
                </label>
                
                <div className={`border rounded-2xl transition-all ${timingType === 'hourly' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                   <label className="flex items-center gap-5 p-6 cursor-pointer">
                      <input type="radio" name="timing" value="hourly" checked={timingType === 'hourly'} onChange={() => setTimingType('hourly')} className="w-6 h-6 accent-black" />
                      <div><div className="font-medium text-lg">Hourly Batch</div><div class="text-gray-500">Process inbox periodically.</div></div>
                   </label>
                   {timingType === 'hourly' && (
                     <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2">
                        <div className="flex justify-between mb-2">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Interval</span>
                            <span className="text-sm font-medium text-black">Every {batchInterval} hours</span>
                        </div>
                        <input type="range" min="1" max="24" value={batchInterval} onChange={(e) => setBatchInterval(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" />
                        <div className="flex justify-between text-xs text-gray-400 mt-2"><span>1h</span><span>12h</span><span>24h</span></div>
                     </div>
                   )}
                </div>

                <div className={`border rounded-2xl transition-all ${timingType === 'daily' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                   <label className="flex items-center gap-5 p-6 cursor-pointer">
                      <input type="radio" name="timing" value="daily" checked={timingType === 'daily'} onChange={() => setTimingType('daily')} className="w-6 h-6 accent-black" />
                      <div><div className="font-medium text-lg">Daily Cleanse</div><div class="text-gray-500">Wake up to a sorted inbox.</div></div>
                   </label>
                   {timingType === 'daily' && (
                     <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2 flex items-center gap-3">
                        <span className="text-sm text-gray-600 font-medium">Run at:</span>
                        <input type="time" value={dailyTime} onChange={(e) => setDailyTime(e.target.value)} className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none" />
                     </div>
                   )}
                </div>
             </div>
             <div className="mt-12 flex justify-between items-center">
                <button onClick={() => setStep(2)} className="text-gray-400 hover:text-black font-medium px-4 py-2">Back</button>
                <button onClick={handleNext} className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition shadow-lg">Next</button>
             </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl mx-auto flex items-center justify-center mb-8 shadow-inner">
               <Mail className="w-10 h-10 text-gray-600" />
            </div>
            <h1 className="text-4xl font-semibold mb-4">Connect Gmail</h1>
            <p className="text-gray-500 mb-10 max-w-sm mx-auto text-lg">We need permission to manage your labels. We never store email content.</p>
            <button onClick={handleConnect} className="bg-[#4285F4] text-white px-8 py-4 rounded-full font-medium hover:bg-[#3367D6] transition shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 mx-auto w-full max-w-xs text-lg">
                <svg className="w-6 h-6" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 15.25 5 12c0-3.26 3.36-7.27 7.2-7.27c3.09-.34 5.29 1.3 5.29 1.3l1.9-2.1s-2.04-2.3-7.2-2.3C6.76 1.63 1 6.53 1 12s5.76 10.37 11.2 10.37c4.88 0 9.73-3.07 9.73-10.4c0-.93-.1-1.27-.1-1.27"/></svg>
                Sign in with Google
            </button>
            <button onClick={() => setStep(3)} className="mt-8 text-gray-400 hover:text-black font-medium">Back</button>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div className="text-center animate-in fade-in zoom-in-95 duration-500 w-full">
             <div className="w-24 h-24 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-8 text-green-600 animate-bounce">
                <Check className="w-12 h-12" />
             </div>
             <h1 className="text-4xl font-semibold mb-4">All Set!</h1>
             <p className="text-gray-500 text-lg mb-8">Running a live test on your inbox...</p>
             
             <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm max-w-xl mx-auto text-left">
                <div className="px-4 py-3 border-b border-gray-200 bg-white flex justify-between items-center">
                     <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Live Log</span>
                     <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                </div>
                <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                    {liveLog.length === 0 ? (
                        <div className="p-6 text-center text-sm text-gray-400 italic">Connecting to Gmail...</div>
                    ) : (
                        liveLog.map((item, i) => (
                            <div key={i} className="px-4 py-3 flex justify-between items-start gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-gray-900 truncate">{item.from}</div>
                                    <div className="text-xs text-gray-500 truncate">{item.subject}</div>
                                    <div className="text-[10px] text-gray-400 mt-1 italic">"{item.reason}"</div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-600">Move</span>
                                    <span className="text-[10px] text-gray-500 font-medium">📂 {item.category}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
             </div>
          </div>
        )}
      
      </div>

      {/* Color Picker */}
      {colorPickerTarget && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[100] backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setColorPickerTarget(null)}>
            <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 w-80 grid grid-cols-5 gap-3" onClick={e => e.stopPropagation()}>
                {COLORS.map(c => (
                    <button key={c} onClick={() => updateColor(c)} className="w-10 h-10 rounded-full hover:scale-110 transition border-2 border-transparent hover:border-black/10 shadow-sm" style={{ backgroundColor: c }} />
                ))}
            </div>
        </div>
      )}
    </div>
  );
}

function CategoryCard({ cat, isSelected, onToggle, onColorClick, small }: any) {
  return (
    <div onClick={onToggle} className={`border rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-200 ${isSelected ? 'border-black bg-gray-50 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'} ${small ? 'py-3 px-4' : 'py-5 px-5'}`}>
        <div className="flex items-center gap-4">
            <button onClick={(e) => { e.stopPropagation(); onColorClick(); }} className="w-10 h-10 rounded-full border border-gray-200 shadow-sm flex items-center justify-center hover:scale-110 transition group" style={{ backgroundColor: cat.color }}>
                <Tag className="w-4 h-4 text-white opacity-90 group-hover:scale-110 transition" />
            </button>
            <div>
                <div className={`font-medium ${small ? 'text-sm' : 'text-lg'} ${isSelected ? 'text-black' : 'text-gray-700'}`}>{cat.name}</div>
                <div className="text-xs text-gray-400">{cat.desc}</div>
            </div>
        </div>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-black border-black text-white scale-100' : 'border-gray-200 text-transparent scale-90'}`}>
            <Check className="w-3.5 h-3.5" />
        </div>
    </div>
  );
}
