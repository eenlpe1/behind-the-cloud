"use client";
import { useCert } from "@/components/certProvider";
import { AceCert } from "@/data/ace";
import SecBadge from "@/components/secBadge";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SectionPicker({ onSelect }: { onSelect: (id: number) => void }) {
  const cert = useCert() ?? AceCert;
  const SECTIONS = cert.sections;
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-sm text-muted-foreground mb-1">Choose a section to begin:</p>
      {SECTIONS.map((s, i) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={cn(
            "fade-in text-left cursor-pointer rounded-xl border border-border bg-card",
            "flex items-center justify-between px-5 py-4 gap-4 w-full",
            "hover:-translate-y-0.5 hover:shadow-md hover:border-border-strong",
            "transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary",
            `stagger-${i + 1}`,
          )}
          style={{ borderLeftWidth: 3, borderLeftColor: `var(--sec-${s.id}-bar)` }}
        >
          <div className="flex items-center gap-3.5">
            <SecBadge section={s.id} />
            <div>
              <p className="font-semibold text-sm text-foreground leading-snug">{s.short}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.title}</p>
            </div>
          </div>
          <ChevronRightIcon className="size-4 text-muted-foreground shrink-0" />
        </button>
      ))}
    </div>
  );
}
