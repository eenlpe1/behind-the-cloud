"use client";
import { Spinner } from "@/components/ui/spinner";

export default function Spin({ msg = "Generating…" }: { msg?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <Spinner className="size-8" />
      <p className="text-muted-foreground text-sm">{msg}</p>
    </div>
  );
}
