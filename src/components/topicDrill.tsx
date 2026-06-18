"use client";
import { useState } from "react";
import { useCert } from "@/components/certProvider";
import { AceCert } from "@/data/ace";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import QuizMode from "@/components/quizMode";
import { cn } from "@/lib/utils";

export default function TopicDrill() {
  const cert = useCert() ?? AceCert;
  const SECTIONS = cert.sections;
  const getTopicsForSection = cert.getTopicsForSection.bind(cert);
  const [selSec, setSelSec] = useState<number | null>(null);
  const [selTopic, setSelTopic] = useState<string | null>(null);
  const [drilling, setDrilling] = useState(false);

  if (drilling && selSec && selTopic) return (
    <div className="flex flex-col gap-3.5">
      <button
        onClick={() => { setDrilling(false); setSelTopic(null); }}
        className="self-start text-sm text-primary hover:text-primary/80 transition-colors bg-transparent border-none cursor-pointer p-0"
      >
        ← Back to topics
      </button>
      <div
        className="rounded-xl border border-border bg-card px-4 py-3"
        style={{ borderLeftWidth: 3, borderLeftColor: `var(--sec-${selSec}-bar)` }}
      >
        <p className="text-xs text-muted-foreground mb-0.5">Drilling topic</p>
        <p className="font-semibold text-sm text-foreground">{selTopic}</p>
      </div>
      <QuizMode section={selSec} topic={selTopic} />
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-sm text-muted-foreground mb-3">1. Choose a section</p>
        <div className="grid grid-cols-2 gap-3">
          {SECTIONS.map((s, i) => {
            const isActive = selSec === s.id;
            return (
              <button
                key={s.id}
                onClick={() => { setSelSec(s.id); setSelTopic(null); }}
                className={cn(
                  `fade-in stagger-${i + 1}`,
                  "text-left cursor-pointer rounded-xl border transition-all duration-150 p-4 outline-none",
                  isActive
                    ? "ring-2 ring-primary"
                    : "border-border bg-card hover:-translate-y-0.5 hover:shadow-md"
                )}
                style={
                  isActive
                    ? {
                        background: `var(--sec-${s.id}-bg)`,
                        borderColor: `var(--sec-${s.id}-text)`,
                      }
                    : {
                        borderLeftWidth: 3,
                        borderLeftColor: `var(--sec-${s.id}-bar)`,
                      }
                }
              >
                <span
                  className="font-mono text-xs font-semibold px-2 py-0.5 rounded"
                  style={{
                    background: isActive ? "oklch(0 0 0 / 0.25)" : `var(--sec-${s.id}-bg)`,
                    color: `var(--sec-${s.id}-text)`,
                  }}
                >
                  {s.weight}
                </span>
                <p
                  className="font-semibold text-sm mt-2.5"
                  style={isActive ? { color: `var(--sec-${s.id}-text)` } : undefined}
                >
                  {s.short}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {selSec && (
        <Card className="fade-in">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground font-normal">
              2. Pick a topic
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ToggleGroup
              value={selTopic ? [selTopic] : []}
              onValueChange={(v: readonly string[]) => setSelTopic(v[v.length - 1] ?? null)}
              className="flex-wrap justify-start gap-2"
            >
              {getTopicsForSection(selSec).map((t) => (
                <ToggleGroupItem
                  key={t}
                  value={t}
                  variant="outline"
                  className="rounded-full text-xs h-8 px-3.5"
                >
                  {t}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Button
              disabled={!selTopic}
              onClick={() => setDrilling(true)}
              size="lg"
              className="w-full font-medium"
            >
              Start Drilling →
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
