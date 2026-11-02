"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { getDictionary, type Locale } from "@/lib/i18n";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@/components/ui/Icons";
import styles from "./Gallery.module.css";

export function Gallery({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const items = dict.gallery.items;
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(
    () => setOpen((o) => (o === null ? null : (o + items.length - 1) % items.length)),
    [items.length]
  );
  const next = useCallback(
    () => setOpen((o) => (o === null ? null : (o + 1) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  const touchX = useRef(0);

  return (
    <section className={styles.section} id="gallery">
      <div className="container">
        <span className="sec-label">{dict.gallery.label}</span>
        <h2 className="sec-title">{dict.gallery.title}</h2>
        <p className="sec-sub">{dict.gallery.sub}</p>
        <div className={styles.grid}>
          {items.map((caption, i) => (
            <button
              key={caption}
              className={`${styles.tile} reveal`}
              style={{ transitionDelay: `${i * 0.06}s` }}
              onClick={() => setOpen(i)}
              aria-label={caption}
            >
              <Image
                src={`/photos/gallery-${i + 1}.webp`}
                alt={caption}
                fill
                sizes="(max-width: 899px) 50vw, 380px"
                className={styles.img}
              />
              <span className={styles.caption}>{caption}</span>
            </button>
          ))}
        </div>
      </div>

      {open !== null && (
        <div
          ref={dialogRef}
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={items[open]}
          tabIndex={-1}
          onClick={(e) => e.target === e.currentTarget && close()}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (dx > 50) prev();
            if (dx < -50) next();
          }}
        >
          <div className={styles.lightboxImg}>
            <Image
              src={`/photos/gallery-${open + 1}.webp`}
              alt={items[open]}
              fill
              sizes="920px"
              className={styles.lightImg}
            />
          </div>
          <p className={styles.lightboxCaption}>
            {items[open]} · {open + 1}/{items.length}
          </p>
          <div className={styles.lightboxControls}>
            <button onClick={prev} aria-label={dict.gallery.lightboxPrev}>
              <ArrowLeftIcon />
            </button>
            <button onClick={next} aria-label={dict.gallery.lightboxNext}>
              <ArrowRightIcon />
            </button>
            <button onClick={close} aria-label={dict.gallery.lightboxClose}>
              <CloseIcon />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
