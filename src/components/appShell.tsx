"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HelpCircle,
  Layers,
  Target,
  ClipboardList,
  ChevronRight,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/themeToggle";
import { useCert } from "@/components/certProvider";
import { cn } from "@/lib/utils";

const MODE_ITEMS = [
  { id: "quiz", icon: HelpCircle, label: "Quiz" },
  { id: "flashcard", icon: Layers, label: "Flashcards" },
  { id: "drill", icon: Target, label: "Drill" },
  { id: "exam", icon: ClipboardList, label: "Exam Sim" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const cert = useCert();

  // Derive cert slug from URL when context isn't available
  const certSlug = cert?.slug ?? pathname.split("/")[1] ?? "";

  const activeMode = MODE_ITEMS.find((m) => pathname.endsWith(`/${m.id}`));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <h2 className="sr-only">
        Behind the Cloud —{" "}
        {cert ? `${cert.provider} ${cert.name}` : "Certification Practice"}
      </h2>

      {/* ── N1b Nav ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-235 mx-auto px-6 h-14 flex items-center justify-between gap-6">
          {/* Left: wordmark → home, then cert name if in cert context */}
          <div className="flex items-center gap-2 shrink-0 min-w-0">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Logo />
              <span className="font-semibold text-sm tracking-tight">
                Behind the Cloud
              </span>
            </Link>
            {cert && (
              <>
                <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
                <Link
                  href={`/${certSlug}`}
                  className="font-mono text-xs font-semibold text-primary hover:text-primary/80 transition-colors truncate"
                >
                  {cert.shortName}
                </Link>
              </>
            )}
          </div>

          {/* Center: mode links (only shown inside a cert route) */}
          {cert && (
            <nav className="hidden sm:flex items-center gap-0.5">
              {MODE_ITEMS.map((m) => {
                const Icon = m.icon;
                const href = `/${certSlug}/${m.id}`;
                const active = pathname === href;
                return (
                  <Link
                    key={m.id}
                    href={href}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                      active
                        ? "text-foreground bg-muted"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                    )}
                  >
                    <Icon className="size-3.5 shrink-0" />
                    {m.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right: theme toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Mobile mode strip (cert routes only) */}
      {cert && (
        <div className="sm:hidden border-b border-border bg-card overflow-x-auto">
          <div className="flex px-4 py-1.5 gap-0.5 min-w-max">
            {MODE_ITEMS.map((m) => {
              const Icon = m.icon;
              const href = `/${certSlug}/${m.id}`;
              const active = pathname === href;
              return (
                <Link
                  key={m.id}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap",
                    active
                      ? "text-foreground bg-muted"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="size-3 shrink-0" />
                  {m.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Breadcrumb (mode pages only) */}
      {cert && activeMode && (
        <div className="max-w-[940px] mx-auto px-6 pt-4 pb-0">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href={`/${certSlug}`}
              className="hover:text-foreground transition-colors"
            >
              {cert.shortName}
            </Link>
            <span>/</span>
            <span className="text-foreground">{activeMode.label}</span>
          </div>
        </div>
      )}

      <main className="max-w-[940px] mx-auto px-6 py-6 pb-16 flex-1 w-full">
        {children}
      </main>

      <footer className="max-w-[940px] mx-auto px-6 pb-8 border-t border-border pt-6 mt-2 w-full">
        <p className="text-xs text-muted-foreground text-center tracking-wide">
          {cert
            ? `Aligned to ${cert.provider} ${cert.shortName} Exam Guide · ${cert.guideDate} · AI-generated — verify with official Google Cloud docs`
            : "AI-generated content — verify with official Google Cloud documentation"}
        </p>
      </footer>
    </div>
  );
}
