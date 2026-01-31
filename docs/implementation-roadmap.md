# Implementation Roadmap

Lộ trình implement chi tiết để hoàn thiện XPERC Badminton Vietnam Arena từ UI prototype thành ứng dụng hoàn chỉnh.

## Current State Summary

| Layer | Status | Notes |
|-------|--------|-------|
| **UI/Design** | ✅ 100% | Mobile-first, responsive, dark theme |
| **Supabase Config** | ✅ Done | Client/Server setup complete |
| **Middleware** | ✅ Done | Route protection configured |
| **Authentication** | ❌ 0% | Mock login only |
| **Database** | ❌ 0% | No tables created |
| **Data Fetching** | ❌ 0% | All data hardcoded |
| **Components** | ❌ 0% | No shared components |
| **Types** | ❌ 0% | No TypeScript interfaces |

---

## Phase 1: Foundation

### 1.1 Database Schema

Chạy trong Supabase SQL Editor:

```sql
-- ============================================
-- PROFILES (extends auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nickname TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  current_rank INTEGER DEFAULT 0,
  is_pro BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, nickname, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nickname', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- USER STATS
-- ============================================
CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_matches INTEGER DEFAULT 0,
  total_wins INTEGER DEFAULT 0,
  total_losses INTEGER DEFAULT 0,
  titles INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ACHIEVEMENTS
-- ============================================
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'emoji_events',
  category TEXT DEFAULT 'general', -- 'tournament', 'performance', 'milestone'
  earned_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TOURNAMENTS
-- ============================================
CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('major', 'regional', 'local')),
  category TEXT NOT NULL CHECK (category IN ('singles', 'doubles', 'mixed')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  registration_deadline TIMESTAMPTZ,
  location TEXT NOT NULL,
  venue TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  max_participants INTEGER,
  prize_pool DECIMAL(10,2),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TOURNAMENT REGISTRATIONS
-- ============================================
CREATE TABLE tournament_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'checked_in')),
  seed_number INTEGER,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tournament_id, user_id)
);

-- ============================================
-- MATCHES
-- ============================================
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE SET NULL,
  player1_id UUID REFERENCES profiles(id) NOT NULL,
  player2_id UUID REFERENCES profiles(id),
  match_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  court TEXT,
  round TEXT, -- 'round_of_16', 'quarter', 'semi', 'final'
  match_type TEXT DEFAULT 'singles' CHECK (match_type IN ('singles', 'doubles', 'mixed')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
  score_player1 INTEGER[],
  score_player2 INTEGER[],
  winner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DRAWS (Lucky Number)
-- ============================================
CREATE TABLE draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE SET NULL,
  number INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('gold', 'silver', 'bronze')),
  is_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, own write
CREATE POLICY "Public profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Own profile update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- User Stats: public read
CREATE POLICY "Public user stats" ON user_stats FOR SELECT USING (true);

-- Achievements: public read
CREATE POLICY "Public achievements" ON achievements FOR SELECT USING (true);

-- Tournaments: public read
CREATE POLICY "Public tournaments" ON tournaments FOR SELECT USING (true);

-- Registrations: own registrations
CREATE POLICY "Own registrations" ON tournament_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Insert own registration" ON tournament_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Matches: public read
CREATE POLICY "Public matches" ON matches FOR SELECT USING (true);

-- Draws: public read, own insert
CREATE POLICY "Public draws" ON draws FOR SELECT USING (true);
CREATE POLICY "Own draws insert" ON draws FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- ENABLE REALTIME
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE draws;
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
```

### 1.2 TypeScript Types

Tạo file `src/types/database.ts`:

```typescript
export interface Profile {
  id: string;
  nickname: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  current_rank: number;
  is_pro: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  total_matches: number;
  total_wins: number;
  total_losses: number;
  titles: number;
  points: number;
  updated_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  icon: string;
  category: 'tournament' | 'performance' | 'milestone' | 'general';
  earned_at: string;
}

export interface Tournament {
  id: string;
  name: string;
  description: string | null;
  type: 'major' | 'regional' | 'local';
  category: 'singles' | 'doubles' | 'mixed';
  start_date: string;
  end_date: string;
  registration_deadline: string | null;
  location: string;
  venue: string | null;
  image_url: string | null;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  max_participants: number | null;
  prize_pool: number | null;
  created_by: string | null;
  created_at: string;
}

export interface TournamentRegistration {
  id: string;
  tournament_id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'checked_in';
  seed_number: number | null;
  registered_at: string;
}

export interface Match {
  id: string;
  tournament_id: string | null;
  player1_id: string;
  player2_id: string | null;
  match_date: string;
  location: string | null;
  court: string | null;
  round: string | null;
  match_type: 'singles' | 'doubles' | 'mixed';
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  score_player1: number[] | null;
  score_player2: number[] | null;
  winner_id: string | null;
  created_at: string;
}

export interface Draw {
  id: string;
  user_id: string;
  tournament_id: string | null;
  number: number;
  category: 'gold' | 'silver' | 'bronze';
  is_verified: boolean;
  created_at: string;
}
```

