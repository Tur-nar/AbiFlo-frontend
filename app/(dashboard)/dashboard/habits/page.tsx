"use client";
import { useState, useMemo } from "react";
import { Plus, Search, TrendingUp, Archive } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { HabitCard } from "@/components/habits/HabitCard";
import { NewHabitSheet } from "@/components/habits/NewHabitSheet";
import { EditHabitSheet } from "@/components/habits/EditHabitSheet";
import { CategoryIcon } from "@/components/common/CategoryIcon";
import { useHabits, useTogglePause, useArchiveHabit, useLogHabit } from "@/hooks/use-habit";
import { useCategories } from "@/hooks/use-category";
import { toast } from "sonner";
import Link from "next/link";
import { DASHBOARD_ROUTES } from "@/constants/routes";
import type { Habit } from "@/types/habit.types";

export default function HabitsPage() {
  const [showNewSheet, setShowNewSheet] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedFrequency, setSelectedFrequency] = useState("ALL");
  const [showPaused, setShowPaused] = useState(false);

  const { data: habits = [], isLoading } = useHabits();
  const { data: categories = [] } = useCategories();
  const togglePause = useTogglePause();
  const archiveHabit = useArchiveHabit();
  const logHabit = useLogHabit();

  // Filter habits client side
  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      if (habit.isArchived) return false;
      if (!showPaused && habit.isPaused) return false;
      if (selectedCategory !== "ALL" && habit.categoryId !== selectedCategory) return false;
      if (selectedFrequency !== "ALL" && habit.frequency !== selectedFrequency) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          habit.title.toLowerCase().includes(q) ||
          habit.category.name.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [habits, selectedCategory, selectedFrequency, showPaused, searchQuery]);

  const bestStreak = useMemo(() => {
    if (!habits.length) return 0;
    return Math.max(...habits.filter((h) => !h.isArchived).map((h) => h.currentStreak), 0);
  }, [habits]);

  const handlePause = (id: string) => {
    togglePause.mutate(id, {
      onSuccess: () => toast.success("Habit pause toggled"),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleArchive = (id: string) => {
    archiveHabit.mutate(id, {
      onSuccess: () => toast.success("Habit archived"),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleLogToday = (habitId: string, payload: import("@/types/habit.types").LogHabitPayload) => {
    logHabit.mutate(
      { habitId, payload },
      {
        onError: (err) => toast.error(err.message),
      },
    );
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
  };

  // Build tab values: "ALL" + each category id
  const tabCategories = [
    { value: "ALL", label: "All", icon: "" },
    ...categories.map((c) => ({ value: c.id, label: c.name, icon: c.icon })),
  ];

  return (
    <div className="flex flex-col gap-5 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Habits</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Track and manage your daily protocols.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Filter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-44 bg-background/50 h-8 text-sm"
            />
          </div>
          <Button
            onClick={() => setShowNewSheet(true)}
            className="bg-brand hover:bg-brand/90 text-brand-foreground font-semibold gap-1 h-8 text-sm px-3"
          >
            <Plus className="h-3.5 w-3.5" />
            New Habit
          </Button>
          <Link href={DASHBOARD_ROUTES.HABITS_ARCHIVED}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label="View archived habits">
              <Archive className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Category Tabs + Filters */}
      <Tabs
        defaultValue="ALL"
        value={selectedCategory}
        onValueChange={(val) => setSelectedCategory(val as string)}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <TabsList className="gap-0">
            {tabCategories.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-xs px-3 gap-1.5">
                {tab.icon && <CategoryIcon name={tab.icon} className="h-3 w-3" />}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Freq
              </span>
              <Select value={selectedFrequency} onValueChange={(val) => setSelectedFrequency(val as string)}>
                <SelectTrigger className="w-28 bg-background/50 text-xs h-7">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="DAILY">Daily</SelectItem>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="CUSTOM">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1.5">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Paused
              </Label>
              <Switch checked={showPaused} onCheckedChange={setShowPaused} />
            </div>
          </div>
        </div>

        {/* Single content panel for all tabs (filtering is done client side) */}
        <div className="flex flex-col gap-2.5 mt-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))
          ) : filteredHabits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <p className="text-base font-medium text-muted-foreground">No habits found</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {searchQuery || selectedCategory !== "ALL"
                  ? "Try adjusting your filters"
                  : "Create your first habit to get started"}
              </p>
              {!searchQuery && selectedCategory === "ALL" && (
                <Button
                  onClick={() => setShowNewSheet(true)}
                  className="mt-3 bg-brand hover:bg-brand/90 text-brand-foreground text-sm h-8"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Create Habit
                </Button>
              )}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredHabits.map((habit, index) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.04, duration: 0.25 }}
                  layout
                >
                  <HabitCard
                    habit={habit}
                    onEdit={handleEdit}
                    onTogglePause={handlePause}
                    onArchive={handleArchive}
                    onLogToday={handleLogToday}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </Tabs>

      {/* Streak Momentum Banner */}
      {bestStreak > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card/50 px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10">
              <TrendingUp className="h-4 w-4 text-brand" />
            </div>
            <div>
              <p className="font-semibold text-sm">Streak Momentum</p>
              <p className="text-[11px] text-muted-foreground">
                You&apos;re on a {bestStreak}-day perfect streak!
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/analytics"
            className="text-xs font-semibold text-brand hover:underline"
          >
            View analytics →
          </Link>
        </div>
      )}

      {/* Sheets */}
      <NewHabitSheet open={showNewSheet} onOpenChange={setShowNewSheet} />
      <EditHabitSheet
        habit={editingHabit}
        open={!!editingHabit}
        onOpenChange={(open) => { if (!open) setEditingHabit(null); }}
      />
    </div>
  );
}
