"use client";

import { useEffect, useState, type ReactNode } from "react";

import { ArrowUpDownIcon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/custom/use-debounce";
import { cn } from "@/lib/utils";

export type ComboboxItem = {
  value: string;
  label: string | ReactNode;
  triggerLabel?: string | ReactNode;
  disabled?: boolean;
};

export type ComboboxProps = {
  items: ComboboxItem[] | undefined;
  initialValue?: string;
  selectedValue?: string;
  isSearchable?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  isError?: boolean;
  hidden?: boolean;
  searchPlaceholder?: string;
  triggerPlaceholder?: string;
  emptyMessage?: string | ReactNode;
  errorMessage?: string | ReactNode;
  loadingMessage?: string | ReactNode;
  triggerIcon?: ReactNode;
  triggerClassName?: string;
  popoverContentClassName?: string;
  itemContainerClassName?: string;
  itemClassName?: string;
  onSearchAction?: (query: string) => void;
  onSelectedValueClearAction?: () => void;
  onValueChangeAction?: (value: string) => void;
};

export const Combobox = ({
  items = [],
  initialValue,
  selectedValue,
  isSearchable = true,
  isLoading = false,
  disabled,
  isError = false,
  hidden = false,
  searchPlaceholder = "Search item...",
  triggerPlaceholder = "Select item...",
  emptyMessage = "No item found.",
  errorMessage = "Failed to load items.",
  loadingMessage = "Loading...",
  triggerIcon,
  triggerClassName,
  popoverContentClassName,
  itemContainerClassName,
  itemClassName,
  onSearchAction,
  onSelectedValueClearAction,
  onValueChangeAction,
}: ComboboxProps) => {
  const [open, setOpen] = useState(false);

  const {
    rawValue: searchValue,
    setRawValue: setSearchValue,
    debouncedValue: debouncedSearchValue,
  } = useDebounce<string>();

  const currentValue = selectedValue ?? initialValue ?? "";
  const selectedItem = items?.find((item) => item.value === currentValue);

  useEffect(() => {
    if (hidden || !isSearchable || !onSearchAction) {
      return;
    }

    onSearchAction(debouncedSearchValue ?? "");
  }, [debouncedSearchValue, isSearchable, hidden, onSearchAction]);

  const handleValueChange = (newValue: ComboboxItem) => {
    if (newValue.disabled) {
      return;
    }

    if (newValue.value === currentValue) {
      return;
    }

    setSearchValue("");
    onValueChangeAction?.(newValue.value);
    setOpen(false);
  };

  const handleClearSelectedValue = (e: React.MouseEvent) => {
    e.stopPropagation(); // Note: Prevent popover from opening
    onSelectedValueClearAction?.();
  };

  const renderTriggerIcon = () => {
    const divClassName =
      "flex size-4 shrink-0 items-center justify-center text-foreground opacity-50";

    if (selectedItem && onSelectedValueClearAction) {
      return (
        <div
          className={cn(divClassName, "hover:opacity-100")}
          role="button"
          onClick={handleClearSelectedValue}
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-full" />
        </div>
      );
    }

    if (triggerIcon) {
      return <div className={divClassName}>{triggerIcon}</div>;
    }

    return (
      <div className={divClassName}>
        <HugeiconsIcon icon={ArrowUpDownIcon} className="size-full" />
      </div>
    );
  };

  const renderEmptyMessage = () => {
    if (isLoading) {
      return loadingMessage;
    }

    if (isError) {
      return errorMessage;
    }

    if ((items?.length ?? 0) === 0) {
      return emptyMessage;
    }

    return null;
  };

  const selectedItemTriggerLabel =
    selectedItem?.triggerLabel || selectedItem?.label;

  if (hidden) {
    return null;
  }

  return (
    <Popover
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          setSearchValue("");
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className={cn(
            "border-input bg-background text-foreground hover:bg-muted dark:bg-muted w-60 justify-between px-3 hover:opacity-75",
            !selectedItemTriggerLabel && "text-foreground/50",
            triggerClassName,
          )}
          disabled={disabled}
          variant="outline"
        >
          <span className="truncate">
            {selectedItemTriggerLabel || triggerPlaceholder}
          </span>
          {renderTriggerIcon()}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          "w-(--radix-popover-trigger-width) p-0",
          popoverContentClassName,
        )}
      >
        <Command shouldFilter={false}>
          <CommandInput
            hidden={!isSearchable}
            placeholder={searchPlaceholder}
            value={searchValue ?? ""}
            onValueChange={setSearchValue}
          />

          <CommandList>
            <CommandEmpty className="p-4" hidden={!renderEmptyMessage()}>
              {renderEmptyMessage()}
            </CommandEmpty>

            {items && items.length > 0 && (
              <CommandGroup
                className={cn("[&>div]:space-y-0.5", itemContainerClassName)}
              >
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    className={cn(
                      "cursor-pointer transition-all duration-200",
                      itemClassName,
                      {
                        "cursor-not-allowed opacity-50": item.disabled,
                        "bg-muted": currentValue === item.value,
                      },
                    )}
                    value={item.value}
                    onSelect={() => handleValueChange(item)}
                  >
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
