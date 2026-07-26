"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface MorphTextProps {
  words: string[];
  interval?: number;
  className?: string;
}

export function MorphText({
  words,
  interval = 3000,
  className,
}: MorphTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const morphRef = useRef<HTMLSpanElement>(null);

  const morph = useCallback(
    (start: string, end: string) => {
      if (!textRef.current || !morphRef.current) return;

      let fraction = 0;
      const duration = 800; // ms
      const startTime = performance.now();

      setIsAnimating(true);

      const animate = (time: number) => {
        fraction = Math.min(1, (time - startTime) / duration);

        // Ease-in-out cubic
        const ease =
          fraction < 0.5
            ? 4 * fraction * fraction * fraction
            : 1 - Math.pow(-2 * fraction + 2, 3) / 2;

        if (textRef.current && morphRef.current) {
          // Outgoing text: blur out + fade
          textRef.current.style.filter = `blur(${Math.min(8, ease * 8)}px)`;
          textRef.current.style.opacity = `${Math.max(0, 1 - ease * 1.5)}`;

          // Incoming text: blur in + fade
          morphRef.current.style.filter = `blur(${Math.max(0, 8 - ease * 8)}px)`;
          morphRef.current.style.opacity = `${Math.min(1, ease * 1.5 - 0.5)}`;
        }

        if (fraction < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };

      // Set the incoming word
      morphRef.current.textContent = end;
      textRef.current.textContent = start;

      requestAnimationFrame(animate);
    },
    []
  );

  useEffect(() => {
    if (words.length <= 1) return;

    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % words.length;
      morph(words[currentIndex], words[nextIndex]);

      // After animation completes, update index and reset styles
      setTimeout(() => {
        setCurrentIndex(nextIndex);
        if (textRef.current && morphRef.current) {
          textRef.current.style.filter = "";
          textRef.current.style.opacity = "1";
          morphRef.current.style.filter = "";
          morphRef.current.style.opacity = "0";
        }
      }, 850);
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, interval, morph, words]);

  return (
    <span
      className={cn("relative inline-flex items-center justify-center", className)}
      aria-live="polite"
    >
      {/* Current / outgoing word */}
      <span
        ref={textRef}
        className="inline-block transition-none"
        style={{ willChange: "filter, opacity" }}
      >
        {words[currentIndex]}
      </span>

      {/* Incoming word — overlaid */}
      <span
        ref={morphRef}
        className="absolute inset-0 inline-flex items-center justify-center transition-none"
        style={{ opacity: 0, willChange: "filter, opacity" }}
        aria-hidden
      />
    </span>
  );
}
