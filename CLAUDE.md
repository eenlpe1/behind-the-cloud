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

GCP Associate Cloud Engineer certification practice/review app. Source of truth for exam topics: `docs/gcp-latest-exam-guide.md` (4 sections: cloud setup ~20%, planning/implementing ~30%, operations ~30%, access/security ~20%).

## Stack

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4
- No UI library, no state management lib, no DB — blank slate
- Fonts: Geist Sans + Geist Mono via `next/font/google`

## Architecture

App Router structure under `src/app/`. Layout wraps all pages with font vars and full-height flex body. No API routes yet.

When building the reviewer: question/topic data should live in `src/data/` as TypeScript objects (no DB needed for a static question bank). Route per exam section makes sense: `/section/[id]` or `/quiz`.
