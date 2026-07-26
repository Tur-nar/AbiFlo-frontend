"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Zap,
  TrendingUp,
  Star,
  Users,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    label: "Habits Tracked",
    value: 10000,
    suffix: "+",
    icon: Zap,
  },
  {
    label: "Avg Completion Rate",
    value: 92,
    suffix: "%",
    icon: TrendingUp,
  },
  {
    label: "User Rating",
    value: 4.9,
    suffix: "★",
    decimals: 1,
    icon: Star,
  },
  {
    label: "Active Users",
    value: 2500,
    suffix: "+",
    icon: Users,
  },
];

const techLogos = [
  "Next.js",
  "NestJS",
  "PostgreSQL",
  "Redis",
  "Prisma",
  "AI-Powered",
  "Real-Time",
  "TypeScript",
];

function AnimatedCounter({
  value,
  suffix = "",
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          if (triggered.current) return;
          triggered.current = true;

          const obj = { val: 0 };
          gsap.to(obj, {
            val: value,
            duration: 2.2,
            ease: "power2.out",
            snap: decimals > 0 ? undefined : { val: 1 },
            onUpdate: () => {
              setCount(
                decimals > 0
                  ? parseFloat(obj.val.toFixed(decimals))
                  : Math.round(obj.val)
              );
            },
          });
        },
      });
    });

    return () => ctx.revert();
  }, [value, decimals]);

  return (
    <span ref={ref}>
      {decimals > 0 ? count.toFixed(decimals) : count.toLocaleString()}
      {suffix}
    </span>
  );
}

function LogoMarquee() {
  return (
    <div className="relative overflow-hidden py-6">
      {/* Fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-background to-transparent" />

      <div className="flex animate-marquee gap-12">
        {[...techLogos, ...techLogos].map((logo, i) => (
          <span
            key={`${logo}-${i}`}
            className="shrink-0 text-sm font-medium text-muted-foreground/50 tracking-wider uppercase whitespace-nowrap select-none"
          >
            {logo}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SocialProof() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-background"
    >
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.6_0.15_280/0.06),transparent_60%)]" />

      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                data-stat-card
                className="scroll-reveal group relative rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 text-center transition-all duration-300 hover:border-brand/30 hover:bg-card/60"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-brand/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 border border-brand/20">
                    <Icon className="h-5 w-5 text-brand" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Logo marquee */}
        <div className="text-center mb-4">
          <p className="text-xs text-muted-foreground/60 uppercase tracking-[0.2em] font-medium">
            Built with industry-leading technologies
          </p>
        </div>
        <LogoMarquee />

        {/* Testimonial */}
        <div className="mt-16 mx-auto max-w-2xl">
          <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-8 text-center">
            <blockquote className="text-base sm:text-lg text-foreground/80 leading-relaxed italic">
              &ldquo;AbiFlo turned my scattered goals into a system. The streak tracking
              and AI coaching keep me accountable in ways no other app has.&rdquo;
            </blockquote>
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="h-10 w-10 rounded-full bg-linear-to-br from-brand/60 to-violet-500/60 flex items-center justify-center text-sm font-bold text-white">
                A
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">
                  Adewale K.
                </p>
                <p className="text-xs text-muted-foreground">
                  Software Engineer · 92-day streak
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
