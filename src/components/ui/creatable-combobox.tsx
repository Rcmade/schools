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
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import * as React from "react";

export type BaseOption = { label: string; value: string };
export type CreatedOption = BaseOption & { new?: true };

type CreatableComboboxProps = {
  options: BaseOption[];
  value: string | null;
  onChange: (next: CreatedOption) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
};

export function CreatableCombobox({
  options,
  value,
  onChange,
  placeholder = "Search or create...",
  emptyText = "No results found",
  disabled,
}: CreatableComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
    );
  }, [options, search]);

  const exactMatch = options.find(
    (o) =>
      o.label.toLowerCase() === search.trim().toLowerCase() ||
      o.value.toLowerCase() === search.trim().toLowerCase()
  );

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? value ?? "";

  const handleCreate = () => {
    const raw = search.trim();
    if (!raw) return;
    // IMPORTANT: Return ONLY the created object with new: true
    // Parent can decide how to persist; we DO NOT push into local list here.
    const created: CreatedOption = { label: raw, value: raw, new: true };
    onChange(created);
    setOpen(false);
  };

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
            onValueChange={setSearch}
          />
          <CommandList>
            {filtered.length === 0 ? (
              <>
                <CommandEmpty>{emptyText}</CommandEmpty>
                {!exactMatch && search.trim().length > 0 && (
                  <div className="p-2">
                    <Button
                      type="button"
                      size="sm"
                      className="w-full"
                      onClick={handleCreate}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create &quot;{search.trim()}&quot;
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                <CommandGroup>
                  {filtered.map((opt) => (
                    <CommandItem
                      key={opt.value}
                      value={opt.value}
                      onSelect={() => {
                        onChange(opt);
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
                {!exactMatch && search.trim().length > 0 && (
                  <div className="p-2 pt-0">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={handleCreate}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create &quot;{search.trim()}&quot;
                    </Button>
                  </div>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
