export const userKeys = {
  all: ["users"] as const,
  profile: () => [...userKeys.all, "profile"] as const,
};

export const categoryKeys = {
  all: ["categories"] as const,
};

export const habitKeys = {
  all: ["habits"] as const,
  lists: (filters?: Record<string, unknown> | undefined) =>
    [...habitKeys.all, "list", filters] as const,
  today: () => [...habitKeys.all, "today"] as const,
  detail: (id: string) => [...habitKeys.all, "detail", id] as const,
  logs: (id: string, range?: { from?: string; to?: string }) =>
    [...habitKeys.all, "logs", id, range] as const,
};
