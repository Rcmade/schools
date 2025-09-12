import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferRequestType } from "hono";
import { useSearchParams } from "next/navigation";

const api = client.api.main.public.cities.$get;
export type CityRequest = InferRequestType<typeof api>['query']

const useGetCities = () => {
  const searchParams = useSearchParams();
  const city = searchParams.get("city");

  return useQuery({
    queryKey: ["cities", city],
    queryFn: async () => {
      const res = await api({
        query: {
          city: city || undefined,
        },
      });
      const data = await res.json();
      return data;
    },
  });
};

export default useGetCities;
