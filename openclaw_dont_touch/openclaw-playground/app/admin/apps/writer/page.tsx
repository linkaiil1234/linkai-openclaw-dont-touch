'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Pen, Sparkles, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function WriterPage() {
  const [topic, setTopic] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    // Mock AI generation for MVP
    setTimeout(() => {
      setOutput(`🚀 Just launched our new ${topic || 'product'}!\n\nIt's a game-changer for the industry. We focused on speed, design, and autonomy.\n\nCheck it out here: [Link]\n\n#Tech #Growth #Innovation`);
      setLoading(false);
      toast.success('Content generated!');
    }, 1500);
  };

  return (
    <div className="space-y-6 text-gray-900">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-white border border-gray-200 rounded-xl text-purple-600 shadow-sm">
           <Pen className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900">Ghost Writer</h1>
          <p className="text-gray-500">AI-powered content generator for social media.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-white border-gray-200 shadow-sm h-full">
          <CardHeader>
            <CardTitle>Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder="What do you want to write about? (e.g., 'New AI Feature')" 
              className="min-h-[200px] bg-gray-50 border-gray-200"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" onClick={generate} disabled={loading}>
              {loading ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate Draft
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm h-full">
          <CardHeader>
            <CardTitle>Output</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="min-h-[200px] p-4 bg-gray-50 rounded-md border border-gray-200 text-sm whitespace-pre-wrap">
              {output || <span className="text-gray-400 italic">Generated content will appear here...</span>}
            </div>
            <Button variant="outline" className="w-full" onClick={() => { navigator.clipboard.writeText(output); toast.success('Copied!'); }} disabled={!output}>
              <Copy className="mr-2 h-4 w-4" /> Copy to Clipboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
