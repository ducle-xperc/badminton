# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

XPERC Badminton Vietnam Arena - Tournament web application built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and Supabase. Uses Bun as package manager.

## Commands

```bash
bun dev       # Start dev server (http://localhost:3000)
bun build     # Build for production
bun start     # Start production server
bun lint      # Run ESLint
```

## Architecture

### Tech Stack
- **Next.js 16** with App Router (React Server Components by default)
- **React 19** with Lexend font family
- **Tailwind CSS v4** using `@import "tailwindcss"` syntax
- **Supabase** for backend (auth, database)
- **TypeScript** with strict mode, path alias `@/*` → `./src/*`
- **Zod + React Hook Form** for form validation
- **UI Components**: Radix UI primitives, class-variance-authority (CVA), Lucide icons

### Key Directories
```
src/
├── app/
│   ├── auth/               # Login, signup, password reset
│   ├── (main)/             # Route group with shared layout (protected routes)
│   │   ├── dashboard/      # User dashboard with achievements
│   │   ├── tournaments/    # Tournament CRUD with [id] dynamic routes
│   │   ├── leaderboard/    # Global player rankings
│   │   └── profile/        # User profile management
│   └── draw/               # Tournament brackets visualization
├── components/ui/          # Reusable UI components (Button, Calendar, Popover)
├── lib/
│   ├── actions/            # Server Actions (auth, tournament, match, draw, achievement, leaderboard, profile)
│   ├── validations/        # Zod schemas
│   └── supabase/           # Supabase client utilities
├── types/                  # TypeScript interfaces (database.ts)
└── middleware.ts           # Auth protection for routes
supabase/migrations/        # Database migration files
```

### Server Actions Pattern

All mutations use Server Actions in `lib/actions/`. Pattern:
```typescript
"use server";
import { createClient } from "@/lib/supabase/server";

export async function createTournament(input: TournamentInput): Promise<TournamentResult> {
  const supabase = await createClient();
  // ... mutation logic
  revalidatePath("/tournaments");
  redirect(`/tournaments/${data.id}`);
}
```

### Supabase Usage

**Server Components / Server Actions:**
```typescript
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();
```

**Client Components:**
```typescript
"use client";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
```

### Database Schema

Core tables (see `supabase/migrations/` for details):
- `profiles` - User profiles linked to Supabase Auth
- `tournaments` - Tournament entities with organizer ownership
- `tournament_participants` - Users registered for tournaments
- `tournament_teams` - Teams formed within tournaments (supports singles/doubles)
- `tournament_matches` - Match records with double elimination bracket support
- `tournament_rankings` - Final standings and points
- `tournament_achievement_tiers` - Organizer-defined achievement tiers
- `user_achievements` - Achievements earned by users

### Double Elimination Bracket System

Tournaments use double elimination brackets with three bracket types:
- `winners` - Winner's bracket
- `losers` - Loser's bracket
- `grand_final` - Championship match

Tournament tracks `current_wb_round`, `current_lb_round`, and `bracket_generated` state.

### Auth Flow
- Middleware protects `/dashboard`, `/tournaments`, `/draw`, `/profile`
- Logged-in users redirected away from `/auth/*` pages
- Organizer ownership checked for tournament edit/delete

### Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
