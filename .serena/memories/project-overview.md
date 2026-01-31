# XPERC Badminton Vietnam Arena

## Tech Stack
- **Next.js 16** with App Router (React Server Components by default)
- **React 19** with Lexend font family
- **Tailwind CSS v4** using `@import "tailwindcss"` syntax
- **Supabase** for backend (auth, database, realtime)
- **TypeScript** with strict mode
- **Bun** as package manager

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
│   ├── layout.tsx          # Root layout (dark mode default)
│   ├── page.tsx            # Home page
│   ├── login/              # Authentication
│   ├── dashboard/          # User dashboard
│   ├── tournaments/        # Tournament listing
│   └── draw/               # Tournament brackets
├── lib/
│   └── supabase/           # Supabase client utilities
│       ├── client.ts       # Browser client (Client Components)
│       ├── server.ts       # Server client (Server Components)
│       └── proxy.ts        # Session refresh helper
└── proxy.ts                # Next.js proxy (replaces middleware in v16)
```

## Supabase Setup

### Environment Variables (.env.local)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key

### Usage

**Server Components:**
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

## Important Notes
- Next.js 16 uses `proxy.ts` instead of `middleware.ts` (renamed convention)
- Dark mode is enabled by default (`<html className="dark">`)
- Material Symbols Outlined icons loaded via Google Fonts
- Path alias: `@/*` → `./src/*`
