"use client";
import { motion, type HTMLMotionProps } from "framer-motion";

interface RevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "scale" | "fade";
}

export default function Reveal({
  children,
  delay = 0,
  className,
  direction = "up",
  ...props
}: RevealProps) {
  const initial =
    direction === "up"
      ? { opacity: 0, y: 24 }
      : direction === "down"
      ? { opacity: 0, y: -24 }
      : direction === "left"
      ? { opacity: 0, x: 24 }
      : direction === "right"
      ? { opacity: 0, x: -24 }
      : direction === "scale"
      ? { opacity: 0, scale: 0.92 }
      : { opacity: 0 };

  const animate =
    direction === "scale"
      ? { opacity: 1, scale: 1 }
      : { opacity: 1, y: 0, x: 0 };

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
