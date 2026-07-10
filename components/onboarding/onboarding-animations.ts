export const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
    scale: 0.96,
  }),
};

export const staggerContainer = {
  center: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  enter: { opacity: 0, y: 12, scale: 0.95 },
  center: { opacity: 1, y: 0, scale: 1 },
};

export const pageTransition = {
  duration: 0.4,
  ease: [0.32, 0.72, 0, 1] as const,
};
