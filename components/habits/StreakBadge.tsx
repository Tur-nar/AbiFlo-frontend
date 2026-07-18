"use client";

import { Flame, Shield, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StreakBadgeProps {
  count: number;
  totalCompletions?: number;
  habitType?: "BUILD" | "QUIT";
  className?: string;
}

/**
 * Achievement milestones derived from the seed data badges.
 * Shown as earned/locked icons next to the streak count.
 */
const STREAK_MILESTONES = [
  { value: 7, icon: "🔥", label: "7-Day Warrior", rarity: "COMMON" },
  { value: 30, icon: "⚡️", label: "30-Day Legend", rarity: "RARE" },
  { value: 100, icon: "👑", label: "Centurion", rarity: "EPIC" },
  { value: 365, icon: "🏅", label: "Marathon Runner", rarity: "LEGENDARY" },
] as const;

const COMPLETION_MILESTONES = [
  { value: 1, icon: "👟", label: "First Step", rarity: "COMMON" },
  { value: 100, icon: "💯", label: "100 Completions", rarity: "RARE" },
] as const;

const RARITY_COLORS: Record<string, string> = {
  COMMON: "border-zinc-400/30 bg-zinc-400/10",
  RARE: "border-blue-400/30 bg-blue-400/10",
  EPIC: "border-purple-400/30 bg-purple-400/10",
  LEGENDARY: "border-amber-400/30 bg-amber-400/10 shadow-amber-500/10 shadow-sm",
};

export function StreakBadge({
  count,
  totalCompletions = 0,
  habitType = "BUILD",
  className,
}: StreakBadgeProps) {
  const isActive = count > 0;
  const Icon = habitType === "BUILD" ? Flame : Shield;

  // Determine earned badges
  const earnedStreaks = STREAK_MILESTONES.filter((m) => count >= m.value);
  const earnedCompletions = COMPLETION_MILESTONES.filter(
    (m) => totalCompletions >= m.value,
  );
  const allEarned = [...earnedCompletions, ...earnedStreaks];

  // Next streak milestone
  const nextStreakMilestone = STREAK_MILESTONES.find((m) => count < m.value);

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        className,
      )}
    >
      {/* Streak count */}
      <div
        className={cn(
          "flex items-center gap-1 font-semibold tabular-nums",
          isActive ? "text-brand" : "text-muted-foreground",
        )}
      >
        <Icon
          className={cn("h-4 w-4", isActive ? "text-brand" : "text-muted-foreground")}
        />
        <span className="text-lg">{count}</span>
      </div>

      {/* Earned achievement badges */}
      {allEarned.length > 0 && (
        <TooltipProvider delay={200}>
          <div className="flex items-center gap-0.5">
            {allEarned.map((badge) => (
              <Tooltip key={badge.label}>
                <TooltipTrigger>
                  <span
                    className={cn(
                      "inline-flex h-5 w-5 items-center justify-center rounded-md border text-[11px] cursor-default transition-transform hover:scale-110",
                      RARITY_COLORS[badge.rarity],
                    )}
                  >
                    {badge.icon}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  <p className="font-semibold">{badge.label}</p>
                  <p className="text-muted-foreground text-[10px]">
                    {"value" in badge && `${badge.value}${"value" in STREAK_MILESTONES[0] ? "" : ""}`}
                    {STREAK_MILESTONES.includes(badge as any)
                      ? ` day streak`
                      : ` completions`}
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      )}

      {/* Next milestone indicator */}
      {nextStreakMilestone && count > 0 && (
        <span className="text-[10px] text-muted-foreground/60 hidden sm:inline">
          {nextStreakMilestone.value - count}d to {nextStreakMilestone.icon}
        </span>
      )}
    </div>
  );
}
