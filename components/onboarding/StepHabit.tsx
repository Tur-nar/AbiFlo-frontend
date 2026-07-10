"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HabitCategory } from "@/types/category.types";
import { pageVariants, pageTransition } from "./onboarding-animations";

const DIFFICULTIES = [
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
  { value: "EXTREME", label: "Extreme" },
] as const;

interface StepHabitProps {
  direction: number;
  habitTitle: string;
  frequency: "DAILY" | "WEEKLY";
  difficulty: string;
  selectedHabitCategory: string;
  availableCategories: HabitCategory[];
  onHabitTitleChange: (val: string) => void;
  onFrequencyChange: (val: "DAILY" | "WEEKLY") => void;
  onDifficultyChange: (val: string) => void;
  onHabitCategoryChange: (val: string) => void;
}

export function StepHabit({
  direction,
  habitTitle,
  frequency,
  difficulty,
  selectedHabitCategory,
  availableCategories,
  onHabitTitleChange,
  onFrequencyChange,
  onDifficultyChange,
  onHabitCategoryChange,
}: StepHabitProps) {
  return (
    <motion.div
      key="step3"
      custom={direction}
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={pageTransition}
      className="flex-1 flex flex-col p-8"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground font-serif italic">
          Create your first habit.
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Define the parameters of your initial technical routine.
        </p>
      </div>

      <div className="flex-1 space-y-6">
        {/* Habit Title */}
        <div className="space-y-2">
          <Label
            htmlFor="habit-title"
            className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground"
          >
            Habit Title
          </Label>
          <Input
            id="habit-title"
            placeholder="e.g., Code Review, Meditate, Drink Water"
            value={habitTitle}
            onChange={(e) => onHabitTitleChange(e.target.value)}
            className="bg-background/60 border-border text-sm focus-visible:ring-brand/40"
          />
        </div>

        {/* Frequency */}
        <div className="space-y-2">
          <Label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Frequency
          </Label>
          <div className="flex rounded-lg border border-border overflow-hidden w-fit">
            {(["DAILY", "WEEKLY"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => onFrequencyChange(f)}
                className={`px-5 py-2.5 text-sm font-medium transition-all ${frequency === f
                    ? "bg-foreground text-background"
                    : "bg-transparent text-muted-foreground hover:text-foreground"
                  }`}
              >
                {f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <Label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Difficulty Level
          </Label>
          <div className="flex gap-2 flex-wrap">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => onDifficultyChange(d.value)}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${difficulty === d.value
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                  }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label
            htmlFor="habit-category"
            className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground"
          >
            Category
          </Label>
          <Select
            value={selectedHabitCategory}
            onValueChange={(val) => { if (val) onHabitCategoryChange(val); }}
          >
            <SelectTrigger
              id="habit-category"
              className="w-full h-10 bg-background/60 border-border text-sm"
            >
              <SelectValue placeholder="Select category">
                {availableCategories.find(cat => cat.id === selectedHabitCategory)?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  );
}
