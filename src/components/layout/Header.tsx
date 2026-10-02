import Image from "next/image";
import Link from "next/link";
import { BUSINESS } from "@/lib/constants";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";
import styles from "./Header.module.css";

export function Header({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const other: Locale = locale === "uk" ? "en" : "uk";
  return (
    <header className={styles.header}>
      <div className={`container ${styles.nav}`}>
        <a href="#top" className={styles.logo}>
          <Image src="/logo.png" alt={BUSINESS.name} width={137} height={40} priority />
        </a>
        <nav aria-label="Main">
          <ul className={styles.links}>
            <li><a href="#services">{dict.nav.services}</a></li>
            <li><a href="#results">{dict.nav.results}</a></li>
            <li><a href="#process">{dict.nav.process}</a></li>
            <li><a href="#gallery">{dict.nav.gallery}</a></li>
            <li><a href="#contact">{dict.nav.contact}</a></li>
          </ul>
        </nav>
        <div className={styles.right}>
          <Link
            href={localePath(other)}
            className={styles.lang}
            aria-label={dict.langSwitch}
          >
            {other === "uk" ? "UA" : "EN"}
          </Link>
          <a href={`tel:${BUSINESS.phone}`} className={styles.phone}>
            {BUSINESS.phoneDisplay}
          </a>
        </div>
      </div>
    </header>
  );
}
