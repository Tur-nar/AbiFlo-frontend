"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { HabitLog } from "@/types/habit.types";
import { format, subDays, startOfDay } from "date-fns";

interface ActivityHeatmapProps {
  logs: HabitLog[];
  colorHex?: string;
  /** @deprecated — use value (1-100 rating) for intensity instead */
  targetValue?: number;
  days?: number;
  className?: string;
}

/**
 * 5-level intensity: 0 = nothing, 1-4 = quartiles based on the 1-100 rating value.
 * Falls back to max intensity if completed but no value is logged.
 */
function ratingToIntensity(value: number | undefined | null, completed: boolean): number {
  if (!completed) return 0;
  if (value == null || value <= 0) return 4; // completed but no rating → full intensity
  if (value <= 25) return 1;
  if (value <= 50) return 2;
  if (value <= 75) return 3;
  return 4;
}

export function ActivityHeatmap({
  logs,
  colorHex,
  days = 365,
  className,
}: ActivityHeatmapProps) {
  const resolvedColor = colorHex || "var(--brand)";
  const { grid, months } = useMemo(() => {
    const today = startOfDay(new Date());
    const logMap = new Map<string, HabitLog>();

    for (const log of logs) {
      const key = new Date(log.loggedDate).toISOString().slice(0, 10);
      logMap.set(key, log);
    }

    // Build weeks from today going back `days` days
    const cells: {
      date: Date;
      dateKey: string;
      log?: HabitLog;
      intensity: number;
    }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dateKey = date.toISOString().slice(0, 10);
      const log = logMap.get(dateKey);

      let intensity = ratingToIntensity(log?.value, !!log?.completed);

      cells.push({ date, dateKey, log, intensity });
    }

    // Pad the start to align with Sunday
    const firstDay = cells[0]?.date.getDay() ?? 0;
    const paddedCells = Array(firstDay)
      .fill(null)
      .concat(cells);

    // Build weeks (columns)
    const weeks: typeof paddedCells[] = [];
    for (let i = 0; i < paddedCells.length; i += 7) {
      weeks.push(paddedCells.slice(i, i + 7));
    }

    // Build month labels
    const monthLabels: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, weekIdx) => {
      for (const cell of week) {
        if (!cell) continue;
        const month = cell.date.getMonth();
        if (month !== lastMonth) {
          monthLabels.push({
            label: format(cell.date, "MMM"),
            weekIndex: weekIdx,
          });
          lastMonth = month;
        }
        break;
      }
    });

    return { grid: weeks, months: monthLabels };
  }, [logs, days]);

  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {/* Month labels */}
      <div className="flex gap-[3px] ml-8 mb-1">
        {months.map((m, i) => (
          <span
            key={i}
            className="text-[10px] text-muted-foreground"
            style={{
              marginLeft: i === 0 ? `${m.weekIndex * 15}px` : undefined,
              width: i < months.length - 1
                ? `${(months[i + 1].weekIndex - m.weekIndex) * 15}px`
                : undefined,
            }}
          >
            {m.label}
          </span>
        ))}
      </div>

      <div className="flex gap-[3px]">
        {/* Day labels */}
        <div className="flex flex-col gap-[3px] mr-1">
          {dayLabels.map((label, i) => (
            <span key={i} className="text-[10px] text-muted-foreground h-[12px] leading-[12px] w-6 text-right">
              {label}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-[3px]">
          {grid.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-[3px]">
              {week.map((cell, dayIdx) => {
                if (!cell) {
                  return <div key={dayIdx} className="h-[12px] w-[12px]" />;
                }

                return (
                  <Tooltip key={cell.dateKey}>
                    <TooltipTrigger
                      render={
                        <div
                          className={cn(
                            "h-[12px] w-[12px] rounded-[2px] transition-colors cursor-pointer",
                            cell.intensity === 0 && "bg-muted",
                          )}
                          style={
                            cell.intensity > 0
                              ? {
                                backgroundColor: resolvedColor,
                                opacity: [0, 0.25, 0.5, 0.75, 1][cell.intensity],
                              }
                              : undefined
                          }
                        />
                      }
                    />
                    <TooltipContent side="top" className="text-xs">
                      <p className="font-medium">{format(cell.date, "MMM d, yyyy")}</p>
                      <p className="text-muted-foreground">
                        {cell.log?.completed
                          ? cell.log.value != null && cell.log.value > 0
                            ? `Rating: ${cell.log.value}/100`
                            : "Completed ✓"
                          : "Not completed"}
                      </p>
                      {cell.log?.note && (
                        <p className="text-muted-foreground mt-0.5 max-w-48 truncate">
                          {cell.log.note}
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-muted-foreground">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="h-[10px] w-[10px] rounded-[2px]"
            style={
              level === 0
                ? { backgroundColor: "var(--muted)", opacity: 0.5 }
                : {
                  backgroundColor: resolvedColor,
                  opacity: [0, 0.25, 0.5, 0.75, 1][level],
                }
            }
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
