export interface UserProfile {
  id: string;
  userId: string;
  phone?: string;
  avatarUrl?: string;
  timezone: string;
  locale: string;
  level: number;
  totalXp: number;
  isPro: boolean;
  onboardingCompletedAt: string | null;
}

export interface CompleteOnboardingPayload {
  timezone?: string;
  avatarUrl?: string;
  categoryIds: string[];
  firstHabitTitle: string;
  firstHabitCategoryId: string;
  frequency?: 'DAILY' | 'WEEKLY';
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'EXTREME';
  firstGoalTitle?: string;
  goalTargetDate?: string;
  firstGoalWhy?: string;
}

export interface UpdateProfilePayload {
  phone?: string;
  avatarUrl?: string;
  timezone?: string;
  locale?: string;
}

export interface UpdateSettingsPayload {
  reminderChannel?: 'EMAIL' | 'SMS' | 'PUSH' | 'NONE';
  weeklyReportEnabled?: boolean;
  aiCoachingEnabled?: boolean;
  profileVisibility?: 'PUBLIC' | 'FRIENDS' | 'PRIVATE' | 'ACCOUNTABILITY_PARTNER';
  theme?: string;
  focusSoundEnabled?: boolean;
}
