import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SkipOnboardingApi } from "@/lib/api/users.api";
import { userKeys } from "@/constants/query-key";

export const useSkipOnboarding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => SkipOnboardingApi(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
};
