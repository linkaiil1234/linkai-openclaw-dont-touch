'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { VoiceSelector } from '@/components/wizard/VoiceSelector';
import { ConnectionsStep } from '@/components/wizard/ConnectionsStep';
import { GoLiveStep } from '@/components/wizard/GoLiveStep';
import { toast } from 'sonner';

interface WizardData {
  businessName: string;
  offer: string;
  voiceId: string;
  gcalStatus: 'idle' | 'loading' | 'connected';
  whatsappStatus: 'idle' | 'loading' | 'connected';
}

// Accept config props to use feature flags inside the wizard logic
export default function WizardClient({ enableVoice, promoMessage }: { enableVoice: boolean; promoMessage: string }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({
    businessName: '',
    offer: '',
    voiceId: 'dana',
    gcalStatus: 'idle',
    whatsappStatus: 'idle'
  });

  const updateData = (updates: Partial<WizardData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const submitStep1 = async () => {
    if (!data.businessName || !data.offer) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Save draft
    try {
        await fetch('/api/wizard/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ step: 1, ...data }),
        });
    } catch (e) {
        console.error("Failed to save draft", e);
    }
    
    setStep(2);
  };

  const submitFinal = async () => {
      // Final submission logic could go here or in GoLiveStep
      try {
        await fetch('/api/wizard/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ step: 4, final: true, ...data }),
        });
        toast.success("Wizard Completed!");
    } catch (e) {
        console.error("Failed to submit final", e);
    }
  };

  const Step1Identity = () => (
    <Card className="w-full max-w-lg shadow-xl border-2 border-indigo-100 dark:border-indigo-900 bg-white dark:bg-slate-900">
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Let's build your Link</CardTitle>
          <span className="text-sm font-mono text-gray-400">Step 1/4</span>
        </div>
        <CardDescription>
          {promoMessage || "We'll set up your AI business operating system in 15 minutes. No code required."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Business Name</label>
          <Input 
            placeholder="e.g. Acme Consulting" 
            value={data.businessName}
            onChange={(e) => updateData({ businessName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">What is your offer?</label>
          <Textarea 
            placeholder="Paste your elevator pitch, pricing, or service description here."
            className="min-h-[150px]"
            value={data.offer}
            onChange={(e) => updateData({ offer: e.target.value })}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" onClick={submitStep1}>
          Next: Give it a Voice →
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 p-4 font-sans">
      {step === 1 && <Step1Identity />}
      {step === 2 && (enableVoice ? (
        <VoiceSelector 
          selectedVoice={data.voiceId}
          onVoiceChange={(voice) => updateData({ voiceId: voice })}
          onNext={() => setStep(3)} 
        />
      ) : (
        <div className="text-center">Voice Mode Disabled by Admin. <Button onClick={() => setStep(3)}>Skip</Button></div>
      ))}
      {step === 3 && (
        <ConnectionsStep 
          gcalStatus={data.gcalStatus}
          setGcalStatus={(status) => updateData({ gcalStatus: status })}
          whatsappStatus={data.whatsappStatus}
          setWhatsappStatus={(status) => updateData({ whatsappStatus: status })}
          onNext={() => {
              setStep(4);
              submitFinal();
          }} 
        />
      )}
      {step === 4 && <GoLiveStep />}
    </div>
  );
}
