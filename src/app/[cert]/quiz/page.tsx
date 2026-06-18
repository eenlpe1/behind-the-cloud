"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import AppShell from "@/components/appShell";
import SectionPicker from "@/components/sectionPicker";
import QuizMode from "@/components/quizMode";
import Spin from "@/components/spin";

function QuizContent() {
  const router = useRouter();
  const params = useParams<{ cert: string }>();
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section");
  const section = sectionParam ? parseInt(sectionParam, 10) : null;

  if (!section) {
    return (
      <SectionPicker
        onSelect={(s) => router.push(`/${params.cert}/quiz?section=${s}`)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => router.push(`/${params.cert}/quiz`)}
        className="self-start text-sm text-primary hover:text-primary/80 transition-colors bg-transparent border-none cursor-pointer p-0"
      >
        ← Change section
      </button>
      <QuizMode section={section} topic={null} />
    </div>
  );
}

export default function QuizPage() {
  return (
    <AppShell>
      <Suspense fallback={<Spin msg="Loading…" />}>
        <QuizContent />
      </Suspense>
    </AppShell>
  );
}
