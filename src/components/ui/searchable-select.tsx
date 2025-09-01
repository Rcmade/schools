"use client";

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
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

export type Option = { label: string; value: string };

type SearchableSelectProps = {
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  // fetchOptions: (query: string) => Promise<Option[]>;
  disabled?: boolean;
  isLoading?: boolean;
  options: Option[];
  onSearchChange?: (query: string) => void;
  searchVal?: string;
};

export function SearchableSelect({
  value,
  onChange,
  placeholder = "Search...",
  emptyText = "No results found",
  isLoading = false,
  // fetchOptions,
  options,
  disabled,
  searchVal,
  onSearchChange,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState(searchVal || "");

  const selectedLabel =
    options?.find((o) => o.value === value)?.label ?? value ?? "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedLabel || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={search}
            onValueChange={(e) => {
              onSearchChange?.(e);
              setSearch(e);
            }}
          />
          <CommandList>
            {isLoading ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : (
              <>
                <CommandEmpty>{emptyText}</CommandEmpty>
                <CommandGroup>
                  {(options ?? [])
                    ?.filter((o) => o.label.toLowerCase().includes(search))
                    .map((opt) => (
                      <CommandItem
                        key={opt.value}
                        value={opt.value}
                        onSelect={() => {
                          onChange?.(opt.value);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === opt.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {opt.label}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
