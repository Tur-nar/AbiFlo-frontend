"use client";

import { useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { HabitLog } from "@/types/habit.types";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SHORT_NAMES = ["S", "M", "T", "W", "T", "F", "S"];

const chartConfig = {
  completions: {
    label: "Completions",
    color: "var(--brand)",
  },
} satisfies ChartConfig;

interface CompletionByDayChartProps {
  logs: HabitLog[];
}

export default function CompletionByDayChart({ logs }: CompletionByDayChartProps) {
  const data = useMemo(() => {
    const counts: number[] = Array(7).fill(0);

    for (const log of logs) {
      if (!log.completed) continue;
      const day = new Date(log.loggedDate).getDay();
      counts[day]++;
    }

    // Reorder to Mon-Sun
    return [1, 2, 3, 4, 5, 6, 0].map((dayIdx) => ({
      day: SHORT_NAMES[dayIdx],
      completions: counts[dayIdx],
    }));
  }, [logs]);

  return (
    <ChartContainer config={chartConfig} className="h-48 w-full">
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11 }}
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
        <Bar
          dataKey="completions"
          fill="var(--brand)"
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
        />
      </BarChart>
    </ChartContainer>
  );
}
