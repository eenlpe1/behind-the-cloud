# GCP ACE Practice Exam

A self-study web app for the [Google Cloud Associate Cloud Engineer](https://cloud.google.com/learn/certification/cloud-engineer) certification. Practice questions and topic review organized by the official exam guide.

## Exam Sections

| Section | Weight |
|---|---|
| Setting up a cloud solution environment | ~20% |
| Planning and implementing a cloud solution | ~30% |
| Deploying and implementing a cloud solution | ~30% |
| Ensuring successful operation of a cloud solution | ~20% |

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- [Next.js](https://nextjs.org/) 16 (App Router) + React 19
- TypeScript
- Tailwind CSS v4
- No database — question bank is static TypeScript data in `src/data/`

## Project Structure

```
src/
  app/        # Next.js App Router pages and layouts
  components/ # Shared UI components
  data/       # Question bank and topic data (TypeScript objects)
  lib/        # Shared utilities
docs/
  gcp-latest-exam-guide.md  # Official exam guide (source of truth for topics)
```

## Scripts

```bash
pnpm dev    # Start dev server at localhost:3000
pnpm build  # Production build
pnpm start  # Serve production build
pnpm lint   # Run ESLint
```

## Contributing

Questions and corrections welcome — open an issue or PR.
