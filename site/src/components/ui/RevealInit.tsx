"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/** Activates .reveal elements once they enter the viewport. */
export function RevealInit() {
  useEffect(() => {
    if (prefersReducedMotion()) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("on"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("on");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
