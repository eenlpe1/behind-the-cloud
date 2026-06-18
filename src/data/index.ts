// Re-export everything from the new structure for any legacy imports.
export type { Question, Flashcard, Section, CertConfig } from "@/data/types";
export { shuffle, makeCertAccessors } from "@/data/types";
export { AceCert } from "@/data/ace";
export { getCert, ALL_CERTS, CERT_REGISTRY, UPCOMING_CERTS } from "@/data/certs";

// Legacy flat exports (ACE data) — used by components that haven't migrated to useCert() yet.
export {
  AceCert as default,
} from "@/data/ace";

import { AceCert } from "@/data/ace";
export const SECTIONS        = AceCert.sections;
export const allQuestions    = AceCert.allQuestions;
export const allFlashcards   = AceCert.allFlashcards;
export const questionsBySection  = AceCert.questionsBySection;
export const flashcardsBySection = AceCert.flashcardsBySection;
export const getRandomQuestion   = AceCert.getRandomQuestion.bind(AceCert);
export const getRandomFlashcard  = AceCert.getRandomFlashcard.bind(AceCert);
export const buildMockExam       = AceCert.buildMockExam.bind(AceCert);
export const getTopicsForSection = AceCert.getTopicsForSection.bind(AceCert);
