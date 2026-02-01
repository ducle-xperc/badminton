# Tournaments Page

**Route**: `/tournaments`
**File**: `src/app/tournaments/page.tsx`
**Type**: Server Component

## Current Status

> ⚠️ **ALL DATA HARDCODED**: Tournament cards là static HTML. Filter tabs không hoạt động. Buttons không có handlers.

## Mô tả

Trang danh sách các giải đấu cầu lông, cho phép người dùng xem, lọc và tham gia các giải đấu.

## Chức năng hiện tại

### 1. Header (UI only)
- **Menu button**: Hamburger menu - ❌ No handler
- **Title**: "Tournaments"
- **Search button**: Search icon - ❌ No handler

### 2. Filter Tabs (UI only - Non-functional)
| Tab | Description | Status |
|-----|-------------|--------|
| Upcoming | Các giải đấu sắp diễn ra | ❌ Static active style |
| Ongoing | Các giải đấu đang diễn ra | ❌ No filter logic |
| Completed | Các giải đấu đã kết thúc | ❌ No filter logic |
| My Events | Các giải đấu đã đăng ký | ❌ No filter logic |

### 3. Tournament Cards (Hardcoded)

#### Card 1: VietNam Arena World Cup 2024
| Field | Value | Status |
|-------|-------|--------|
| Type | Major, Singles | ❌ Hardcoded |
| Date | OCT 24-30 | ❌ Hardcoded |
| Location | Vietnam Center Court | ❌ Hardcoded |
| Action | "Join Tournament" | ❌ No handler |

#### Card 2: Asia Pacific Open
| Field | Value | Status |
|-------|-------|--------|
| Type | Regional, Doubles | ❌ Hardcoded |
| Date | NOV 12-15 | ❌ Hardcoded |
| Location | Jakarta Arena | ❌ Hardcoded |
| Action | "View Details" | ❌ No handler |

#### Card 3: Winter Championship '23
| Field | Value | Status |
|-------|-------|--------|
| Status | Completed | ❌ Hardcoded |
| Location | Seoul Gymnasium | ❌ Hardcoded |
| Action | "See Results" | ❌ No handler |

### 4. Bottom Navigation (UI only)
- Same as Dashboard - ❌ Non-functional

## UI Components

### Tournament Cards
- Full-width image backgrounds
- Gradient overlays (bottom to top)
- Hover scale animation trên image
- Tag badges (Major/Regional, Singles/Doubles)
- Date badges (gold hoặc card style)

### Filter Tabs
- Pill-style buttons
- Active state với primary color và shadow
- Horizontal scroll với hide-scroll

### Card Variations
- **Upcoming**: Full color, "Join Tournament" CTA
- **Active**: Primary button "View Details"
- **Completed**: Grayscale filter, reduced opacity

## What Needs Implementation

### Priority 1: Data Fetching

```typescript
import { createClient } from "@/lib/supabase/server";

interface Tournament {
  id: string;
  name: string;
  type: 'major' | 'regional' | 'local';
  category: 'singles' | 'doubles' | 'mixed';
  start_date: string;
  end_date: string;
  location: string;
  image_url: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  max_participants: number;
  current_participants: number;
}

export default async function TournamentsPage({
  searchParams,
}: {
  searchParams: { filter?: string; search?: string };
}) {
  const supabase = await createClient();
  const filter = searchParams.filter || 'upcoming';

  let query = supabase
    .from("tournaments")
    .select("*")
    .order("start_date", { ascending: true });

  // Apply filter
  if (filter === 'upcoming') {
    query = query.eq("status", "upcoming");
  } else if (filter === 'ongoing') {
    query = query.eq("status", "ongoing");
  } else if (filter === 'completed') {
    query = query.eq("status", "completed");
  } else if (filter === 'my-events') {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: registrations } = await supabase
        .from("tournament_registrations")
        .select("tournament_id")
        .eq("user_id", user.id);

      const tournamentIds = registrations?.map(r => r.tournament_id) || [];
      query = query.in("id", tournamentIds);
    }
  }

  const { data: tournaments } = await query;

  return (
    // ... render with real data
  );
}
```

### Priority 2: Filter Functionality

```typescript
// Convert to Client Component for interactivity
"use client";

import { useRouter, useSearchParams } from "next/navigation";

function FilterTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter") || "upcoming";

  const setFilter = (filter: string) => {
    router.push(`/tournaments?filter=${filter}`);
  };

  return (
    <div className="flex gap-3">
      {["upcoming", "ongoing", "completed", "my-events"].map((filter) => (
        <button
          key={filter}
          onClick={() => setFilter(filter)}
          className={currentFilter === filter ? "bg-primary" : "bg-card-dark"}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
```

### Priority 3: Tournament Actions
- [ ] "Join Tournament" - Registration flow
- [ ] "View Details" - Tournament detail page
- [ ] "See Results" - Results page

### Priority 4: Additional Features
- [ ] Search functionality
- [ ] Tournament detail page (`/tournaments/[id]`)
- [ ] Registration flow
- [ ] Pagination hoặc infinite scroll

## Database Schema Required

```sql
-- Tournaments
CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'major', 'regional', 'local'
  category TEXT NOT NULL, -- 'singles', 'doubles', 'mixed'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  location TEXT NOT NULL,
  venue TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'upcoming', -- 'upcoming', 'ongoing', 'completed'
  max_participants INTEGER,
  registration_deadline TIMESTAMPTZ,
  prize_pool DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tournament Registrations
CREATE TABLE tournament_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id) NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled'
  UNIQUE(tournament_id, user_id)
);
```

## New Pages Required

- [ ] `/tournaments/[id]` - Tournament detail
- [ ] `/tournaments/[id]/register` - Registration form
- [ ] `/tournaments/[id]/results` - Tournament results
- [ ] `/tournaments/[id]/bracket` - Tournament bracket view

## Styling Notes

- Layout: Mobile-first, max-width 480px
- Cards: Rounded-3xl với shadow-xl
- Gradient: Navy deep với transparency
- Theme: Dark mode
