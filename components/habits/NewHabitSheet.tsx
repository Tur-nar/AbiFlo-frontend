"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useCreateHabit } from "@/hooks/use-habit";
import { useCategories } from "@/hooks/use-category";
import { CategoryIcon } from "@/components/common/CategoryIcon";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import type { CreateHabitPayload, Frequency, Difficulty, HabitType } from "@/types/habit.types";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  categoryId: z.string().min(1, "Pick a category"),
  habitType: z.enum(["BUILD", "QUIT"]),
  frequency: z.enum(["DAILY", "WEEKLY", "CUSTOM"]),
  frequencyDays: z.array(z.number()).optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD", "EXTREME"]),
  isMeasurable: z.boolean(),
  unit: z.string().max(20).optional(),
  targetValue: z.coerce.number().min(0).optional(),
  reminderTime: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const DAY_VALUES = [1, 2, 3, 4, 5, 6, 0];

const DIFFICULTIES: Difficulty[] = ["EASY", "MEDIUM", "HARD", "EXTREME"];
const DIFFICULTY_STYLES: Record<string, { active: string; label: string }> = {
  EASY: { active: "border-emerald-500/60 bg-emerald-500/15 text-emerald-400", label: "Easy" },
  MEDIUM: { active: "border-amber-500/60 bg-amber-500/15 text-amber-400", label: "Medium" },
  HARD: { active: "border-brand/60 bg-brand/15 text-brand", label: "Hard" },
  EXTREME: { active: "border-rose-500/60 bg-rose-500/15 text-rose-400", label: "Elite" },
};

interface NewHabitSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewHabitSheet({ open, onOpenChange }: NewHabitSheetProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-[420px] overflow-y-auto border-l border-border/50 bg-card p-0">
          <SheetHeader className="px-5 pt-5 pb-3 border-b border-border/30">
            <SheetTitle className="text-base font-semibold">New Habit</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-64px)]">
            <div className="px-5 py-4">
              <HabitForm onOpenChange={onOpenChange} />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent className="max-h-[90dvh]">
        <DrawerHeader className="px-5 pt-4 pb-2">
          <DrawerTitle className="text-base font-semibold">New Habit</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="px-5 pb-6 overflow-y-auto" style={{ maxHeight: "calc(90dvh - 80px)" }}>
          <HabitForm onOpenChange={onOpenChange} />
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}

