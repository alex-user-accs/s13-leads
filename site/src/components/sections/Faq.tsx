import { getDictionary, type Locale } from "@/lib/i18n";
import { ChevronIcon } from "@/components/ui/Icons";
import styles from "./Faq.module.css";

export function Faq({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <section className={styles.section} id="faq">
      <div className="container">
        <span className="sec-label">{dict.faq.label}</span>
        <h2 className="sec-title">{dict.faq.title}</h2>
        <div className={styles.list}>
          {dict.faq.items.map((item) => (
            <details key={item.q} className={`${styles.item} reveal`}>
              <summary>
                {item.q}
                <ChevronIcon className={styles.chevron} />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
