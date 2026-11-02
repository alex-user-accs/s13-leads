import { BUSINESS } from "@/lib/constants";
import { getDictionary, type Locale } from "@/lib/i18n";
import { faqJsonLd, localBusinessJsonLd } from "@/lib/seo";
import { Header } from "./layout/Header";
import { Footer } from "./layout/Footer";
import { MobileCallBar } from "./layout/MobileCallBar";
import { RevealInit } from "./ui/RevealInit";
import { Hero } from "./sections/Hero";
import { Services } from "./sections/Services";
import { BeforeAfter } from "./sections/BeforeAfter";
import { Process } from "./sections/Process";
import { WhyS13 } from "./sections/WhyS13";
import { Warranty } from "./sections/Warranty";
import { Gallery } from "./sections/Gallery";
import { Reviews } from "./sections/Reviews";
import { Faq } from "./sections/Faq";
import { Contact } from "./sections/Contact";

export function Landing({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd(locale)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(locale)) }}
      />
      <Header locale={locale} />
      <main>
        <Hero locale={locale} />
        <Services locale={locale} />
        <BeforeAfter locale={locale} />
        <Process locale={locale} />
        <WhyS13 locale={locale} />
        <Warranty locale={locale} />
        <Gallery locale={locale} />
        <Reviews locale={locale} />
        <Faq locale={locale} />
        <Contact locale={locale} />
      </main>
      <Footer locale={locale} />
      <MobileCallBar phone={BUSINESS.phone} label={dict.callbar.call} />
      <RevealInit />
    </>
  );
}
