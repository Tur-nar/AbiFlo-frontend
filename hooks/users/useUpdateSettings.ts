import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateSettingsApi } from "@/lib/api/users.api";
import { UpdateSettingsPayload } from "@/types/user.types";
import { userKeys } from "@/constants/query-key";

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSettingsPayload) => UpdateSettingsApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
};
