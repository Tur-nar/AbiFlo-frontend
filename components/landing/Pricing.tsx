"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-pricing-reveal]", {
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
        y: 24,
        autoAlpha: 0,
        duration: 0.45,
        ease: "power2.out",
        stagger: 0.06,
        clearProps: "opacity,visibility,transform",
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="pricing" className="py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,oklch(0.15_0.02_18/0.15),transparent_60%)]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 data-pricing-reveal className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Scalable{" "}
            <span className="font-serif italic text-brand font-medium">
              Pricing
            </span>
          </h2>
          <p data-pricing-reveal className="mt-4 text-sm sm:text-base text-muted-foreground">
            Choose the plan that fits your engineering workflow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              data-pricing-reveal
              className={`relative flex flex-col justify-between rounded-lg border bg-card/60 p-8 shadow-sm transition-[border-color,transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-card/80 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${plan.popular
                ? "border-brand ring-1 ring-brand/40 md:-translate-y-1 shadow-lg shadow-brand/5"
                : "border-border"
                }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-brand-foreground">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold tracking-tight text-foreground">
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
                      <span className="text-xs text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                {plan.popular ? (
                  <Button className="w-full bg-brand text-brand-foreground hover:bg-brand/90 py-5 rounded-lg text-xs font-semibold">
                    {plan.buttonText}
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full border-border hover:bg-muted text-muted-foreground hover:text-foreground py-5 rounded-lg text-xs font-semibold">
                    {plan.buttonText}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
