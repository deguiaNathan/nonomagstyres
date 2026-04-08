import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';

const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;
const REVEAL_VIEWPORT = {
  once: true,
  amount: 0.24,
  margin: '0px 0px -12% 0px',
} as const;

const getRevealTransition = (reducedMotion: boolean, delay: number) => ({
  duration: reducedMotion ? 0.24 : 0.7,
  delay,
  ease: REVEAL_EASE,
});

export function Reveal({
  children,
  className,
  delay = 0,
  distance = 32,
  scale = 0.985,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  scale?: number;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reducedMotion ? 0 : distance, scale: reducedMotion ? 1 : scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={REVEAL_VIEWPORT}
      transition={getRevealTransition(reducedMotion, delay)}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({
  children,
  className,
  stagger = 0.12,
  delayChildren = 0,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reducedMotion ? Math.min(stagger, 0.05) : stagger,
            delayChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  delay = 0,
  distance = 24,
  scale = 0.99,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  scale?: number;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: reducedMotion ? 0 : distance, scale: reducedMotion ? 1 : scale },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: getRevealTransition(reducedMotion, delay),
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function ParallaxMedia({
  children,
  className,
  innerClassName,
  offset = 52,
  startScale = 1.08,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  offset?: number;
  startScale?: number;
}) {
  const reducedMotion = useReducedMotion();
  const targetRef = useRef<HTMLDivElement>(null);
  const resolvedInnerClassName = innerClassName ? `h-full w-full ${innerClassName}` : 'h-full w-full';
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });
  const yRange = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [offset, -offset]);
  const scaleRange = useTransform(scrollYProgress, [0, 1], reducedMotion ? [1, 1] : [startScale, 1]);
  const y = useSpring(yRange, { stiffness: 140, damping: 28, mass: 0.35 });
  const scale = useSpring(scaleRange, { stiffness: 140, damping: 28, mass: 0.35 });

  return (
    <div ref={targetRef} className={className}>
      <motion.div className={resolvedInnerClassName} style={reducedMotion ? undefined : { y, scale }}>
        {children}
      </motion.div>
    </div>
  );
}
