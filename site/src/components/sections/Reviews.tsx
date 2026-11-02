"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BUSINESS } from "@/lib/constants";
import { getDictionary, type Locale } from "@/lib/i18n";
import { GoogleIcon, StarIcon } from "@/components/ui/Icons";
import styles from "./Reviews.module.css";

const AVATAR_COLORS = ["#5DCAA5", "#AFA9EC", "#F0997B", "#85B7EB"];
const AUTO_MS = 4000;

export function Reviews({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const items = dict.reviews.items;
  const rowRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const lastManual = useRef(0);
  const programmatic = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState(0);

  const scrollToCard = (i: number) => {
    const row = rowRef.current;
    if (!row) return;
    const card = row.children[i] as HTMLElement | undefined;
    if (!card) return;
    if (programmatic.current) clearTimeout(programmatic.current);
    programmatic.current = setTimeout(() => (programmatic.current = null), 900);
    row.scrollTo({ left: card.offsetLeft - row.offsetLeft, behavior: "smooth" });
  };

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const row = rowRef.current;
    if (!row) return;

    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      threshold: 0.3,
    });
    io.observe(row);

    const timer = setInterval(() => {
      if (!visible || paused.current || document.hidden) return;
      if (Date.now() - lastManual.current < 8000) return;
      const maxScroll = row.scrollWidth - row.clientWidth;
      const atEnd = row.scrollLeft >= maxScroll - 10;
      const current = Math.round(
        (row.scrollLeft / maxScroll) * (items.length - 1)
      );
      scrollToCard(atEnd ? 0 : Math.min(current + 1, items.length - 1));
    }, AUTO_MS);

    return () => {
      clearInterval(timer);
      io.disconnect();
    };
  }, [items.length]);

  const onScroll = () => {
    const row = rowRef.current;
    if (!row) return;
    if (!programmatic.current) lastManual.current = Date.now();
    const maxScroll = row.scrollWidth - row.clientWidth;
    if (maxScroll <= 0) return;
    setActive(Math.round((row.scrollLeft / maxScroll) * (items.length - 1)));
  };

  return (
    <section className={styles.section} id="reviews">
      <div className="container">
        <span className="sec-label">{dict.reviews.label}</span>
        <h2 className="sec-title">{dict.reviews.title}</h2>
        <p className="sec-sub">{dict.reviews.sub}</p>
        <div
          ref={rowRef}
          className={styles.row}
          onScroll={onScroll}
          onPointerEnter={() => (paused.current = true)}
          onPointerLeave={() => (paused.current = false)}
          onTouchStart={() => (paused.current = true)}
          onTouchEnd={() => setTimeout(() => (paused.current = false), 3000)}
        >
          {items.map((review, i) => {
            const inner = (
              <>
                <div className={styles.head}>
                  {review.avatar ? (
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      width={42}
                      height={42}
                      className={styles.avatarImg}
                    />
                  ) : (
                    <span
                      className={styles.avatar}
                      style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                      aria-hidden="true"
                    >
                      {review.name.charAt(0)}
                    </span>
                  )}
                  <div>
                    <footer>{review.name}</footer>
                    <div className={styles.stars} aria-label="5/5">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <StarIcon key={s} />
                      ))}
                    </div>
                  </div>
                </div>
                <p>{review.text}</p>
              </>
            );
            const cls = `${styles.card} reveal`;
            const delay = { transitionDelay: `${i * 0.08}s` };
            return review.url ? (
              <a
                key={review.name}
                href={review.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${cls} ${styles.cardClickable}`}
                style={delay}
              >
                {inner}
              </a>
            ) : (
              <blockquote key={review.name} className={cls} style={delay}>
                {inner}
              </blockquote>
            );
          })}
        </div>
        <div className={styles.dots} role="tablist" aria-label={dict.reviews.title}>
          {items.map((review, i) => (
            <button
              key={review.name}
              className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
              onClick={() => scrollToCard(i)}
              aria-label={`${i + 1}/${items.length}`}
              aria-selected={i === active}
              role="tab"
            />
          ))}
        </div>
        <div className={styles.moreWrap}>
          <a
            href={BUSINESS.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn-ghost ${styles.moreLink}`}
          >
            <GoogleIcon />
            {dict.reviews.googleLink}
          </a>
        </div>
      </div>
    </section>
  );
}
