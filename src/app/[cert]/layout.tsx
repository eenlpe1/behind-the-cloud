import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCert, ALL_CERTS } from "@/data/certs";
import { CertProvider } from "@/components/certProvider";

export function generateStaticParams() {
  return ALL_CERTS.map((c) => ({ cert: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cert: string }>;
}): Promise<Metadata> {
  const { cert: slug } = await params;
  const cert = getCert(slug);
  if (!cert) return { title: "Not Found" };
  return {
    title: `${cert.provider} ${cert.shortName} — Vexamy`,
    description: `Scenario-based practice questions, flashcards, and a full mock exam for the ${cert.provider} ${cert.name}. Aligned to the ${cert.guideDate} exam guide.`,
  };
}

export default async function CertLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ cert: string }>;
}) {
  const { cert: slug } = await params;
  const cert = getCert(slug);
  if (!cert) notFound();

  return <CertProvider slug={slug}>{children}</CertProvider>;
}
