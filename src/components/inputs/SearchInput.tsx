"use client";
import { useDebounce } from "@/hooks/useDebounce";
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams";
import { SearchIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

const SearchInput = () => {
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(searchTerm);

  const { updateSearchParams } = useUpdateSearchParams();

  const debounceLocation = useDebounce(updateSearchParams, 600);

  useEffect(() => {
    debounceLocation({ search: searchQuery, page: "1" });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  return (
    <div className="relative w-full flex">
      <Input
        placeholder="Search School ..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyUp={(e) =>
          e.key === "Enter" &&
          updateSearchParams({ search: searchQuery, page: "1" })
        }
        onBlur={() =>
          searchTerm !== searchQuery &&
          updateSearchParams({ search: searchQuery, page: "1" })
        }
        className="flex-1"
      />
      <SearchIcon className="pointer-events-none absolute right-4 top-1.5" />
    </div>
  );
};

export default SearchInput;
