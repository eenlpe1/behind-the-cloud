import { AceCert } from "@/data/ace";
import type { CertConfig } from "@/data/types";

/** Registry of all available certifications. Add new certs here. */
export const CERT_REGISTRY: Record<string, CertConfig> = {
  ace: AceCert,
};

export const ALL_CERTS: CertConfig[] = Object.values(CERT_REGISTRY);

export function getCert(slug: string): CertConfig | null {
  return CERT_REGISTRY[slug] ?? null;
}

/** Certs planned but not yet available — shown as "Coming soon" on the picker. */
export const UPCOMING_CERTS = [
  { slug: "pca", shortName: "PCA", name: "Professional Cloud Architect", provider: "GCP" },
  { slug: "pde", shortName: "PDE", name: "Professional Data Engineer",   provider: "GCP" },
];
