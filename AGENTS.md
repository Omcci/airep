# AGENTS.md

## Cursor Cloud specific instructions

### Project overview
AI SEO Studio — a TypeScript monorepo with a **NestJS 11 backend** (port 4000) and a **Vite + React 19 frontend** (port 5173). No database required; the app is stateless. AI features degrade gracefully without API keys.

### Running services

| Service | Directory | Dev command | Port |
|---------|-----------|-------------|------|
| Backend | `backend/` | `node dist/main.js` (after `tsc`) | 4000 |
| Frontend | `frontend/` | `npm run dev` | 5173 |

The frontend proxies `/api` to `http://localhost:4000` via Vite config.

### Important caveats

- **Backend compilation**: `nest start --watch` and `nest build` will fail due to pre-existing type errors in `audit.service.ts` (TS2339 on `Object.values()` return type). Workaround: run `npx tsc` (which emits JS despite errors since `noEmitOnError` defaults to false), then start with `node dist/main.js`. For hot-reload during development, you can re-run `npx tsc && node dist/main.js` after changes.
- **Missing file**: `backend/src/ai/ai-test.controller.ts` was missing from the original repo and is required by `ai.module.ts`. A stub was created in the dev setup PR.
- **Environment**: Copy `backend/.env.example` to `backend/.env`. AI API keys are optional; the app starts and provides heuristic-only analysis without them.
- **Lint**: Both backend (`npm run lint` in `backend/`) and frontend (`npm run lint` in `frontend/`) have pre-existing lint errors (mostly `@typescript-eslint/no-unsafe-*` and `@typescript-eslint/no-explicit-any`). These do not block the application from running.
- **Tests**: Backend unit tests pass with `npm test` in `backend/`. The e2e test file has a type error with the `supertest` import but unit tests work fine.

### Standard commands
See `backend/package.json` and `frontend/package.json` for all available scripts (`lint`, `test`, `build`, `dev`, etc.).
