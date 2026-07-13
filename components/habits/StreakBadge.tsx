"use client";

import { Flame, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  count: number;
  habitType?: "BUILD" | "QUIT";
  className?: string;
}

export function StreakBadge({ count, habitType = "BUILD", className }: StreakBadgeProps) {
  const isActive = count > 0;
  const Icon = habitType === "BUILD" ? Flame : Shield;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 font-semibold tabular-nums",
        isActive ? "text-brand" : "text-muted-foreground",
        className,
      )}
    >
      <Icon className={cn("h-4 w-4", isActive ? "text-brand" : "text-muted-foreground")} />
      <span className="text-lg">{count}</span>
    </div>
  );
}
