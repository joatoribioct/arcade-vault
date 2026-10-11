# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Arcade Vault — a platform for playing games online and competing for the highest score (per README.md). The UI is in Spanish. Currently the **visual MVP** is implemented with mock data: all screens exist, but there is no real game logic, backend, or real authentication.

This project uses **Next.js 16.3.5** (App Router) with **React 19.2.8** — both newer than your training data. Per AGENTS.md, consult `node_modules/next/dist/docs/` for current APIs and conventions before implementing anything Next.js-related; do not rely on remembered Next.js behavior (e.g. `params` is a `Promise` in pages).

## Commands

- `npm run dev` — dev server (also regenerates the AGENTS.md breaking-changes block).
- `npm run build` / `npm run start` — production build / run it.
- `npm run lint` — ESLint (flat config `eslint.config.mjs`, extends `eslint-config-next` core-web-vitals + typescript; ignores `references/**`).
- Prettier is installed (`.prettierrc.json`: semicolons, double quotes, trailing commas `all`; ignores in `.prettierignore`). There is no `format` npm script — a hook formats files automatically (see Hooks).
- There is no test runner configured — do not assume Jest/Vitest/etc. is present.

## Routes & features (implemented)

| Route                | File                             | Notes                                                                                                             |
| -------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `/`                  | `app/page.tsx`                   | Landing: hero, features, game rail (first 6 games), stats, live activity ticker, pricing/FAQ, final CTA (spec 02) |
| `/biblioteca`        | `app/biblioteca/page.tsx`        | Game library with search and filtering                                                                            |
| `/juegos/[id]`       | `app/juegos/[id]/page.tsx`       | Async server component; `notFound()` if the game is missing; cover, tags, stats, top-10 scores                    |
| `/juegos/[id]/jugar` | `app/juegos/[id]/jugar/page.tsx` | Player using `app/components/GamePlayer.tsx`                                                                      |
| `/auth`              | `app/auth/page.tsx`              | Mock login / sign-up / guest                                                                                      |
| `/salon`             | `app/salon/page.tsx`             | Hall of Fame (scores + users)                                                                                     |

Shared pieces:

- `app/components/Nav.tsx` (navigation, rendered in the root layout), `GameCard.tsx`, `GamePlayer.tsx`.
- `app/providers.tsx` — `UserProvider` / `useUser()` (`user`, `login`, `logout`). Session is mock, stored in `localStorage` key `av_user` through `useSyncExternalStore`; no credentials are validated.
- `GamePlayer` simulates a match (`setInterval` adds random points, pause/game-over/restart) and saves the final score to `localStorage` key `av_scores`. No real game logic exists.
- `app/data/` — `types.ts` (`Game`, `ScoreRow`, `User`), `games.ts` (`GAMES`), `scores.ts` (seeded pseudo-random score generator, e.g. `seededScores(seed, n)`). Meant to be swapped for a real data source later.

## Architecture notes

- **Routing**: App Router only (`app/`). Root layout `app/layout.tsx` wraps pages in `UserProvider` + `Nav`.
- **Styling**: Tailwind CSS v4 via PostCSS (`@tailwindcss/postcss`), no `tailwind.config.*`. The retro arcade look (scanlines, neon glow, CRT effect, pixel typography) lives in `app/globals.css`, ported from `references/resources/templates/styles.css`.
- **Fonts**: Press Start 2P, JetBrains Mono and Courier Prime via `next/font/google` in `app/layout.tsx` (exposed as `--font-press-start-2p`, `--font-jetbrains-mono`, `--font-courier-prime`). Geist was replaced.
- **Path alias**: `@/*` maps to the repo root (`tsconfig.json`).
- **TypeScript**: strict mode.
- **`references/`**: static HTML/JSX design templates (Biblioteca, Detalle, Reproductor, Auth, Salón, `home-about/home.jsx`) used as the visual source of truth. Not app source; excluded from lint/format hook.
- **`demos/Demo.tsx`**: scratch demo component, not part of the app.

## Workflow (Spec Driven Design)

Per README.md the project uses `/spec` and `/spec-impl` from https://github.com/Klerith/fernando-skills (installed with `npx skills@latest add Klerith/fernando-skills`; locked in `skills-lock.json`).

- Specs live in `specs/NN-slug.md`; config in `specs/.spec-config.yml` (`AutoCreateBranch: true` → `/spec-impl` creates the `spec-NN-slug` branch without asking).
- Existing specs: `01-mvp-pantallas-visuales` (Aprobado/implemented), `02-pagina-inicio` (Aprobado/implemented; depends on 01).
- Branch/PR convention: feature branches like `spec-02-pagina-inicio`, `01-config`, merged through numbered PRs on GitHub (`joatoribioct`).

## Skills (installed in `.claude/skills`, mirrored in `.agents/skills`)

- `spec` — write a spec from `template.md` into `specs/`.
- `spec-impl` — implement an approved spec.
- `frontend-design` — **always use `/frontend-design` to design the frontend and user interfaces.**

## Agents (`.claude/agents`)

- `game-planner` — plans and decides which new game fits the platform (scores candidates against the catalog in `app/data/games.ts`). Keeps a persistent project memory of past suggestions and their status (sugerido/aceptado/descartado/implementado) in `.claude/agent-memory/game-planner/MEMORY.md`.

## Hooks

`.claude/settings.json` registers a `PostToolUse` hook on `Write|Edit` that runs `.claude/hooks/format-and-lint.mjs`: Prettier (`--write`) and then ESLint on the edited file (skips `node_modules`, `.next`, `out`, `build`, `references` and files outside the project). `.claude/settings.local.json` pre-allows `npx tsc`, `npx next`, `npm run`, `npm i` and `git push`.
