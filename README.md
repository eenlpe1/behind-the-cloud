# Vexamy

Pass your next certification with confidence. Vexamy turns official exam guides into scenario-based practice questions, instant feedback, and realistic mock exams, one track at a time.

Currently ships the **Google Cloud Associate Cloud Engineer** track, aligned to the June 30, 2025 exam guide.

## Features

- **Quiz Mode** — scenario-based questions per exam section with instant answer feedback and score tracking
- **Flashcard Mode** — 3D flip-card concept review for terms and definitions
- **Topic Drill** — deep-dive on specific subtopics within each section
- **Exam Sim** — full 50-question timed mock exam (2 hours) with section-weighted questions, jump-to-question navigation, and a detailed results breakdown

## GCP ACE Exam Sections

| Section | Topic | Weight |
|---|---|---|
| §1 | Setting up a cloud solution environment | ~20% |
| §2 | Planning and implementing a cloud solution | ~30% |
| §3 | Deploying and implementing a cloud solution | ~30% |
| §4 | Ensuring successful operation / access & security | ~20% |

## Tech Stack

- [Next.js 16](https://nextjs.org) App Router + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) (base-nova preset, base-ui primitives)
- [Lucide React](https://lucide.dev) icons
- No database — question bank is a static TypeScript data file

## Getting Started

**Prerequisites:** Node.js 18+ and [pnpm](https://pnpm.io)

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/               # Next.js App Router (layout, page, globals.css)
├── components/
│   ├── ui/            # shadcn/ui primitives (auto-generated, do not edit)
│   ├── appShell.tsx         # nav, breadcrumb, mode routing
│   ├── quizMode.tsx         # scored Q&A mode
│   ├── flashcardMode.tsx    # 3D flip-card mode
│   ├── topicDrill.tsx       # section + topic selector → quiz
│   ├── examSim.tsx          # timed 50-question mock exam
│   ├── sectionPicker.tsx    # section selection card list
│   └── secBadge.tsx         # section + topic badge
├── data/              # static question & flashcard bank
└── lib/
    ├── reviewer.ts    # section metadata, mode list, color constants
    └── utils.ts       # cn() helper
docs/
└── gcp-latest-exam-guide.md  # source of truth for exam topics
```

## Available Scripts

```bash
pnpm dev      # development server at localhost:3000
pnpm build    # production build
pnpm start    # serve production build
pnpm lint     # ESLint
```

## Disclaimer

Question content is AI-generated. Always verify answers against the [official Google Cloud documentation](https://cloud.google.com/docs) and the [ACE exam guide](https://cloud.google.com/certification/guides/cloud-engineer).
