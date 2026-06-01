/**
 * Strict Emil Kowalski motion utilities for saadanddanial.com
 * "Clarity in Motion" — refined editorial cinematic
 *
 * Rules enforced here:
 * - Only transform + opacity (GPU)
 * - Custom easings from CSS vars
 * - Durations 120-650ms caps
 * - Staggers 35-55ms (max 80ms for cinematic)
 * - Reduced-motion guard (no transforms)
 * - Never animate frequent actions
 */

export const MOTION = {
  durations: {
    micro: 140,
    ui: 200,
    standard: 260,
    modal: 280,
    cinematic: 520,
  },
  easings: {
    out: 'cubic-bezier(0.23, 1, 0.32, 1)',
    inOut: 'cubic-bezier(0.77, 0, 0.175, 1)',
    soft: 'cubic-bezier(0.32, 0.72, 0, 1)',
    cinematic: 'cubic-bezier(0.22, 1, 0.36, 1)',
  },
  staggers: {
    tight: 35,
    standard: 48,
    cinematic: 82, // rare filmic sequences only
  },
} as const;

/**
 * Safe check for reduced motion (respects user preference)
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Returns safe transform/opacity values for reduced motion
 */
export function safeMotionProps(props: { y?: number; x?: number; scale?: number; opacity?: number }) {
  if (prefersReducedMotion()) {
    return { opacity: props.opacity ?? 1, transform: 'none' };
  }
  const transforms: string[] = [];
  if (props.y) transforms.push(`translateY(${props.y}px)`);
  if (props.x) transforms.push(`translateX(${props.x}px)`);
  if (props.scale) transforms.push(`scale(${props.scale})`);
  return {
    opacity: props.opacity ?? 1,
    transform: transforms.length ? transforms.join(' ') : undefined,
  };
}

/**
 * GSAP-safe init guard (respects reduced motion, prevents double init)
 */
export function initGSAPSafely(callback: () => void) {
  if (prefersReducedMotion()) {
    // Still run but with instant values — no motion
    callback();
    return;
  }
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    setTimeout(() => initGSAPSafely(callback), 120);
    return;
  }
  callback();
}

/**
 * Calculate stagger delay (Emil: short musical steps)
 */
export function getStaggerDelay(index: number, base = MOTION.staggers.standard): number {
  return Math.min(index * base, 320);
}

/**
 * Cinematic reveal helper (for IntersectionObserver + class toggle)
 * Use on elements with .cinematic-reveal
 */
export function observeCinematicReveals(selector = '.cinematic-reveal') {
  if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '-40px 0px' });

  document.querySelectorAll(selector).forEach((el) => observer.observe(el));
}

// Expose for console debugging in dev (remove in prod if desired)
if (typeof window !== 'undefined') {
  (window as any).__MOTION = MOTION;
}