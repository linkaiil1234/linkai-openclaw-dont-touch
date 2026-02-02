import { getConfig } from '@/app/actions/config';
import WizardClient from './wizard-client';
import { AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function WizardPage() {
  const config = await getConfig();

  if (config.maintenanceMode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4">
        <div className="bg-slate-900 p-8 rounded-xl border border-red-900/50 text-center max-w-md shadow-2xl">
          <div className="mx-auto w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-6 text-red-500">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">System Maintenance</h1>
          <p className="text-slate-400">
            The Link OS Wizard is currently undergoing upgrades. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return <WizardClient enableVoice={config.enableVoice} promoMessage={config.promoMessage} />;
}
