"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  TrendingUp,
  Brain,
  Trophy,
  Timer,
  Users,
  Target,
  BarChart3,
  Sparkles,
  Shield,
  Zap,
  Calendar,
  Bell,
} from "lucide-react";

const features = [
  {
    title: "Habit Streaks",
    description: "Maintain momentum with visual progress tracking and automated reminders.",
    icon: TrendingUp,
    gradient: "from-brand/15 to-violet-500/15",
  },
  {
    title: "AI Coaching",
    description: "Personalized habit insights and dynamic goal adjustments powered by AI.",
    icon: Brain,
    gradient: "from-violet-500/15 to-indigo-500/15",
  },
  {
    title: "Gamification & XP",
    description: "Level up your life and earn rewards for consistent behavior change.",
    icon: Trophy,
    gradient: "from-amber-500/15 to-orange-500/15",
  },
  {
    title: "Focus Timer",
    description: "Integrated deep work sessions with distraction-free tracking modes.",
    icon: Timer,
    gradient: "from-emerald-500/15 to-cyan-500/15",
  },
  {
    title: "Accountability Partners",
    description: "Sync with peers to share progress and stay motivated together.",
    icon: Users,
    gradient: "from-rose-500/15 to-pink-500/15",
  },
  {
    title: "Group Challenges",
    description: "Join community-driven habit sprints and compete for the top spots.",
    icon: Target,
    gradient: "from-cyan-500/15 to-blue-500/15",
  },
  {
    title: "Advanced Analytics",
    description: "Deep data visualizations: heatmaps, trends, and behavioral patterns over time.",
    icon: BarChart3,
    gradient: "from-indigo-500/15 to-violet-500/15",
  },
  {
    title: "Smart Reminders",
    description: "Context-aware notifications that adapt to your schedule and completion history.",
    icon: Bell,
    gradient: "from-sky-500/15 to-blue-500/15",
  },
  {
    title: "Mood & Energy",
    description: "Log how you feel alongside habits to discover what drives peak performance.",
    icon: Sparkles,
    gradient: "from-fuchsia-500/15 to-pink-500/15",
  },
  {
    title: "Data Privacy",
    description: "End-to-end encryption. Your habit data stays yours — we never sell or share.",
    icon: Shield,
    gradient: "from-emerald-500/15 to-teal-500/15",
  },
  {
    title: "Instant Sync",
    description: "Real-time sync across all devices. Start on your phone, continue on desktop.",
    icon: Zap,
    gradient: "from-amber-500/15 to-yellow-500/15",
  },
  {
    title: "Habit Calendar",
    description: "Monthly and weekly views with completion heatmaps and streak visualization.",
    icon: Calendar,
    gradient: "from-brand/15 to-rose-500/15",
  },
  {
    title: "Habit Streaks",
    description: "Maintain momentum with visual progress tracking and automated reminders.",
    icon: TrendingUp,
    gradient: "from-brand/15 to-violet-500/15",
  },
  {
    title: "AI Coaching",
    description: "Personalized habit insights and dynamic goal adjustments powered by AI.",
    icon: Brain,
    gradient: "from-violet-500/15 to-indigo-500/15",
  },
  {
    title: "Gamification & XP",
    description: "Level up your life and earn rewards for consistent behavior change.",
    icon: Trophy,
    gradient: "from-amber-500/15 to-orange-500/15",
  },
];

/* ─── Feature Card ─── */
function FeatureCard({ feature }: { feature: (typeof features)[0] }) {
  const Icon = feature.icon;

  return (
    <div className="group relative flex flex-col gap-5 rounded-2xl border border-border/50 bg-card/40 p-7 transition-all duration-300 hover:border-brand/30 hover:bg-card/60 w-full">
      <div
        className={`absolute inset-0 rounded-2xl bg-linear-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <div className="relative z-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 border border-brand/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <Icon className="h-7 w-7 text-brand" />
        </div>

        <h3 className="mt-5 text-lg font-semibold text-foreground">
          {feature.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

/* ─── Parallax Column — matches skiper30 pattern exactly ─── */
function Column({
  cards,
  y,
}: {
  cards: (typeof features)[number][];
  y: MotionValue<number>;
}) {
  return (
    <motion.div
      className="relative flex h-full w-1/4 min-w-62 flex-col gap-[2vw] first:top-[-30%] nth-2:top-[-80%] nth-3:top-[-10%] nth-4:top-[-75%]"
      style={{ y }}
    >
      {cards.map((feature, i) => (
        <FeatureCard key={`${feature.title}-${i}`} feature={feature} />
      ))}
    </motion.div>
  );
}

export function Features() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"],
  });

  const { height } = dimension;

  // 4 columns with different speeds — exactly like skiper30
  // Even columns go up, odd columns go down (opposite directions)
  const y1 = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);

  useEffect(() => {
    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  // 4 columns with repeated/shuffled cards for fullness
  const col1 = [features[0], features[4], features[8], features[3]];
  const col2 = [features[1], features[5], features[9], features[13]];
  const col3 = [features[2], features[6], features[10], features[0]];
  const col4 = [features[3], features[7], features[11], features[5]];

  return (
    <section id="features" className="relative overflow-hidden bg-background">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.15_0.02_18/0.1),transparent_70%)]" />

      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 pt-28 pb-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 font-medium mb-3">
            Core Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Engineered for{" "}
            <span className="font-serif italic text-brand font-medium">
              Consistency
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Advanced tools designed for technical minds to master their daily
            routines.
          </p>
        </div>
      </div>

      {/* Oliver Parallax Gallery — 4 columns, skiper30 style */}
      <div
        ref={galleryRef}
        className="relative box-border flex h-[175vh] gap-[2vw] overflow-hidden p-[2vw]"
      >
        <Column cards={col1} y={y1} />
        <Column cards={col2} y={y2} />
        <Column cards={col3} y={y3} />
        <Column cards={col4} y={y4} />
      </div>
    </section>
  );
}
