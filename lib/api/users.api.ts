import { api } from "./client";
import { UserProfile, CompleteOnboardingPayload, UpdateProfilePayload, UpdateSettingsPayload } from "@/types/user.types";
import { ApiResponse } from "@/types/api.types";

export const GetUserProfileApi = async (): Promise<UserProfile> => {
  const res = await api.get<any, ApiResponse<UserProfile>>("/users/me");
  return res.data;
};

export const CompleteOnboardingApi = async (payload: CompleteOnboardingPayload): Promise<UserProfile> => {
  const res = await api.post<any, ApiResponse<UserProfile>>("/users/onboarding", payload);
  return res.data;
};

export const UpdateProfileApi = async (payload: UpdateProfilePayload): Promise<UserProfile> => {
  const res = await api.patch<any, ApiResponse<UserProfile>>("/users/profile", payload);
  return res.data;
};

export const UpdateSettingsApi = async (payload: UpdateSettingsPayload): Promise<any> => {
  const res = await api.patch<any, ApiResponse<any>>("/users/settings", payload);
  return res.data;
};

export const SkipOnboardingApi = async (): Promise<UserProfile> => {
  const res = await api.post<any, ApiResponse<UserProfile>>("/users/onboarding/skip");
  return res.data;
};
