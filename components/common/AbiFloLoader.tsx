"use client";

import { motion } from "framer-motion";

export function AbiFloLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          className="flex items-center gap-0.5"
        >
          <motion.span
            className="text-2xl font-bold tracking-tight text-foreground"
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            Abi
          </motion.span>
          <motion.span
            className="text-2xl font-bold tracking-tight text-foreground"
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            Fl
          </motion.span>
          <motion.span
            className="text-2xl font-bold tracking-tight text-brand"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.40,
              type: "spring",
              stiffness: 300,
              damping: 15,
            }}
          >
            o
          </motion.span>
        </motion.div>

        {/* Pulse bar */}
        <motion.div
          className="h-0.5 w-16 overflow-hidden rounded-full bg-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full rounded-full bg-brand"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: "easeInOut",
              repeatDelay: 0.2,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
