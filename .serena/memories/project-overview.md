# XPERC Badminton Vietnam Arena

## Tech Stack
- **Next.js 16** with App Router (React Server Components by default)
- **React 19** with Lexend font family
- **Tailwind CSS v4** using `@import "tailwindcss"` syntax
- **Supabase** for backend (auth, database)
- **TypeScript** with strict mode
- **Bun** as package manager
- **Zod + React Hook Form** for form validation

## Commands
```bash
bun dev       # Start dev server (http://localhost:3000)
bun build     # Build for production
bun start     # Start production server
bun lint      # Run ESLint
```

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/               # Login, signup, password reset, callback
│   ├── dashboard/          # User dashboard
│   ├── tournaments/        # Tournament CRUD with [id] dynamic routes
│   │   ├── new/            # Create tournament
│   │   └── [id]/           # View/edit tournament with tab components
│   └── draw/               # Tournament brackets
├── lib/
│   ├── actions/            # Server Actions
│   │   ├── auth.ts         # signIn, signUp, signOut, forgotPassword, resetPassword
│   │   └── tournament.ts   # CRUD operations for tournaments
│   ├── validations/        # Zod schemas
│   │   ├── auth.ts         # Auth form validation
│   │   └── tournament.ts   # Tournament form validation
│   └── supabase/           # Supabase client utilities
│       ├── client.ts       # Browser client (Client Components)
│       ├── server.ts       # Server client (Server Components)
│       └── proxy.ts        # Session refresh helper
├── types/
│   └── database.ts         # TypeScript interfaces (Tournament, Match, Team, etc.)
└── middleware.ts           # Auth protection for routes
```

## Database Tables
- `tournaments` - Tournament entities with organizer ownership
- `profiles` - User profiles with nickname (linked to Supabase Auth)

## Key Patterns

### Server Actions
All mutations in `lib/actions/`. Return `{ error?: string; success?: string; data?: T }`.
```typescript
"use server";
import { createClient } from "@/lib/supabase/server";
export async function createTournament(input: TournamentInput): Promise<TournamentResult> {
  const supabase = await createClient();
  // ... mutation
  revalidatePath("/tournaments");
  redirect(`/tournaments/${data.id}`);
}
```

### Supabase Usage
**Server:** `const supabase = await createClient();` (from `@/lib/supabase/server`)
**Client:** `const supabase = createClient();` (from `@/lib/supabase/client`)

### Auth Flow
- Middleware protects: `/dashboard`, `/tournaments`, `/draw`
- Logged-in users redirected away from `/auth/*` pages
- Organizer ownership checked for tournament edit/delete

## TypeScript Types (src/types/database.ts)
- `Tournament`, `TournamentInsert`, `TournamentUpdate`
- `TournamentParticipant`, `TournamentTeam`
- `TournamentMatch` (with MatchRound, MatchStatus)
- `TournamentRanking`

## UI Notes
- Dark mode enabled by default
- Material Symbols Outlined icons via Google Fonts
- Tournament detail page uses tab components (Info, Participant, Team, Match, MVP)
