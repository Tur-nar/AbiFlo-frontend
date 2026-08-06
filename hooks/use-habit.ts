import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  GetHabitsApi,
  GetHabitsTodayApi,
  GetHabitApi,
  CreateHabitApi,
  UpdateHabitApi,
  ArchiveHabitApi,
  ToggleArchiveApi,
  TogglePauseApi,
  ReorderHabitsApi,
  LogHabitApi,
  GetHabitLogsApi,
} from "@/lib/api/habits.api";
import { habitKeys } from "@/constants/query-key";
import type {
  Habit,
  HabitFilters,
  CreateHabitPayload,
  UpdateHabitPayload,
  LogHabitPayload,
  ReorderHabitsPayload,
} from "@/types/habit.types";

export const useHabits = (filters?: HabitFilters, enabled = true) => {
  return useQuery({
    queryKey: habitKeys.lists(filters as Record<string, unknown> | undefined),
    queryFn: () => GetHabitsApi(filters),
    enabled,
  });
};

export const useHabitsToday = (enabled = true) => {
  return useQuery({
    queryKey: habitKeys.today(),
    queryFn: GetHabitsTodayApi,
    enabled,
  });
};

export const useHabit = (id: string, enabled = true) => {
  return useQuery({
    queryKey: habitKeys.detail(id),
    queryFn: () => GetHabitApi(id),
    enabled: !!id && enabled,
  });
};

export const useHabitLogs = (
  id: string,
  range?: { from?: string; to?: string },
  enabled = true,
) => {
  return useQuery({
    queryKey: habitKeys.logs(id, range),
    queryFn: () => GetHabitLogsApi(id, range?.from, range?.to),
    enabled: !!id && enabled,
  });
};

export const useCreateHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateHabitPayload) => CreateHabitApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.all });
    },
  });
};

export const useUpdateHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateHabitPayload }) =>
      UpdateHabitApi(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: habitKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: habitKeys.all });
    },
  });
};

export const useArchiveHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ArchiveHabitApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.all });
    },
  });
};

export const useToggleArchive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ToggleArchiveApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.all });
    },
  });
};

export const useTogglePause = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TogglePauseApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.all });
    },
  });
};

export const useReorderHabits = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReorderHabitsPayload) => ReorderHabitsApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.all });
    },
  });
};

interface LogHabitVars {
  habitId: string;
  payload: LogHabitPayload;
}

export const useLogHabit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ habitId, payload }: LogHabitVars) =>
      LogHabitApi(habitId, payload),

    // Optimistic update — toggle the checkbox instantly
    onMutate: async ({ habitId, payload }) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: habitKeys.today() });
      await queryClient.cancelQueries({ queryKey: habitKeys.all });

      // Snapshot current values for rollback
      const previousToday = queryClient.getQueryData<Habit[]>(habitKeys.today());
      const previousAll = queryClient.getQueryData<Habit[]>(habitKeys.lists(undefined));

      const optimisticUpdate = (habits: Habit[] | undefined) =>
        (habits ?? []).map((habit) => {
          if (habit.id !== habitId) return habit;
          return {
            ...habit,
            logs: [
              {
                id: `optimistic-${Date.now()}`,
                habitId,
                userId: habit.userId,
                loggedDate: payload.date,
                completed: payload.completed,
                value: payload.value,
                mood: payload.mood,
                energyLevel: payload.energyLevel,
                note: payload.note,
                completedInFocus: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
            currentStreak: payload.completed
              ? habit.currentStreak + 1
              : Math.max(0, habit.currentStreak - 1),
            totalCompletions: payload.completed
              ? habit.totalCompletions + 1
              : Math.max(0, habit.totalCompletions - 1),
          };
        });

      // Optimistically update today's habits
      if (previousToday) {
        queryClient.setQueryData<Habit[]>(habitKeys.today(), optimisticUpdate);
      }

      // Optimistically update full list
      if (previousAll) {
        queryClient.setQueryData<Habit[]>(habitKeys.lists(undefined), optimisticUpdate);
      }

      return { previousToday, previousAll };
    },

    // Rollback on error
    onError: (_err, _vars, context) => {
      if (context?.previousToday) {
        queryClient.setQueryData(habitKeys.today(), context.previousToday);
      }
      if (context?.previousAll) {
        queryClient.setQueryData(habitKeys.lists(undefined), context.previousAll);
      }
    },

    // Sync with server truth
    onSettled: (_data, _err, { habitId }) => {
      queryClient.invalidateQueries({ queryKey: habitKeys.today() });
      queryClient.invalidateQueries({ queryKey: habitKeys.detail(habitId) });
      queryClient.invalidateQueries({ queryKey: habitKeys.all });
    },
  });
};
