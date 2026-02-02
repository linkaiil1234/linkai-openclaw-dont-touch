'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Assuming label exists or I use div
import { Settings, Shield, Bug, Mic, Users, Megaphone, Save, Loader2 } from 'lucide-react';
import { SystemConfig, updateConfig } from '@/app/actions/config';
import { toast } from 'sonner';

export default function SettingsClient({ initialConfig }: { initialConfig: SystemConfig }) {
  const [config, setConfig] = useState(initialConfig);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (key: keyof SystemConfig) => {
    const newValue = !config[key as keyof SystemConfig]; // TS hack for boolean toggle
    setConfig({ ...config, [key]: newValue });
    
    startTransition(async () => {
      const res = await updateConfig(key, newValue);
      if (res.success) toast.success(`${key} updated`);
      else toast.error('Failed to update');
    });
  };

  const handleSaveText = (key: keyof SystemConfig, val: string | number) => {
    startTransition(async () => {
      const res = await updateConfig(key, val);
      if (res.success) toast.success('Saved');
      else toast.error('Failed to save');
    });
  };

  return (
    <div className="space-y-6 text-gray-900">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-white border border-gray-200 rounded-xl text-gray-500 shadow-sm">
           <Settings className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900">System Settings</h1>
          <p className="text-gray-500">Configure global feature flags and system limits.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Feature Flags */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900"><Shield className="h-5 w-5 text-indigo-600"/> Feature Flags</CardTitle>
            <CardDescription className="text-gray-500">Control system behavior in real-time.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded text-red-600"><Shield className="h-5 w-5" /></div>
                <div>
                  <p className="font-bold text-gray-900">Maintenance Mode</p>
                  <p className="text-xs text-gray-500">Disable access for all users</p>
                </div>
              </div>
              <Switch checked={config.maintenanceMode} onCheckedChange={() => handleToggle('maintenanceMode')} disabled={isPending} />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded text-yellow-600"><Bug className="h-5 w-5" /></div>
                <div>
                  <p className="font-bold text-gray-900">Debug Mode</p>
                  <p className="text-xs text-gray-500">Verbose logging to Redis</p>
                </div>
              </div>
              <Switch checked={config.debugMode} onCheckedChange={() => handleToggle('debugMode')} disabled={isPending} />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded text-blue-600"><Mic className="h-5 w-5" /></div>
                <div>
                  <p className="font-bold text-gray-900">Enable Voice AI</p>
                  <p className="text-xs text-gray-500">Allow users to talk to the wizard</p>
                </div>
              </div>
              <Switch checked={config.enableVoice} onCheckedChange={() => handleToggle('enableVoice')} disabled={isPending} />
            </div>

          </CardContent>
        </Card>

        {/* Global Config */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900"><Settings className="h-5 w-5 text-emerald-600"/> General Config</CardTitle>
            <CardDescription className="text-gray-500">System limits and messaging.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
             <div className="space-y-2">
               <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                 <Users className="h-4 w-4 text-gray-400" /> Max Daily Users
               </label>
               <div className="flex gap-2">
                 <Input 
                   type="number" 
                   value={config.maxDailyUsers} 
                   onChange={(e) => setConfig({ ...config, maxDailyUsers: parseInt(e.target.value) })}
                   className="bg-white border-gray-200 text-gray-900"
                 />
                 <Button 
                   size="icon" 
                   variant="outline" 
                   disabled={isPending}
                   onClick={() => handleSaveText('maxDailyUsers', config.maxDailyUsers)}
                   className="border-gray-200 hover:bg-gray-100 text-gray-700"
                 >
                   <Save className="h-4 w-4" />
                 </Button>
               </div>
             </div>

             <div className="space-y-2">
               <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                 <Megaphone className="h-4 w-4 text-gray-400" /> Promo Message
               </label>
               <div className="flex gap-2">
                 <Input 
                   value={config.promoMessage} 
                   onChange={(e) => setConfig({ ...config, promoMessage: e.target.value })}
                   className="bg-white border-gray-200 text-gray-900"
                 />
                 <Button 
                   size="icon" 
                   variant="outline" 
                   disabled={isPending}
                   onClick={() => handleSaveText('promoMessage', config.promoMessage)}
                   className="border-gray-200 hover:bg-gray-100 text-gray-700"
                 >
                   <Save className="h-4 w-4" />
                 </Button>
               </div>
             </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}

function Switch({ checked, onCheckedChange, disabled }: { checked: boolean; onCheckedChange: () => void; disabled: boolean }) {
  return (
    <button
      onClick={onCheckedChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 ${
        checked ? 'bg-indigo-600' : 'bg-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`${
          checked ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm`}
      />
    </button>
  );
}
