# Modern.js App

## Project Structure

The project follows a modular architecture for better code organization and maintenance:

```
core-ui-modernjs/
├── src/                   # Source code directory
│   ├── components/        # Reusable UI components
│   │   ├── providers/     # Context providers
│   │   ├── reports/       # Report-specific components
│   │   ├── test-statistics/ # Test statistics components
│   │   └── ui/            # Base UI components (buttons, inputs, etc.)
│   ├── hooks/             # Custom React hooks
│   │   └── api/           # REST API access hooks
│   ├── lib/               # Utility libraries
│   │   ├── api-client.ts  # API client configuration
│   │   ├── pagination-utils.ts # Pagination helper utilities  
│   │   ├── test-statistics-utils.ts # Test statistics utilities
│   │   └── utils.ts       # General utility functions
│   ├── routes/            # Application routes using Modern.js routing
│   │   ├── layout.tsx     # Root layout component
│   │   ├── page.tsx       # Home page component
│   │   └── reports/       # Report-related routes
│   ├── styles/            # Global styles
│   │   └── globals.css    # Global CSS with Tailwind directives
│   ├── modern-app-env.d.ts # Type definitions for Modern.js
│   └── modern.runtime.ts  # Runtime configuration
├── biome.json             # Biome linter and formatter configuration
├── components.json        # shadcn/ui components configuration
├── modern.config.ts       # Modern.js framework configuration
├── package.json           # Package dependencies and scripts
├── tailwind.config.ts     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## Setup

Install the dependencies:

```bash
pnpm install
```

## Get Started

Start the dev server:

```bash
pnpm dev
```

Enable optional features or add a new entry:

```bash
pnpm new
```

Build the app for production:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm serve
```

## Key Files and Directories

- **modern.config.ts**: Configures the Modern.js application settings, including bundlers, plugins, and environment variables
- **tailwind.config.ts**: Defines the Tailwind CSS theme configuration with custom colors, spacing, and other design tokens
- **biome.json**: Sets up code quality rules and formatting preferences
- **components.json**: Configures shadcn/ui component settings and theme preferences
- **src/components/ui/**: Contains reusable UI components built with shadcn/ui and Tailwind
- **src/hooks/api/**: Custom React hooks for interacting with the REST API endpoints
- **src/lib/api-client.ts**: Sets up the API client for communicating with the Total Report backend services
- **src/routes/**: Contains the application's page components and routing structure
- **src/styles/globals.css**: Defines global styling and includes Tailwind directives

## Application Architecture

- **Routing**: Uses Modern.js file-based routing system with layouts and pages
- **State Management**: Leverages React Query for server state management
- **API Integration**: Implements type-safe API client with ts-rest and custom React hooks for each endpoint
- **Component Design**: Follows a composable component architecture with shadcn/ui
- **Styling**: Utilizes utility-first approach with Tailwind CSS

## Integration with Total Report

This UI application is part of the Total Report monorepo and integrates with:

- **@total-report/core-contract**: For type-safe API contracts
- **Backend Services**: Connects to core-service for data retrieval and manipulation
- **Shared Types**: Utilizes shared type definitions across the monorepo

For more information, see the [Modern.js documentation](https://modernjs.dev/en).
