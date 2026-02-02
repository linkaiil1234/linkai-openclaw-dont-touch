'use client';

import { useState } from 'react';
import { toast } from 'sonner'; // Fix: Moved import to top-level
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Play, Phone } from 'lucide-react'; 

const VOICES = [
  { id: 'dana', name: 'Dana (Hebrew)', gender: 'Female', style: 'Professional & Warm' },
  { id: 'omer', name: 'Omer (Hebrew)', gender: 'Male', style: 'Direct & Authoritative' },
  { id: 'sarah', name: 'Sarah (English)', gender: 'Female', style: 'International / Tech' },
];

export function VoiceSelector({ onNext }: { onNext: () => void }) {
  const [selectedVoice, setSelectedVoice] = useState('dana');
  const [testPhone, setTestPhone] = useState('');
  const [isCalling, setIsCalling] = useState(false);

  const handleTestCall = async () => {
    if (!testPhone) {
      toast.error("Please enter a phone number");
      return;
    }
    setIsCalling(true);
    toast.info("Initiating Test Call... (Simulation)");
    
    try {
      // Functional Test: Send data to API
      const res = await fetch('/api/wizard/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'test_call',
          phone: testPhone, 
          voice: selectedVoice 
        }),
      });
      
      const data = await res.json();
      console.log('API Response:', data);
      
      setTimeout(() => {
        toast.success("Call connected! (This is where the phone would ring)");
        setIsCalling(false);
      }, 3000);

    } catch (error) {
      console.error('API Error:', error);
      toast.error("Failed to connect");
      setIsCalling(false);
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-xl border-2 border-indigo-100 dark:border-indigo-900">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">The Voice</CardTitle>
          <span className="text-sm font-mono text-gray-400">Step 2/4</span>
        </div>
        <CardDescription>
          This is who your customers will talk to. Pick a persona.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <RadioGroup defaultValue="dana" onValueChange={setSelectedVoice} className="grid grid-cols-1 gap-4">
          {VOICES.map((voice) => (
            <div key={voice.id}>
              <RadioGroupItem value={voice.id} id={voice.id} className="peer sr-only" />
              <Label
                htmlFor={voice.id}
                className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-indigo-600 [&:has([data-state=checked])]:border-indigo-600 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-indigo-100 p-2 dark:bg-indigo-900">
                    {/* Placeholder Avatar */}
                    <span className="text-xl">🎙️</span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium leading-none">{voice.name}</p>
                    <p className="text-xs text-muted-foreground">{voice.style}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); /* Play Audio */ }}>
                  <Play className="h-4 w-4" />
                </Button>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="pt-4 border-t">
          <Label className="mb-2 block">Test it live (Magic Moment ✨)</Label>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input 
              type="tel" 
              placeholder="050-0000000" 
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
            />
            <Button type="button" onClick={handleTestCall} disabled={isCalling || !testPhone}>
              {isCalling ? 'Calling...' : <><Phone className="mr-2 h-4 w-4" /> Call Me</>}
            </Button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">
            * This will trigger a real call from the AI agent immediately.
          </p>
        </div>

        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 mt-4" size="lg" onClick={onNext}>
          Next: Connections →
        </Button>

      </CardContent>
    </Card>
  );
}
