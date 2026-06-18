import { getCert, ALL_CERTS } from "@/data/certs";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HelpCircle, Layers, Target, ClipboardList, ChevronRight } from "lucide-react";
import AppShell from "@/components/appShell";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return ALL_CERTS.map((c) => ({ cert: c.slug }));
}

const MODE_META = [
  { id: "quiz",      icon: HelpCircle,    label: "Quiz",        desc: "Scenario questions per section", section: 1 },
  { id: "flashcard", icon: Layers,        label: "Flashcards",  desc: "Flip-card concept review",       section: 2 },
  { id: "drill",     icon: Target,        label: "Topic Drill", desc: "Deep-dive on specific subtopics", section: 3 },
  { id: "exam",      icon: ClipboardList, label: "Exam Sim",    desc: "Full timed mock exam",            section: 4 },
];

const EXAM_WEIGHTS: Record<string, Record<number, number>> = {
  ace: { 1: 20, 2: 30, 3: 30, 4: 20 },
};

export default async function CertPage({
  params,
}: {
  params: Promise<{ cert: string }>;
}) {
  const { cert: slug } = await params;
  const cert = getCert(slug);
  if (!cert) notFound();

  const weights = EXAM_WEIGHTS[slug] ?? {};

  return (
    <AppShell>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-16 items-start pt-6">

        {/* ── Left: identity + exam map ───────────────────────────────────── */}
        <div className="flex flex-col gap-10 fade-in stagger-1">

          {/* Identity */}
          <div className="flex flex-col gap-3">
            <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
              {cert.provider} Certification
            </p>
            <h1
              className="leading-tight text-foreground"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.875rem, 5vw, 2.75rem)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
              }}
            >
              {cert.name}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {cert.allQuestions.length} questions · {cert.allFlashcards.length} flashcards · aligned to the {cert.guideDate} exam guide.
            </p>
          </div>

          {/* Exam section map */}
          <div className="flex flex-col gap-1">
            <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-4">
              Exam Breakdown
            </p>
            {cert.sections.map((s) => (
              <div
                key={s.id}
                className="flex items-stretch gap-4 py-4 border-b border-border last:border-0"
              >
                <div
                  className="w-0.5 rounded-full shrink-0 self-stretch"
                  style={{ background: `var(--sec-${s.id}-bar)` }}
                />
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground shrink-0">
                      {s.weight} · {s.examCount} Qs
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground leading-snug">{s.short}</p>
                  <div className="h-px bg-border rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${weights[s.id] ?? 0}%`,
                        background: `var(--sec-${s.id}-bar)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ── Right: study mode stations ──────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MODE_META.map((m, i) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.id}
                href={`/${slug}/${m.id}`}
                className={cn(
                  "card-hover group rounded-2xl border border-border bg-card outline-none",
                  "flex flex-col gap-5 px-6 py-6",
                  `fade-in stagger-${i + 1}`,
                )}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="size-9 rounded-lg flex items-center justify-center"
                    style={{
                      background: `var(--sec-${m.section}-bg)`,
                      color: `var(--sec-${m.section}-text)`,
                    }}
                  >
                    <Icon className="size-4" />
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="font-semibold text-base text-foreground">{m.label}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                </div>
                <div
                  className="h-0.5 rounded-full mt-auto"
                  style={{ background: `var(--sec-${m.section}-bar)` }}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
