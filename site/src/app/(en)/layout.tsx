import type { Metadata } from "next";
import { onest } from "@/lib/fonts";
import { buildMetadata } from "@/lib/seo";
import "@/styles/globals.css";

export const metadata: Metadata = buildMetadata("en");

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={onest.className}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
