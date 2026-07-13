"use client";
import { useMemo } from "react";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { HabitLog } from "@/types/habit.types";
import { format, subWeeks, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

const chartConfig = {
  streak: {
    label: "Streak",
    color: "var(--brand)",
  },
} satisfies ChartConfig;

interface StreakChartProps {
  logs: HabitLog[];
}

export default function StreakChart({ logs }: StreakChartProps) {
  const data = useMemo(() => {
    const weeks: { week: string; completions: number }[] = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(subWeeks(now, i), { weekStartsOn: 1 });

      const weekLogs = logs.filter(
        (l) =>
          l.completed &&
          isWithinInterval(new Date(l.loggedDate), { start: weekStart, end: weekEnd }),
      );

      weeks.push({
        week: format(weekStart, "MMM d"),
        completions: weekLogs.length,
      });
    }

    return weeks;
  }, [logs]);

  return (
    <ChartContainer config={chartConfig} className="h-48 w-full">
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="streakGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="week"
          tick={{ fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          className="text-muted-foreground"
        />
        <YAxis
          tick={{ fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          className="text-muted-foreground"
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="completions"
          stroke="var(--brand)"
          strokeWidth={2}
          fill="url(#streakGradient)"
        />
      </AreaChart>
    </ChartContainer>
  );
}
