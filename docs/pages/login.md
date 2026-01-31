# Login Page

**Route**: `/login`
**File**: `src/app/login/page.tsx`
**Type**: Client Component (`"use client"`)

## Current Status

> ⚠️ **MOCK ONLY**: Form hiển thị đầy đủ nhưng KHÔNG có logic authentication thực sự. Submit form chỉ redirect đến `/dashboard` mà không verify credentials.

## Mô tả

Trang đăng nhập cho người dùng tham gia giải đấu XPERC Badminton World Cup.

## Chức năng hiện tại

### 1. Form đăng nhập (UI only)
- **Nickname field**: Input text để người dùng nhập nickname
- **Password field**: Input password để nhập mật khẩu

### 2. Submit Handler (Mock)
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  router.push("/dashboard"); // ❌ No authentication!
};
```

### 3. Branding
- Logo trophy icon với gradient
- Tiêu đề "XPERC BADMINTON WORLD CUP"
- Badge "Official App"

## UI Components

### Form Elements
- Input fields với icons (alternate_email, lock)
- Focus states với gold accent border
- Placeholder text styling

### Button
- Gradient hover effect
- Scale animation khi active
- Icon "login" với hover translate

### Background Decorations
- Court line patterns
- Circular decorations
- Large sports_tennis icon (opacity 5%)

## Styling

- Layout: Centered, max-width 480px
- Theme: Dark mode
- Backdrop blur effects
- Shadow và glow effects trên button

## What Needs Implementation

### Priority 1: Supabase Authentication

```typescript
// Cần implement trong handleSubmit:
import { createClient } from "@/lib/supabase/client";

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: nickname, // hoặc dùng email field riêng
    password: password,
  });

  if (error) {
    // Show error message
    return;
  }

  router.push("/dashboard");
};
```

### Priority 2: Form Validation
- [ ] Required field validation
- [ ] Email format validation (nếu dùng email)
- [ ] Password minimum length
- [ ] Error message display
- [ ] Loading state khi submit

### Priority 3: Additional Auth Features
- [ ] **Sign Up page/modal**: Tạo tài khoản mới
- [ ] **Forgot Password**: Reset password flow
- [ ] **Remember Me**: Persist session
- [ ] **Social Login**: Google, Facebook (optional)

### Priority 4: UX Improvements
- [ ] Form validation feedback (inline errors)
- [ ] Loading spinner khi authenticating
- [ ] Toast notifications cho success/error
- [ ] Redirect to previous page after login

## Database Requirements

Supabase Auth tự quản lý `auth.users` table. Cần thêm:

```sql
-- profiles table để store thêm user info
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  nickname TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  rank INTEGER DEFAULT 0,
  is_pro BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Dependencies

- `next/navigation`: useRouter hook
- `@/lib/supabase/client`: Supabase client (cần import)
- React: useState (cần thêm cho form state)