---

## Phase 2: Authentication

### 2.1 Login Page Implementation

File: `src/app/login/page.tsx`

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  // ... rest of UI
}
```

### 2.2 Sign Up Page (New)

Create `src/app/signup/page.tsx`

### 2.3 Logout Functionality

Add to dashboard/header

---

## Phase 3: Data Integration

### 3.1 Dashboard Data Fetching
- Fetch user profile from `profiles`
- Fetch stats from `user_stats`
- Fetch achievements
- Fetch upcoming matches

### 3.2 Tournaments Data Fetching
- Query tournaments table với filter
- Implement search
- Add pagination

### 3.3 Draw Page Logic
- Random number generation
- Save to database
- Real-time history updates

---

## Phase 4: Shared Components

### 4.1 Component Structure

```
src/components/
├── layout/
│   ├── BottomNavigation.tsx
│   ├── Header.tsx
│   └── BackgroundDecorations.tsx
├── cards/
│   ├── TournamentCard.tsx
│   ├── MatchCard.tsx
│   ├── AchievementCard.tsx
│   └── StatsCard.tsx
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Badge.tsx
│   └── Avatar.tsx
└── index.ts
```

### 4.2 BottomNavigation Component

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: "grid_view", href: "/dashboard", label: "Home" },
  { icon: "calendar_month", href: "/calendar", label: "Calendar" },
  { icon: "sports_tennis", href: "/play", label: "Play", isFab: true },
  { icon: "leaderboard", href: "/leaderboard", label: "Rank" },
  { icon: "person", href: "/profile", label: "Profile" },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 ...">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={pathname === item.href ? "text-primary" : "text-gray-500"}
        >
          <span className="material-symbols-outlined">{item.icon}</span>
        </Link>
      ))}
    </nav>
  );
}
```

---

## Phase 5: New Pages

### 5.1 Required Routes

| Route | Priority | Description |
|-------|----------|-------------|
| `/signup` | P1 | User registration |
| `/profile` | P2 | User profile view/edit |
| `/profile/edit` | P2 | Edit profile |
| `/tournaments/[id]` | P2 | Tournament detail |
| `/tournaments/[id]/register` | P2 | Registration flow |
| `/leaderboard` | P3 | Global rankings |
| `/calendar` | P3 | Match calendar |
| `/notifications` | P3 | Notification center |
| `/draw/history` | P4 | Full draw history |

---

## Implementation Priority

### Week 1: Auth & Database
- [ ] Create database schema
- [ ] Create TypeScript types
- [ ] Implement login with Supabase Auth
- [ ] Add signup page
- [ ] Test middleware protection

### Week 2: Data Integration
- [ ] Dashboard data fetching
- [ ] Tournaments data fetching
- [ ] Filter functionality

### Week 3: Components & Polish
- [ ] Extract shared components
- [ ] Bottom navigation routing
- [ ] Draw page functionality

### Week 4: New Features
- [ ] Profile page
- [ ] Tournament detail
- [ ] Leaderboard
- [ ] Real-time updates

---

## Testing Checklist

### Authentication
- [ ] Login với valid credentials → redirect to dashboard
- [ ] Login với invalid credentials → show error
- [ ] Protected route without auth → redirect to login
- [ ] Logout → clear session, redirect to home

### Data
- [ ] Dashboard shows real user data
- [ ] Tournaments load from database
- [ ] Filters work correctly
- [ ] Draw saves to database

### Real-time
- [ ] Draw history updates live
- [ ] New draws appear immediately

---

## Commands Reference

```bash
# Development
bun dev

# Build
bun build

# Lint
bun lint

# Add packages
bun add <package>
```
