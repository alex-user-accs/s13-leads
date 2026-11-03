"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { getDictionary, type Locale } from "@/lib/i18n";
import { useParallax } from "@/lib/motion";
import styles from "./BeforeAfter.module.css";

export function BeforeAfter({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const wrapRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [pos, setPos] = useState(50);

  useParallax(sectionRef, (offset, isMobile) => {
    const amp = isMobile ? -110 : -220;
    if (wordRef.current) {
      wordRef.current.style.transform = `translateY(calc(-50% + ${offset * amp}px))`;
    }
  });

  const moveTo = useCallback((clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = Math.min(Math.max((clientX - rect.left) / rect.width, 0.05), 0.95);
    setPos(Math.round(p * 1000) / 10);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    wrapRef.current?.setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(p - 4, 5));
    if (e.key === "ArrowRight") setPos((p) => Math.min(p + 4, 95));
  };

  return (
    <section ref={sectionRef} className={styles.section} id="results">
      <div ref={wordRef} className={styles.word} aria-hidden="true">
        S13
      </div>
      <div className={`container ${styles.inner}`}>
        <span className="sec-label">{dict.beforeAfter.label}</span>
        <h2 className="sec-title">{dict.beforeAfter.title}</h2>
        <p className="sec-sub">{dict.beforeAfter.sub}</p>

        <div
          ref={wrapRef}
          className={`${styles.wrap} reveal`}
          role="slider"
          aria-label={dict.beforeAfter.sliderAria}
          aria-valuenow={Math.round(pos)}
          aria-valuemin={5}
          aria-valuemax={95}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={(e) => dragging.current && moveTo(e.clientX)}
          onPointerUp={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
          onKeyDown={onKeyDown}
        >
          <div className={`${styles.side} ${styles.before}`}>
            <Image
              src="/photos/before.jpg"
              alt={dict.beforeAfter.beforeAlt}
              fill
              sizes="(max-width: 899px) 100vw, 1180px"
              className={styles.img}
            />
          </div>
          <div
            className={`${styles.side} ${styles.after}`}
            style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
          >
            <Image
              src="/photos/after.jpg"
              alt={dict.beforeAfter.afterAlt}
              fill
              sizes="(max-width: 899px) 100vw, 1180px"
              className={styles.img}
            />
          </div>
          <span className={`${styles.tag} ${styles.tagL}`}>{dict.beforeAfter.before}</span>
          <span className={`${styles.tag} ${styles.tagR}`}>{dict.beforeAfter.after}</span>
          <div className={styles.handle} style={{ left: `${pos}%` }} aria-hidden="true">
            <span className={styles.knob}>⟷</span>
          </div>
        </div>
      </div>
    </section>
  );
}
