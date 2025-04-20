# Total Report Project Structure

This project is organized as a monorepo using pnpm workspaces and Turborepo for managing multiple packages and applications.

## Root Directory

- `dev-db.docker-compose.yml`: Docker Compose configuration for development databases
- `dev.env`: Environment variables for development
- `Dockerfile`: Multi-stage Docker configuration for containerizing services
- `package.json`: Root package configuration with scripts for development and CI
- `pnpm-lock.yaml` & `pnpm-workspace.yaml`: pnpm workspace configuration
- `turbo.json`: Turborepo configuration

## Applications (`apps/`)

### Core Schema Migrator (`apps/core-schema-migrator/`)
A database migration utility that handles schema migrations using SQL files.
- Contains migration files in `migrations/` directory
- Uses Drizzle ORM for database operations
- Includes seed data functionality

### Core Service (`apps/core-service/`)
Backend API service for the application.
- Main entry point in `src/index.ts`
- Database connection and models in `src/db/`
- API routes defined in `src/routes/`
- Error handling in `src/errors/`
- Input validation in `src/validations/`

### Core UI (`apps/core-ui/`)
*This module is outdated and will be replaced by `apps/core-ui-astrojs/`*
Frontend Next.js application.
- Components, pages, and application logic
- Tailwind CSS for styling
- Modern React application structure

### Core UI AstroJS (`apps/core-ui-astrojs/`)
Frontend using Astro framework.
- Pages and components for rendering UI
- Static site generation capabilities

## Packages (`packages/`)

### Core Contract (`packages/core-contract/`)
Defines the REST API contract for the application domain.
- Test entities, steps, and contexts
- Report and launch definitions
- Shared types across the application

### Core Entities Generator (`packages/core-entities-generator/`)
Code generation utilities for creating domain entities.
- Generators for test steps, contexts, and reports
- Utilities for consistent entity creation

### Core Schema (`packages/core-schema/`)
Database schema definitions.
- Shared constants and schema types
- Used by both the migrator and service applications

### TypeScript Config (`packages/typescript-config/`)
Shared TypeScript configurations.
- Base configurations for consistent TypeScript settings across packages

## Tests (`test/`)

Comprehensive test suite for the application.
- Test setup with hooks and environment configuration
- Integration and unit tests for components
- Docker Compose configuration for test environments
- Client utilities and test helpers

## Development

The project uses Docker for development and testing environments, with scripts provided in the root package.json:

- `dev:setup`: Start development databases
- `dev:teardown`: Stop development databases
- `dockerize:core-schema-migrator` & `dockerize:core-service`: Build Docker images
- `test`: Run tests across the monorepo

## Requirements

- Node.js 18+
- pnpm 9.5.0+
- Docker (for development and testing environments)
