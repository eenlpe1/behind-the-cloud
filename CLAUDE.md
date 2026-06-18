@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev         # dev server at localhost:3000
pnpm build       # production build
pnpm start       # serve production build
pnpm lint        # eslint
```

No test suite yet. Add one when logic complexity warrants it.

## Purpose

Vexamy — certification practice app. Currently ships the GCP Associate Cloud Engineer track. Source of truth for exam topics: `docs/gcp-latest-exam-guide.md` (4 sections: cloud setup ~20%, planning/implementing ~30%, operations ~30%, access/security ~20%).

## Stack

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4
- shadcn/ui (base-nova preset, base-ui primitives) — component library
- Lucide React — icons
- No external state management lib, no DB — static question bank only
- Fonts: Inter + Fraunces (display) + Geist Mono via `next/font/google`

## Architecture

App Router structure under `src/app/`. Layout wraps all pages with font vars and full-height flex body. No API routes.

### Component conventions
- All UI primitives live in `src/components/ui/` — added via `pnpm dlx shadcn@latest add <name>`
- Page-level components live in `src/components/` and use shadcn primitives
- Question/topic data lives in `src/data/` as TypeScript objects (no DB needed)
- Shared constants (section colors, mode list) live in `src/lib/reviewer.ts`

### shadcn/ui rules
- Use semantic color tokens (`bg-card`, `text-muted-foreground`) — never raw Tailwind color values
- Use `cn()` from `@/lib/utils` for conditional class merging
- Use `gap-*` for spacing, never `space-x-*` / `space-y-*`
- Icons inside `Button` use the `data-icon` prop, not manual sizing classes
- The flashcard 3D flip (`.flip-scene`, `.flip-inner`, `.flip-face`) and quiz option states (`.opt-btn`, `.opt-btn--correct/wrong/dimmed`) are kept as custom CSS in `globals.css` — no shadcn equivalent

### Route structure
Route per exam section makes sense: `/section/[id]` or `/quiz` if adding routing later.
