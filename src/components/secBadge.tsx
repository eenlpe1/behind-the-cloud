"use client";
import { SECTIONS } from "@/data";

export default function SecBadge({ section, topic }: { section: number; topic?: string }) {
  const s = SECTIONS.find((x) => x.id === section);
  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      <span
        data-section={section}
        className="inline-flex items-center font-mono text-xs font-semibold px-2 py-0.5 rounded"
        style={{
          background: `var(--sec-${section}-bg)`,
          color: `var(--sec-${section}-text)`,
        }}
      >
        {s?.short}
      </span>
      {topic && (
        <span className="inline-flex items-center font-mono text-xs px-2 py-0.5 rounded border border-border text-muted-foreground">
          {topic}
        </span>
      )}
    </div>
  );
}
