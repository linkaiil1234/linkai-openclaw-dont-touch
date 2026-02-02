"use client";

import { Sparkles, FileText, Wand2, RotateCcw, Layers } from "lucide-react";

interface EditPanelProps {
  editPrompt: string;
  setEditPrompt: (value: string) => void;
  onApply: () => void;
}

export default function EditPanel({
  editPrompt,
  setEditPrompt,
  onApply,
}: EditPanelProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header with gradient */}
      <div className="p-6 bg-linear-to-l from-blue-500/10 via-purple-500/5 to-transparent border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Wand2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Edit with AI
            </h1>
            <p className="text-sm text-muted-foreground">
              תאר את השינויים שתרצה לבצע
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Current Content Preview */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <label className="text-sm font-medium text-foreground">
              תצוגה מקדימה
            </label>
          </div>
          <div className="rounded-2xl overflow-hidden border border-border bg-linear-to-br from-blue-50 to-purple-50 p-1">
            <div className="bg-card rounded-xl p-4 min-h-[120px]">
              <div className="space-y-3">
                <div className="h-3 w-3/4 bg-muted rounded-full" />
                <div className="h-3 w-1/2 bg-muted rounded-full" />
                <div className="h-8 w-32 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg mt-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Edit Instructions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            <label className="text-sm font-medium text-foreground">
              הוראות לסוכן
            </label>
          </div>
          <textarea
            value={editPrompt}
            onChange={(e) => setEditPrompt(e.target.value)}
            placeholder="לדוגמה: שנה את הכותרת לגדולה יותר, הוסף צבע כחול לכפתורים, הסר את התמונה..."
            className="w-full h-36 bg-muted/50 border border-border rounded-2xl p-4 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none transition-all"
          />
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            פעולות מהירות
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-muted/50 border border-border hover:border-primary/50 hover:bg-muted text-foreground transition-all group">
              <Layers className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium">שכפל</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-muted/50 border border-border hover:border-primary/50 hover:bg-muted text-foreground transition-all group">
              <RotateCcw className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium">בטל</span>
            </button>
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <div className="p-6 border-t border-border bg-card">
        <button
          onClick={onApply}
          disabled={!editPrompt.trim()}
          className="w-full py-4 rounded-2xl bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          החל שינויים
        </button>
      </div>
    </div>
  );
}
