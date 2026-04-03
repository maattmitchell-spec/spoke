# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### Spoke (Mobile App) — `artifacts/spoke`
- **Type**: Expo (React Native)
- **Preview path**: `/`
- **Purpose**: Mobile app for curated outdoor adventures for remote workers
- **Brand**: Minimal bike wheel logo, forest green + warm earth palette, DM Sans typeface
- **Screens**:
  - Explore tab: Event feed with type filters (rides, runs, hikes, meetups)
  - Schedule tab: User's joined events
  - Community tab: Member directory
  - Profile tab: User stats, badges, settings
  - Event Detail: Full event info with join/leave action
- **State**: AsyncStorage-backed EventsContext for join state persistence
- **Font**: DM Sans (400, 500, 600, 700) via `@expo-google-fonts/dm-sans`
- **Colors**: Dark forest green primary (#2D6A4F light / #52B788 dark), warm earth accent (#E07B39), warm off-white background

### API Server — `artifacts/api-server`
- **Type**: Express 5 API
- **Preview path**: `/api`

### Canvas (Mockup Sandbox) — `artifacts/mockup-sandbox`
- **Type**: Design / Vite
- **Preview path**: `/__mockup`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
