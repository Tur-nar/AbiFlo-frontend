"use client";

import { useMemo } from "react";
import { Scatter, ScatterChart, XAxis, YAxis, ZAxis, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { HabitLog, Mood } from "@/types/habit.types";
import { format } from "date-fns";

const MOOD_VALUES: Record<string, number> = {
  AWFUL: 1,
  BAD: 2,
  NEUTRAL: 3,
  GOOD: 4,
  GREAT: 5,
};

const MOOD_LABELS = ["", "Awful", "Bad", "Neutral", "Good", "Great"];

const chartConfig = {
  completed: {
    label: "Completed",
    color: "var(--brand)",
  },
  missed: {
    label: "Missed",
    color: "hsl(var(--muted-foreground))",
  },
} satisfies ChartConfig;

interface MoodCompletionChartProps {
  logs: HabitLog[];
}

export default function MoodCompletionChart({ logs }: MoodCompletionChartProps) {
  const data = useMemo(() => {
    return logs
      .filter((l) => l.mood)
      .map((l, i) => ({
        index: i,
        date: format(new Date(l.loggedDate), "MMM d"),
        mood: MOOD_VALUES[l.mood!] ?? 3,
        moodLabel: l.mood,
        completed: l.completed,
        size: 60,
      }))
      .slice(0, 90); // last 90 entries with mood
  }, [logs]);

  const completedData = data.filter((d) => d.completed);
  const missedData = data.filter((d) => !d.completed);

  return (
    <ChartContainer config={chartConfig} className="h-48 w-full">
      <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <XAxis
          dataKey="index"
          tick={{ fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(val) => data[val]?.date ?? ""}
          interval="preserveStartEnd"
          className="text-muted-foreground"
        />
        <YAxis
          dataKey="mood"
          domain={[0.5, 5.5]}
          tick={{ fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(val) => MOOD_LABELS[val] ?? ""}
          className="text-muted-foreground"
        />
        <ZAxis dataKey="size" range={[40, 80]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Scatter name="Completed" data={completedData} fill="var(--brand)">
          {completedData.map((_, i) => (
            <Cell key={i} fill="var(--brand)" opacity={0.8} />
          ))}
        </Scatter>
        <Scatter name="Missed" data={missedData} fill="hsl(var(--muted-foreground))">
          {missedData.map((_, i) => (
            <Cell key={i} fill="hsl(0 0% 40%)" opacity={0.5} />
          ))}
        </Scatter>
      </ScatterChart>
    </ChartContainer>
  );
}
