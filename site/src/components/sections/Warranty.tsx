import Image from "next/image";
import { getDictionary, type Locale } from "@/lib/i18n";
import { CheckIcon, ShieldIcon } from "@/components/ui/Icons";
import styles from "./Warranty.module.css";

/** Brands confirmed by the owner. Logos: public/brands/<slug>.png */
const MATERIAL_BRANDS = [
  { name: "Koch Chemie", slug: "koch-chemie" },
  { name: "CarPro", slug: "carpro" },
  { name: "Soft99", slug: "soft99" },
  { name: "Glaco", slug: "glaco" },
  { name: "Meguiar's", slug: "meguiars" },
  { name: "Shiny Garage", slug: "shiny-garage" },
  { name: "ZviZZer", slug: "zvizzer" },
  { name: "Binder", slug: "binder" },
];

export function Warranty({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <section className={styles.section} id="warranty">
      <div className={`container ${styles.grid}`}>
        <div className="reveal">
          <span className="sec-label">{dict.warranty.label}</span>
          <h2 className="sec-title">{dict.warranty.title}</h2>
          <p className={styles.text}>{dict.warranty.text}</p>
          <ul className={styles.points}>
            {dict.warranty.points.map((point) => (
              <li key={point}>
                <CheckIcon className={styles.check} /> {point}
              </li>
            ))}
          </ul>
        </div>
        <div className={`${styles.panel} reveal`}>
          <div className={styles.panelHead}>
            <div className={styles.shieldIco}>
              <ShieldIcon size={26} />
            </div>
            <h3>{dict.warranty.materialsLabel}</h3>
          </div>
          <div className={styles.chips}>
            {MATERIAL_BRANDS.map((brand) => (
              <span key={brand.slug} className={styles.chip}>
                <Image
                  src={`/brands/${brand.slug}.png`}
                  alt={brand.name}
                  width={44}
                  height={44}
                  className={styles.chipLogo}
                />
                {brand.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
