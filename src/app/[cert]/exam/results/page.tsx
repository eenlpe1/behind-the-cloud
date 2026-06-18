import { getCert, ALL_CERTS } from "@/data/certs";
import { notFound } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/appShell";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return ALL_CERTS.map((c) => ({ cert: c.slug }));
}

export default async function ExamResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ cert: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { cert: slug } = await params;
  const sp = await searchParams;
  const cert = getCert(slug);
  if (!cert) notFound();

  const pct = Number(sp.p ?? 0);
  const correct = Number(sp.c ?? 0);
  const total = Number(sp.t ?? 0);
  const passed = pct >= 70;

  const bySection = cert.sections.map((s) => ({
    ...s,
    pct: Number(sp[`s${s.id}p`] ?? 0),
    correct: Number(sp[`s${s.id}c`] ?? 0),
    total: Number(sp[`s${s.id}t`] ?? 0),
  }));

  // Guard: if no meaningful data in URL, redirect to exam
  if (!total) notFound();

  return (
    <AppShell>
      <div className="flex flex-col gap-6 max-w-[600px] mx-auto pt-4">

        {/* Score hero */}
        <div
          className={cn(
            "score-hero-enter rounded-2xl border p-10 text-center flex flex-col gap-2",
            passed ? "feedback-correct" : "feedback-wrong",
          )}
        >
          <p className="feedback-title text-7xl font-semibold font-mono leading-none">
            {pct}%
          </p>
          <p className="feedback-title text-xl font-semibold mt-2">
            {passed ? "Passing Score" : "Keep Studying"}
          </p>
          <p className="feedback-body text-sm mt-1">
            {correct} / {total} correct · {passed ? "Above 70% threshold" : "Below 70% threshold"}
          </p>
        </div>

        {/* Per-section breakdown */}
        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
            Section Breakdown
          </p>
          <div className="grid grid-cols-2 gap-3">
            {bySection.map((s) => (
              <div
                key={s.id}
                className="flex flex-col gap-2.5 rounded-xl border border-border p-4 bg-card"
                style={{ borderLeftWidth: 3, borderLeftColor: `var(--sec-${s.id}-bar)` }}
              >
                <div className="flex justify-between items-center">
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: s.pct >= 70
                        ? "var(--color-stat-correct)"
                        : "var(--color-stat-wrong)",
                    }}
                  >
                    {s.pct}%
                  </span>
                </div>
                <p className="text-xs font-semibold text-foreground">{s.short}</p>
                <Progress value={s.pct}>
                  <ProgressTrack className="h-1">
                    <ProgressIndicator
                      style={{
                        background: s.pct >= 70
                          ? "var(--color-bar-correct)"
                          : "var(--color-bar-wrong)",
                      }}
                    />
                  </ProgressTrack>
                </Progress>
                <p className="text-xs text-muted-foreground">{s.correct}/{s.total}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <Link
            href={`/${slug}/exam/review`}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card text-foreground font-semibold text-sm h-11 px-5 hover:bg-muted/60 transition-colors"
          >
            Review Answers
          </Link>
          <div className="flex gap-2.5">
            <Link
              href={`/${slug}/exam`}
              className="flex-1 inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold text-sm h-11 px-5 hover:bg-primary/90 transition-colors"
            >
              Retake Exam
            </Link>
            <Link
              href={`/${slug}`}
              className="flex-1 inline-flex items-center justify-center rounded-xl border border-border bg-card text-foreground font-medium text-sm h-11 px-5 hover:bg-muted/60 transition-colors"
            >
              Back to Overview
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
