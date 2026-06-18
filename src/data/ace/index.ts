import q1 from "./questions/section1.json";
import q2 from "./questions/section2.json";
import q3 from "./questions/section3.json";
import q4 from "./questions/section4.json";
import f1 from "./flashcards/section1.json";
import f2 from "./flashcards/section2.json";
import f3 from "./flashcards/section3.json";
import f4 from "./flashcards/section4.json";

import type { CertConfig, Question, Flashcard, Section } from "@/data/types";
import { makeCertAccessors } from "@/data/types";

const sections: Section[] = [
  { id: 1, short: "Cloud Setup",            weight: "~20%", examCount: 10, title: "Setting up a cloud solution environment" },
  { id: 2, short: "Planning & Implementing", weight: "~30%", examCount: 15, title: "Planning and implementing a cloud solution" },
  { id: 3, short: "Operations",             weight: "~30%", examCount: 15, title: "Ensuring successful operation of a cloud solution" },
  { id: 4, short: "Access & Security",      weight: "~20%", examCount: 10, title: "Configuring access and security" },
];

const questionsBySection: Record<number, Question[]> = {
  1: q1 as Question[],
  2: q2 as Question[],
  3: q3 as Question[],
  4: q4 as Question[],
};

const flashcardsBySection: Record<number, Flashcard[]> = {
  1: f1 as Flashcard[],
  2: f2 as Flashcard[],
  3: f3 as Flashcard[],
  4: f4 as Flashcard[],
};

const allQuestions: Question[] = [...q1, ...q2, ...q3, ...q4] as Question[];
const allFlashcards: Flashcard[] = [...f1, ...f2, ...f3, ...f4] as Flashcard[];

export const AceCert: CertConfig = {
  slug: "ace",
  name: "Associate Cloud Engineer",
  shortName: "ACE",
  provider: "GCP",
  guideDate: "June 2025",
  examDuration: 7200,
  totalQuestions: 50,
  passScore: 70,
  sections,
  allQuestions,
  allFlashcards,
  questionsBySection,
  flashcardsBySection,
  ...makeCertAccessors(sections, questionsBySection, flashcardsBySection),
};
