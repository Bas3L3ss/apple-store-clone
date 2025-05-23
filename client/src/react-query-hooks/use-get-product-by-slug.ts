import { useQuery } from "@tanstack/react-query";
import { Product } from "@/src/@types";
import { getProductBySlug } from "../action/products";

export const useProductGetBySlug = (slug?: string) => {
  return useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug, // Avoid fetching if slug is undefined
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
