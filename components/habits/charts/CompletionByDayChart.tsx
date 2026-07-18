"use client";

import { useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { HabitLog } from "@/types/habit.types";

const SHORT_NAMES = ["S", "M", "T", "W", "T", "F", "S"];
const FULL_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const chartConfig = {
  rating: {
    label: "Avg Rating",
    color: "var(--brand)",
  },
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
    const sums: number[] = Array(7).fill(0);
    const counts: number[] = Array(7).fill(0);
    const completionCounts: number[] = Array(7).fill(0);

    for (const log of logs) {
      if (!log.completed) continue;
      const day = new Date(log.loggedDate).getDay();
      completionCounts[day]++;
      if (log.value != null && log.value > 0) {
        sums[day] += log.value;
        counts[day]++;
      }
    }

    // Mon → Sun order
    return [1, 2, 3, 4, 5, 6, 0].map((dayIdx) => ({
      day: SHORT_NAMES[dayIdx],
      fullDay: FULL_NAMES[dayIdx],
      rating: counts[dayIdx] > 0 ? Math.round(sums[dayIdx] / counts[dayIdx]) : 0,
      completions: completionCounts[dayIdx],
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
          domain={[0, 100]}
          className="text-muted-foreground"
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, name) => {
                if (name === "rating") return [`${value}/100`, "Avg Rating"];
                return [value, "Completions"];
              }}
            />
          }
        />
        <Bar dataKey="rating" radius={[4, 4, 0, 0]} maxBarSize={32}>
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill="var(--brand)"
              opacity={entry.rating > 0 ? 0.4 + (entry.rating / 100) * 0.6 : 0.15}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
