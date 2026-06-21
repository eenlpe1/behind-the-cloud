"use client";
import { useState, useCallback } from "react";
import type { Question } from "@/data/types";
import { useCert } from "@/components/certProvider";
import { AceCert } from "@/data/ace";
import SecBadge from "@/components/secBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function QuizMode({ section, topic }: Readonly<{ section: number; topic: string | null }>) {
  const cert = useCert() ?? AceCert;
  const [q, setQ] = useState<Question | null>(() => cert.getRandomQuestion(section, topic, null));
  const [sel, setSel] = useState<string | null>(null);
  const [score, setScore] = useState({ c: 0, t: 0 });
  const [dots, setDots] = useState<boolean[]>([]);
  const [prevSection, setPrevSection] = useState(section);
  const [prevTopic, setPrevTopic] = useState(topic);

  if (prevSection !== section || prevTopic !== topic) {
    setPrevSection(section);
    setPrevTopic(topic);
    setSel(null);
    setQ(cert.getRandomQuestion(section, topic, null));
  }

  const load = useCallback(() => {
    setSel(null);
    setQ(cert.getRandomQuestion(section, topic, q?.id ?? null));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, topic]);

  const pick = (opt: string) => {
    if (sel || !q) return;
    setSel(opt);
    const ok = opt === q.correct;
    setScore((s) => ({ c: s.c + (ok ? 1 : 0), t: s.t + 1 }));
    setDots((d) => [ok, ...d].slice(0, 10));
  };

  const optClass = (opt: string) =>
    cn(
      "opt-btn",
      sel && opt === q!.correct && "opt-btn--correct",
      sel && opt === sel && opt !== q!.correct && "opt-btn--wrong",
      sel && opt !== sel && opt !== q!.correct && "opt-btn--dimmed",
    );

  if (!q) return (
    <Card>
      <CardContent className="py-8 text-center text-muted-foreground text-sm">
        No questions found for this section/topic.
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col gap-4">

      {/* Borderless stat row */}
      <div className="flex items-center justify-between px-1">
        <div className="flex gap-8 items-end">
          <div>
            <p
              className="text-3xl font-semibold font-mono leading-none"
              style={{ color: "var(--color-stat-correct)" }}
            >
              {score.c}
            </p>
            <p className="text-xs text-muted-foreground mt-1">correct</p>
          </div>
          <div>
            <p className="text-3xl font-semibold font-mono leading-none text-foreground">{score.t}</p>
            <p className="text-xs text-muted-foreground mt-1">total</p>
          </div>
          {score.t > 0 && (
            <div>
              <p className="text-3xl font-semibold font-mono leading-none text-primary">
                {Math.round((score.c / score.t) * 100)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">accuracy</p>
            </div>
          )}
        </div>
        {/* Recent history dots */}
        <div className="flex gap-1.5 items-center">
          {dots.map((ok, i) => (
            <div
              key={i}
              className="size-2 rounded-full"
              style={{
                background: ok
                  ? "var(--color-bar-correct)"
                  : "var(--color-bar-wrong)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Question card */}
      <Card>
        <CardContent className="flex flex-col gap-5 py-6 px-6">
          <SecBadge section={q.section} topic={q.topic} />
          <p className="font-medium text-base leading-relaxed text-foreground">{q.question}</p>
          <div className="flex flex-col gap-2.5">
            {(Object.entries(q.options) as [string, string][]).map(([opt, text]) => (
              <button
                key={opt}
                disabled={!!sel}
                onClick={() => pick(opt)}
                className={optClass(opt)}
              >
                <span className="opt-letter font-mono text-xs size-6 rounded-md bg-muted flex items-center justify-center shrink-0 font-semibold">
                  {opt}
                </span>
                <span className="leading-snug">{text}</span>
              </button>
            ))}
          </div>

          {/* Feedback — uses theme-aware --fb-* tokens */}
          {sel && (
            <div
              className={cn(
                "slide-up rounded-xl px-5 py-4 border-l-4 flex flex-col gap-1.5",
                sel === q.correct ? "feedback-correct" : "feedback-wrong",
              )}
            >
              <p className="feedback-title text-sm font-semibold">
                {sel === q.correct ? "Correct" : `Incorrect — Answer: ${q.correct}`}
              </p>
              <p className="feedback-body text-sm leading-relaxed">{q.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {sel && (
        <Button onClick={load} size="lg" className="w-full font-medium">
          Next Question →
        </Button>
      )}
    </div>
  );
}
