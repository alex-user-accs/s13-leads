import type { Metadata } from "next";
import { RootDocument } from "@/components/layout/RootDocument";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata("en");

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
