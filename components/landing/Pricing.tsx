"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: "Free",
    price: 0,
    features: [
      "Up to 3 habits",
      "Basic AI insights",
      "7-day history",
      "Community access",
    ],
    buttonText: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: 12,
    features: [
      "Unlimited habits",
      "Advanced AI coaching",
      "Full history & analytics",
      "Priority support",
      "Custom API hooks",
    ],
    buttonText: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Team",
    price: 49,
    features: [
      "Up to 10 members",
      "Team leaderboards",
      "Shared challenges",
      "Admin dashboard",
    ],
    buttonText: "Contact Sales",
    popular: false,
  },
];

function PricingCard({ plan }: { plan: (typeof plans)[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse-tracked gradient spotlight
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const spotlight = card.querySelector<HTMLDivElement>("[data-spotlight]");
    if (!spotlight) return;

    const handleMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spotlight.style.background = `radial-gradient(300px circle at ${x}px ${y}px, oklch(0.69 0.17 18 / 0.08), transparent 60%)`;
      spotlight.style.opacity = "1";
    };

    const handleLeave = () => {
      spotlight.style.opacity = "0";
    };

    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", handleLeave);
    return () => {
      card.removeEventListener("mousemove", handleMove);
      card.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      data-pricing-card
      className={`scroll-reveal relative flex flex-col justify-between rounded-2xl border bg-card/40 backdrop-blur-sm p-8 transition-all duration-300 hover:-translate-y-1 ${plan.popular
          ? "border-brand/50 shadow-xl shadow-brand/10 md:-translate-y-2"
          : "border-border/50 hover:border-border"
        }`}
    >
      {/* Mouse spotlight */}
      <div
        data-spotlight
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300"
      />

      {/* Animated glow border for Pro plan */}
      {plan.popular && (
        <div className="absolute -inset-px rounded-2xl bg-[conic-gradient(from_var(--conic-angle),oklch(0.69_0.17_18),oklch(0.5_0.15_280),oklch(0.65_0.2_155),oklch(0.69_0.17_18))] animate-conic-spin -z-10 opacity-40 blur-[1px]" />
      )}

      {plan.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-4 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-foreground shadow-lg shadow-brand/20">
          Most Popular
        </span>
      )}

      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight text-foreground">
            ${plan.price}
          </span>
          <span className="text-xs text-muted-foreground">/mo</span>
        </div>

        <ul className="mt-8 space-y-3.5">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand/10 border border-brand/20">
                <Check className="h-2.5 w-2.5 text-brand" />
              </div>
              <span className="text-xs text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 relative z-10">
        {plan.popular ? (
          <Button className="w-full bg-brand text-brand-foreground hover:bg-brand/90 py-5 rounded-xl text-xs font-semibold shadow-lg shadow-brand/20">
            {plan.buttonText}
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full border-border/60 hover:bg-card/80 text-muted-foreground hover:text-foreground py-5 rounded-xl text-xs font-semibold"
          >
            {plan.buttonText}
          </Button>
        )}
      </div>
    </div>
  );
}

export function Pricing() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="py-28 relative overflow-hidden bg-background"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,oklch(0.15_0.02_18/0.12),transparent_60%)]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="scroll-reveal mx-auto max-w-3xl text-center mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 font-medium mb-3">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Scalable{" "}
            <span className="font-serif italic text-brand font-medium">
              Pricing
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">
            Choose the plan that fits your engineering workflow.
          </p>
        </div>

        <div
          className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 items-stretch"
          style={{ perspective: "1200px" }}
        >
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