// Shared form extracted so both Sheet and Drawer use the same form
function HabitForm({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const { data: categories = [] } = useCategories();
  const createHabit = useCreateHabit();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      habitType: "BUILD",
      frequency: "DAILY",
      frequencyDays: [1, 2, 3, 4, 5],
      difficulty: "MEDIUM",
      isMeasurable: false,
      unit: "",
      targetValue: undefined,
      reminderTime: "",
    },
  });

  const frequency = form.watch("frequency");
  const isMeasurable = form.watch("isMeasurable");
  const selectedCategory = form.watch("categoryId");
  const selectedType = form.watch("habitType");
  const selectedDifficulty = form.watch("difficulty");
  const selectedDays = form.watch("frequencyDays") ?? [];

  const onSubmit = (data: FormValues) => {
    const payload: CreateHabitPayload = {
      title: data.title,
      description: data.description || undefined,
      categoryId: data.categoryId,
      habitType: data.habitType as HabitType,
      frequency: data.frequency as Frequency,
      frequencyDays: data.frequency !== "DAILY" ? data.frequencyDays : undefined,
      difficulty: data.difficulty as Difficulty,
      isMeasurable: data.isMeasurable,
      unit: data.isMeasurable ? data.unit : undefined,
      targetValue: data.isMeasurable ? data.targetValue : undefined,
      reminderTime: data.reminderTime || undefined,
    };

    createHabit.mutate(payload, {
      onSuccess: () => {
        toast.success("Habit created!");
        form.reset();
        onOpenChange(false);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to create habit");
      },
    });
  };

  const toggleDay = (day: number) => {
    const current = form.getValues("frequencyDays") ?? [];
    const next = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    form.setValue("frequencyDays", next);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Title */}
      <div className="space-y-1.5">
        <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Title
        </Label>
        <Input
          placeholder="e.g. Morning Meditation"
          {...form.register("title")}
          className="bg-background/50 text-sm h-9"
        />
        {form.formState.errors.title && (
          <p className="text-[11px] text-destructive">{form.formState.errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Description <span className="text-muted-foreground/50 font-normal normal-case">(optional)</span>
        </Label>
        <Textarea
          placeholder="What does this habit look like?"
          rows={2}
          {...form.register("description")}
          className="bg-background/50 resize-none text-sm"
        />
      </div>

      {/* Category — show icon + name in a compact grid */}
      <div className="space-y-1.5">
        <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Category
        </Label>
        <div className="grid grid-cols-3 gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => form.setValue("categoryId", cat.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-medium transition-all",
                selectedCategory === cat.id
                  ? "border-brand/50 bg-brand/10 text-foreground shadow-sm"
                  : "border-border/40 bg-background/30 text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              <CategoryIcon name={cat.icon} className="h-3.5 w-3.5 shrink-0" colorHex={cat.colorHex} />
              <span className="truncate">{cat.name}</span>
            </button>
          ))}
        </div>
        {form.formState.errors.categoryId && (
          <p className="text-[11px] text-destructive">{form.formState.errors.categoryId.message}</p>
        )}
      </div>

      {/* Habit Type */}
      <div className="space-y-1.5">
        <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Type
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {(["BUILD", "QUIT"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => form.setValue("habitType", type)}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all",
                selectedType === type
                  ? type === "BUILD"
                    ? "border-brand/50 bg-brand/10 text-brand"
                    : "border-sky-500/50 bg-sky-500/10 text-sky-400"
                  : "border-border/40 bg-background/30 text-muted-foreground hover:border-border",
              )}
            >
              {type === "BUILD" ? "🔥" : "🛡️"} {type === "BUILD" ? "Build" : "Quit"}
            </button>
          ))}
        </div>
      </div>

      {/* Frequency */}
      <div className="space-y-2">
        <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Frequency
        </Label>
        <div className="grid grid-cols-3 gap-1.5">
          {(["DAILY", "WEEKLY", "CUSTOM"] as const).map((freq) => (
            <button
              key={freq}
              type="button"
              onClick={() => form.setValue("frequency", freq)}
              className={cn(
                "rounded-lg border px-2.5 py-2 text-xs font-medium transition-all",
                frequency === freq
                  ? "border-brand/50 bg-brand/10 text-foreground"
                  : "border-border/40 bg-background/30 text-muted-foreground hover:border-border",
              )}
            >
              {freq.charAt(0) + freq.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {frequency !== "DAILY" && (
          <div className="flex gap-1.5 pt-1">
            {DAY_LABELS.map((label, i) => {
              const dayVal = DAY_VALUES[i];
              const isSelected = selectedDays.includes(dayVal);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDay(dayVal)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold transition-all",
                    isSelected
                      ? "bg-brand text-white"
                      : "bg-background/50 text-muted-foreground border border-border/40 hover:border-brand/40",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Difficulty */}
      <div className="space-y-1.5">
        <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Difficulty
        </Label>
        <div className="grid grid-cols-4 gap-1.5">
          {DIFFICULTIES.map((d) => {
            const style = DIFFICULTY_STYLES[d];
            return (
              <button
                key={d}
                type="button"
                onClick={() => form.setValue("difficulty", d)}
                className={cn(
                  "rounded-lg border px-1.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all",
                  selectedDifficulty === d
                    ? style.active
                    : "border-border/40 bg-background/30 text-muted-foreground hover:border-border",
                )}
              >
                {style.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Measurable */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Measurable
          </Label>
          <Switch
            checked={isMeasurable}
            onCheckedChange={(checked) => form.setValue("isMeasurable", checked)}
          />
        </div>
        {isMeasurable && (
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-[10px] uppercase text-muted-foreground">Unit</Label>
              <Input
                placeholder="min, km, pages..."
                {...form.register("unit")}
                className="bg-background/50 text-sm h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase text-muted-foreground">Target</Label>
              <Input
                type="number"
                placeholder="60"
                {...form.register("targetValue")}
                className="bg-background/50 text-sm h-8"
              />
            </div>
          </div>
        )}
      </div>

      {/* Reminder */}
      <div className="space-y-1.5">
        <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Reminder <span className="text-muted-foreground/50 font-normal normal-case">(optional)</span>
        </Label>
        <Input
          type="time"
          {...form.register("reminderTime")}
          className="bg-background/50 text-sm h-9 w-32"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={createHabit.isPending}
        className="w-full bg-brand hover:bg-brand/90 text-brand-foreground font-semibold h-10 text-sm mt-1"
      >
        {createHabit.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Create Habit"
        )}
      </Button>
    </form>
  );
}
