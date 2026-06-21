# AI agent guide — Total Report

Proof-of-concept test reporting platform (monorepo). Read this before exploring the tree.

## Stack

| Layer | Location | Tech |
|-------|----------|------|
| API contract | `packages/core-contract` | ts-rest + Zod |
| DB schema | `packages/core-schema` | Drizzle ORM (PostgreSQL) |
| API server | `apps/core-service` | Express + ts-rest |
| Migrations | `apps/core-schema-migrator` | drizzle-kit |
| UI | `apps/core-ui` | Modern.js, React 18, TanStack Query, Tailwind, Radix |
| Integration tests | `test/` | Mocha + earl + ts-rest client |
| Test data | `packages/core-entities-generator` | API-based factories |

## Data flow (contract-first)

```
core-schema (tables) → core-contract (Zod + ts-rest routes) → core-service (routes + DAOs) → test/ + core-ui
```

Never implement API shapes only in `core-service` or tests — define them in `core-contract` first.

## Domain model (short)

- **Launch** — a test run session; contains test entities.
- **Test entity** — `beforeTest` | `test` | `afterTest`; has title, timestamps, status, correlation/argument hashes.
- **Test step** — sub-steps within a test entity.
- **Status / status group** — predefined outcome taxonomy (seeded).
- **User** — email/password auth; must be active **and** email-verified to call protected APIs.

Business context: `docs/product/` (priorities) and `docs/features/` (domain model).

## Commands

```shell
pnpm install          # from repo root
pnpm dev              # DB (Docker) + migrator + services
pnpm build
pnpm test             # Docker test stack + integration tests
```

Per-package: `pnpm --filter @total-report/core-service dev`, etc.

## Where to change what

| Task | Start here |
|------|------------|
| New API endpoint | `packages/core-contract/src/{domain}.ts` → `contract.ts` → `apps/core-service/src/routes/` + `db/` |
| DB table/column | `packages/core-schema/src/schema.ts` → `apps/core-schema-migrator` (`pnpm generate` / `migrate`) |
| Auth / access rules | `apps/core-service/src/middleware/auth.ts`, `utils/user-access.ts` |
| UI data fetching | `apps/core-ui/src/hooks/api/` (wraps `src/lib/api-client.ts`) |
| UI pages | `apps/core-ui/src/routes/` |
| UI components | `apps/core-ui/src/components/ui/` (shadcn-style), `src/containers/` (feature blocks) |
| Integration test | `test/tests/{domain}/` — use `test/tools/auth.ts` + `core-entities-generator` |
| New test factory | `packages/core-entities-generator/src/` |

## Cursor rules (auto-loaded by glob)

- `.cursor/rules/architecture.mdc` — always on; monorepo map and workflows
- `.cursor/rules/core-contract.mdc` — contract / Zod changes
- `.cursor/rules/core-service.mdc` — backend routes and DAOs
- `.cursor/rules/core-ui.mdc` — frontend
- `.cursor/rules/core-schema.mdc` — schema and migrations
- `.cursor/rules/test-conventions.mdc` — `test/**`

## Do not index or edit

- `**/dist/**`, `**/node_modules/**`, `**/.turbo/**`, `coverage/`
- Generated OpenAPI at runtime: `GET /openapi`
- Prefer source over compiled output in `apps/*/dist` and `packages/*/dist`

## Conventions

- ESM throughout (`"type": "module"`); imports use `.js` extensions in compiled packages.
- Package scope: `@total-report/*`.
- Protected routes require `Authorization: Bearer <accessToken>`; public: `/healthcheck`, `/openapi`, `/v1/auth/*`.
- Tests assert via `@total-report/core-contract` types/clients, not service internals.
- Never commit without explicit user approval.
