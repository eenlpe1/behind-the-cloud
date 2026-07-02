"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { correctSet, isAnswerCorrect, isMultiAnswer, type Question } from "@/data/types";
import { useCert } from "@/components/certProvider";
import { AceCert } from "@/data/ace";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";
import SecBadge from "@/components/secBadge";
import { cn } from "@/lib/utils";

type Phase = "intro" | "exam";

const fmt = (s: number) =>
  `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function ExamSim() {
  const cert = useCert() ?? AceCert;
  const SECTIONS = cert.sections;
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [qs, setQs] = useState<Question[]>([]);
  const [ans, setAns] = useState<Record<number, string[]>>({});
  const [cur, setCur] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const [t, setT] = useState(cert.examDuration);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const slug = cert.slug;

  const start = () => {
    setQs(cert.buildMockExam());
    setAns({});
    setCur(0);
    setVisited(new Set());
    setT(cert.examDuration);
    setPhase("exam");
  };

  const navigate = (next: number) => {
    setVisited((v) => new Set(v).add(cur));
    setCur(next);
  };

  const submitExam = (currentAns: Record<number, string[]>, questions: Question[]) => {
    if (timer.current) clearInterval(timer.current);
    const total = questions.length;
    const correct = questions.filter((q, i) => isAnswerCorrect(q, currentAns[i])).length;
    const pct = Math.round((correct / total) * 100);

    const params = new URLSearchParams({
      p: String(pct),
      c: String(correct),
      t: String(total),
    });

    SECTIONS.forEach((s) => {
      const idxs = questions.map((q, i) => ({ q, i })).filter(({ q }) => q.section === s.id);
      const sc = idxs.filter(({ q, i }) => isAnswerCorrect(q, currentAns[i])).length;
      const sp = idxs.length ? Math.round((sc / idxs.length) * 100) : 0;
      params.set(`s${s.id}p`, String(sp));
      params.set(`s${s.id}c`, String(sc));
      params.set(`s${s.id}t`, String(idxs.length));
    });

    try {
      sessionStorage.setItem(
        `exam-review-${slug}`,
        JSON.stringify({ questionIds: questions.map((q) => q.id), answers: currentAns })
      );
    } catch {}

    router.push(`/${slug}/exam/results?${params}`);
  };

  useEffect(() => {
    if (phase === "exam") {
      timer.current = setInterval(() => {
        setT((prev) => {
          if (prev <= 1) {
            clearInterval(timer.current!);
            submitExam(ans, qs);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timer.current) clearInterval(timer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ── INTRO ───────────────────────────────────────────────────────────────────
  if (phase === "intro") return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold tracking-tight">
            Mock Exam
          </CardTitle>
          <CardDescription>
            50 questions · 2 hours · Weighted per June 2025 guide · Instant — no loading
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            {SECTIONS.map((s) => (
              <div
                key={s.id}
                className="flex flex-col gap-2 rounded-xl border border-border p-4 bg-card"
                style={{ borderLeftWidth: 3, borderLeftColor: `var(--sec-${s.id}-bar)` }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{s.weight}</span>
                </div>
                <p className="text-sm font-semibold text-foreground mt-0.5">{s.short}</p>
                <p className="text-xs text-muted-foreground">{s.examCount} questions</p>
              </div>
            ))}
          </div>
          <Button onClick={start} size="lg" className="w-full font-semibold text-base mt-1">
            Start Exam →
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // ── ACTIVE EXAM ─────────────────────────────────────────────────────────────
  const q = qs[cur];
  const isFullyAnswered = (i: number) => (ans[i]?.length ?? 0) === correctSet(qs[i]).length;
  const answered = qs.filter((_, i) => isFullyAnswered(i)).length;
  const multi = isMultiAnswer(q);
  const need = correctSet(q).length;
  const timerPct = (t / cert.examDuration) * 100;

  // Group question indices by section for the jump grid
  const sectionGroups = SECTIONS.map((s) => ({
    ...s,
    indices: qs.map((q, i) => i).filter((i) => qs[i].section === s.id),
  }));

  return (
    <div className="flex flex-col gap-3.5">
      {/* Progress / timer */}
      <Card>
        <CardContent className="flex flex-col gap-2.5 py-3.5 px-5">
          <div className="flex justify-between text-sm items-center">
            <span className="text-muted-foreground text-xs">Question {cur + 1} / {qs.length}</span>
            <span
              className={cn(
                "font-mono font-bold text-lg",
                t < 600 ? "pulse-danger" : "text-foreground"
              )}
              style={{ color: t < 600 ? "var(--color-stat-wrong)" : undefined }}
            >
              {fmt(t)}
            </span>
            <span className="text-muted-foreground text-xs">{answered} answered</span>
          </div>
          <Progress value={timerPct}>
            <ProgressTrack className="h-0.5">
              <ProgressIndicator
                style={{
                  background: t < 600 ? "var(--color-bar-wrong)" : "var(--primary)",
                  transition: "width 1s linear",
                }}
              />
            </ProgressTrack>
          </Progress>
        </CardContent>
      </Card>

      {/* Question card */}
      <Card>
        <CardContent className="flex flex-col gap-5 py-6 px-6">
          <div className="flex items-center justify-between gap-3">
            <SecBadge section={q.section} topic={q.topic} />
            {multi && (
              <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full border border-border text-muted-foreground shrink-0">
                Select {need} · {(ans[cur]?.length ?? 0)}/{need}
              </span>
            )}
          </div>
          <p className="font-medium text-base leading-relaxed text-foreground">{q.question}</p>
          <div className="flex flex-col gap-2.5">
            {(Object.entries(q.options) as [string, string][]).map(([opt, text]) => {
              const picked = ans[cur] ?? [];
              const selected = picked.includes(opt);
              const capped = !selected && multi && picked.length >= need;
              return (
                <button
                  key={opt}
                  disabled={capped}
                  onClick={() =>
                    setAns((a) => {
                      const prev = a[cur] ?? [];
                      if (prev.includes(opt)) {
                        if (!multi) return a;
                        return { ...a, [cur]: prev.filter((o) => o !== opt) };
                      }
                      if (!multi) return { ...a, [cur]: [opt] };
                      if (prev.length >= need) return a;
                      return { ...a, [cur]: [...prev, opt] };
                    })
                  }
                  className={cn(
                    "w-full text-left px-4 py-3.5 rounded-xl flex items-start gap-3 text-sm leading-snug border transition-all",
                    capped ? "cursor-default" : "cursor-pointer",
                    selected
                      ? ""
                      : capped
                      ? "bg-card border-border opacity-50"
                      : "bg-card border-border hover:bg-muted/50 hover:border-border-strong"
                  )}
                  style={
                    selected
                      ? {
                          background: "oklch(0.491 0.113 244 / 0.12)",
                          borderColor: "var(--primary)",
                          color: "var(--foreground)",
                        }
                      : undefined
                  }
                >
                  <span className="font-mono text-xs size-6 rounded-md bg-muted flex items-center justify-center shrink-0 font-semibold">
                    {opt}
                  </span>
                  <span>{text}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Prev / Next / Submit */}
      <div className="flex gap-2.5">
        <Button
          variant="outline"
          disabled={cur === 0}
          onClick={() => navigate(cur - 1)}
          className="flex-1"
        >
          ← Prev
        </Button>
        {answered === qs.length ? (
          <Button
            onClick={() => submitExam(ans, qs)}
            className="flex-1 font-semibold"
            style={{ background: "var(--color-bar-correct)", color: "var(--bg-surface)" }}
          >
            Submit Exam
          </Button>
        ) : (
          <Button
            variant="outline"
            disabled={cur === qs.length - 1}
            onClick={() => navigate(cur + 1)}
            className="flex-1"
            title={
              cur === qs.length - 1
                ? `Answer all questions to submit (${qs.length - answered} remaining)`
                : undefined
            }
          >
            Next →
          </Button>
        )}
      </div>

      {/* Jump grid — grouped by section */}
      <Card>
        <CardContent className="py-4 px-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground">Jump to question</p>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-sm inline-block border-2" style={{ background: "oklch(0.491 0.113 244 / 0.18)", borderColor: "oklch(0.491 0.113 244 / 0.7)" }} />
                Answered
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-sm inline-block border-2" style={{ background: "oklch(0.75 0.12 60 / 0.22)", borderColor: "oklch(0.65 0.14 60 / 0.7)" }} />
                Skipped
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-sm inline-block bg-muted" />
                Unseen
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {sectionGroups.map((sg) => (
              <div key={sg.id} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded"
                    style={{
                      background: `var(--sec-${sg.id}-bg)`,
                      color: `var(--sec-${sg.id}-text)`,
                    }}
                  >
                    S{sg.id}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{sg.short}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {sg.indices.map((i) => {
                    const isAnswered = isFullyAnswered(i);
                    const isSkipped = !isAnswered && visited.has(i);
                    const isCurrent = i === cur;
                    return (
                      <button
                        key={i}
                        onClick={() => navigate(i)}
                        className={cn(
                          "size-8 rounded-lg text-xs font-mono font-semibold cursor-pointer transition-all",
                          isCurrent
                            ? "text-primary-foreground ring-2 ring-offset-1 ring-primary border-none"
                            : isAnswered
                            ? "border-2"
                            : isSkipped
                            ? "border-2"
                            : "bg-muted text-muted-foreground border-none hover:bg-muted/70"
                        )}
                        style={
                          isCurrent
                            ? { background: "var(--primary)" }
                            : isAnswered
                            ? {
                                background: "oklch(0.491 0.113 244 / 0.18)",
                                color: "var(--primary)",
                                borderColor: "oklch(0.491 0.113 244 / 0.7)",
                              }
                            : isSkipped
                            ? {
                                background: "oklch(0.75 0.12 60 / 0.22)",
                                color: "oklch(0.48 0.14 60)",
                                borderColor: "oklch(0.65 0.14 60 / 0.7)",
                              }
                            : undefined
                        }
                        title={isCurrent ? "Current" : isAnswered ? "Answered" : isSkipped ? "Skipped" : "Not visited"}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
