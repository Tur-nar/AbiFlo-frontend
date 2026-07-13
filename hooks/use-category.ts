import { useQuery } from "@tanstack/react-query";
import { GetCategoriesApi } from "@/lib/api/categories.api";
import { categoryKeys } from "@/constants/query-key";

// ─── Queries ─────────────────────────────────────────────────────────────────

export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: GetCategoriesApi,
  });
};
