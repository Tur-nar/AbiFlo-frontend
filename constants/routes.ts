export const AuthRoutes = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  ONBOARDING: "/onboarding",
  FORGOT_PASSWORD: "/forgot-password",
  VERIFY_EMAIL: "/verify-email",
};

export const DASHBOARD_ROUTES = {
  HOME: "/dashboard",
  HABITS: "/dashboard/habits",
  HABITS_ARCHIVED: "/dashboard/habits/archived",
  HABIT_DETAIL: (id: string) => `/dashboard/habits/${id}` as const,
  GOALS: "/dashboard/goals",
  SETTINGS: "/dashboard/settings",
};
