'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Book } from 'lucide-react';
import { getFileList, getFileContent } from '@/app/actions/docs';

export function DocsClient() {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    getFileList().then(list => {
        setFiles(list);
        if (list.length > 0) handleSelect(list[0]);
    });
  }, []);

  const handleSelect = async (file: string) => {
    setSelectedFile(file);
    const text = await getFileContent(file);
    setContent(text);
  };

  return (
    <div className="p-8 h-screen bg-gray-50 flex flex-col">
      <header className="mb-8 flex items-center gap-3">
        <div className="bg-orange-100 p-2 rounded-lg">
            <Book className="w-6 h-6 text-orange-600" />
        </div>
        <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Knowledge Base</h1>
            <p className="text-gray-500 font-medium">Internal Documentation</p>
        </div>
      </header>

      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 flex flex-col gap-2 overflow-y-auto">
          {files.map(file => (
            <button
              key={file}
              onClick={() => handleSelect(file)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold text-left ${
                selectedFile === file 
                  ? 'bg-white text-orange-600 shadow-md border border-orange-100' 
                  : 'text-gray-500 hover:bg-white/50 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              {file}
            </button>
          ))}
        </div>

        {/* Content Viewer */}
        <Card className="flex-1 bg-white border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <span className="font-mono text-xs text-gray-500">{selectedFile ? `/workspace/${selectedFile}` : ''}</span>
                <span className="text-xs font-bold bg-gray-200 text-gray-600 px-2 py-1 rounded">Markdown</span>
            </div>
            <div className="flex-1 p-8 overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
                {content}
            </div>
        </Card>
      </div>
    </div>
  );
}
