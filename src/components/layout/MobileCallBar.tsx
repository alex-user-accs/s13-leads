"use client";

import { useEffect, useState } from "react";
import { PhoneIcon } from "@/components/ui/Icons";
import styles from "./MobileCallBar.module.css";

interface Props {
  phone: string;
  label: string;
}

export function MobileCallBar({ phone, label }: Props) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact) return;
    const io = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.2 }
    );
    io.observe(contact);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`${styles.bar} ${hidden ? styles.hidden : ""}`}>
      <a href={`tel:${phone}`} className="btn btn-primary">
        <PhoneIcon /> {label}
      </a>
    </div>
  );
}
