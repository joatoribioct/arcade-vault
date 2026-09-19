# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Arcade Vault — a platform for playing games online and competing for the highest score (per README.md). The codebase is currently a fresh `create-next-app` scaffold: no game, scoring, or vault features have been implemented yet (`app/` only contains the default layout/page/globals.css).

This project uses **Next.js 16.3.5** (App Router) with **React 19.2.8** — both newer than your training data. Per AGENTS.md, consult `node_modules/next/dist/docs/` for current APIs and conventions before implementing anything Next.js-related; do not rely on remembered Next.js behavior.

## Commands

- `npm run dev` — start the dev server (this is also what regenerates the AGENTS.md breaking-changes block).
- `npm run build` — production build.
- `npm run start` — run the production build.
- `npm run lint` — ESLint via the flat config in `eslint.config.mjs` (extends `eslint-config-next`'s core-web-vitals and typescript rule sets).

There is no test runner configured yet — do not assume Jest/Vitest/etc. is present.

## Architecture notes

- **Routing**: App Router only (`app/` directory). `app/layout.tsx` is the root layout; `app/page.tsx` is the home route.
- **Styling**: Tailwind CSS v4, wired through PostCSS (`@tailwindcss/postcss` in `postcss.config.mjs`) rather than a `tailwind.config.*` file. Theme tokens (colors, fonts) are declared inline in `app/globals.css` via `@theme inline`, with dark-mode overrides through `prefers-color-scheme`.
- **Fonts**: Geist Sans/Mono are loaded via `next/font/google` in `app/layout.tsx` and exposed as CSS variables consumed by the Tailwind theme.
- **Path alias**: `@/*` maps to the repo root (see `tsconfig.json`).
- **TypeScript**: strict mode is on.

## Workflow

Per README.md, this project follows a **Spec Driven Design** workflow using `/spec` and `/spec-impl`, based on the practices at https://github.com/Klerith/fernando-skills, installed via `npx skills@latest add Klerith/fernando-skills`. Those skills are not yet installed in this checkout (no `.claude/skills` present) — if spec/spec-impl commands are invoked and unavailable, the user may need to run that install command first.
