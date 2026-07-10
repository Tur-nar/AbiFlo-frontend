import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateProfileApi } from "@/lib/api/users.api";
import { UpdateProfilePayload } from "@/types/user.types";
import { userKeys } from "@/constants/query-key";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => UpdateProfileApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
};
