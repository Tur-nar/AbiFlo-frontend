"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompleteOnboarding } from "@/hooks/users/useCompleteOnboarding";
import { useSkipOnboarding } from "@/hooks/users/useSkipOnboarding";
import { useCategories } from "@/hooks/categories/useCategories";
import { DASHBOARD_ROUTES } from "@/constants/routes";
import { authClient } from "@/lib/auth-client";
import { UploadAvatarApi } from "@/lib/api/upload.api";

import { StepProfile } from "@/components/onboarding/StepProfile";
import { StepCategories } from "@/components/onboarding/StepCategories";
import { StepHabit } from "@/components/onboarding/StepHabit";
import { StepGoal } from "@/components/onboarding/StepGoal";
import { StepComplete } from "@/components/onboarding/StepComplete";

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const { mutateAsync: completeOnboarding } = useCompleteOnboarding();
  const { mutateAsync: skipOnboarding, isPending: isSkipping } =
    useSkipOnboarding();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const [loading, setLoading] = useState(false);

  // Session data
  const { data: session } = authClient.useSession();
  const userName = session?.user?.name || "there";

  // Step 1: Profile
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [timezone, setTimezone] = useState("Africa/Lagos");

  // Step 2: Categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Step 3: Habit
  const [habitTitle, setHabitTitle] = useState("");
  const [frequency, setFrequency] = useState<"DAILY" | "WEEKLY">("DAILY");
  const [difficulty, setDifficulty] = useState<string>("MEDIUM");
  const [selectedHabitCategory, setSelectedHabitCategory] = useState("");

  // Step 4: Goal
  const [goalTitle, setGoalTitle] = useState("");
  const [goalTargetDate, setGoalTargetDate] = useState("");
  const [goalWhy, setGoalWhy] = useState("");

  const handleAvatarSelect = useCallback((file: File) => {
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const toggleCategory = (id: string) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== id));
    } else if (selectedCategories.length < 5) {
      setSelectedCategories([...selectedCategories, id]);
    } else {
      toast.error("Maximum 5 categories allowed.");
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!timezone) {
        toast.error("Please select a timezone");
        return;
      }
      setDirection(1);
      setStep(2);
    } else if (step === 2) {
      if (selectedCategories.length < 3) {
        toast.error("Please select at least 3 categories.");
        return;
      }
      if (selectedCategories.length > 5) {
        toast.error("Please select at most 5 categories.");
        return;
      }
      setSelectedHabitCategory(selectedCategories[0]);
      setDirection(1);
      setStep(3);
    } else if (step === 3) {
      if (!habitTitle.trim()) {
        toast.error("Please name your first habit.");
        return;
      }
      if (!selectedHabitCategory) {
        toast.error("Please select a category for your habit.");
        return;
      }
      setDirection(1);
      setStep(4);
    } else if (step === 4) {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      // Upload avatar if selected
      let avatarUrl: string | undefined;
      if (avatarFile) {
        try {
          avatarUrl = await UploadAvatarApi(avatarFile);
        } catch {
          // Non-blocking — continue without avatar
          console.warn("Avatar upload failed, continuing without it");
        }
      }

      await completeOnboarding({
        timezone,
        avatarUrl,
        categoryIds: selectedCategories,
        firstHabitTitle: habitTitle,
        firstHabitCategoryId: selectedHabitCategory,
        frequency,
        difficulty: difficulty as "EASY" | "MEDIUM" | "HARD" | "EXTREME",
        firstGoalTitle: goalTitle || undefined,
        goalTargetDate: goalTargetDate || undefined,
        firstGoalWhy: goalWhy || undefined,
      });

      setDirection(1);
      setStep(5);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to complete onboarding"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    try {
      await skipOnboarding();
      toast.success("Onboarding skipped. You can set up later.");
      router.push(DASHBOARD_ROUTES.HOME);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to skip onboarding"
      );
    }
  };

  const goToDashboard = () => {
    import("canvas-confetti").then((confetti) => {
      confetti.default({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#f97316", "#ef4444", "#8b5cf6", "#10b981", "#f59e0b"],
      });
    });
    setTimeout(() => router.push(DASHBOARD_ROUTES.HOME), 800);
  };

  // Filter categories for habit step (only selected ones)
  const availableHabitCategories = categories.filter((c) =>
    selectedCategories.includes(c.id)
  );

  if (categoriesLoading) {
    return (
      <div className="relative min-h-[calc(100vh-6rem)] flex items-center justify-center py-12 px-16 sm:px-6 lg:px-8 selection:text-foreground">
        <div className="text-sm text-muted-foreground font-mono animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-6rem)] flex items-center justify-center py-12 px-16 sm:px-6 lg:px-8 selection:text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.13_0.02_18/0.08),transparent_70%)] pointer-events-none" />
      <div className="z-10 w-full min-w-[80vw] lg:min-w-[950px]">
        {step < 5 && (
          <div className="mb-8 px-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Step {step} of {TOTAL_STEPS - 1}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                {Math.round((step / (TOTAL_STEPS - 1)) * 100)}%
              </span>
            </div>
            <div className="h-1 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-brand"
                initial={{ width: 0 }}
                animate={{
                  width: `${(step / (TOTAL_STEPS - 1)) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              />
            </div>
          </div>
        )}

        {/* Card Container */}
        <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-2xl shadow-black/30 overflow-hidden min-h-[480px] flex flex-col">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <StepProfile
                direction={direction}
                userName={userName}
                avatarPreview={avatarPreview}
                timezone={timezone}
                onAvatarSelect={handleAvatarSelect}
                onTimezoneChange={setTimezone}
              />
            )}

            {step === 2 && (
              <StepCategories
                direction={direction}
                categories={categories}
                selectedIds={selectedCategories}
                onToggle={toggleCategory}
              />
            )}

            {step === 3 && (
              <StepHabit
                direction={direction}
                habitTitle={habitTitle}
                frequency={frequency}
                difficulty={difficulty}
                selectedHabitCategory={selectedHabitCategory}
                availableCategories={availableHabitCategories}
                onHabitTitleChange={setHabitTitle}
                onFrequencyChange={setFrequency}
                onDifficultyChange={setDifficulty}
                onHabitCategoryChange={setSelectedHabitCategory}
              />
            )}

            {step === 4 && (
              <StepGoal
                direction={direction}
                goalTitle={goalTitle}
                goalTargetDate={goalTargetDate}
                goalWhy={goalWhy}
                onGoalTitleChange={setGoalTitle}
                onGoalTargetDateChange={setGoalTargetDate}
                onGoalWhyChange={setGoalWhy}
              />
            )}

            {step === 5 && (
              <StepComplete
                direction={direction}
                userName={userName}
                habitTitle={habitTitle}
                frequency={frequency}
                difficulty={difficulty}
                goalTitle={goalTitle}
                goalTargetDate={goalTargetDate}
                onGoToDashboard={goToDashboard}
              />
            )}
          </AnimatePresence>

          {/* Footer Navigation (steps 1-4) */}
          {step < 5 && (
            <div className="flex justify-between items-center border-t border-border/60 px-8 py-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={step === 1 || loading}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  disabled={loading || isSkipping}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground gap-1"
                >
                  <SkipForward className="h-3.5 w-3.5" />
                  {isSkipping ? "Skipping..." : "Skip"}
                </Button>
              </div>
              <Button
                onClick={handleNext}
                disabled={loading}
                className="bg-brand text-brand-foreground hover:bg-brand/90 px-5 py-2.5 rounded-lg text-xs font-semibold gap-1.5"
              >
                {loading ? (
                  "Processing..."
                ) : step === 4 ? (
                  <>
                    Complete Setup
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
