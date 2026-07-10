import { HabitCategory } from './category.types';

// ─── Enums ───────────────────────────────────────────────────────────────────

export type Frequency = 'DAILY' | 'WEEKLY' | 'CUSTOM';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXTREME';
export type HabitType = 'BUILD' | 'QUIT';
export type Mood = 'AWFUL' | 'BAD' | 'NEUTRAL' | 'GOOD' | 'GREAT';

// ─── Models ──────────────────────────────────────────────────────────────────

export interface Habit {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  description?: string;
  frequency: Frequency;
  frequencyDays: number[];
  frequencyTimesPerPeriod: number;
  targetStreak: number;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  reminderTime?: string;
  reminderDays: number[];
  startDate: string;
  endDate?: string;
  isArchived: boolean;
  isPaused: boolean;
  difficulty: Difficulty;
  xpReward: number;
  color?: string;
  sortOrder: number;
  unit?: string;
  targetValue?: number;
  habitType: HabitType;
  triggerDescription?: string;
  stackedAfterHabitId?: string;
  createdAt: string;
  updatedAt: string;
  category: HabitCategory;
  logs?: HabitLog[];
  stackedHabits?: Habit[];
  stackParent?: { id: string; title: string } | null;
}

export interface HabitLog {
  id: string;
  habitId: string;
  userId: string;
  loggedDate: string;
  completed: boolean;
  value?: number;
  completionTime?: string;
  mood?: Mood;
  energyLevel?: number;
  note?: string;
  completedInFocus: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Payloads ────────────────────────────────────────────────────────────────

export interface CreateHabitPayload {
  title: string;
  description?: string;
  categoryId: string;
  frequency?: Frequency;
  frequencyDays?: number[];
  difficulty?: Difficulty;
  habitType?: HabitType;
  unit?: string;
  targetValue?: number;
  isMeasurable?: boolean;
  reminderTime?: string;
  reminderDays?: number[];
  color?: string;
  triggerDescription?: string;
  stackedAfterHabitId?: string;
}

export interface UpdateHabitPayload extends Partial<CreateHabitPayload> {}

export interface LogHabitPayload {
  date: string;
  completed: boolean;
  value?: number;
  mood?: Mood;
  energyLevel?: number;
  note?: string;
}

export interface UpdateLogPayload {
  mood?: Mood;
  energyLevel?: number;
  note?: string;
}

export interface ReorderHabitsPayload {
  items: { id: string; sortOrder: number }[];
}

// ─── Filter types ────────────────────────────────────────────────────────────

export interface HabitFilters {
  categoryId?: string;
  frequency?: Frequency;
  habitType?: HabitType;
  isArchived?: boolean;
  isPaused?: boolean;
}
