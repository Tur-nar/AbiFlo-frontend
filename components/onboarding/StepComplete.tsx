"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pageVariants } from "./onboarding-animations";

interface StepCompleteProps {
  direction: number;
  userName: string;
  habitTitle: string;
  frequency: string;
  difficulty: string;
  goalTitle: string;
  goalTargetDate: string;
  onGoToDashboard: () => void;
}

export function StepComplete({
  direction,
  userName,
  habitTitle,
  frequency,
  difficulty,
  goalTitle,
  goalTargetDate,
  onGoToDashboard,
}: StepCompleteProps) {
  return (
    <motion.div
      key="step5"
      custom={direction}
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className="flex-1 flex flex-col items-center p-8 text-center"
    >
      {/* Animated Checkmark */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.2,
        }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 border border-brand/20 mb-6"
      >
        <Check className="h-8 w-8 text-brand" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-bold tracking-tight text-foreground font-serif italic"
      >
        You&apos;re all set, {userName.split(" ")[0]}!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-2 text-sm text-muted-foreground max-w-sm"
      >
        Your personalized performance flow is ready. We&apos;ve calibrated your
        habits and goals for maximum momentum.
      </motion.p>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="w-full mt-8 rounded-xl border border-border bg-background/60 p-5 text-left"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Onboarding Summary
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand">
            Confirmed
          </span>
        </div>

        {/* Habit */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Habit
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-foreground">
              {habitTitle}
            </span>
            <div className="flex gap-1.5">
              <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-border text-muted-foreground">
                {frequency.toLowerCase()}
              </span>
              <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-border text-muted-foreground">
                {difficulty.toLowerCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Goal */}
        {goalTitle && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-1">
              <Flag className="h-3.5 w-3.5 text-brand" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Goal
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-foreground">
                {goalTitle}
              </span>
              {goalTargetDate && (
                <div className="text-right">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground block">
                    Target
                  </span>
                  <span className="text-xs font-medium text-foreground">
                    {new Date(goalTargetDate).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Go to Dashboard CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="w-full mt-6"
      >
        <Button
          onClick={onGoToDashboard}
          className="w-full bg-brand text-brand-foreground hover:bg-brand/90 h-12 rounded-xl text-sm font-semibold uppercase tracking-wider gap-2"
        >
          Go to Dashboard
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 text-[10px] font-mono uppercase tracking-widest text-muted-foreground"
      >
        Ready for flow
      </motion.p>
    </motion.div>
  );
}
