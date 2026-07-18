"use client";

import {
  TrendingUp,
  Brain,
  Trophy,
  Timer,
  Users,
  Target,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const features = [
  {
    title: "Habit Streaks",
    description:
      "Maintain momentum with visual progress tracking and automated reminders.",
    icon: TrendingUp,
  },
  {
    title: "AI Coaching",
    description:
      "Personalized habit insights and dynamic goal adjustments powered by AI.",
    icon: Brain,
  },
  {
    title: "Gamification & XP",
    description:
      "Level up your life and earn rewards for consistent behavior change.",
    icon: Trophy,
  },
  {
    title: "Focus Timer",
    description:
      "Integrated deep work sessions with distraction-free tracking modes.",
    icon: Timer,
  },
  {
    title: "Accountability Partners",
    description:
      "Sync with peers to share progress and stay motivated together.",
    icon: Users,
  },
  {
    title: "Group Challenges",
    description:
      "Join community-driven habit sprints and compete for the top spots.",
    icon: Target,
  },
];

function FeatureCard({ feature }: { feature: typeof features[0] }) {
  const Icon = feature.icon;

  return (
    <div
      className="scroll-reveal group flex flex-col gap-4 rounded-lg border border-border bg-card/60 p-6 shadow-sm transition-[border-color,transform,background-color] duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-card/80 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 border border-brand/20 transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none">
        <Icon className="h-5 w-5 text-brand" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-foreground">
          {feature.title}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

export function Features() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={sectionRef} id="features" className="py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.15_0.02_18/0.15),transparent_70%)]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2
            className="scroll-reveal text-3xl sm:text-4xl font-bold tracking-tight text-foreground"
          >
            Engineered for{" "}
            <span className="font-serif italic text-brand font-medium">
              Consistency
            </span>
          </h2>
          <p
            className="scroll-reveal mt-4 text-sm sm:text-base text-muted-foreground max-w-md mx-auto"
          >
            Advanced tools designed for technical minds to master their daily routines.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
