import Link from "next/link";
import {
  ChevronRight,
  Lock,
  Star,
  BookOpen,
  CreditCard,
  Target,
  Timer,
} from "lucide-react";
import { ALL_CERTS, UPCOMING_CERTS } from "@/data/certs";
import { MODES } from "@/lib/reviewer";
import { ThemeToggle } from "@/components/themeToggle";
import { cn } from "@/lib/utils";

// Re-fetch star count from GitHub API at most once per hour (ISR).
export const revalidate = 3600;

const REPO = "eenlpe1/behind-the-cloud";

const MODE_ICONS = {
  quiz: BookOpen,
  flashcard: CreditCard,
  drill: Target,
  exam: Timer,
};

const SECTION_COLORS = [
  { bar: "var(--sec-1-bar)", bg: "var(--sec-1-bg)", text: "var(--sec-1-text)" },
  { bar: "var(--sec-2-bar)", bg: "var(--sec-2-bg)", text: "var(--sec-2-text)" },
  { bar: "var(--sec-3-bar)", bg: "var(--sec-3-bg)", text: "var(--sec-3-text)" },
  { bar: "var(--sec-4-bar)", bg: "var(--sec-4-bg)", text: "var(--sec-4-text)" },
];

async function getStars(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.stargazers_count ?? null;
  } catch {
    return null;
  }
}

function fmtStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default async function Home() {
  const stars = await getStars();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <h2 className="sr-only">
        Behind the Cloud — Choose a certification to begin
      </h2>

      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-235 mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-semibold text-sm tracking-tight">
            Behind the Cloud
          </span>
          <div className="flex items-center gap-2">
            {stars !== null && (
              <Link
                href={`https://github.com/${REPO}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border",
                  "text-xs font-mono font-medium text-muted-foreground",
                  "hover:text-foreground hover:border-foreground/30 transition-colors",
                )}
                aria-label={`Star on GitHub — ${stars} stars`}
              >
                <svg
                  viewBox="0 0 16 16"
                  className="size-3 shrink-0 fill-current"
                  aria-hidden="true"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                <span className="opacity-40">·</span>
                <Star className="size-3 shrink-0" />
                {fmtStars(stars)}
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-235 mx-auto px-6 py-10 flex-1 w-full">
        {/* Hero — compact two-column on sm+ */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 fade-in stagger-1">
          <div className="flex flex-col gap-1.5">
            <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
              Study System
            </p>
            <h1
              className="leading-tight text-foreground font-semibold tracking-tight"
              style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)" }}
            >
              Behind the Cloud
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Official exam guides turned into scenario-based questions, instant
              feedback, and realistic mock exams.
            </p>
          </div>

          {/* Mode pills — anchored right on sm+ */}
          <div className="flex flex-wrap gap-2 sm:justify-end sm:max-w-70 shrink-0">
            {MODES.map((mode) => {
              const Icon = MODE_ICONS[mode.id as keyof typeof MODE_ICONS];
              return (
                <span
                  key={mode.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-muted text-xs font-medium text-muted-foreground"
                >
                  {Icon && <Icon className="size-3 shrink-0" />}
                  {mode.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-6 fade-in stagger-1" />

        {/* Available certs */}
        <div className="flex flex-col gap-3 mb-8 fade-in stagger-2">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
              Available now
            </p>
            <span className="font-mono text-xs text-muted-foreground/60">
              {ALL_CERTS.length} cert{ALL_CERTS.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ALL_CERTS.map((cert, i) => (
              <Link
                key={cert.slug}
                href={`/${cert.slug}`}
                className={cn(
                  "card-hover group rounded-2xl border border-border bg-card outline-none",
                  "flex flex-col gap-4 px-5 py-5",
                  `fade-in stagger-${i + 1}`,
                )}
              >
                {/* Card top */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-[10px] font-semibold tracking-widest uppercase text-primary">
                      {cert.provider}
                    </span>
                    <span className="font-mono text-3xl font-semibold tracking-tight text-foreground leading-none">
                      {cert.shortName}
                    </span>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0" />
                </div>

                {/* Cert name */}
                <div>
                  <p className="font-semibold text-sm text-foreground leading-snug">
                    {cert.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {cert.allQuestions.length} questions ·{" "}
                    {cert.allFlashcards.length} flashcards · {cert.guideDate}
                  </p>
                </div>

                {/* Section breakdown */}
                <div className="flex flex-col gap-1.5">
                  {cert.sections.map((sec, si) => {
                    const col = SECTION_COLORS[si] ?? SECTION_COLORS[0];
                    return (
                      <div key={sec.id} className="flex items-center gap-2">
                        <div
                          className="w-1 h-4 rounded-full shrink-0"
                          style={{ background: col.bar }}
                        />
                        <span
                          className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0"
                          style={{ background: col.bg, color: col.text }}
                        >
                          Section {sec.id}
                        </span>
                        <span className="text-xs text-foreground truncate">
                          {sec.short}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground ml-auto shrink-0">
                          {sec.weight}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom bar accent */}
                <div className="h-px rounded-full mt-auto bg-primary/25" />
              </Link>
            ))}
          </div>
        </div>

        {/* Coming soon */}
        {UPCOMING_CERTS.length > 0 && (
          <div className="flex flex-col gap-3 fade-in stagger-3">
            <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
              Coming soon
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {UPCOMING_CERTS.map((cert) => (
                <div
                  key={cert.slug}
                  className="rounded-xl border border-dashed border-border bg-card/40 flex items-center justify-between px-5 py-4 opacity-55 select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
                        {cert.provider}
                      </span>
                      <span className="font-mono text-xl font-semibold tracking-tight text-muted-foreground leading-none">
                        {cert.shortName}
                      </span>
                    </div>
                    <div className="w-px h-8 bg-border shrink-0" />
                    <p className="text-xs text-muted-foreground leading-snug">
                      {cert.name}
                    </p>
                  </div>
                  <Lock className="size-3.5 text-muted-foreground shrink-0 ml-3" />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-235 mx-auto px-6 pb-8 border-t border-border pt-5 mt-4 w-full">
        <p className="text-xs text-muted-foreground text-center tracking-wide">
          AI-generated content — verify with official Cloud provider
          documentation
        </p>
      </footer>
    </div>
  );
}
