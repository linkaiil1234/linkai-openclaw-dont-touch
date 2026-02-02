'use client';

import { useState, useEffect, Suspense } from 'react';
import { Card } from "@/components/ui/card";
import { useSearchParams } from 'next/navigation';
import { FileText, Book } from 'lucide-react';
import { getFileList, getFileContent } from '@/app/actions/docs';

function DocsContent() {
  const searchParams = useSearchParams();
  const initialFile = searchParams.get('file');
  
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    getFileList().then(list => {
        setFiles(list);
        
        let target = null;
        if (initialFile) {
            // Try exact match
            if (list.includes(initialFile)) {
                target = initialFile;
            } 
            // Try partial match (e.g. url has "STRATEGY.md", list has "knowledge/STRATEGY.md")
            else {
                target = list.find(f => f.endsWith(initialFile) || f.includes(initialFile));
            }
        }
        
        // Fallback to first file only if no target found
        handleSelect(target || list[0]);
    });
  }, [initialFile]);

  const handleSelect = async (file: string) => {
    setSelectedFile(file);
    const text = await getFileContent(file);
    setContent(text);
    
    // Update URL without reload (for sharing)
    const url = new URL(window.location.href);
    url.searchParams.set('file', file);
    window.history.pushState({}, '', url);
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
              {file.replace('knowledge/', '').replace('.md', '')}
            </button>
          ))}
        </div>

        {/* Content Viewer */}
        <Card className="flex-1 bg-white border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <span className="font-mono text-xs text-gray-500">{selectedFile || 'Select a file'}</span>
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

export function DocsClient() {
    return (
        <Suspense fallback={<div>Loading Docs...</div>}>
            <DocsContent />
        </Suspense>
    );
}
