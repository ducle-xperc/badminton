# XPERC Badminton Vietnam Arena

## Project Summary
Tournament management web application for badminton competitions.

## Tech Stack
- Next.js 16 with App Router (RSC by default)
- React 19
- TypeScript (strict mode, `@/*` path alias)
- Tailwind CSS v4 (`@import "tailwindcss"` syntax)
- Supabase (auth + database)
- Bun package manager
- Zod + React Hook Form for validation
- UI: Radix UI, CVA, Lucide icons

## Key Patterns

### Server Actions
All mutations in `src/lib/actions/`. Use `createClient` from `@/lib/supabase/server`.

### Supabase Clients
- Server: `import { createClient } from "@/lib/supabase/server"`
- Client: `import { createClient } from "@/lib/supabase/client"`

### Database Tables
1. `profiles` - User profiles (linked to Supabase Auth)
2. `tournaments` - Tournament entities with organizer ownership
3. `tournament_participants` - Registered users
4. `tournament_teams` - Teams (singles=1, doubles=2 team_size)
5. `tournament_matches` - Match records with double elimination
6. `tournament_rankings` - Final standings
7. `tournament_achievement_tiers` - Organizer-defined tiers
8. `user_achievements` - Earned achievements

### Double Elimination Bracket
- Bracket types: `winners`, `losers`, `grand_final`
- Tournament tracks: `current_wb_round`, `current_lb_round`, `bracket_generated`

### Auth Flow
- Protected routes: `/dashboard`, `/tournaments`, `/draw`
- Auth pages redirect logged-in users to `/dashboard`
- Organizer ownership enforced for edit/delete

## Directory Structure
```
src/
├── app/           # Pages (auth, dashboard, tournaments, draw, profile)
├── components/ui/ # Reusable UI (Button, Calendar, Popover)
├── lib/
│   ├── actions/   # Server Actions
│   ├── validations/ # Zod schemas
│   └── supabase/  # Client utilities
├── types/         # TypeScript interfaces
└── middleware.ts  # Auth protection
supabase/migrations/ # SQL migrations
```

## Commands
```bash
bun dev    # Dev server
bun build  # Production build
bun lint   # ESLint
```
