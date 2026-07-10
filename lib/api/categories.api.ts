import { api } from "./client";
import { HabitCategory } from "@/types/category.types";
import { ApiResponse } from "@/types/api.types";

export const GetCategoriesApi = async (): Promise<HabitCategory[]> => {
  const res = await api.get<any, ApiResponse<HabitCategory[]>>("/categories");
  return res.data;
};
