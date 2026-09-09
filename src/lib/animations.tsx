"use client";

import {
  motion,
  useReducedMotion,
  Variants,
  HTMLMotionProps,
} from "framer-motion";
import { ReactNode } from "react";

// ─────────────────────────────────────────────
// VARIANTS
// ─────────────────────────────────────────────

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const fadeLeftVariants: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeRightVariants: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─────────────────────────────────────────────
// REDUCED MOTION SAFE VARIANTS
// ─────────────────────────────────────────────

function useSafeVariants(variants: Variants): Variants {
  const reduced = useReducedMotion();
  if (!reduced) return variants;
  // Strip all transforms, just fade
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
  };
}

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────

interface RevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  className?: string;
  variants?: Variants;
}

/** Generic scroll reveal — wraps children with viewport-triggered animation */
export function ScrollReveal({
  children,
  delay = 0,
  className,
  variants = fadeUpVariants,
  ...props
}: RevealProps) {
  const safe = useSafeVariants(variants);
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        ...safe,
        visible: {
          ...(safe.visible as object),
          transition: {
            ...((safe.visible as { transition?: object }).transition ?? {}),
            delay,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Fade up on scroll */
export function FadeUp({
  children,
  delay = 0,
  className,
  ...props
}: RevealProps) {
  return (
    <ScrollReveal
      variants={fadeUpVariants}
      delay={delay}
      className={className}
      {...props}
    >
      {children}
    </ScrollReveal>
  );
}

/** Fade in on scroll (no translate) */
export function FadeIn({
  children,
  delay = 0,
  className,
  ...props
}: RevealProps) {
  return (
    <ScrollReveal
      variants={fadeInVariants}
      delay={delay}
      className={className}
      {...props}
    >
      {children}
    </ScrollReveal>
  );
}

/** Slide in from left */
export function FadeLeft({
  children,
  delay = 0,
  className,
  ...props
}: RevealProps) {
  return (
    <ScrollReveal
      variants={fadeLeftVariants}
      delay={delay}
      className={className}
      {...props}
    >
      {children}
    </ScrollReveal>
  );
}

/** Slide in from right */
export function FadeRight({
  children,
  delay = 0,
  className,
  ...props
}: RevealProps) {
  return (
    <ScrollReveal
      variants={fadeRightVariants}
      delay={delay}
      className={className}
      {...props}
    >
      {children}
    </ScrollReveal>
  );
}

/** Scale + fade in on scroll */
export function ScaleIn({
  children,
  delay = 0,
  className,
  ...props
}: RevealProps) {
  return (
    <ScrollReveal
      variants={scaleInVariants}
      delay={delay}
      className={className}
      {...props}
    >
      {children}
    </ScrollReveal>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/** Container that staggers its children */
export function StaggerContainer({ children, className, delay = 0 }: StaggerProps) {
  const reduced = useReducedMotion();
  const variants: Variants = reduced
    ? { hidden: {}, visible: {} }
    : {
        ...staggerContainerVariants,
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay,
          },
        },
      };
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Item inside StaggerContainer */
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const variants: Variants = reduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : staggerItemVariants;
  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
}

/** Hero entrance — immediate, no scroll trigger */
export function HeroReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
