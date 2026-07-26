"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthRoutes } from "@/constants/routes";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useScrollReveal<HTMLElement>();

  return (
    <footer ref={footerRef} className="relative bg-background">
      {/* CTA Banner */}
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 py-20">
          <div
            className="scroll-reveal relative rounded-3xl border border-border/50 bg-card/40 backdrop-blur-sm p-10 sm:p-14 text-center overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.69_0.17_18/0.08),transparent_70%)]" />

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-4">
                Ready to transform your{" "}
                <span className="text-brand">habits</span>?
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-md mx-auto">
                Join thousands of engineers who&apos;ve built systems that
                stick. Start free, no credit card required.
              </p>
              <Link href={AuthRoutes.SIGN_UP}>
                <Button
                  size="lg"
                  className="bg-brand text-brand-foreground hover:bg-brand/90 rounded-xl h-12 px-8 text-sm font-medium gap-2 hero-cta-glow shadow-lg shadow-brand/20"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer links */}
      <div
        data-footer-content
        className="border-t border-border/40 py-10"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-brand">
                <span className="text-[10px] font-bold text-brand-foreground">
                  A
                </span>
              </div>
              <span className="text-sm font-semibold tracking-tight text-foreground">
                AbiFlo
              </span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
              {["Privacy Policy", "Terms of Service", "API Docs", "System Status"].map(
                (link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link}
                  </a>
                )
              )}
            </div>

            {/* Copyright */}
            <p className="text-[10px] text-muted-foreground md:text-right">
              &copy; {currentYear} Abiflo Technical Habit Systems. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
