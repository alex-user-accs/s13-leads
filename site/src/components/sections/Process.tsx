import { getDictionary, type Locale } from "@/lib/i18n";
import styles from "./Process.module.css";

function CurvedArrow({ className }: { className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 96 56"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 48 C 28 8, 66 6, 88 30"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="7 6"
      />
      <path
        d="M81.8 19.8 L88 30 L76.2 28.2"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Process({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <section className={styles.section} id="process">
      <div className="container">
        <span className="sec-label">{dict.process.label}</span>
        <h2 className="sec-title">{dict.process.title}</h2>
        <p className="sec-sub">{dict.process.sub}</p>
        <div className={styles.steps}>
          {dict.process.steps.map((step, i) => (
            <div
              key={step.title}
              className={`${styles.step} reveal`}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className={styles.num}>{String(i + 1).padStart(2, "0")}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              {i < dict.process.steps.length - 1 && (
                <CurvedArrow
                  className={`${styles.arrow} ${styles[`arrow${i + 1}`]}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
