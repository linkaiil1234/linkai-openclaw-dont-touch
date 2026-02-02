'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { VoiceSelector } from '@/components/wizard/VoiceSelector';
import { ConnectionsStep } from '@/components/wizard/ConnectionsStep';
import { GoLiveStep } from '@/components/wizard/GoLiveStep';

export default function WizardPage() {
  const [step, setStep] = useState(1);

  // Step 1 Component (Inline for simplicity, can extract later)
  const Step1Identity = () => (
    <Card className="w-full max-w-lg shadow-xl border-2 border-indigo-100 dark:border-indigo-900">
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Let's build your Link</CardTitle>
          <span className="text-sm font-mono text-gray-400">Step 1/4</span>
        </div>
        <CardDescription>
          We'll set up your AI business operating system in 15 minutes. No code required.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Business Name</label>
          <Input placeholder="e.g. Acme Consulting" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">What is your offer?</label>
          <Textarea 
            placeholder="Paste your elevator pitch, pricing, or service description here."
            className="min-h-[150px]"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setStep(2)}>
          Next: Give it a Voice →
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 p-4 font-sans">
      {step === 1 && <Step1Identity />}
      {step === 2 && <VoiceSelector onNext={() => setStep(3)} />}
      {step === 3 && <ConnectionsStep onNext={() => setStep(4)} />}
      {step === 4 && <GoLiveStep />}
    </div>
  );
}
