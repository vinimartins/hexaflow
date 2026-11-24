import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <div
      data-testid="scroll-progress-bar"
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-50 h-[2px] bg-slate-800/40"
    >
      <motion.div
        data-testid="scroll-progress-fill"
        className="h-full w-full origin-left bg-sky-400"
        style={{ scaleX: prefersReducedMotion ? scrollYProgress : smoothProgress }}
      />
    </div>
  );
}
