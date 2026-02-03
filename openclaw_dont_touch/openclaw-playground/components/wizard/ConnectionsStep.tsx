'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

interface ConnectionsStepProps {
  onNext: () => void;
  gcalStatus: 'idle' | 'loading' | 'connected';
  setGcalStatus: (status: 'idle' | 'loading' | 'connected') => void;
  whatsappStatus: 'idle' | 'loading' | 'connected';
  setWhatsappStatus: (status: 'idle' | 'loading' | 'connected') => void;
}

export function ConnectionsStep({ onNext, gcalStatus, setGcalStatus, whatsappStatus, setWhatsappStatus }: ConnectionsStepProps) {

  const connectGcal = () => {
    setGcalStatus('loading');
    setTimeout(() => setGcalStatus('connected'), 1500); // Faster simulation
  };

  const connectWhatsapp = () => {
    setWhatsappStatus('loading');
    setTimeout(() => setWhatsappStatus('connected'), 2500); // Faster simulation
  };

  // Allow proceeding if at least ONE is connected (MVP Logic: Don't block the user)
  const isReady = gcalStatus === 'connected' || whatsappStatus === 'connected';

  return (
    <Card className="w-full max-w-lg shadow-2xl border border-indigo-50 dark:border-indigo-900 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              The Body
            </CardTitle>
            <CardDescription className="text-lg mt-1 text-gray-500">
              Give your agent access to the world.
            </CardDescription>
          </div>
          <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-mono font-bold">
            03 / 04
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        
        {/* Google Calendar */}
        <div 
          className={`group flex items-center justify-between p-5 border-2 rounded-xl transition-all duration-200 ${gcalStatus === 'connected' ? 'border-blue-100 bg-blue-50/50' : 'border-gray-100 hover:border-blue-200 bg-white'}`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full transition-colors ${gcalStatus === 'connected' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'}`}>
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Google Calendar</p>
              <p className="text-sm text-gray-500">Appointments & Availability</p>
            </div>
          </div>
          <Button 
            variant={gcalStatus === 'connected' ? "ghost" : "outline"}
            className={gcalStatus === 'connected' ? "text-blue-700 hover:text-blue-800 hover:bg-transparent cursor-default" : "border-blue-200 hover:bg-blue-50 text-blue-700"}
            onClick={connectGcal}
            disabled={gcalStatus !== 'idle'}
          >
            {gcalStatus === 'loading' && <Loader2 className="h-5 w-5 animate-spin" />}
            {gcalStatus === 'connected' && <CheckCircle2 className="h-6 w-6" />}
            {gcalStatus === 'idle' && "Connect"}
          </Button>
        </div>

        {/* WhatsApp */}
        <div 
          className={`group flex items-center justify-between p-5 border-2 rounded-xl transition-all duration-200 ${whatsappStatus === 'connected' ? 'border-green-100 bg-green-50/50' : 'border-gray-100 hover:border-green-200 bg-white'}`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full transition-colors ${whatsappStatus === 'connected' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600'}`}>
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-gray-900">WhatsApp</p>
              <p className="text-sm text-gray-500">Messaging & Follow-ups</p>
            </div>
          </div>
          <Button 
            variant={whatsappStatus === 'connected' ? "ghost" : "outline"}
            className={whatsappStatus === 'connected' ? "text-green-700 hover:text-green-800 hover:bg-transparent cursor-default" : "border-green-200 hover:bg-green-50 text-green-700"}
            onClick={connectWhatsapp}
            disabled={whatsappStatus !== 'idle'}
          >
            {whatsappStatus === 'loading' && <Loader2 className="h-5 w-5 animate-spin" />}
            {whatsappStatus === 'connected' && <CheckCircle2 className="h-6 w-6" />}
            {whatsappStatus === 'idle' && "Connect"}
          </Button>
        </div>

        {whatsappStatus === 'loading' && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <div className="h-32 w-32 bg-white shadow-sm border border-gray-100 rounded-lg mb-3 flex items-center justify-center">
               <div className="grid grid-cols-6 grid-rows-6 gap-1 p-2">
                  {/* Fake QR Pattern */}
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className={`h-full w-full rounded-sm ${Math.random() > 0.5 ? 'bg-gray-800' : 'bg-transparent'}`} />
                  ))}
               </div>
            </div>
            <p className="text-xs font-medium text-gray-500">Scanning via Composio...</p>
          </div>
        )}

      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          className={`w-full font-bold py-6 text-lg transition-all duration-300 shadow-xl ${isReady ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 hover:shadow-indigo-300 translate-y-0' : 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed'}`}
          onClick={onNext}
          disabled={!isReady}
        >
          {isReady ? (
            <span className="flex items-center gap-2">Go Live <ArrowRight className="h-5 w-5" /></span>
          ) : (
            'Connect at least one tool'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
