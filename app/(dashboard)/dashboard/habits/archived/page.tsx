"use client";

import { useMemo } from "react";
import { Archive, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HabitCard } from "@/components/habits/HabitCard";
import { useHabits, useToggleArchive } from "@/hooks/use-habit";
import { toast } from "sonner";
import { DASHBOARD_ROUTES } from "@/constants/routes";

export default function ArchivedHabitsPage() {
  const { data: habits = [], isLoading } = useHabits({ isArchived: true });
  const toggleArchive = useToggleArchive();

  const archivedHabits = useMemo(
    () => habits.filter((h) => h.isArchived),
    [habits],
  );

  const handleUnarchive = (id: string) => {
    toggleArchive.mutate(id, {
      onSuccess: () => toast.success("Habit restored!"),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div className="flex flex-col gap-5 p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={DASHBOARD_ROUTES.HABITS}>
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Back to habits">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Archive className="h-5 w-5 text-muted-foreground" />
            Archived Habits
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Restore habits you previously archived.
          </p>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2.5">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))
        ) : archivedHabits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50 mb-4">
              <Archive className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-base font-medium text-muted-foreground">No archived habits</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Habits you archive will appear here.
            </p>
            <Link href={DASHBOARD_ROUTES.HABITS}>
              <Button variant="outline" className="mt-4 text-sm h-8">
                Back to Habits
              </Button>
            </Link>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {archivedHabits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40, scale: 0.95 }}
                transition={{ delay: index * 0.05, duration: 0.25 }}
                layout
              >
                <HabitCard
                  habit={habit}
                  showUnarchive
                  onUnarchive={handleUnarchive}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
