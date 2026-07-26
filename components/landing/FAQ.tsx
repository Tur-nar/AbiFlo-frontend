"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
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

function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border/40 last:border-b-0">
      <button
        onClick={onToggle}
        className="group flex w-full items-center justify-between py-5 text-left transition-colors"
      >
        <span className="text-sm sm:text-base font-medium text-foreground group-hover:text-brand transition-colors pr-4">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="shrink-0"
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-muted-foreground leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      ref={sectionRef}
      className="py-28 relative overflow-hidden bg-background"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.15_0.02_18/0.08),transparent_50%)]" />

      <div className="mx-auto max-w-3xl px-6 relative z-10">
        {/* Header */}
        <div className="scroll-reveal text-center mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 font-medium mb-3">
            FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            System Intelligence:{" "}
            <span className="font-serif italic text-brand font-medium">
              FAQ
            </span>
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-muted-foreground">
            Deep dives into the mechanics of the AbiFlo engine.
          </p>
        </div>

        {/* Accordion */}
        <div
          data-faq-container
          className="scroll-reveal rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm px-6 sm:px-8"
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
