# Contributing to Behind the Cloud

## Test Vercel CI/CD

## Prerequisites

Node.js 18+ and [pnpm](https://pnpm.io).

## Getting Started

```bash
pnpm install
pnpm dev        # dev server at localhost:3000
```

## Scripts

```bash
pnpm dev      # development server at localhost:3000
pnpm build    # production build
pnpm start    # serve production build
pnpm lint     # ESLint
```

No test suite yet. Add one when logic complexity warrants it.

## Tech Stack

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4
- shadcn/ui (base-nova preset, base-ui primitives) — component library
- Lucide React — icons
- No external state management, no DB — static question bank only
- Fonts: Inter + Fraunces (display) + Geist Mono via `next/font/google`

## Project Structure

```
src/
├── app/
│   ├── [cert]/
│   │   ├── layout.tsx       # resolves cert slug, wraps in CertProvider
│   │   ├── page.tsx         # cert landing: identity, exam map, mode cards
│   │   └── [mode]/page.tsx  # quiz / flashcard / drill / exam views
│   ├── layout.tsx           # root layout: fonts, theme
│   ├── page.tsx             # home: cert picker + upcoming certs
│   ├── globals.css          # global styles, custom CSS (flip cards, opt-btn states)
│   └── tokens.css           # CSS custom properties (section colors, etc.)
├── components/
│   ├── ui/                  # shadcn/ui primitives — added via `pnpm dlx shadcn@latest add <name>`, do not hand-edit
│   ├── appShell.tsx         # nav, breadcrumb, mode routing
│   ├── certProvider.tsx     # React context that holds the resolved CertConfig
│   ├── quizMode.tsx         # scored Q&A mode
│   ├── flashcardMode.tsx    # 3D flip-card mode
│   ├── topicDrill.tsx       # section + topic selector → quiz
│   ├── examSim.tsx          # timed mock exam
│   ├── sectionPicker.tsx    # section selection card list
│   ├── secBadge.tsx         # section + topic badge
│   └── themeToggle.tsx      # light / dark toggle
├── data/
│   ├── types.ts             # CertConfig, Question, Flashcard interfaces + makeCertAccessors()
│   ├── certs.ts             # CERT_REGISTRY, ALL_CERTS, UPCOMING_CERTS
│   ├── index.ts             # re-exports
│   └── ace/                 # GCP ACE data
│       ├── index.ts         # assembles AceCert from JSON files
│       ├── questions/       # section1–4.json
│       └── flashcards/      # section1–4.json
└── lib/
    ├── reviewer.ts          # section metadata, MODES list, color constants
    └── utils.ts             # cn() helper
docs/
└── gcp-latest-exam-guide.md # source of truth for GCP ACE exam topics
```

## Architecture Notes

- App Router structure under `src/app/`. No API routes.
- `[cert]` is a dynamic route segment. All cert slugs are statically generated at build time via `generateStaticParams()`.
- `CertProvider` passes the resolved `CertConfig` down to mode components via React context.

## Component Conventions

- UI primitives live in `src/components/ui/` — add via `pnpm dlx shadcn@latest add <name>`.
- Page-level components live in `src/components/` and consume shadcn primitives.
- Question/topic data lives in `src/data/` as TypeScript objects.
- Shared constants (section colors, mode list) live in `src/lib/reviewer.ts`.

### shadcn/ui Rules

- Use semantic color tokens (`bg-card`, `text-muted-foreground`) — never raw Tailwind color values.
- Use `cn()` from `@/lib/utils` for conditional class merging.
- Use `gap-*` for spacing, never `space-x-*` / `space-y-*`.
- Icons inside `Button` use the `data-icon` prop, not manual sizing classes.
- The flashcard 3D flip (`.flip-scene`, `.flip-inner`, `.flip-face`) and quiz option states (`.opt-btn`, `.opt-btn--correct/wrong/dimmed`) are custom CSS in `globals.css` — no shadcn equivalent exists.

## Adding a New Certification

1. Create `src/data/<slug>/` with `questions/section1–N.json`, `flashcards/section1–N.json`, and an `index.ts` that assembles a `CertConfig` using `makeCertAccessors()` from `src/data/types.ts`. Model it on `src/data/ace/index.ts`.
2. Register the cert in `src/data/certs.ts` under `CERT_REGISTRY`.
3. Remove it from `UPCOMING_CERTS` in `src/data/certs.ts` if it was listed there.

### Question Schema (`src/data/types.ts`)

```ts
interface Question {
  id: string;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correct: string;       // "A" | "B" | "C" | "D"
  explanation: string;
  topic: string;
  section: number;
}
```

### Flashcard Schema

```ts
interface Flashcard {
  id: string;
  term: string;
  definition: string;
  context?: string;
  section: number;
}
```

### CertConfig Required Fields

| Field | Description |
|---|---|
| `slug` | URL segment, e.g. `"ace"` |
| `shortName` | Short label shown on cards, e.g. `"ACE"` |
| `name` | Full exam name |
| `provider` | Cloud provider, e.g. `"GCP"` |
| `guideDate` | Exam guide revision date string |
| `examDuration` | Mock exam duration in seconds |
| `totalQuestions` | Number of questions in the mock exam |
| `passScore` | Pass threshold as a percentage (e.g. `70`) |
| `sections` | Array of `Section` objects, each with `id`, `short`, `weight`, `examCount`, `title` |

`makeCertAccessors()` derives the accessor methods from the raw data — you do not implement them manually.

## Source of Truth for Exam Topics

`docs/gcp-latest-exam-guide.md` is the canonical reference for GCP ACE question coverage. When adding or updating questions, align topics and subtopics to that guide.
