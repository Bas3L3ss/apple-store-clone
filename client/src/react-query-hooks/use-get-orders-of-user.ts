import { QueryClient, useQuery } from "@tanstack/react-query";
import { getOrdersOfUser } from "../action/orders";

interface UseGetOrdersParams {
  page?: number;
  limit?: number;
}

export const useGetOrdersOfUser = ({
  page = 1,
  limit = 10,
}: UseGetOrdersParams) => {
  return useQuery({
    queryKey: ["orders", { page, limit }],
    queryFn: () => getOrdersOfUser(page, limit),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2, // Retry twice before failing
  });
};
export const invalidateAllOrdersCache = (queryClient: QueryClient) => {
  queryClient.resetQueries({ queryKey: ["order"], exact: false });
  queryClient.resetQueries({ queryKey: ["orders"], exact: false });
  queryClient.resetQueries({ queryKey: ["admin:orders"], exact: false });
};
