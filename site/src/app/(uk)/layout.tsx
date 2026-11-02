import type { Metadata } from "next";
import { RootDocument } from "@/components/layout/RootDocument";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("uk");

export default function UkLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="uk">{children}</RootDocument>;
}
