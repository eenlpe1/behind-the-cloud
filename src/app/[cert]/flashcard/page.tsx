"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import AppShell from "@/components/appShell";
import SectionPicker from "@/components/sectionPicker";
import FlashcardMode from "@/components/flashcardMode";
import Spin from "@/components/spin";

function FlashcardContent() {
  const router = useRouter();
  const params = useParams<{ cert: string }>();
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section");
  const section = sectionParam ? parseInt(sectionParam, 10) : null;

  if (!section) {
    return (
      <SectionPicker
        onSelect={(s) => router.push(`/${params.cert}/flashcard?section=${s}`)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => router.push(`/${params.cert}/flashcard`)}
        className="self-start text-sm text-primary hover:text-primary/80 transition-colors bg-transparent border-none cursor-pointer p-0"
      >
        ← Change section
      </button>
      <FlashcardMode section={section} topic={null} />
    </div>
  );
}

export default function FlashcardPage() {
  return (
    <AppShell>
      <Suspense fallback={<Spin msg="Loading…" />}>
        <FlashcardContent />
      </Suspense>
    </AppShell>
  );
}
