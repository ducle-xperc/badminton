# XPERC Badminton Vietnam Arena

## Project Summary
Tournament management web application for badminton competitions with double elimination brackets, team management, achievements, and leaderboard.

## Tech Stack
- Next.js 16 with App Router (RSC by default)
- React 19
- TypeScript (strict mode, `@/*` path alias → `./src/*`)
- Tailwind CSS v4 (`@import "tailwindcss"` syntax)
- Supabase (auth + database)
- Bun package manager
- Zod + React Hook Form for validation
- UI: Radix UI primitives, CVA, Lucide icons

## Commands
```bash
bun dev    # Dev server (http://localhost:3000)
bun build  # Production build
bun lint   # ESLint
```

## Directory Structure
```
src/
├── app/
│   ├── auth/               # Login, signup, password reset
│   ├── (main)/             # Route group with shared layout
│   │   ├── dashboard/      # User dashboard with achievements
│   │   ├── tournaments/    # Tournament CRUD with [id] routes
│   │   ├── leaderboard/    # Global player rankings
│   │   └── profile/        # User profile management
│   └── draw/               # Tournament brackets visualization
├── components/ui/          # Reusable UI (Button, Calendar, Popover)
├── lib/
│   ├── actions/            # Server Actions
│   │   ├── auth.ts         # signIn, signUp, signOut, resetPassword
│   │   ├── tournament.ts   # Tournament CRUD
│   │   ├── match.ts        # Match operations
│   │   ├── draw.ts         # Bracket generation
│   │   ├── achievement.ts  # Achievement handling
│   │   ├── leaderboard.ts  # Rankings
│   │   └── profile.ts      # Profile management
│   ├── validations/        # Zod schemas
│   └── supabase/           # Client utilities
├── types/database.ts       # TypeScript interfaces
└── middleware.ts           # Auth protection
supabase/migrations/        # SQL migrations
```

## Key Patterns

### Server Actions
All mutations in `src/lib/actions/`. Return format varies by action.
```typescript
"use server";
import { createClient } from "@/lib/supabase/server";

export async function createTournament(input: TournamentInput) {
  const supabase = await createClient();
  // ... mutation
  revalidatePath("/tournaments");
  redirect(`/tournaments/${data.id}`);
}
```

### Supabase Clients
- **Server** (Server Components/Actions): `import { createClient } from "@/lib/supabase/server"`
- **Client** (Client Components): `import { createClient } from "@/lib/supabase/client"`

### Auth Flow
- Protected routes: `/dashboard`, `/tournaments`, `/draw`, `/profile`
- Auth pages redirect logged-in users to `/dashboard`
- Organizer ownership enforced for tournament edit/delete

## Database Tables
1. `profiles` - User profiles (linked to Supabase Auth)
2. `tournaments` - Tournament entities with organizer ownership
3. `tournament_participants` - Registered users
4. `tournament_teams` - Teams (singles=1, doubles=2 team_size)
5. `tournament_matches` - Match records with double elimination
6. `tournament_rankings` - Final standings and points
7. `tournament_achievement_tiers` - Organizer-defined achievement tiers
8. `user_achievements` - Achievements earned by users

### Key Types (src/types/database.ts)
- `Profile` - id, email, nickname, gender, status
- `Tournament` - Full tournament entity with bracket state
- `TournamentMatch` - bracket, round, team scores, winner
- `TournamentTeam` - team_number, members, is_full
- `TournamentParticipant` - user in tournament with team assignment
- `TournamentRanking` - position, wins, losses, points
- `TournamentAchievementTier` - title, icon, color, position range
- `UserAchievement` - earned achievements with tournament reference

### Double Elimination Bracket
- Bracket types: `winners`, `losers`, `grand_final`
- Tournament tracks: `current_wb_round`, `current_lb_round`, `bracket_generated`
- Match has `is_reset_match` for grand final reset scenario

## Environment Variables
Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
