import Image from "next/image";
import { BUSINESS } from "@/lib/constants";
import { getDictionary, type Locale } from "@/lib/i18n";
import { InstagramColorIcon } from "@/components/ui/Icons";
import styles from "./Footer.module.css";

export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <Image src="/logo.png" alt={BUSINESS.name} width={110} height={32} />
        <p>
          © {year} {BUSINESS.name} · {dict.footer.madeIn} · {dict.footer.rights}
        </p>
        <div className={styles.links}>
          <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phoneDisplay}</a>
          <a
            href={BUSINESS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.instaBtn}
            aria-label="Instagram"
          >
            <InstagramColorIcon size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
