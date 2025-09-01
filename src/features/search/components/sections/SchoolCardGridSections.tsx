"use client";
import PaginationButtons from "@/components/buttons/PaginationButtons";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { useSchoolSearch } from "../../hooks/useSearchSchool";
import SchoolCard from "../cards/SchoolCard";
import SearchFilterSidebar from "../sidebar/SearchFilterSidebar";

const SchoolCardGridSections = () => {
  const { data, isLoading } = useSchoolSearch();

  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex justify-end md:hidden" >
        <Sheet>
          <SheetTrigger asChild>
            <Button className="gap-2 ml-auto" size={"sm"}>
              <Filter size={16} /> Filter
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[88vw] sm:w-[380px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <SearchFilterSidebar />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      {/* Grid */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-lg border bg-muted/30"
              />
            ))
          : (data?.data ?? []).map((school) => (
              <SchoolCard key={school.id} school={school} />
            ))}
      </div>

      {pagination && (
        <PaginationButtons
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          count={pagination.total}
        />
      )}
    </div>
  );
};

export default SchoolCardGridSections;
