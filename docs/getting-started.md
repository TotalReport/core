# Getting started (early adopters)

> **Status**: Draft — complete after Docker Compose + JUnit adapter ship.  
> Target reader: QA lead installing for workplace pilot.

## Prerequisites

- Docker & Docker Compose
- JUnit-based CI (Maven/Gradle) for first integration
- PostgreSQL included via Compose (no separate DB install)

## Quick start

```shell
# From repo root (once publishable image/compose exists)
docker compose up -d
```

Open UI: `http://localhost:<ui-port>`  
API: `http://localhost:<api-port>` (see `CORE_SERVICE_PORT` in env)

## First user

1. Register an account.
2. Verify email (pilot may allow manual DB flag — document actual flow).
3. Log in — protected routes require verified active user.

## First launch from JUnit

<!-- TODO: replace when JUnit adapter exists -->

1. Run tests in CI producing JUnit XML.
2. Run Total Report JUnit adapter pointing at API URL + project ID.
3. Open **Launches** in UI — confirm new launch appears.

## Investigate test history

1. Open a launch → failed test.
2. Note **correlation ID** on test detail.
3. Open **History** — see status across prior launches.

## Configuration

| Variable | Purpose |
|----------|---------|
| `CORE_SERVICE_PORT` | API port |
| `AUTH_SECRET` | JWT signing — **change in production** |
| `DB_URL` | PostgreSQL connection |

## Troubleshooting

- **401/403**: user not verified or inactive — see auth docs in `AGENTS.md`.
- **Empty launches**: check adapter logs and API URL.
- **Correlation history empty**: prior launches must use same correlation ID.

## Next

- Product context: [`product/brief.md`](./product/brief.md)
- MVP scope: [`product/mvp-scope.md`](./product/mvp-scope.md)
