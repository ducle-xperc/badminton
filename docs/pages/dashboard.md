# Dashboard Page

**Route**: `/dashboard`
**File**: `src/app/dashboard/page.tsx`
**Type**: Server Component

## Current Status

> ⚠️ **ALL DATA HARDCODED**: Tất cả thông tin hiển thị (profile, stats, achievements, matches) đều là static. Không có data fetching từ Supabase.

## Mô tả

Trang dashboard cá nhân của người chơi, hiển thị thông tin profile, thống kê, thành tích và các trận đấu sắp tới.

## Chức năng hiện tại

### 1. Header Navigation (UI only)
- **Menu button**: Nút hamburger menu - ❌ Không có handler
- **Notifications**: Icon thông báo với badge đỏ - ❌ Không có logic

### 2. Profile Section (Hardcoded)
| Field | Value | Status |
|-------|-------|--------|
| Avatar | External image URL | ❌ Static |
| PRO badge | Always shown | ❌ Static |
| Name | "Alex "Ace" Chen" | ❌ Hardcoded |
| Title | "Badminton Professional" | ❌ Hardcoded |

### 3. Statistics Grid (Hardcoded)
| Stat | Value | Status |
|------|-------|--------|
| Matches | 42 | ❌ Hardcoded |
| Titles | 5 | ❌ Hardcoded |
| Rank | #12 | ❌ Hardcoded |

### 4. Recent Achievements (Hardcoded)
- MVP Player - Regional Finals 2023
- Fastest Smash - 386 km/h Record
- Top 20 Break - October 2023

### 5. Upcoming Matches (Hardcoded)
- vs. M. Rashid - OCT 24 - Center Court, Arena 1 (League)
- vs. K. Momota - NOV 02 - Tokyo Gymnasium (Finals)

### 6. Bottom Navigation Bar (UI only)
| Icon | Action | Status |
|------|--------|--------|
| grid_view | Dashboard | Active style only |
| calendar_month | Calendar | ❌ No route |
| sports_tennis | FAB | ❌ No handler |
| leaderboard | Leaderboard | ❌ No route |
| person | Profile | ❌ No route |

## UI Components

### Stats Cards
- Gradient background cho "Titles" card
- Border và backdrop blur effects

### Achievement Cards
- Horizontal scroll với hide-scroll class
- Hover states với color transitions
- Icons với colored backgrounds

### Match Cards
- Date badge ở bên trái
- Tag badges (League, Finals)
- Location info với icon
- Arrow button - ❌ Không có navigation

## What Needs Implementation

### Priority 1: User Session & Data Fetching

```typescript
// Cần thêm vào dashboard/page.tsx:
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get authenticated user
  const { data: { user }, error } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch user stats
  const { data: stats } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Fetch achievements
  const { data: achievements } = await supabase
    .from("achievements")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch upcoming matches
  const { data: matches } = await supabase
    .from("matches")
    .select("*, opponent:profiles!opponent_id(*)")
    .eq("user_id", user.id)
    .gte("match_date", new Date().toISOString())
    .order("match_date", { ascending: true })
    .limit(3);

  return (
    // ... render with real data
  );
}
```

### Priority 2: Bottom Navigation
- [ ] Tạo shared component `BottomNavigation.tsx`
- [ ] Implement routing cho mỗi tab
- [ ] Active state dựa trên current route
- [ ] Thêm routes: `/calendar`, `/leaderboard`, `/profile`

### Priority 3: Interactive Features
- [ ] Menu drawer/sidebar
- [ ] Notifications dropdown
- [ ] Match detail modal
- [ ] Achievement detail view
- [ ] "View All" links functionality

### Priority 4: Real-time Updates
- [ ] Live match score updates
- [ ] New notification alerts
- [ ] Rank changes

## Database Schema Required

```sql
-- User stats
CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  total_matches INTEGER DEFAULT 0,
  total_wins INTEGER DEFAULT 0,
  titles INTEGER DEFAULT 0,
  current_rank INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  opponent_id UUID REFERENCES profiles(id),
  tournament_id UUID REFERENCES tournaments(id),
  match_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  match_type TEXT, -- 'league', 'finals', 'friendly'
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'live', 'completed'
  score_user INTEGER,
  score_opponent INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Styling Notes

- Layout: Mobile-first, max-width 480px
- Theme: Dark mode với navy deep background
- Card styles: Glassmorphism với backdrop-blur
