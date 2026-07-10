"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Check, Flame, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthRoutes } from "@/constants/routes";

gsap.registerPlugin(ScrollTrigger);

/* ─── Floating Ambient Orbs ─── */
function AmbientOrbs() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const orbs = containerRef.current.querySelectorAll("[data-orb]");
    const ctx = gsap.context(() => {
      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          x: `random(-40, 40)`,
          y: `random(-30, 30)`,
          duration: `random(6, 10)`,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.8,
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        data-orb
        className="absolute top-[15%] left-[10%] h-80 w-80 rounded-full bg-brand/4 blur-3xl"
      />
      <div
        data-orb
        className="absolute top-[40%] right-[5%] h-64 w-64 rounded-full bg-violet-500/4 blur-3xl"
      />
      <div
        data-orb
        className="absolute bottom-[10%] left-[30%] h-72 w-72 rounded-full bg-emerald-500/3 blur-3xl"
      />
    </div>
  );
}

/* ─── Dashboard Preview Card (right side of hero) ─── */
function DashboardPreview() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [xpCount, setXpCount] = useState(0);
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      // Card entrance — cinematic rise with blur
      gsap.from(cardRef.current, {
        y: 60,
        opacity: 0,
        scale: 0.92,
        filter: "blur(8px)",
        duration: 1.2,
        delay: 0.6,
        ease: "power4.out",
      });

      // Counter animations
      const xpObj = { val: 0 };
      gsap.to(xpObj, {
        val: 173,
        duration: 2,
        delay: 1.2,
        ease: "power2.out",
        snap: { val: 1 },
        onUpdate: () => setXpCount(Math.round(xpObj.val)),
      });

      const streakObj = { val: 0 };
      gsap.to(streakObj, {
        val: 92,
        duration: 1.8,
        delay: 1.4,
        ease: "power2.out",
        snap: { val: 1 },
        onUpdate: () => setStreakCount(Math.round(streakObj.val)),
      });
    });

    return () => ctx.revert();
  }, []);

  // 3D Parallax mouse tracking
  useEffect(() => {
    if (!cardRef.current) return;
    const card = cardRef.current;

    const handleMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(card, {
        rotateY: x * 8,
        rotateX: -y * 8,
        duration: 0.6,
        ease: "power2.out",
        transformPerspective: 800,
      });
    };

    const handleLeave = () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });
    };

    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", handleLeave);
    return () => {
      card.removeEventListener("mousemove", handleMove);
      card.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
  const heatmapData = [
    [3, 4, 2, 5, 3, 1, 4],
    [5, 3, 4, 2, 5, 3, 2],
    [2, 5, 3, 4, 1, 5, 3],
    [4, 2, 5, 3, 4, 2, 5],
  ];

  return (
    <div ref={cardRef} className="relative w-full max-w-md" style={{ transformStyle: "preserve-3d" }}>
      {/* Main dashboard card */}
      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Deep Work Protocol</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider">Active</span>
          </div>
        </div>

        {/* Session info */}
        <div className="mb-4 rounded-xl bg-background/60 p-3.5 border border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground">Current Session</span>
            <span className="text-xs font-mono text-brand">14 hrs</span>
          </div>

          {/* Progress bars with shimmer */}
          <div className="space-y-2">
            {[
              { label: "Mental Clarity", width: "85%", color: "bg-brand", delay: 0.8 },
              { label: "Focus Score", width: "72%", color: "bg-emerald-500", delay: 1.0 },
              { label: "Consistency", width: "93%", color: "bg-violet-500", delay: 1.2 },
            ].map((bar) => (
              <div key={bar.label} className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-20 shrink-0">{bar.label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${bar.color} relative overflow-hidden`}
                    initial={{ width: 0 }}
                    animate={{ width: bar.width }}
                    transition={{ duration: 1.4, delay: bar.delay, ease: "easeOut" }}
                  >
                    <div className="hero-shimmer" />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day Heatmap */}
        <div className="mb-4">
          <span className="text-xs text-muted-foreground mb-2 block">7-Day Overview</span>
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((d, i) => (
              <span key={i} className="text-center text-[9px] text-muted-foreground mb-0.5">{d}</span>
            ))}
            {heatmapData.flat().map((val, i) => (
              <motion.div
                key={i}
                className="aspect-square rounded-sm"
                style={{
                  backgroundColor: `oklch(${0.35 + val * 0.08} 0.17 18 / ${0.2 + val * 0.18})`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                  delay: 0.8 + i * 0.025,
                }}
              />
            ))}
          </div>
        </div>

        {/* Daily Score Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <span className="text-[10px] text-muted-foreground block">Daily Score</span>
            <span className="text-lg font-semibold text-foreground">
              {xpCount}
              <span className="text-xs text-muted-foreground font-normal ml-0.5">/ 200 XP</span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-muted-foreground block">Streak</span>
            <div className="flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-brand" />
              <span className="text-lg font-bold text-foreground">{streakCount}</span>
              <span className="text-[10px] text-muted-foreground">days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating notification */}
      <motion.div
        initial={{ x: 30, y: 10, opacity: 0, scale: 0.85, filter: "blur(4px)" }}
        animate={{ x: 0, y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{
          duration: 0.8,
          delay: 1.8,
          ease: [0.32, 0.72, 0, 1],
        }}
        className="absolute -right-4 top-12 rounded-xl border border-border bg-card/95 backdrop-blur-md px-3.5 py-2.5 shadow-xl shadow-black/30"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20">
            <Check className="h-3 w-3 text-emerald-400" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-foreground">Habit Logged</p>
            <p className="text-[9px] text-muted-foreground">Morning meditation • 15 min</p>
          </div>
        </div>
      </motion.div>

      {/* Continuous float animation on notification */}
      <motion.div
        className="absolute -right-4 top-12"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ pointerEvents: "none" }}
      />

      {/* Glow */}
      <div className="absolute -inset-8 -z-10 rounded-3xl bg-brand/5 blur-3xl" />
    </div>
  );
}

