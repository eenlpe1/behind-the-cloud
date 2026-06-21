"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/appShell";
import { Card, CardContent } from "@/components/ui/card";
import SecBadge from "@/components/secBadge";
import { cn } from "@/lib/utils";
import type { Question } from "@/data/types";
import { useCert } from "@/components/certProvider";
import { AceCert } from "@/data/ace";

type Filter = "all" | "correct" | "incorrect";

interface ReviewEntry {
  question: Question;
  picked: string | undefined;
  isCorrect: boolean;
  index: number;
}

export default function ExamReviewPage() {
  const { cert: slug } = useParams<{ cert: string }>();
  const cert = useCert() ?? AceCert;
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");

  const [entries] = useState<ReviewEntry[]>(() => {
    if (typeof globalThis.window === "undefined") return [];
    try {
      const raw = sessionStorage.getItem(`exam-review-${slug}`);
      if (!raw) return [];
      const { questionIds, answers } = JSON.parse(raw) as {
        questionIds: string[];
        answers: Record<number, string>;
      };
      const byId = new Map(cert.allQuestions.map((q) => [q.id, q]));
      return questionIds.flatMap((id, i) => {
        const q = byId.get(id);
        if (!q) return [];
        return [{ question: q, picked: answers[i], isCorrect: answers[i] === q.correct, index: i }];
      });
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (entries.length === 0) router.replace(`/${slug}/exam`);
  }, [entries.length, router, slug]);

  const visible = entries.filter((e) =>
    filter === "all" ? true : filter === "correct" ? e.isCorrect : !e.isCorrect
  );

  const correctCount = entries.filter((e) => e.isCorrect).length;
  const incorrectCount = entries.length - correctCount;

  if (entries.length === 0) return null;

  return (
    <AppShell>
      <div className="flex flex-col gap-4 max-w-[680px] mx-auto pt-4 pb-10">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-base">Answer Review</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {correctCount} correct · {incorrectCount} incorrect · {entries.length} total
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to results
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 p-1 bg-muted rounded-xl w-fit">
          {(["all", "correct", "incorrect"] as Filter[]).map((f) => {
            const count = f === "all" ? entries.length : f === "correct" ? correctCount : incorrectCount;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all",
                  filter === f
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f} <span className="font-mono opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Question list */}
        <div className="flex flex-col gap-3">
          {visible.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-10">No questions in this filter.</p>
          )}
          {visible.map((e) => (
            <QuestionCard key={e.index} entry={e} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function QuestionCard({ entry }: { entry: ReviewEntry }) {
  const { question: q, picked, isCorrect } = entry;
  const opts = Object.entries(q.options) as [string, string][];

  return (
    <Card className={cn("overflow-hidden border", isCorrect ? "border-l-[3px]" : "border-l-[3px]")}
      style={{ borderLeftColor: isCorrect ? "var(--color-bar-correct)" : "var(--color-bar-wrong)" }}
    >
      <CardContent className="flex flex-col gap-4 py-5 px-5">

        {/* Meta + status */}
        <div className="flex items-start justify-between gap-3">
          <SecBadge section={q.section} topic={q.topic} />
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
            style={
              isCorrect
                ? { background: "var(--color-bar-correct)", color: "var(--bg-surface)" }
                : { background: "var(--color-bar-wrong)", color: "var(--bg-surface)" }
            }
          >
            {isCorrect ? "Correct" : "Incorrect"}
          </span>
        </div>

        <p className="text-sm font-medium leading-relaxed text-foreground">{q.question}</p>

        {/* Options */}
        <div className="flex flex-col gap-1.5">
          {opts.map(([opt, text]) => {
            const isCorrectOpt = opt === q.correct;
            const isPickedOpt = opt === picked;
            const isWrongPick = isPickedOpt && !isCorrectOpt;

            return (
              <div
                key={opt}
                className={cn(
                  "flex items-start gap-3 px-3.5 py-2.5 rounded-xl border text-sm leading-snug",
                  isCorrectOpt
                    ? "border-transparent"
                    : isWrongPick
                    ? "border-transparent"
                    : "border-transparent opacity-50"
                )}
                style={
                  isCorrectOpt
                    ? { background: "oklch(0.55 0.16 145 / 0.12)", borderColor: "oklch(0.55 0.16 145 / 0.5)" }
                    : isWrongPick
                    ? { background: "oklch(0.55 0.18 25 / 0.12)", borderColor: "oklch(0.55 0.18 25 / 0.5)" }
                    : undefined
                }
              >
                <span
                  className="font-mono text-xs size-6 rounded-md flex items-center justify-center shrink-0 font-semibold"
                  style={
                    isCorrectOpt
                      ? { background: "oklch(0.55 0.16 145 / 0.25)", color: "oklch(0.45 0.16 145)" }
                      : isWrongPick
                      ? { background: "oklch(0.55 0.18 25 / 0.25)", color: "oklch(0.45 0.18 25)" }
                      : { background: "var(--muted)", color: "var(--muted-foreground)" }
                  }
                >
                  {opt}
                </span>
                <span className={cn("flex-1", isCorrectOpt || isWrongPick ? "text-foreground" : "text-muted-foreground")}>
                  {text}
                </span>
                {isCorrectOpt && (
                  <span className="text-[10px] font-semibold shrink-0 mt-0.5" style={{ color: "oklch(0.45 0.16 145)" }}>
                    correct
                  </span>
                )}
                {isWrongPick && (
                  <span className="text-[10px] font-semibold shrink-0 mt-0.5" style={{ color: "oklch(0.45 0.18 25)" }}>
                    your pick
                  </span>
                )}
              </div>
            );
          })}
          {!picked && (
            <p className="text-xs text-muted-foreground italic px-1">Not answered</p>
          )}
        </div>

        {/* Explanation */}
        {q.explanation && (
          <div
            className="rounded-xl px-4 py-3 text-s leading-relaxed text-muted-foreground"
            style={{ background: "var(--muted)" }}
          >
            <span className="font-semibold text-foreground">Explanation · </span>
            {q.explanation}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
