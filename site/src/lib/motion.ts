import { useEffect, useRef, type RefObject } from "react";

export function prefersReducedMotion(): boolean {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Calls `apply` on scroll (rAF-throttled) with the section's offset from the
 * viewport centre, in viewport heights (0 = centred). Skipped when the section
 * is far off-screen and for reduced-motion users.
 */
export function useParallax(
  sectionRef: RefObject<HTMLElement | null>,
  apply: (offset: number, isMobile: boolean) => void
) {
  const applyRef = useRef(apply);
  applyRef.current = apply;

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (section) {
          const r = section.getBoundingClientRect();
          const offset = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
          if (Math.abs(offset) < 1.2) applyRef.current(offset, innerWidth < 900);
        }
        ticking = false;
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, [sectionRef]);
}
