# Draw Page

**Route**: `/draw`
**File**: `src/app/draw/page.tsx`
**Type**: Server Component

## Current Status

> ⚠️ **COMPLETELY STATIC**: Số hiển thị (42) là hardcoded. Button "DRAW NOW" không có handler. History là static HTML.

## Mô tả

Trang quay số may mắn (Lucky Number Draw) cho giải đấu. Cho phép quay số ngẫu nhiên để chọn người thắng cuộc hoặc xác định thứ tự thi đấu.

## Chức năng hiện tại

### 1. Top App Bar (UI only)
- **Back button**: arrow_back - ❌ No navigation
- **Title**: "Badminton VietNam Arena"
- **Settings button**: settings icon - ❌ No handler

### 2. Main Display Stage (Static)

| Element | Value | Status |
|---------|-------|--------|
| Live Badge | "Live Draw" with pulse | ❌ Not live |
| Title | "Lucky Number" | Static |
| Number | 42 | ❌ Hardcoded |
| Category | "Gold Tier" | ❌ Hardcoded |
| Status | "Verified" | ❌ Hardcoded |

### 3. History Section (Hardcoded)
| Number | Tier | Time | Status |
|--------|------|------|--------|
| #88 | Silver Tier Winner | 2m ago | ❌ Static |
| #12 | Bronze Tier Winner | 5m ago | ❌ Static |
| #05 | Bronze Tier Winner | 8m ago | ❌ Static |

### 4. Action Button (Non-functional)
- **DRAW NOW button**: ❌ No onClick handler
- Spinning icon animation works (CSS only)

## UI Components

### Number Display Card
- Glassmorphism với backdrop blur
- Gradient border với glow
- Dot pattern background (opacity 3%)
- Decorative sports_tennis icon

### History Cards
- Horizontal snap scroll
- Avatar thumbnails
- Timestamp display
- Tier badges

### Draw Button
- Full-width sticky bottom
- Animated spin icon (CSS: animate-spin-slow)
- Shadow và glow effects
- Hover state với overlay

## What Needs Implementation

### Priority 1: Random Number Generation

```typescript
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DrawPage() {
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [history, setHistory] = useState<Draw[]>([]);

  const handleDraw = async () => {
    setIsSpinning(true);

    // Animation: cycle through numbers
    const animationDuration = 3000; // 3 seconds
    const intervalId = setInterval(() => {
      setCurrentNumber(Math.floor(Math.random() * 100) + 1);
    }, 50);

    // Stop animation and get final number
    setTimeout(async () => {
      clearInterval(intervalId);
      const finalNumber = Math.floor(Math.random() * 100) + 1;
      setCurrentNumber(finalNumber);
      setIsSpinning(false);

      // Save to database
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase.from("draws").insert({
          user_id: user.id,
          number: finalNumber,
          category: selectedCategory,
        });
      }

      // Refresh history
      fetchHistory();
    }, animationDuration);
  };

  return (
    // ... UI with real state
  );
}
```

### Priority 2: History from Database

```typescript
interface Draw {
  id: string;
  number: number;
  category: 'gold' | 'silver' | 'bronze';
  created_at: string;
  user: {
    nickname: string;
    avatar_url: string;
  };
}

const fetchHistory = async () => {
  const supabase = createClient();
  const { data } = await supabase
    .from("draws")
    .select("*, user:profiles!user_id(nickname, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(10);

  setHistory(data || []);
};
```

### Priority 3: Real-time Updates

```typescript
import { useEffect } from "react";

useEffect(() => {
  const supabase = createClient();

  // Subscribe to new draws
  const channel = supabase
    .channel("draws")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "draws",
      },
      (payload) => {
        setHistory((prev) => [payload.new as Draw, ...prev.slice(0, 9)]);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

### Priority 4: Category Selection
- [ ] Dropdown/tabs để chọn tier (Gold/Silver/Bronze)
- [ ] Mỗi tier có range số khác nhau
- [ ] UI indicator cho selected tier

### Priority 5: Enhanced UX
- [ ] Confetti animation khi có winner
- [ ] Sound effects (optional)
- [ ] Full-screen celebration modal
- [ ] Share result button
- [ ] Print/export result

## Database Schema Required

```sql
-- Draws table
CREATE TABLE draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  tournament_id UUID REFERENCES tournaments(id), -- optional
  number INTEGER NOT NULL,
  category TEXT NOT NULL, -- 'gold', 'silver', 'bronze'
  is_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable realtime for draws
ALTER PUBLICATION supabase_realtime ADD TABLE draws;
```

## Animation Requirements

### Spin Animation
```css
/* Already in globals.css */
.animate-spin-slow {
  animation: spin 3s linear infinite;
}
```

### Number Cycling Animation
```typescript
// Rapid number cycling effect
const animateNumbers = () => {
  const interval = setInterval(() => {
    setDisplayNumber(Math.floor(Math.random() * 100) + 1);
  }, 50); // Change every 50ms

  return interval;
};
```

### Confetti (Optional)
```bash
bun add canvas-confetti
```

```typescript
import confetti from "canvas-confetti";

const celebrateWin = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
};
```

## New Pages/Features Required

- [ ] `/draw/history` - Full history view
- [ ] Draw configuration (admin only)
- [ ] Multiple draw pools
- [ ] Exclude already-won numbers option

## Styling Notes

- Layout: Full screen với sticky elements
- Background: Dynamic image với overlay
- Theme: Dark mode với blue accents
- Animations: Pulse, spin, scale transitions
