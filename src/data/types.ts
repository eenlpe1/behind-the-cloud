export interface Question {
  id: string;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correct: string;
  explanation: string;
  topic: string;
  section: number;
}

export interface Flashcard {
  id: string;
  term: string;
  definition: string;
  context?: string;
  section: number;
}

export interface Section {
  id: number;
  short: string;
  weight: string;
  examCount: number;
  title: string;
}

export interface CertConfig {
  slug: string;
  name: string;
  shortName: string;
  provider: string;
  guideDate: string;
  examDuration: number;   // seconds
  totalQuestions: number;
  passScore: number;      // percentage, e.g. 70
  sections: Section[];
  allQuestions: Question[];
  allFlashcards: Flashcard[];
  questionsBySection: Record<number, Question[]>;
  flashcardsBySection: Record<number, Flashcard[]>;
  getRandomQuestion: (sectionId: number, topic: string | null, excludeId: string | null) => Question | null;
  getRandomFlashcard: (sectionId: number, topic: string | null, excludeId: string | null) => Flashcard | null;
  buildMockExam: () => Question[];
  getTopicsForSection: (sectionId: number) => string[];
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Build cert-generic data accessors from raw JSON data. */
export function makeCertAccessors(
  sections: Section[],
  questionsBySection: Record<number, Question[]>,
  flashcardsBySection: Record<number, Flashcard[]>,
) {
  return {
    getRandomQuestion(sectionId: number, topic: string | null, excludeId: string | null): Question | null {
      let pool = questionsBySection[sectionId] ?? [];
      if (topic) pool = pool.filter(q => q.topic === topic);
      if (excludeId && pool.length > 1) pool = pool.filter(q => q.id !== excludeId);
      if (!pool.length) return null;
      return pool[Math.floor(Math.random() * pool.length)];
    },
    getRandomFlashcard(sectionId: number, topic: string | null, excludeId: string | null): Flashcard | null {
      let pool = flashcardsBySection[sectionId] ?? [];
      if (topic) pool = pool.filter(f => f.term === topic);
      if (excludeId && pool.length > 1) pool = pool.filter(f => f.id !== excludeId);
      if (!pool.length) return null;
      return pool[Math.floor(Math.random() * pool.length)];
    },
    buildMockExam(): Question[] {
      const picks = sections.flatMap(s => {
        const pool = shuffle(questionsBySection[s.id] ?? []);
        return pool.slice(0, Math.min(s.examCount, pool.length));
      });
      return shuffle(picks);
    },
    getTopicsForSection(sectionId: number): string[] {
      const pool = questionsBySection[sectionId] ?? [];
      return [...new Set(pool.map(q => q.topic))];
    },
  };
}