/* ─── Hero Section ─── */
export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // Master timeline for cinematic entrance
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Badge slide in
      tl.from("[data-hero-badge]", {
        y: 20,
        opacity: 0,
        scale: 0.9,
        duration: 0.7,
      });

      // Heading — reveal with clip-path (Apple style)
      tl.from("[data-hero-heading] .hero-line", {
        y: 50,
        opacity: 0,
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1,
        stagger: 0.15,
        ease: "power4.out",
      }, "-=0.3");

      // Description fade
      tl.from("[data-hero-desc]", {
        y: 20,
        opacity: 0,
        duration: 0.7,
      }, "-=0.5");

      // CTA buttons slide up
      tl.from("[data-hero-cta] > *", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
      }, "-=0.3");

      // Social proof
      tl.from("[data-hero-social]", {
        y: 15,
        opacity: 0,
        duration: 0.5,
      }, "-=0.2");

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.15_0.02_18)_0%,transparent_60%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
      </div>

      <AmbientOrbs />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Text content */}
          <div className="max-w-xl">
            {/* System badge */}
            {/* <div data-hero-badge>
              <Badge
                variant="outline"
                className="mb-6 border-border text-muted-foreground font-mono text-[10px] uppercase tracking-widest px-3 py-1 h-auto rounded-full"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-brand mr-2 animate-pulse" />
                System v1.4 Online
              </Badge>
            </div> */}

            {/* Heading */}
            <h1
              data-hero-heading
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] tracking-tight text-foreground mb-5"
            >
              <span className="hero-line block overflow-hidden">
                <span className="inline-block">Master Your Internal</span>
              </span>
              <span className="hero-line block overflow-hidden">
                <span className="inline-block text-foreground">Architecture</span>
              </span>
            </h1>

            {/* Description */}
            <p
              data-hero-desc
              className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-md"
            >
              Engineer long-term behavior change with AI coaching and
              technical habit tracking. Build routines like you write code —
              with consistency and focus.
            </p>

            {/* CTA Buttons */}
            <div data-hero-cta className="flex flex-wrap items-center gap-3 mb-8">
              <Link href={AuthRoutes.SIGN_UP}>
                <Button
                  size="lg"
                  className="bg-brand text-brand-foreground hover:bg-brand/90 rounded-lg h-11 px-6 text-sm font-medium gap-2 hero-cta-glow"
                >
                  Start Tracking
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-lg h-11 px-6 text-sm font-medium gap-2"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                  Features
                </Button>
              </a>
            </div>

            {/* Social proof */}
            <div data-hero-social className="flex items-center gap-3">
              {/* Avatar stack */}
              <div className="flex -space-x-2">
                {[
                  "bg-violet-500",
                  "bg-emerald-500",
                  "bg-amber-500",
                  "bg-brand",
                ].map((bg, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, x: -10 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 1.5 + i * 0.1,
                    }}
                    className={`h-7 w-7 rounded-full ${bg} border-2 border-background flex items-center justify-center`}
                  >
                    <span className="text-[9px] font-medium text-white">
                      {["A", "K", "M", "S"][i]}
                    </span>
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Adopted by <span className="text-foreground font-medium">25k+</span> engineers & Pro
              </p>
            </div>
          </div>

          {/* Right - Dashboard preview */}
          <div className="hidden lg:flex justify-end">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
