"use client";
import { createContext, useContext } from "react";
import type { CertConfig } from "@/data/types";
import { getCert } from "@/data/certs";

const CertContext = createContext<CertConfig | null>(null);

/**
 * Receives only the cert slug from the server layout (functions aren't serializable
 * across the server→client boundary). Looks up the full config client-side.
 */
export function CertProvider({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const cert = getCert(slug);
  if (!cert) return null;
  return <CertContext.Provider value={cert}>{children}</CertContext.Provider>;
}

/** Returns the current cert config, or null when outside a [cert] route. */
export function useCert(): CertConfig | null {
  return useContext(CertContext);
}
