"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const faqs = [
  {
    question: "How does the AI coaching engine adapt to my habits?",
    answer:
      "Our engine analyzes your habit frequency, success rate, and time-of-day performance to suggest optimal windows for habit execution and identifies potential burnout patterns before they occur.",
  },
  {
    question: "Is my data secure and private?",
    answer:
      "Absolutely. All tracking data, journal entries, and insights are encrypted. We prioritize user privacy and never sell or share user data.",
  },
  {
    question: "Can I sync with other productivity tools?",
    answer:
      "Yes, you can export your data in various formats and we plan to support integrations with popular calendar and productivity suites in upcoming releases.",
  },
  {
    question: "What defines a 'Technical Habit System'?",
    answer:
      "It means applying software engineering principles—like incremental updates, monitoring, refactoring patterns, and modular design—to behavioral change.",
  },
  {
    question: "How do group challenges work?",
    answer:
      "You can create or join group habit challenges with custom start/end dates. Members log completions to build collective streaks, earn group rewards, and rank on local leaderboards.",
  },
  {
    question: "What happens if I miss a day?",
    answer:
      "Habits can be paused (up to 3 days maximum) without breaking your streak. Otherwise, streaks reset, but your overall consistency history is preserved for analytics.",
  },
];

export function FAQ() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.15_0.02_18/0.1),transparent_50%)]" />

      <div className="mx-auto max-w-4xl px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="scroll-reveal text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            System Intelligence:{" "}
            <span className="font-serif italic text-brand font-medium">FAQ</span>
          </h2>
          <p className="scroll-reveal mt-4 text-xs sm:text-sm text-muted-foreground">
            Deep dives into the mechanics of the AbiFlo engine.
          </p>
        </div>

        {/* Accordion List */}
        <div
          className="scroll-reveal rounded-2xl border border-border bg-card/30 backdrop-blur-xs p-6 sm:p-8"
        >
          <Accordion className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="border-b border-border/60 py-2.5 last:border-b-0"
              >
                <AccordionTrigger className="text-xs sm:text-sm font-medium hover:no-underline text-foreground transition-colors hover:text-brand">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
