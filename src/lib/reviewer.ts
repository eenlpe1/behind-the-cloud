// reviewer.ts — app-wide constants not tied to a specific cert.
// Cert-specific data (sections, questions, etc.) lives in src/data/[cert]/index.ts.

export interface Mode {
  id: string;
  label: string;
  desc: string;
}

export const MODES: Mode[] = [
  { id: "quiz",      label: "Quiz",        desc: "Scenario questions per section" },
  { id: "flashcard", label: "Flashcards",  desc: "Flip-card concept review" },
  { id: "drill",     label: "Topic Drill", desc: "Deep-dive on specific subtopics" },
  { id: "exam",      label: "Exam Sim",    desc: "Full timed mock exam" },
];
