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

### Key Directories
```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/               # Login, signup, password reset
│   ├── dashboard/          # User dashboard
│   ├── tournaments/        # Tournament CRUD with [id] dynamic routes
│   └── draw/               # Tournament brackets
├── lib/
│   ├── actions/            # Server Actions (auth.ts, tournament.ts)
│   ├── validations/        # Zod schemas (auth.ts, tournament.ts)
│   └── supabase/           # Supabase client utilities
├── types/                  # TypeScript interfaces (database.ts)
└── middleware.ts           # Auth protection for routes
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

### Database Tables
- `tournaments` - Tournament entities with organizer ownership
- `profiles` - User profiles with nickname (linked to Supabase Auth)

### Auth Flow
- Middleware protects `/dashboard`, `/tournaments`, `/draw`
- Logged-in users redirected away from `/auth/*` pages
- Organizer ownership checked for tournament edit/delete
