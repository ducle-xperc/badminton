# Badminton VietNam Arena - Documentation

## Overview

Ứng dụng web giải đấu cầu lông được xây dựng với Next.js 16, React 19, TypeScript, Tailwind CSS v4 và Supabase. Uses Bun as package manager.

## Current Status

> **Trạng thái: UI Prototype**
>
> Hiện tại app chỉ có UI hoàn chỉnh. Tất cả data đều hardcoded và chưa có backend integration.

| Component | Status |
|-----------|--------|
| UI/Design | ✅ Hoàn chỉnh |
| Supabase Config | ✅ Đã setup client |
| Authentication | ❌ Chưa implement |
| Database Queries | ❌ Chưa implement |
| Shared Components | ❌ Chưa có |
| TypeScript Types | ❌ Chưa có |

## Danh sách Pages

| Route | File | Mô tả | Backend |
|-------|------|-------|---------|
| `/` | `src/app/page.tsx` | Trang chủ - Landing page | N/A (static) |
| `/login` | `src/app/login/page.tsx` | Trang đăng nhập | ❌ Mock only |
| `/dashboard` | `src/app/dashboard/page.tsx` | Dashboard người dùng | ❌ Hardcoded |
| `/tournaments` | `src/app/tournaments/page.tsx` | Danh sách giải đấu | ❌ Hardcoded |
| `/draw` | `src/app/draw/page.tsx` | Trang quay số may mắn | ❌ Static |

## Chi tiết từng Page

- [Home Page](./pages/home.md)
- [Login Page](./pages/login.md)
- [Dashboard Page](./pages/dashboard.md)
- [Tournaments Page](./pages/tournaments.md)
- [Draw Page](./pages/draw.md)

## Missing Core Features

### 1. Authentication System
- [ ] Supabase Auth integration trong login page
- [ ] Sign up flow
- [ ] Password reset
- [ ] Session management
- [ ] Protected route testing

### 2. Database & Data Fetching
- [ ] Database schema (xem [Implementation Roadmap](./implementation-roadmap.md))
- [ ] User profiles từ database
- [ ] Tournament listing từ database
- [ ] Match history
- [ ] Draw results storage

### 3. Shared Components
Cần tạo `src/components/`:
- [ ] `BottomNavigation.tsx` - Tách từ dashboard/tournaments
- [ ] `TournamentCard.tsx`
- [ ] `MatchCard.tsx`
- [ ] `AchievementCard.tsx`
- [ ] `BackgroundDecorations.tsx`

### 4. TypeScript Types
Cần tạo `src/types/`:
- [ ] `User` interface
- [ ] `Tournament` interface
- [ ] `Match` interface
- [ ] `Draw` interface
- [ ] `Achievement` interface

### 5. Functional Features
- [ ] Tournament filter tabs
- [ ] Search functionality
- [ ] Lucky draw random logic
- [ ] Real-time updates
- [ ] Notifications system

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS v4
- **Backend**: Supabase (Auth + Database + Realtime)
- **Font**: Lexend, Material Symbols Outlined
- **Package Manager**: Bun

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (dark mode default)
│   ├── globals.css         # Tailwind + custom theme
│   ├── page.tsx            # Home page
│   ├── login/page.tsx      # Authentication
│   ├── dashboard/page.tsx  # User dashboard
│   ├── tournaments/page.tsx # Tournament listing
│   └── draw/page.tsx       # Lucky draw
├── lib/
│   └── supabase/           # Supabase client utilities ✅
│       ├── client.ts       # Browser client
│       ├── server.ts       # Server client
│       └── proxy.ts        # Session refresh
├── components/             # ❌ MISSING - needs creation
├── types/                  # ❌ MISSING - needs creation
├── middleware.ts           # Route protection ✅
└── proxy.ts                # Next.js 16 proxy
```

## Related Documentation

- [Implementation Roadmap](./implementation-roadmap.md) - Lộ trình implement chi tiết
