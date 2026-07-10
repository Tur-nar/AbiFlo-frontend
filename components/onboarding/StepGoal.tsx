"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { pageVariants, pageTransition } from "./onboarding-animations";

interface StepGoalProps {
  direction: number;
  goalTitle: string;
  goalTargetDate: string;
  goalWhy: string;
  onGoalTitleChange: (val: string) => void;
  onGoalTargetDateChange: (val: string) => void;
  onGoalWhyChange: (val: string) => void;
}

export function StepGoal({
  direction,
  goalTitle,
  goalTargetDate,
  goalWhy,
  onGoalTitleChange,
  onGoalTargetDateChange,
  onGoalWhyChange,
}: StepGoalProps) {
  return (
    <motion.div
      key="step4"
      custom={direction}
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={pageTransition}
      className="flex-1 flex flex-col p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground font-serif italic">
          Set a goal to work toward.
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-sm mx-auto">
          Define your primary objective to track your systemic progress.
        </p>
      </div>

      <div className="flex-1 space-y-6">
        {/* Goal Title */}
        <div className="space-y-2">
          <Label
            htmlFor="goal-title"
            className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground"
          >
            Goal Title
          </Label>
          <Input
            id="goal-title"
            placeholder="e.g., Deploy core infrastructure"
            value={goalTitle}
            onChange={(e) => onGoalTitleChange(e.target.value)}
            className="bg-background/60 border-border text-sm focus-visible:ring-brand/40"
          />
        </div>

        {/* Target Date */}
        <div className="space-y-2">
          <Label
            htmlFor="goal-date"
            className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground"
          >
            Target Date
          </Label>
          <Input
            id="goal-date"
            type="date"
            value={goalTargetDate}
            onChange={(e) => onGoalTargetDateChange(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="bg-background/60 border-border text-sm focus-visible:ring-brand/40"
          />
        </div>

        {/* Why */}
        <div className="space-y-2">
          <Label
            htmlFor="goal-why"
            className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground"
          >
            Your why
          </Label>
          <Textarea
            id="goal-why"
            placeholder="Why does this matter to you?"
            value={goalWhy}
            onChange={(e) => onGoalWhyChange(e.target.value)}
            rows={3}
            className="bg-background/60 border-border text-sm focus-visible:ring-brand/40 resize-none"
          />
        </div>
      </div>
    </motion.div>
  );
}
