"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Pause,
  Play,
  Archive,
  Star,
  Flame,
  Trophy,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityHeatmap } from "@/components/habits/ActivityHeatmap";
import { useHabit, useTogglePause, useArchiveHabit } from "@/hooks/use-habit";
import { EditHabitSheet } from "@/components/habits/EditHabitSheet";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DASHBOARD_ROUTES } from "@/constants/routes";
import dynamic from "next/dynamic";
import type { HabitLog, Mood } from "@/types/habit.types";

// Lazy-load charts — heavy client-only components
const StreakChart = dynamic(() => import("@/components/habits/charts/StreakChart"), {
  ssr: false,
  loading: () => <Skeleton className="h-48" />,
});
const CompletionByDayChart = dynamic(
  () => import("@/components/habits/charts/CompletionByDayChart"),
  { ssr: false, loading: () => <Skeleton className="h-48" /> },
);
const MoodCompletionChart = dynamic(
  () => import("@/components/habits/charts/MoodCompletionChart"),
  { ssr: false, loading: () => <Skeleton className="h-48" /> },
);

const MOOD_EMOJI: Record<string, string> = {
  AWFUL: "😫",
  BAD: "😔",
  NEUTRAL: "😐",
  GOOD: "😊",
  GREAT: "🤩",
};

const ENERGY_DOTS = ["⚡", "⚡⚡", "⚡⚡⚡", "⚡⚡⚡⚡", "⚡⚡⚡⚡⚡"];

export default function HabitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: habit, isLoading } = useHabit(id);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const togglePauseMutation = useTogglePause();
  const archiveMutation = useArchiveHabit();

  const handleTogglePause = () => {
    togglePauseMutation.mutate(id, {
      onSuccess: () => toast.success(habit?.isPaused ? "Habit resumed" : "Habit paused"),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleArchive = () => {
    archiveMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Habit archived");
        router.push("/dashboard/habits");
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const stats = useMemo(() => {
    if (!habit?.logs) return null;
    const completed = habit.logs.filter((l) => l.completed).length;
    const total = habit.logs.length || 1;
    const rate = ((completed / total) * 100).toFixed(1);
    return { completed, rate };
  }, [habit]);

  const recentLogs = useMemo(() => {
    if (!habit?.logs) return [];
    return habit.logs
      .filter((l) => l.completed || l.mood || l.note)
      .slice(0, 10);
  }, [habit]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-5xl">
        <Skeleton className="h-12 w-72" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">Habit not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{habit.title}</h1>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] font-bold uppercase",
                habit.isPaused
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
              )}
            >
              {habit.isPaused ? "Paused" : "Active"}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {habit.category.name} · {habit.frequency} ·{" "}
            {habit.habitType === "BUILD" ? "Core" : "Quit"}{" "}
            {habit.frequency}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Edit" onClick={() => setShowEditSheet(true)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Toggle pause" onClick={handleTogglePause}>
            {habit.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Archive" onClick={handleArchive}>
            <Archive className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Flame className="h-4 w-4 text-brand" />}
          label="Current Streak"
          value={`${habit.currentStreak}`}
          suffix="days"
        />
        <StatCard
          icon={<Trophy className="h-4 w-4 text-amber-400" />}
          label="Longest Streak"
          value={`${habit.longestStreak}`}
          suffix="days"
          sub="Top 2% Performance"
        />
        <StatCard
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-400" />}
          label="Total Completions"
          value={`${habit.totalCompletions}`}
          sub="Life-time aggregate"
        />
        <StatCard
          icon={<TrendingUp className="h-4 w-4 text-sky-400" />}
          label="Completion Rate"
          value={`${stats?.rate ?? 0}%`}
        />
      </div>

      {/* Annual Heatmap */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Annual Intensity Grid</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Visualizing distribution over the last 365 days.
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {new Date().getFullYear()} Performance 📅
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <ActivityHeatmap
            logs={habit.logs ?? []}
            colorHex={habit.category.colorHex || "#e63956"}
            targetValue={habit.targetValue ?? undefined}
            days={365}
          />
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Streak History</CardTitle>
          </CardHeader>
          <CardContent>
            <StreakChart logs={habit.logs ?? []} />
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Completion by Day</CardTitle>
          </CardHeader>
          <CardContent>
            <CompletionByDayChart logs={habit.logs ?? []} />
          </CardContent>
        </Card>
      </div>

      {/* Mood vs Completion */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">Mood vs Completion</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Correlation between daily focus and subjective well-being.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-brand" /> Completed
              </span>
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-muted-foreground" /> Missed
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <MoodCompletionChart logs={habit.logs ?? []} />
        </CardContent>
      </Card>

      {/* Recent Logs */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Recent Logs</CardTitle>
            <span className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
              View all logs
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/50">
                  <th className="pb-2 text-left font-semibold">Date</th>
                  <th className="pb-2 text-left font-semibold">Status</th>
                  <th className="pb-2 text-left font-semibold">Mood</th>
                  <th className="pb-2 text-left font-semibold">Energy</th>
                  <th className="pb-2 text-left font-semibold">Note</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((log) => (
                  <tr key={log.id} className="border-b border-border/30 last:border-0">
                    <td className="py-3 text-muted-foreground">
                      {format(new Date(log.loggedDate), "MMM dd, yyyy")}
                    </td>
                    <td className="py-3">
                      {log.completed ? (
                        <span className="text-emerald-400">✓</span>
                      ) : (
                        <span className="text-destructive">✗</span>
                      )}
                    </td>
                    <td className="py-3">
                      {log.mood ? MOOD_EMOJI[log.mood] : "—"}
                    </td>
                    <td className="py-3 text-xs">
                      {log.energyLevel
                        ? ENERGY_DOTS[log.energyLevel - 1] || "—"
                        : "—"}
                    </td>
                    <td className="py-3 text-muted-foreground max-w-xs truncate">
                      {log.note || "—"}
                    </td>
                  </tr>
                ))}
                {recentLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No logs yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Sheet */}
      <EditHabitSheet
        habit={habit}
        open={showEditSheet}
        onOpenChange={setShowEditSheet}
      />
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  suffix,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  suffix?: string;
  sub?: string;
}) {
  return (
    <Card className="border-border/50 bg-card/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          {icon}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold tabular-nums">{value}</span>
          {suffix && (
            <span className="text-xs text-muted-foreground">{suffix}</span>
          )}
        </div>
        {sub && (
          <p className="mt-1 text-[10px] text-muted-foreground">{sub}</p>
        )}
      </CardContent>
    </Card>
  );
}
