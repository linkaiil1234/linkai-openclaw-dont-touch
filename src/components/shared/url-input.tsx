"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowUp01Icon,
  Link01Icon,
  Cancel01Icon,
  Loading02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

export type UrlInputProps = {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  onClose: () => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
};

export function UrlInput({
  value,
  onChange,
  onAdd,
  onClose,
  disabled = false,
  loading = false,
  placeholder = "your-link.com",
}: UrlInputProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onAdd();
    }
    if (event.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-linear-to-r from-primary/5 to-primary/10 backdrop-blur-sm px-3 py-2 shadow-md animate-in fade-in slide-in-from-left-2 duration-200">
      <HugeiconsIcon
        icon={Link01Icon}
        className="size-4 text-primary/70 shrink-0"
      />
      <span className="text-muted-foreground text-sm font-medium shrink-0">
        https://
      </span>
      <Input
        value={value.replace(/^https?:\/\//, "")}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="border-none bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm flex-1 min-w-0"
        disabled={disabled}
        autoFocus
      />
      <Button
        type="button"
        size="icon"
        variant="ghost"
        // rounded="full"
        onClick={onAdd}
        className={cn(
          "size-8 transition-all duration-200 shrink-0",
          value.trim() && !disabled && !loading
            ? "bg-green-500/20 hover:bg-green-500/30 text-green-600 hover:text-green-700 hover:scale-110"
            : "hover:bg-primary/20 hover:text-primary hover:scale-110",
        )}
        disabled={disabled || !value.trim() || loading}
      >
        {loading ? (
          <HugeiconsIcon
            icon={Loading02Icon}
            className="size-4 text-green-600 shrink-0 animate-spin"
          />
        ) : (
          <HugeiconsIcon
            icon={ArrowUp01Icon}
            className={cn(
              "size-4 shrink-0",
              value.trim() && !disabled && !loading
                ? "text-green-600"
                : "text-primary/70",
            )}
          />
        )}
      </Button>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        // rounded="full"
        onClick={onClose}
        className="size-8 hover:bg-destructive/20 hover:text-destructive hover:scale-110 transition-all duration-200 shrink-0"
        disabled={disabled}
        aria-label="Close URL input"
      >
        <HugeiconsIcon
          icon={Cancel01Icon}
          className="size-4 text-destructive/70 shrink-0"
        />
      </Button>
    </div>
  );
}
