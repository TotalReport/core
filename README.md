# Total Report — Test Reporting Platform (Proof of Concept)

Status: Proof of concept — not production ready

Total Report is a modular test reporting platform designed to generate, aggregate, and present test reports across projects, products, and organizations. 

## Repository layout

Top-level folders of note:

- `apps/`
  - `core-ui/` — Frontend application and UI components used to visualize and interact with reports.
  - `core-service/` — Backend API server providing health checks, routes, and business logic for generating and serving reports.
  - `core-schema-migrator/` — Database migrations and seeding utilities for the platform's schema management.

- `packages/`
  - `core-contract/` — Shared test reporting contracts, types, utilities and helpers used by services and tests.
  - `core-entities-generator/` — Utilities to generate test entities and report payloads for tests and demos.
  - `core-schema/` — Schema definitions and related utilities.

- `tools/`, `utils/`, `test/`, `coverage/` — Supporting scripts, test harnesses, and coverage artifacts.

Each app and package includes its own `package.json` and TypeScript configuration when applicable. The repository uses a monorepo structure to share code and simplify local development.

## Project concept and motivation

The central idea behind this project is to provide a flexible test reporting tool that can be adapted to many teams and products by combining a small core with an ecosystem of plugins and adapters. The platform's goals include:

- Universal fit: Provide a core reporting model and plugin surface that accommodates many test frameworks, CI providers, and reporting policies.
- Pluggable presentation: Allow teams to change how reports are displayed, enriched, or transformed without changing the core engine.
- Reusable building blocks: Expose shared contracts, schema, and generators to make it easy to author integrations and consistent reports across projects.

Think of the platform as a composable reporting workspace where organizations can assemble the exact feature set they need from plugins and shared packages.

## Getting started (for developers)

Prerequisites

- Node.js (LTS) and a PNPM package manager.
- Docker and Docker Compose when running services that depend on a local database (migration tooling is included).

Local development

1. Install dependencies from the repository root:
```shell
pnpm install
```

2. Run the app:
```shell
pnpm dev
```

Note: `pnpm dev` will start a local PostgreSQL instance using Docker Compose.

Running tests

To run tests use:
```shell
pnpm test
```

## Limitations and roadmap

This is an early proof of concept. Known limitations include incomplete production hardening, partial test coverage, and early-stage plugin ergonomics. Future work may include:

- Stabilizing the contracts and plugin API.
- Improving documentation and adding examples for common adapters.
- Adding CI integration templates and deployment guides.
