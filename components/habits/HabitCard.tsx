"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Pause, Play, Archive, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StreakBadge } from "./StreakBadge";
import { HabitLogDialog } from "./HabitLogDialog";
import { DASHBOARD_ROUTES } from "@/constants/routes";
import type { Habit, LogHabitPayload } from "@/types/habit.types";

interface HabitCardProps {
  habit: Habit;
  todayCompleted?: boolean;
  onEdit?: (habit: Habit) => void;
  onTogglePause?: (id: string) => void;
  onArchive?: (id: string) => void;
  onLogToday?: (habitId: string, payload: LogHabitPayload) => void;
  /** For the archived view where we show unarchive instead */
  showUnarchive?: boolean;
  onUnarchive?: (id: string) => void;
  isLogPending?: boolean;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  EASY: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  MEDIUM: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  HARD: "bg-brand/15 text-brand border-brand/20",
  EXTREME: "bg-rose-500/15 text-rose-400 border-rose-500/20",
};

export function HabitCard({
  habit,
  todayCompleted,
  onEdit,
  onTogglePause,
  onArchive,
  onLogToday,
  showUnarchive,
  onUnarchive,
  isLogPending,
}: HabitCardProps) {
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const miniGrid = buildMiniGrid(habit);

  // Determine if completed today from logs or explicit prop
  const isCompletedToday =
    todayCompleted ??
    (habit.logs ?? []).some((l) => {
      const d = new Date(l.loggedDate);
      const now = new Date();
      return (
        l.completed &&
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    });

  return (
    <>
      <div className="group relative rounded-xl border border-border/50 bg-card/50 px-4 py-3.5 transition-all hover:border-border hover:bg-card/80">
        <Link
          href={DASHBOARD_ROUTES.HABIT_DETAIL(habit.id)}
          className="absolute inset-0 z-0 rounded-xl"
          aria-label={`View ${habit.title} details`}
        />

        <div className="relative z-10 flex items-center gap-4">
          {/* Check button — opens log dialog */}
          {!showUnarchive && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isCompletedToday) {
                  // Quick uncomplete
                  onLogToday?.(habit.id, {
                    date: new Date().toISOString().slice(0, 10),
                    completed: false,
                    value: 0,
                  });
                } else {
                  // Open full log dialog
                  setLogDialogOpen(true);
                }
              }}
              className={cn(
                "relative z-20 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                isCompletedToday
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-border/60 bg-transparent hover:border-brand/50",
              )}
              aria-label={isCompletedToday ? "Mark incomplete" : "Log check-in"}
            >
              {isCompletedToday && <Check className="h-3.5 w-3.5" />}
            </button>
          )}

          {/* Title + category */}
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-semibold text-sm truncate",
                isCompletedToday && "line-through text-muted-foreground",
              )}
            >
              {habit.title}
            </h3>
            <p className="mt-0.5 text-[11px] text-muted-foreground uppercase tracking-wider">
              {habit.category.name} ·{" "}
              {habit.frequency.charAt(0) + habit.frequency.slice(1).toLowerCase()}
            </p>
          </div>

          {/* Streak */}
          <div className="flex flex-col items-center shrink-0">
            <StreakBadge count={habit.currentStreak} habitType={habit.habitType} />
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">
              streak
            </span>
          </div>

          {/* Mini Grid */}
          <div className="hidden sm:flex flex-col gap-[3px] shrink-0">
            {miniGrid.map((row, i) => (
              <div key={i} className="flex gap-[3px]">
                {row.map((cell, j) => (
                  <div
                    key={j}
                    className={cn(
                      "h-[10px] w-[10px] rounded-[2px]",
                      cell ? "opacity-80" : "opacity-20",
                    )}
                    style={{
                      backgroundColor: cell
                        ? habit.category.colorHex || "#e63956"
                        : undefined,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Difficulty */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <div className="flex gap-0.5">
              {Array.from({ length: getDifficultyLevel(habit.difficulty) }).map(
                (_, i) => (
                  <div
                    key={i}
                    className="h-1.5 w-3.5 rounded-full"
                    style={{
                      backgroundColor: habit.category.colorHex || "#e63956",
                    }}
                  />
                ),
              )}
              {Array.from({
                length: 3 - getDifficultyLevel(habit.difficulty),
              }).map((_, i) => (
                <div key={i} className="h-1.5 w-3.5 rounded-full bg-muted/50" />
              ))}
            </div>
            <Badge
              variant="outline"
              className={cn(
                "text-[9px] font-bold uppercase tracking-wider border px-1.5 py-0",
                DIFFICULTY_COLORS[habit.difficulty],
              )}
            >
              {habit.difficulty === "EXTREME" ? "ELITE" : habit.difficulty}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {showUnarchive ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-emerald-400"
                onClick={(e) => {
                  e.preventDefault();
                  onUnarchive?.(habit.id);
                }}
                aria-label="Unarchive habit"
              >
                <Archive className="h-3 w-3" />
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.preventDefault();
                    onEdit?.(habit);
                  }}
                  aria-label="Edit habit"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.preventDefault();
                    onTogglePause?.(habit.id);
                  }}
                  aria-label={habit.isPaused ? "Resume habit" : "Pause habit"}
                >
                  {habit.isPaused ? (
                    <Play className="h-3 w-3" />
                  ) : (
                    <Pause className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.preventDefault();
                    onArchive?.(habit.id);
                  }}
                  aria-label="Archive habit"
                >
                  <Archive className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Log Dialog */}
      <HabitLogDialog
        habitTitle={habit.title}
        open={logDialogOpen}
        onOpenChange={setLogDialogOpen}
        isPending={isLogPending}
        onSubmit={(payload) => {
          onLogToday?.(habit.id, payload);
          setLogDialogOpen(false);
        }}
      />
    </>
  );
}

function buildMiniGrid(habit: Habit): boolean[][] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const logDates = new Set(
    (habit.logs ?? [])
      .filter((l) => l.completed)
      .map((l) => new Date(l.loggedDate).toISOString().slice(0, 10)),
  );

  const grid: boolean[][] = [[], []];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const row = i >= 7 ? 0 : 1;
    grid[row].push(logDates.has(key));
  }

  return grid;
}

function getDifficultyLevel(d: string): number {
  switch (d) {
    case "EASY":
      return 1;
    case "MEDIUM":
      return 2;
    case "HARD":
      return 3;
    case "EXTREME":
      return 3;
    default:
      return 2;
  }
}
