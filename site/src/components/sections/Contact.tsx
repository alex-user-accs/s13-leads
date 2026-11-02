"use client";

import { useRef, useState } from "react";
import { BUSINESS } from "@/lib/constants";
import { getDictionary, type Locale } from "@/lib/i18n";
import { isValidUaPhone, LEAD_SERVICES } from "@/lib/lead";
import { PhoneIcon, PinIcon, ClockIcon, InstagramIcon } from "@/components/ui/Icons";
import styles from "./Contact.module.css";

type Status = "idle" | "sending" | "success" | "error";

export function Contact({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const mountedAt = useRef(Date.now());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const service = String(data.get("service") ?? "").trim();
    const honeypot = String(data.get("company") ?? "");

    const nextErrors: typeof errors = {};
    if (name.length < 2) nextErrors.name = dict.contact.form.nameError;
    if (!isValidUaPhone(phone)) nextErrors.phone = dict.contact.form.phoneError;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          service,
          honeypot,
          elapsed: Date.now() - mountedAt.current,
          locale,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    `${BUSINESS.address.street}, ${BUSINESS.address.city}`
  )}&output=embed&hl=${locale}`;

  return (
    <section className={styles.section} id="contact">
      <div className="container">
        <span className="sec-label">{dict.contact.label}</span>
        <h2 className="sec-title">{dict.contact.title}</h2>
        <p className="sec-sub">{dict.contact.sub}</p>

        <div className={styles.grid}>
          <address className={styles.info}>
            <div className={styles.item}>
              <span className={styles.ico}><PinIcon /></span>
              <div>
                <b>{dict.contact.addressLabel}</b>
                <br />
                {BUSINESS.address.street}, {BUSINESS.address.city}
              </div>
            </div>
            <div className={styles.item}>
              <span className={styles.ico}><ClockIcon /></span>
              <div>
                <b>{dict.contact.hoursLabel}</b>
                <br />
                {dict.contact.hoursValue}
              </div>
            </div>
            <div className={styles.item}>
              <span className={styles.ico}><PhoneIcon /></span>
              <div>
                <b>{dict.contact.phoneLabel}</b>
                <br />
                <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phoneDisplay}</a>
              </div>
            </div>
            <div className={styles.item}>
              <span className={styles.ico}><InstagramIcon /></span>
              <div>
                <b>{dict.contact.instagramLabel}</b>
                <br />
                <a href={BUSINESS.instagram} target="_blank" rel="noopener noreferrer">
                  {BUSINESS.instagramHandle}
                </a>
              </div>
            </div>
          </address>

          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <div>
              <label htmlFor="lead-name" className={styles.srOnly}>
                {dict.contact.form.name}
              </label>
              <input
                id="lead-name"
                name="name"
                type="text"
                placeholder={dict.contact.form.name}
                aria-invalid={!!errors.name}
              />
              {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
            </div>
            <div>
              <label htmlFor="lead-phone" className={styles.srOnly}>
                {dict.contact.phoneLabel}
              </label>
              <input
                id="lead-phone"
                name="phone"
                type="tel"
                placeholder={dict.contact.form.phone}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
            </div>
            <div>
              <label htmlFor="lead-service" className={styles.srOnly}>
                {dict.contact.form.service}
              </label>
              <select id="lead-service" name="service" defaultValue="">
                <option value="">{dict.contact.form.service}</option>
                {LEAD_SERVICES.map((id) => (
                  <option key={id} value={id}>
                    {dict.services.groups[id].title}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              className={styles.honeypot}
              aria-hidden="true"
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={status === "sending"}
            >
              {status === "sending" ? "…" : dict.contact.form.submit}
            </button>
            {status === "success" && (
              <p className={styles.success} role="status">
                {dict.contact.form.success}
              </p>
            )}
            {status === "error" && (
              <p className={styles.error} role="alert">
                {dict.contact.form.error}{" "}
                <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phoneDisplay}</a>
              </p>
            )}
            <span className={styles.consent}>*{dict.contact.form.consent}</span>
          </form>
        </div>

        <div className={styles.map} id="map">
          <iframe
            src={mapSrc}
            title={dict.contact.mapTitle}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
