"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Slider } from "@/components/ui/slider";
import useGetBoardAndMedium from "@/features/school/hooks/useGetBoardAndMedium";
import useGetCities from "@/features/school/hooks/useGetCities";
import { useDebounce } from "@/hooks/useDebounce";
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams";
import { cn } from "@/lib/utils";
import { useState } from "react";

const defaultFilterState = {
  city: "",
  boards: [] as string[],
  mediums: [] as string[],
  minFees: 0,
  maxFees: 500000,
};

const sliderMarks = [0, 100000, 200000, 300000, 400000, 500000];

const SearchFilterSidebar = () => {
  const { updateSearchParams, searchParams } = useUpdateSearchParams(true);

  const { data: cities = [], isLoading } = useGetCities();
  const { data: boardAndMedium } = useGetBoardAndMedium();

  const debounceSearch = useDebounce(updateSearchParams, 500);

  const [value, setValue] = useState({
    city: searchParams.get("city") || defaultFilterState.city,
    boards: searchParams.get("boards")?.split(",") || defaultFilterState.boards,
    mediums:
      searchParams.get("mediums")?.split(",") || defaultFilterState.mediums,
    minFees: Number(searchParams.get("minFees") ?? defaultFilterState.minFees),
    maxFees: Number(searchParams.get("maxFees") ?? defaultFilterState.maxFees),
  });

  const updateCity = (v: string) => {
    setValue((prev) => ({
      ...prev,
      city: v,
    }));
  };

  // --- Handlers ---
  const toggleBoard = (board: string, checked: boolean) => {
    const newBoards = checked
      ? [...value.boards, board]
      : value.boards.filter((b) => b !== board);

    setValue((prev) => ({ ...prev, boards: newBoards }));
    debounceSearch({ boards: newBoards });
  };

  const toggleMedium = (medium: string, checked: boolean) => {
    const newMediums = checked
      ? [...value.mediums, medium]
      : value.mediums.filter((m) => m !== medium);

    setValue((prev) => ({ ...prev, mediums: newMediums }));
    debounceSearch({ mediums: newMediums });
  };

  const updateFees = (min: number, max: number) => {
    setValue((prev) => ({ ...prev, minFees: min, maxFees: max }));
    debounceSearch({ minFees: min, maxFees: max });
  };

  const resetFilters = () => {
    setValue(defaultFilterState);
    debounceSearch(defaultFilterState);
  };

  return (
    <div className={cn("rounded-lg border p-4")}>
      {/* City */}
      <div className="mb-4 space-y-4">
        <Label htmlFor="city">City</Label>
        <SearchableSelect
          disabled={isLoading}
          searchVal={value.city}
          value={value.city}
          onSearchChange={(v) => {
            updateCity(v);
            debounceSearch({ city: v });
          }}
          onChange={(v) => {
            updateCity(v);
            debounceSearch({ city: v });
          }}
          placeholder="Search city"
          options={cities}
        />
      </div>

      <Accordion
        type="multiple"
        defaultValue={["boards", "fees", "mediums", "more"]}
        className="w-full"
      >
        {/* Boards */}
        <AccordionItem value="boards">
          <AccordionTrigger>Board</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              {(boardAndMedium?.boards || []).map((b) => {
                const checked = value.boards.includes(b.label);
                return (
                  <label
                    key={b.label}
                    className="flex items-center gap-2 rounded-md border px-2 py-1.5"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) => toggleBoard(b.label, Boolean(v))}
                      aria-label={b.label}
                    />
                    <span className="text-sm">{b.label}</span>
                  </label>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Mediums */}
        <AccordionItem value="mediums">
          <AccordionTrigger>Medium</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              {(boardAndMedium?.medium || []).map((m) => {
                const checked = value.mediums.includes(m.label);
                return (
                  <label
                    key={m.label}
                    className="flex items-center gap-2 rounded-md border px-2 py-1.5"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) => toggleMedium(m.label, Boolean(v))}
                      aria-label={m.label}
                    />
                    <span className="text-sm">{m.label}</span>
                  </label>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Fees */}
        <AccordionItem value="fees">
          <AccordionTrigger>Average Annual Fees</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 my-4">
              <Slider
                min={0}
                max={500001}
                step={5000}
                value={[value.minFees, value.maxFees]}
                onValueChange={([min, max]) =>
                  updateFees(min || 0, max || 500001)
                }
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                {sliderMarks.map((m) => (
                  <span key={m}>₹{(m / 1000).toFixed(0)}k</span>
                ))}
              </div>
              <div className="text-sm">
                ₹{value.minFees.toLocaleString()} - ₹
                {value.maxFees.toLocaleString()}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Reset / Apply */}
        <AccordionItem value="more">
          <AccordionTrigger>More filters</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={resetFilters}
                >
                  Reset
                </Button>
                <Button type="button">Apply</Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SearchFilterSidebar;
