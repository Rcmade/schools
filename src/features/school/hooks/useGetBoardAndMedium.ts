import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

const api = client.main.public["board-medium"].$get;
type GetBoardMediumResponse = InferResponseType<typeof api, 200>;

const useGetBoardAndMedium = () => {
  return useQuery<GetBoardMediumResponse>({
    queryKey: ["board-medium"],
    queryFn: async () => {
      const res = await api();
      const data = await res.json();
      return data;
    },
  });
};

export default useGetBoardAndMedium;
