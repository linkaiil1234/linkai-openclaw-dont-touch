"use client";

import { useEffect, useState } from "react";

import { Search01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQueryParams } from "@/hooks/custom/use-query-params";
import { useDebounce } from "@/hooks/custom/use-debounce";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type SearchBarProps = {
  placeholder?: string;
  debounceDelay?: number;
  containerClassName?: string;
  searchParamKey?: string;
  value?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
};

export const SearchBar = ({
  placeholder = "Search...",
  debounceDelay = 500,
  containerClassName,
  searchParamKey,
  value: controlledValue,
  className,
  onSearch,
  onChange,
  onClear,
}: SearchBarProps) => {
  const { params, updateParams } = useQueryParams();
  const [uncontrolledQuery, setUncontrolledQuery] = useState<string>(
    controlledValue?.toString() ??
      (searchParamKey ? String(params[searchParamKey] ?? "") : "") ??
      "",
  );
  const searchQuery = controlledValue?.toString() ?? uncontrolledQuery;
  const { debouncedValue: debouncedSearchQuery } = useDebounce(
    searchQuery,
    debounceDelay,
  );

  const handleClear = () => {
    if (controlledValue === undefined) {
      setUncontrolledQuery("");
    }
    onClear?.();
  };

  useEffect(() => {
    if (searchParamKey) {
      const currentParam = String(params[searchParamKey] || "");
      const isInitialLoad = debouncedSearchQuery === currentParam;

      updateParams({
        [searchParamKey]: debouncedSearchQuery || undefined,
        page: isInitialLoad ? String(params.page || "1") : "1",
      });
    }

    onSearch?.(debouncedSearchQuery || "");
  }, [debouncedSearchQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) {
      setUncontrolledQuery(newValue);
    }
    onChange?.(e);
  };

  return (
    <div
      className={cn(
        "relative h-10 min-w-0 flex items-center overflow-hidden rounded-full border bg-background",
        containerClassName,
      )}
    >
      <Input
        className={cn(
          "placeholder:text-muted-foreground size-full border-0 bg-transparent pl-12 text-sm focus-visible:ring-0",
          searchQuery && onClear ? "pr-10" : "pr-4",
          className,
        )}
        placeholder={placeholder}
        type="text"
        value={searchQuery}
        onChange={handleChange}
      />
      <HugeiconsIcon
        icon={Search01Icon}
        className="text-muted-foreground absolute left-4 top-1/2 size-4 -translate-y-1/2"
      />
      {searchQuery && onClear && (
        <Button
          className="text-muted-foreground hover:bg-background absolute right-2 top-1/2 size-5 -translate-y-1/2"
          size="icon"
          variant="ghost"
          onClick={handleClear}
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
        </Button>
      )}
    </div>
  );
};
