export interface HabitCategory {
  id: string;
  userId: string | null;
  name: string;
  colorHex: string;
  icon: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
