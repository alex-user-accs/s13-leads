import Image from "next/image";
import { BUSINESS, STATS } from "@/lib/constants";
import { getDictionary, type Locale } from "@/lib/i18n";
import { PhoneIcon, PinIcon } from "@/components/ui/Icons";
import styles from "./Hero.module.css";

export function Hero({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <section className={styles.hero} id="top">
      <div className={`container ${styles.grid}`}>
        <div className={styles.content}>
          <a href="#map" className={styles.badge}>
            <PinIcon size={15} className={styles.badgePin} />
            {dict.hero.badge}
          </a>
          <h1 className={styles.h1}>
            {dict.hero.h1a} <span>{dict.hero.h1b}</span>
          </h1>
          <p className={styles.sub}>{dict.hero.sub}</p>
          <div className={styles.cta}>
            <a href={`tel:${BUSINESS.phone}`} className="btn btn-primary">
              <PhoneIcon /> {dict.hero.ctaCall}
            </a>
            <a href="#contact" className="btn btn-ghost">
              {dict.hero.ctaForm}
            </a>
          </div>
          <div className={styles.trust}>
            <div>
              <strong>{STATS.cars}+</strong>
              <span>{dict.hero.statCars}</span>
            </div>
            <div>
              <strong>5.0</strong>
              <span>{dict.hero.statRating}</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>{dict.hero.statQuality}</span>
            </div>
          </div>
        </div>
        <div className={`${styles.photo} reveal`}>
          <Image
            src="/photos/hero.jpg"
            alt={dict.hero.photoAlt}
            fill
            priority
            sizes="(max-width: 899px) 100vw, 45vw"
            className={styles.photoImg}
          />
        </div>
      </div>
    </section>
  );
}
