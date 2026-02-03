'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (res.ok) {
        setStatus('success');
        toast.success("Welcome to the future.");
        setEmail('');
      } else {
        toast.error("Something went wrong. Try again.");
        setStatus('idle');
      }
    } catch (error) {
      toast.error("Network error.");
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex items-center justify-center gap-2 p-4 bg-green-50 text-green-700 rounded-full border border-green-200 animate-in fade-in zoom-in duration-300">
        <CheckCircle2 className="w-5 h-5" />
        <span className="font-bold">You're in. Watch your inbox.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-sm mx-auto mt-8">
      <div className="relative flex-1">
        <Input 
          type="email" 
          placeholder="Enter your email..." 
          className="h-12 rounded-full border-2 border-gray-200 focus:border-indigo-500 focus:ring-0 pl-5 pr-12 bg-white/80 backdrop-blur-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
          required
        />
        <Sparkles className="absolute right-4 top-3.5 w-5 h-5 text-indigo-400 opacity-50" />
      </div>
      <Button 
        type="submit" 
        className="h-12 rounded-full px-8 font-bold bg-black hover:bg-gray-800 text-white transition-all hover:scale-105"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : "Join Waitlist"}
      </Button>
    </form>
  );
}
