# CLAUDE.md

See [CONTRIBUTING.md](CONTRIBUTING.md) for architecture, project structure, component conventions, and how to add new certifications.

## Commands

```bash
pnpm dev         # dev server at localhost:3000
pnpm build       # production build
pnpm start       # serve production build
pnpm lint        # eslint
```

## Before writing any code

- Read `CONTRIBUTING.md` for architecture, project structure, and conventions.
- Read `src/data/types.ts` before touching any data — it defines `CertConfig`, `Question`, `Flashcard`, and `makeCertAccessors()`.
- Read `src/data/certs.ts` before touching cert registration — it holds `CERT_REGISTRY`, `ALL_CERTS`, and `UPCOMING_CERTS`.

## Hard rules

- **No raw Tailwind color values.** Use semantic tokens only: `bg-card`, `text-muted-foreground`, `border-border`, etc.
- **Never hand-edit `src/components/ui/`.** These are managed by shadcn. Add new primitives with `pnpm dlx shadcn@latest add <name>`.
- **No `space-x-*` / `space-y-*`.** Use `gap-*` for all spacing.
- **Always use `cn()`** from `@/lib/utils` for conditional class merging.
- **No external state management libraries and no database.** All data is static JSON.

## Architecture patterns to follow

- New certifications go in `src/data/<slug>/` with JSON files + an `index.ts` that calls `makeCertAccessors()`. Register in `CERT_REGISTRY`. See `src/data/ace/` as the reference implementation.
- Section colors come from CSS variables (`--sec-1-bar`, `--sec-2-bg`, etc.) defined in `tokens.css`. Do not hardcode colors for sections.
- Dynamic route is `[cert]`. The slug resolves in `src/app/[cert]/layout.tsx` via `getCert(slug)` and is passed to children through `CertProvider`. Mode components access cert data via the `CertProvider` context — not via props or direct imports.
- The home page uses ISR (`revalidate = 3600`) for the GitHub star count. Do not remove or change this.

## Source of truth

- GCP ACE exam topics → `docs/gcp-latest-exam-guide.md`
- Developer setup and conventions → `CONTRIBUTING.md`
- User-facing product info → `README.md`
