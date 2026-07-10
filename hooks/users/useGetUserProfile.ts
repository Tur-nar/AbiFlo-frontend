import { useQuery } from "@tanstack/react-query";
import { GetUserProfileApi } from "@/lib/api/users.api";
import { userKeys } from "@/constants/query-key";

export const useGetUserProfile = (enabled = true) => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: GetUserProfileApi,
    enabled,
  });
};
