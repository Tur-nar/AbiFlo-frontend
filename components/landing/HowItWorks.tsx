"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  PlusCircle,
  CalendarCheck,
  Trophy,
  Target,
  Brain,
  BarChart3,
  Users,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Set Your Habits",
    description:
      "Define daily, weekly, or custom-frequency habits with reminders. Stack habits together for powerful routines.",
    icon: PlusCircle,
    accentColor: "text-brand",
    borderColor: "border-brand/20",
    bgColor: "bg-brand/10",
    visual: (
      <div className="space-y-3">
        {["Morning Meditation", "Read 30 Minutes", "Deep Work Sprint"].map(
          (habit, i) => (
            <div
              key={habit}
              className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/60 p-3"
            >
              <div className="h-5 w-5 rounded-full border-2 border-brand/40" />
              <span className="text-sm text-foreground/80">{habit}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {["6:00 AM", "7:00 AM", "9:00 AM"][i]}
              </span>
            </div>
          )
        )}
      </div>
    ),
  },
  {
    number: "02",
    title: "Define Your Goals",
    description:
      "Set measurable goals with deadlines. Break them into milestones and link habits directly to outcomes.",
    icon: Target,
    accentColor: "text-violet-500",
    borderColor: "border-violet-500/20",
    bgColor: "bg-violet-500/10",
    visual: (
      <div className="space-y-3">
        <div className="rounded-xl border border-border/50 bg-background/60 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Run a Marathon</span>
            <span className="text-xs text-violet-500">68%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-linear-to-r from-violet-500 to-indigo-500" style={{ width: "68%" }} />
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">3 of 4 milestones complete</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-background/60 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Learn TypeScript</span>
            <span className="text-xs text-violet-500">45%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-linear-to-r from-violet-500 to-indigo-500" style={{ width: "45%" }} />
          </div>
        </div>
      </div>
    ),
  },
  {
    number: "03",
    title: "Track Daily",
    description:
      "Log completions with one tap. Watch your heatmap fill up and streaks grow. Mood and energy tracking included.",
    icon: CalendarCheck,
    accentColor: "text-emerald-500",
    borderColor: "border-emerald-500/20",
    bgColor: "bg-emerald-500/10",
    visual: (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-1.5">
          {[0.7,0.3,1,0.5,0.8,0.2,0.9, 0.4,1,0.6,0.3,0.8,0.5,1, 0.2,0.7,0.4,1,0.6,0.3,0.8, 0.9,0.5,0.2,0.7,1,0.4,0.6].map((intensity, i) => (
            <div
              key={i}
              className="aspect-square rounded-sm"
              style={{
                backgroundColor: `oklch(86.692% 0.29416 142.393 / ${intensity})`,
              }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between rounded-xl border border-border/50 bg-background/60 p-3">
          <span className="text-xs text-muted-foreground">Current Streak</span>
          <span className="text-lg font-bold text-emerald-500">🔥 47 days</span>
        </div>
      </div>
    ),
  },
  {
    number: "04",
    title: "AI-Powered Insights",
    description:
      "Get personalized suggestions on timing, habit stacking, and burnout prevention from our AI coaching engine.",
    icon: Brain,
    accentColor: "text-fuchsia-500",
    borderColor: "border-fuchsia-500/20",
    bgColor: "bg-fuchsia-500/10",
    visual: (
      <div className="space-y-3">
        <div className="rounded-xl border border-border/50 bg-background/60 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-4 w-4 text-fuchsia-500" />
            <span className="text-xs font-medium text-foreground">AI Insight</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            &ldquo;Your meditation habit has 94% completion before 7AM but drops to 42% after. Consider locking it in as your first morning action.&rdquo;
          </p>
        </div>
        <div className="flex gap-2">
          <span className="rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 px-2.5 py-1 text-[10px] font-medium text-fuchsia-500">Optimal Time</span>
          <span className="rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 px-2.5 py-1 text-[10px] font-medium text-fuchsia-500">Habit Stack</span>
        </div>
      </div>
    ),
  },
  {
    number: "05",
    title: "Deep Analytics",
    description:
      "Visualize trends with heatmaps, radar charts, and weekly reports. Export data or connect via API.",
    icon: BarChart3,
    accentColor: "text-sky-500",
    borderColor: "border-sky-500/20",
    bgColor: "bg-sky-500/10",
    visual: (
      <div className="space-y-3">
        {/* Mini bar chart */}
        <div className="flex items-end gap-1.5 h-16">
          {[40, 65, 80, 55, 90, 70, 85].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-linear-to-t from-sky-500/60 to-sky-500/20"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-border/50 bg-background/60 p-3">
          <span className="text-xs text-muted-foreground">Weekly Score</span>
          <span className="text-sm font-bold text-sky-500">89%</span>
        </div>
      </div>
    ),
  },
  {
    number: "06",
    title: "Level Up & Earn",
    description:
      "Earn XP for every completion. Unlock badges, hit milestones, and get recognized for consistency.",
    icon: Trophy,
    accentColor: "text-amber-500",
    borderColor: "border-amber-500/20",
    bgColor: "bg-amber-500/10",
    visual: (
      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/60 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-lg">
            🏆
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Level 12</p>
            <div className="mt-1 h-1.5 w-32 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-linear-to-r from-amber-500 to-orange-500"
                style={{ width: "72%" }}
              />
            </div>
          </div>
          <span className="ml-auto text-xs text-muted-foreground">
            1,730 XP
          </span>
        </div>
        <div className="flex gap-2">
          {["🌅", "💪", "🧠", "⚡", "🔥"].map((emoji) => (
            <div
              key={emoji}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-background/60 text-lg"
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: "07",
    title: "Team Challenges",
    description:
      "Create or join group challenges. Compete on leaderboards, share progress, and build accountability.",
    icon: Users,
    accentColor: "text-rose-500",
    borderColor: "border-rose-500/20",
    bgColor: "bg-rose-500/10",
    visual: (
      <div className="space-y-3">
        <div className="rounded-xl border border-border/50 bg-background/60 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-foreground">30-Day Fitness Sprint</span>
            <span className="text-[10px] text-emerald-500 font-medium">Active</span>
          </div>
          <div className="flex -space-x-1.5">
            {["bg-rose-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500"].map((bg, i) => (
              <div key={i} className={`h-6 w-6 rounded-full ${bg} border-2 border-background flex items-center justify-center`}>
                <span className="text-[8px] font-bold text-white">{["A", "B", "C", "D"][i]}</span>
              </div>
            ))}
            <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
              <span className="text-[8px] font-medium text-muted-foreground">+8</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

export function HowItWorks() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  // Measure the track width on mount and resize
  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.scrollWidth);
      }
    };

    measure();
    // Re-measure after fonts/images load
    const timer = setTimeout(measure, 300);
    window.addEventListener("resize", measure);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const scrollDistance = Math.max(0, trackWidth - (typeof window !== "undefined" ? window.innerWidth : 1400));

  // Use framer-motion scroll tracking on the tall wrapper
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Map vertical scroll → horizontal translation
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);

  return (
    <>
      {/* 
        Tall wrapper: height = 100vh (sticky viewport) + scrollDistance (horizontal content overflow).
        The user scrolls through this tall div vertically, and the sticky container converts
        that vertical scroll into horizontal motion.
      */}
      <div
        ref={wrapperRef}
        style={{ height: `${scrollDistance + (typeof window !== "undefined" ? window.innerHeight : 800)}px` }}
        className="relative"
      >
        {/* Sticky container — stays pinned at the top of the viewport */}
        <div className="sticky top-0 h-screen overflow-hidden bg-background">
          {/* Section header */}
          <div className="absolute top-0 left-0 right-0 z-20 pt-16 pb-8 pointer-events-none">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 font-medium mb-3">
                How It Works
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Your journey to{" "}
                <span className="font-serif italic text-brand font-medium">
                  transformation
                </span>
              </h2>
            </div>
          </div>

          {/* Horizontal scrolling track — driven by framer-motion x transform */}
          <motion.div
            ref={trackRef}
            className="absolute top-0 left-0 flex h-full items-center gap-8 pl-6 lg:pl-8 pt-28 pb-16 pr-[10vw] will-change-transform"
            style={{ x }}
          >
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="w-105 min-w-95 shrink-0"
                >
                  <div
                    className={`group relative rounded-2xl border ${step.borderColor} bg-card/40 backdrop-blur-sm p-8 h-full transition-all duration-300 hover:bg-card/60`}
                  >
                    <div className="relative z-10">
                      {/* Step number + icon */}
                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-5xl font-bold text-foreground/8 tracking-tighter">
                          {step.number}
                        </span>
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${step.bgColor} border ${step.borderColor}`}
                        >
                          <Icon className={`h-5 w-5 ${step.accentColor}`} />
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                        {step.description}
                      </p>

                      {/* Visual preview */}
                      <div className="rounded-xl border border-border/30 bg-background/40 p-4">
                        {step.visual}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </>
  );
}
