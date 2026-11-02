"use client";

import { useEffect, useRef, useState } from "react";
import { STATS } from "@/lib/constants";
import { getDictionary, type Locale } from "@/lib/i18n";
import { prefersReducedMotion, useParallax } from "@/lib/motion";
import styles from "./WhyS13.module.css";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1200;
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return (
    <strong ref={ref}>
      {value}
      {suffix}
    </strong>
  );
}

export function WhyS13({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);

  useParallax(sectionRef, (offset, isMobile) => {
    const amp = isMobile ? -150 : -330;
    if (bgRef.current && wordRef.current) {
      bgRef.current.style.transform = `translateY(${offset * 80}px)`;
      wordRef.current.style.transform = `translateY(calc(-50% + ${offset * amp}px))`;
    }
  });

  return (
    <section ref={sectionRef} className={styles.section} id="why">
      <div ref={bgRef} className={styles.bg} aria-hidden="true" />
      <div ref={wordRef} className={styles.word} aria-hidden="true">
        S13
      </div>
      <div className={`container ${styles.inner}`}>
        <span className="sec-label">{dict.why.label}</span>
        <h2 className={`sec-title ${styles.title}`}>{dict.why.title}</h2>
        <p className="sec-sub" style={{ marginBottom: 0 }}>
          {dict.why.sub}
        </p>
        <div className={styles.stats}>
          <div>
            <Counter target={STATS.cars} suffix="+" />
            <span>{dict.why.statCars}</span>
          </div>
          <div>
            <Counter target={STATS.years} />
            <span>{dict.why.statYears}</span>
          </div>
          <div>
            <Counter target={STATS.services} />
            <span>{dict.why.statServices}</span>
          </div>
        </div>
        <a href="#contact" className={`btn btn-primary ${styles.cta}`}>
          {dict.why.cta}
        </a>
      </div>
    </section>
  );
}
