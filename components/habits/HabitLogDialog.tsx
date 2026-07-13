"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Loader2, Check, X } from "lucide-react";
import type { Mood, LogHabitPayload } from "@/types/habit.types";

const MOODS: { value: Mood; emoji: string; label: string }[] = [
  { value: "AWFUL", emoji: "😫", label: "Awful" },
  { value: "BAD", emoji: "😔", label: "Bad" },
  { value: "NEUTRAL", emoji: "😐", label: "Okay" },
  { value: "GOOD", emoji: "😊", label: "Good" },
  { value: "GREAT", emoji: "🤩", label: "Great" },
];

const ENERGY_LEVELS = [
  { value: 1, label: "Very Low" },
  { value: 2, label: "Low" },
  { value: 3, label: "Medium" },
  { value: 4, label: "High" },
  { value: 5, label: "Very High" },
];

interface HabitLogDialogProps {
  habitTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: LogHabitPayload) => void;
  isPending?: boolean;
  /** Pre-fill if editing an existing log */
  defaultCompleted?: boolean;
}

export function HabitLogDialog({
  habitTitle,
  open,
  onOpenChange,
  onSubmit,
  isPending,
  defaultCompleted = true,
}: HabitLogDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const content = (
    <LogForm
      habitTitle={habitTitle}
      onSubmit={onSubmit}
      onCancel={() => onOpenChange(false)}
      isPending={isPending}
      defaultCompleted={defaultCompleted}
    />
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px] p-0 gap-0 bg-card border-border/50">
          <DialogHeader className="px-5 pt-5 pb-3 border-b border-border/30">
            <DialogTitle className="text-sm font-semibold">Log Check-in</DialogTitle>
          </DialogHeader>
          <div className="px-5 py-4">{content}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent className="max-h-[85dvh]">
        <DrawerHeader className="px-5 pt-4 pb-2">
          <DrawerTitle className="text-sm font-semibold">Log Check-in</DrawerTitle>
        </DrawerHeader>
        <div className="px-5 pb-6">{content}</div>
      </DrawerContent>
    </Drawer>
  );
}

function LogForm({
  habitTitle,
  onSubmit,
  onCancel,
  isPending,
  defaultCompleted,
}: {
  habitTitle: string;
  onSubmit: (payload: LogHabitPayload) => void;
  onCancel: () => void;
  isPending?: boolean;
  defaultCompleted: boolean;
}) {
  const [completed, setCompleted] = useState(defaultCompleted);
  const [rating, setRating] = useState(75);
  const [mood, setMood] = useState<Mood | undefined>(undefined);
  const [energyLevel, setEnergyLevel] = useState<number | undefined>(undefined);
  const [note, setNote] = useState("");

  const today = new Date().toISOString().slice(0, 10);

  const handleSubmit = () => {
    onSubmit({
      date: today,
      completed,
      value: completed ? rating : 0,
      mood,
      energyLevel,
      note: note.trim() || undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4"
    >
      {/* Habit name */}
      <p className="text-xs text-muted-foreground truncate">{habitTitle}</p>

      {/* Completed toggle */}
      <div className="flex items-center justify-between">
        <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Status
        </Label>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setCompleted(true)}
            className={cn(
              "flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
              completed
                ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400"
                : "border-border/40 bg-background/30 text-muted-foreground hover:border-border",
            )}
          >
            <Check className="h-3 w-3" /> Done
          </button>
          <button
            type="button"
            onClick={() => setCompleted(false)}
            className={cn(
              "flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
              !completed
                ? "border-rose-500/50 bg-rose-500/15 text-rose-400"
                : "border-border/40 bg-background/30 text-muted-foreground hover:border-border",
            )}
          >
            <X className="h-3 w-3" /> Skipped
          </button>
        </div>
      </div>

      {/* Rating slider (1-100) — only when completed */}
      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Rating
                </Label>
                <span className="text-xs font-bold tabular-nums text-foreground">
                  {rating}
                  <span className="text-muted-foreground font-normal">/100</span>
                </span>
              </div>
              <Slider
                value={[rating]}
                onValueChange={(val) => setRating(Array.isArray(val) ? val[0] : val)}
                min={1}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Minimal</span>
                <span>Average</span>
                <span>Peak</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mood */}
      <div className="space-y-1.5">
        <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Mood <span className="text-muted-foreground/50 font-normal normal-case">(optional)</span>
        </Label>
        <div className="flex gap-1.5">
          {MOODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMood(mood === m.value ? undefined : m.value)}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg border px-2 py-1.5 transition-all flex-1",
                mood === m.value
                  ? "border-brand/50 bg-brand/10 shadow-sm"
                  : "border-border/30 bg-background/30 hover:border-border",
              )}
              title={m.label}
            >
              <span className="text-lg">{m.emoji}</span>
              <span className="text-[9px] text-muted-foreground">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Energy Level */}
      <div className="space-y-1.5">
        <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Energy <span className="text-muted-foreground/50 font-normal normal-case">(optional)</span>
        </Label>
        <div className="flex gap-1.5">
          {ENERGY_LEVELS.map((e) => (
            <button
              key={e.value}
              type="button"
              onClick={() => setEnergyLevel(energyLevel === e.value ? undefined : e.value)}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg border px-1.5 py-1.5 transition-all flex-1",
                energyLevel === e.value
                  ? "border-amber-500/50 bg-amber-500/10 shadow-sm"
                  : "border-border/30 bg-background/30 hover:border-border",
              )}
            >
              <span className="text-xs font-bold">{e.value}</span>
              <span className="text-[8px] text-muted-foreground leading-tight text-center">{e.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="space-y-1.5">
        <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Note <span className="text-muted-foreground/50 font-normal normal-case">(optional)</span>
        </Label>
        <Textarea
          placeholder="How did it go?"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="bg-background/50 resize-none text-sm"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button
          variant="outline"
          className="flex-1 h-9 text-sm"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </Button>
        <Button
          className="flex-1 bg-brand hover:bg-brand/90 text-brand-foreground font-semibold h-9 text-sm"
          onClick={handleSubmit}
          disabled={isPending}
          type="button"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log Check-in"}
        </Button>
      </div>
    </motion.div>
  );
}
