import { api } from "./client";
import type { ApiResponse } from "@/types/api.types";
import type {
  Habit,
  HabitLog,
  CreateHabitPayload,
  UpdateHabitPayload,
  LogHabitPayload,
  UpdateLogPayload,
  ReorderHabitsPayload,
  HabitFilters,
} from "@/types/habit.types";

export const GetHabitsApi = async (filters?: HabitFilters): Promise<Habit[]> => {
  const params = new URLSearchParams();
  if (filters?.categoryId) params.set("categoryId", filters.categoryId);
  if (filters?.frequency) params.set("frequency", filters.frequency);
  if (filters?.habitType) params.set("habitType", filters.habitType);
  if (filters?.isArchived !== undefined) params.set("isArchived", String(filters.isArchived));
  if (filters?.isPaused !== undefined) params.set("isPaused", String(filters.isPaused));

  const query = params.toString();
  const res = await api.get<any, ApiResponse<Habit[]>>(`/habits${query ? `?${query}` : ""}`);
  return res.data;
};

export const GetHabitsTodayApi = async (): Promise<Habit[]> => {
  const res = await api.get<any, ApiResponse<Habit[]>>("/habits/today");
  return res.data;
};

export const GetHabitApi = async (id: string): Promise<Habit> => {
  const res = await api.get<any, ApiResponse<Habit>>(`/habits/${id}`);
  return res.data;
};

export const CreateHabitApi = async (payload: CreateHabitPayload): Promise<Habit> => {
  const res = await api.post<any, ApiResponse<Habit>>("/habits", payload);
  return res.data;
};

export const UpdateHabitApi = async (id: string, payload: UpdateHabitPayload): Promise<Habit> => {
  const res = await api.patch<any, ApiResponse<Habit>>(`/habits/${id}`, payload);
  return res.data;
};

export const ArchiveHabitApi = async (id: string): Promise<Habit> => {
  const res = await api.delete<any, ApiResponse<Habit>>(`/habits/${id}`);
  return res.data;
};

export const ToggleArchiveApi = async (id: string): Promise<Habit> => {
  const res = await api.patch<any, ApiResponse<Habit>>(`/habits/${id}/archive`);
  return res.data;
};

export const TogglePauseApi = async (id: string): Promise<Habit> => {
  const res = await api.patch<any, ApiResponse<Habit>>(`/habits/${id}/pause`);
  return res.data;
};

export const ReorderHabitsApi = async (payload: ReorderHabitsPayload): Promise<void> => {
  await api.patch("/habits/reorder", payload);
};

// ─── Habit Logs ──────────────────────────────────────────────────────────────

export const LogHabitApi = async (id: string, payload: LogHabitPayload): Promise<HabitLog> => {
  const res = await api.post<any, ApiResponse<HabitLog>>(`/habits/${id}/log`, payload);
  return res.data;
};

export const GetHabitLogsApi = async (
  id: string,
  from?: string,
  to?: string,
): Promise<HabitLog[]> => {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const query = params.toString();
  const res = await api.get<any, ApiResponse<HabitLog[]>>(
    `/habits/${id}/logs${query ? `?${query}` : ""}`,
  );
  return res.data;
};

export const UpdateHabitLogApi = async (
  id: string,
  date: string,
  payload: UpdateLogPayload,
): Promise<HabitLog> => {
  const res = await api.patch<any, ApiResponse<HabitLog>>(`/habits/${id}/logs/${date}`, payload);
  return res.data;
};

export const DeleteHabitLogApi = async (id: string, date: string): Promise<void> => {
  await api.delete(`/habits/${id}/logs/${date}`);
};
