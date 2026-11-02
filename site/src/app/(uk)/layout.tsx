import type { Metadata } from "next";
import { onest } from "@/lib/fonts";
import { buildMetadata } from "@/lib/seo";
import "@/styles/globals.css";

export const metadata: Metadata = buildMetadata("uk");

export default function UkLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={onest.className}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
