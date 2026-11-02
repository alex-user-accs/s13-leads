import { CARD_GROUP_IDS, SERVICE_GROUPS, type ServiceItem } from "@/lib/constants";
import { getDictionary, type Dictionary, type Locale } from "@/lib/i18n";
import { CheckIcon, ChevronIcon, SprayIcon, SparkleIcon, ShieldIcon, CarIcon } from "@/components/ui/Icons";
import styles from "./Services.module.css";

const groupIcons = {
  cleaning: SprayIcon,
  polishing: SparkleIcon,
  protection: ShieldIcon,
  extra: CarIcon,
} as const;

const fmt = (n: number) => n.toLocaleString("uk-UA");

function formatPrice(item: ServiceItem, t: Dictionary["services"]): string {
  if (item.negotiable) return t.negotiable;
  if (!item.price) return "—";
  if (item.priceMax) {
    return `${t.from} ${fmt(item.price)} ${t.to} ${fmt(item.priceMax)} ${t.uah}`;
  }
  return `${item.from ? `${t.from} ` : ""}${fmt(item.price)} ${t.uah}`;
}

export function Services({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const items = dict.services.items as Record<string, string>;

  return (
    <section className={styles.section} id="services">
      <div className="container">
        <span className="sec-label">{dict.services.label}</span>
        <h2 className="sec-title">{dict.services.title}</h2>
        <p className="sec-sub">{dict.services.sub}</p>

        <div className={styles.cards}>
          {SERVICE_GROUPS.filter((group) => CARD_GROUP_IDS.includes(group.id)).map((group, i) => {
            const g = dict.services.groups[group.id];
            const Icon = groupIcons[group.id];
            return (
              <article
                key={group.id}
                className={`${styles.card} reveal`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className={styles.cardHead}>
                  <div className={styles.ico}>
                    <Icon size={26} />
                  </div>
                  <h3>{g.title}</h3>
                </div>
                <ul>
                  {g.features.map((f) => (
                    <li key={f}>
                      <CheckIcon className={styles.check} /> {f}
                    </li>
                  ))}
                </ul>
                <div className={styles.price}>
                  {dict.services.from}{" "}
                  <b>
                    {fmt(group.priceFrom)} {dict.services.uah}
                  </b>
                </div>
                <a href="#contact" className="btn btn-primary">
                  {dict.services.cta}
                </a>
              </article>
            );
          })}
        </div>

        <details className={`${styles.fullPrice} reveal`}>
          <summary>
            {dict.services.fullPrice}
            <ChevronIcon className={styles.chevron} />
          </summary>
          <div className={styles.priceTable}>
            {SERVICE_GROUPS.map((group) => (
              <div key={group.id} className={styles.priceGroup}>
                <h4>{dict.services.groups[group.id].title}</h4>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <span>{items[item.id]}</span>
                      <span className={styles.dots} aria-hidden="true" />
                      <span className={styles.priceValue}>
                        {formatPrice(item, dict.services)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}
