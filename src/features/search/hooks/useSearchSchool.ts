import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { useSearchParams } from "next/navigation";

const api = client.api.main.search.school.$get;
export type SearchSchoolResponseType = InferResponseType<typeof api>;

export function useSchoolSearch() {
  const searchParams = useSearchParams();

  const filters = {
    city: searchParams.get("city") ?? undefined,
    boards: searchParams.getAll("boards"),
    mediums: searchParams.getAll("mediums"),
    minFees: searchParams.get("minFees") ?? undefined,
    maxFees: searchParams.get("maxFees") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    pageSize: searchParams.get("pageSize") ?? undefined,
  };

  const queryKey = ["schools", filters];

  return useQuery<SearchSchoolResponseType>({
    queryKey,
    queryFn: async () => {
      const res = await api({ query: filters });
      if (!res.ok) throw new Error("Failed to fetch schools");
      return await res.json();
    },
  });
}
