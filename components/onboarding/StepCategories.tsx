"use client";

import { motion } from "framer-motion";
import {
  Check,
  Heart,
  Brain,
  BookOpen,
  Apple,
  Users,
  Wallet,
  Palette,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { HabitCategory } from "@/types/category.types";
import {
  pageVariants,
  pageTransition,
  staggerContainer,
  staggerItem,
} from "./onboarding-animations";

/** Map backend icon strings to Lucide components */
const ICON_MAP: Record<string, LucideIcon> = {
  "heart-pulse": Heart,
  heart: Heart,
  brain: Brain,
  "book-open": BookOpen,
  apple: Apple,
  users: Users,
  wallet: Wallet,
  palette: Palette,
  zap: Zap,
};

interface StepCategoriesProps {
  direction: number;
  categories: HabitCategory[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export function StepCategories({
  direction,
  categories,
  selectedIds,
  onToggle,
}: StepCategoriesProps) {
  return (
    <motion.div
      key="step2"
      custom={direction}
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={pageTransition}
      className="flex-1 flex flex-col p-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          What do you want to focus on?
        </h2>
        <p className="mt-1.5 text-xs text-muted-foreground flex items-center gap-1.5">
          <span className="inline-block h-1 w-1 rounded-full bg-brand" />
          Pick 3-5 to start your precision tracking.
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="enter"
        animate="center"
        className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3 flex-1"
      >
        {categories.map((cat) => {
          const isSelected = selectedIds.includes(cat.id);
          const Icon = ICON_MAP[cat.icon] || Zap;

          return (
            <motion.button
              key={cat.id}
              type="button"
              variants={staggerItem}
              onClick={() => onToggle(cat.id)}
              className={`relative flex flex-col gap-3 rounded-xl border p-4 text-left transition-all duration-200 hover:bg-muted/40 ${
                isSelected
                  ? "border-brand/60 bg-brand/5 ring-1 ring-brand/30"
                  : "border-border bg-card/40"
              }`}
            >
              {/* Icon + Check */}
              <div className="flex items-start justify-between">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${cat.colorHex}15` }}
                >
                  <Icon
                    className="h-4.5 w-4.5"
                    style={{ color: cat.colorHex }}
                  />
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-brand"
                  >
                    <Check className="h-3 w-3 text-white" />
                  </motion.div>
                )}
              </div>

              <div>
                <span className="text-sm font-semibold text-foreground block">
                  {cat.name}
                </span>
              </div>

              <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground mt-auto">
                Status:{" "}
                <span className={isSelected ? "text-brand" : ""}>
                  {isSelected ? "Active" : "Ready"}
                </span>
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
