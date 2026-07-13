import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  GetUserProfileApi,
  UpdateProfileApi,
  UpdateSettingsApi,
  CompleteOnboardingApi,
  SkipOnboardingApi,
} from "@/lib/api/users.api";
import { userKeys } from "@/constants/query-key";
import type {
  UpdateProfilePayload,
  UpdateSettingsPayload,
  CompleteOnboardingPayload,
} from "@/types/user.types";

// ─── Queries ─────────────────────────────────────────────────────────────────

export const useGetUserProfile = (enabled = true) => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: GetUserProfileApi,
    enabled,
  });
};

// ─── Mutations ───────────────────────────────────────────────────────────────

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => UpdateProfileApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSettingsPayload) => UpdateSettingsApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
};

export const useCompleteOnboarding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CompleteOnboardingPayload) => CompleteOnboardingApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
};

export const useSkipOnboarding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => SkipOnboardingApi(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
};
