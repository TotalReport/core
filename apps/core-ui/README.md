# Modern.js App

## Project Structure

The project follows a modular architecture for better code organization and maintenance:

```
core-ui/
├── src/                   # Source code directory
│   ├── components/        # Reusable UI components
│   │   ├── providers/     # Context providers
│   │   ├── reports/       # Report-specific components
│   │   ├── test-statistics/ # Test statistics components
│   │   └── ui/            # Base UI components (buttons, inputs, etc.)
│   ├── containers/        # Container components (data-fetching + composition)
│   │   └── test-details/   # Containers that compose presentation components and use API hooks (e.g., test-details, status)
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

