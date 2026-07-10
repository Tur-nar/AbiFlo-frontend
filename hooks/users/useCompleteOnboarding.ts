import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CompleteOnboardingApi } from "@/lib/api/users.api";
import { CompleteOnboardingPayload } from "@/types/user.types";
import { userKeys } from "@/constants/query-key";

export const useCompleteOnboarding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CompleteOnboardingPayload) => CompleteOnboardingApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
};
