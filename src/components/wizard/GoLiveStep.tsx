'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PartyPopper, ArrowRight, PhoneCall, LayoutDashboard } from 'lucide-react';

export function GoLiveStep() {
  const [status, setStatus] = useState<'provisioning' | 'ready'>('provisioning');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate provisioning process
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('ready');
          return 100;
        }
        return prev + 2; // 5 seconds total
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full max-w-lg shadow-xl border-2 border-indigo-100 dark:border-indigo-900 overflow-hidden">
      <CardHeader className="text-center">
        <div className="mx-auto bg-indigo-100 p-4 rounded-full w-fit mb-4 dark:bg-indigo-900">
          {status === 'ready' ? <PartyPopper className="h-8 w-8 text-indigo-600" /> : <PhoneCall className="h-8 w-8 text-indigo-600 animate-pulse" />}
        </div>
        <CardTitle className="text-3xl font-bold">
          {status === 'ready' ? "You are Live! 🚀" : "Provisioning Link AI..."}
        </CardTitle>
        <CardDescription>
          {status === 'ready' ? "Your Business OS is active and waiting for calls." : "Allocating dedicated phone line and training neural network..."}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {status === 'provisioning' ? (
          <div className="space-y-2">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-100" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-xs text-gray-400 font-mono">
              {progress < 30 ? "Securing phone number..." : 
               progress < 60 ? "Training voice model..." : 
               progress < 90 ? "Connecting integrations..." : "Finalizing..."}
            </p>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center dark:bg-green-900/20 dark:border-green-900">
            <p className="text-sm text-gray-500 mb-1">Your Dedicated AI Number</p>
            <p className="text-4xl font-black text-indigo-900 tracking-wider font-mono dark:text-white">
              055-943-2811
            </p>
            <p className="text-xs text-gray-400 mt-2">
              (Call this number now to test your full agent)
            </p>
          </div>
        )}
      </CardContent>

      {status === 'ready' && (
        <CardFooter>
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 text-lg h-auto shadow-lg shadow-indigo-200 dark:shadow-none" size="lg">
            Open Dashboard <LayoutDashboard className="ml-2 h-5 w-5" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
