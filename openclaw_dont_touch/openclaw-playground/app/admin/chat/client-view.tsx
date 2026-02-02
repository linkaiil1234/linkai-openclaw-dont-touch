'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User } from "lucide-react";
import { getMessages, sendMessage, ChatMessage } from '@/app/actions/chat';

export function ChatClient() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Poll for messages
  useEffect(() => {
    const fetch = async () => {
      const msgs = await getMessages();
      setMessages(msgs);
    };
    
    fetch();
    const interval = setInterval(fetch, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    await sendMessage(input);
    setInput('');
    setLoading(false);
    // Optimistic update
    setMessages(prev => [...prev, {
        id: 'temp', role: 'user', content: input, timestamp: Date.now()
    }]);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto h-screen flex flex-col pb-24">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comms</h1>
          <p className="text-gray-500">Direct Neural Link</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
          Online
        </div>
      </div>

      <Card className="flex-1 flex flex-col shadow-sm border-gray-200 overflow-hidden bg-gray-50/50">
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-20">
              <Bot className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No signal history. Start transmission.</p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role !== 'user' && (
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-indigo-600" />
                </div>
              )}
              
              <div className={`max-w-[70%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
              }`}>
                {msg.content}
                <div className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-indigo-100' : 'text-gray-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </CardContent>

        <div className="p-4 bg-white border-t border-gray-200">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-3"
          >
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Transmit command to Link..." 
              className="flex-1 bg-gray-50 border-gray-200 focus:bg-white transition-all"
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !input.trim()} className="bg-indigo-600 hover:bg-indigo-700">
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
