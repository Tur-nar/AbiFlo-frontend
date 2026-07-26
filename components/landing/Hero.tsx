"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextRoll } from "@/components/ui/skiper-ui/skiper58";
import { MorphText } from "@/components/ui/morph-text";
import { AuthRoutes } from "@/constants/routes";

gsap.registerPlugin(ScrollTrigger);

/* ─── Parallax Layer System ─── */
function ParallaxLayers() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Each layer moves at different speeds — creates depth
  const y0 = useTransform(scrollYProgress, [0, 1], [0, -50]); // slowest (deepest)
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -300]); // fastest (foreground)
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {/* Layer 0 — Deepest: Gradient mesh */}
      <motion.div
        className="absolute inset-0"
        style={{ y: y0, opacity }}
      >
        <div className="absolute top-[10%] left-[15%] h-125 w-125 rounded-full bg-brand/6 blur-[100px]" />
        <div className="absolute top-[30%] right-[10%] h-100 w-100 rounded-full bg-violet-500/5 blur-[80px]" />
        <div className="absolute bottom-[20%] left-[40%] h-87.5 w-87.5 rounded-full bg-emerald-500/4 blur-[90px]" />
      </motion.div>

      {/* Layer 1 — Grid pattern with drift */}
      <motion.div
        className="absolute inset-0"
        style={{ y: y1, opacity }}
      >
        {/* Layer intentionally empty — clean background */}
      </motion.div>

      {/* Layer 2 — Floating geometric shapes */}
      <motion.div
        className="absolute inset-0"
        style={{ y: y2 }}
      >
        {/* Dotted ring */}
        <div className="absolute top-[20%] right-[20%] h-32 w-32 rounded-full border border-dashed border-foreground/5 animate-[spin_40s_linear_infinite]" />

        {/* Small accent squares */}
        <div className="absolute top-[60%] left-[8%] h-4 w-4 rounded-sm bg-brand/10 rotate-45" />
        <div className="absolute top-[25%] left-[70%] h-3 w-3 rounded-full bg-violet-500/15" />
        <div className="absolute top-[70%] right-[15%] h-5 w-5 rounded-sm bg-emerald-500/10 rotate-12" />

        {/* Gradient line */}
        <div className="absolute top-[45%] left-0 right-0 h-px bg-linear-to-r from-transparent via-foreground/5 to-transparent" />
      </motion.div>

      {/* Layer 3 — Foreground accents (move fastest) */}
      <motion.div
        className="absolute inset-0"
        style={{ y: y3, scale }}
      >
        <div className="absolute top-[15%] left-[5%] h-1 w-20 bg-linear-to-r from-brand/20 to-transparent rounded-full" />
        <div className="absolute bottom-[30%] right-[8%] h-1 w-16 bg-linear-to-l from-violet-500/20 to-transparent rounded-full" />
      </motion.div>
    </div>
  );
}

/* ─── Scroll Indicator ─── */
function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/40"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.6 }}
    >
      <span className="text-[10px] uppercase tracking-[0.2em] font-medium">
        Scroll
      </span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-4 w-4" />
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Hero ─── */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from("[data-hero-heading] .hero-line > span", {
        y: "100%",
        duration: 1,
        stagger: 0.12,
      })
        .from(
          "[data-hero-desc]",
          { y: 30, opacity: 0, duration: 0.8 },
          "-=0.5"
        )
        .from(
          "[data-hero-cta]",
          { y: 20, opacity: 0, duration: 0.6 },
          "-=0.4"
        )
        .from(
          "[data-hero-social]",
          { y: 15, opacity: 0, duration: 0.5 },
          "-=0.3"
        )
        .from(
          "[data-hero-morph]",
          { y: 15, opacity: 0, duration: 0.5 },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-dvh flex items-center justify-center overflow-hidden"
    >
      {/* Parallax background layers */}
      <ParallaxLayers />

      {/* Top border line */}
      <div className="absolute top-0 left-0 right-0">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Content — moves up as you scroll */}
      <motion.div
        className="relative z-10 mx-auto max-w-5xl px-6 lg:px-8 w-full text-center"
        style={
          prefersReducedMotion
            ? {}
            : { y: contentY, opacity: contentOpacity }
        }
      >
        {/* Heading */}
        <h1
          data-hero-heading
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-foreground mb-6"
        >
          <span className="hero-line block overflow-hidden">
            <span className="inline-block">
              <TextRoll
                center
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight"
              >
                Master Your Internal
              </TextRoll>
            </span>
          </span>
          <span className="hero-line block overflow-hidden">
            <span className="inline-block">
              <TextRoll
                center
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-brand"
              >
                Architecture
              </TextRoll>
            </span>
          </span>
        </h1>

        {/* MorphText subtitle */}
        <div data-hero-morph className="mb-8">
          <MorphText
            words={[
              "Build unbreakable habits.",
              "Track meaningful goals.",
              "Engineer your best self.",
              "Master your daily systems.",
            ]}
            interval={3500}
            className="text-lg sm:text-xl text-muted-foreground font-medium h-8"
          />
        </div>

        {/* Description */}
        <p
          data-hero-desc
          className="text-sm sm:text-base text-muted-foreground/80 leading-relaxed mb-10 max-w-lg mx-auto"
        >
          AI-powered coaching, streak tracking, and behavioral science —
          combined in one system built for people who ship.
        </p>

        {/* CTA Buttons */}
        <div
          data-hero-cta
          className="flex flex-wrap items-center justify-center gap-3 mb-10"
        >
          <Link href={AuthRoutes.SIGN_UP}>
            <Button
              size="lg"
              className="bg-brand text-brand-foreground hover:bg-brand/90 rounded-xl h-12 px-8 text-sm font-medium gap-2 hero-cta-glow shadow-lg shadow-brand/20"
            >
              Start Building Habits
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="#features">
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl h-12 px-8 text-sm font-medium gap-2 border-border/60 hover:bg-card/60"
            >
              See Features
            </Button>
          </a>
        </div>

        {/* Social proof */}
        <div
          data-hero-social
          className="flex items-center justify-center gap-3"
        >
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
            Adopted by{" "}
            <span className="text-foreground font-medium">25k+</span>{" "}
            engineers &amp; professionals
          </p>
        </div>
      </motion.div>

      <ScrollIndicator />

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
