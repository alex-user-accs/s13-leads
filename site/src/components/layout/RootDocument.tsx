import { onest } from "@/lib/fonts";
import type { Locale } from "@/lib/i18n";
import "@/styles/globals.css";

/** <html>/<body> shell shared by the uk and en root layouts. */
export function RootDocument({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={locale} className={onest.className}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
