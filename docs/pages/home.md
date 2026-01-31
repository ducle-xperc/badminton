# Home Page

**Route**: `/`
**File**: `src/app/page.tsx`
**Type**: Server Component

## Mô tả

Trang chủ (Landing Page) của ứng dụng XPERC Badminton Vietnam Arena. Đây là trang giới thiệu sự kiện giải đấu cầu lông với thiết kế mobile-first.

## Chức năng

### 1. Hiển thị thông tin sự kiện
- **Tiêu đề**: "XPERC Tournament - BADMINTON WORLD CUP"
- **Badge "Live Event"**: Hiển thị trạng thái sự kiện đang diễn ra
- **Hình ảnh hero**: Hiển thị hình ảnh giải đấu

### 2. Thông tin chi tiết
- **Lịch thi đấu**: 19:00 - 21:00 (7 PM - 9 PM)
- **Địa điểm**: Global Arena - Vietnam Center Court

### 3. Call-to-Action
- **Nút "JOIN NOW"**: Chuyển hướng đến trang `/login`

## UI Components

### Background Decorations
- Các hình tròn và đường kẻ trang trí với hiệu ứng opacity
- Gradient overlay trên hero image

### Info Card
- Card nổi với backdrop blur
- Hiển thị icon schedule và location
- Border gradient và shadow effects

## Styling

- Layout: Responsive, max-width 480px (mobile-first)
- Theme: Dark mode với accent colors (primary blue, gold)
- Typography: Lexend font family

## Dependencies

- `next/link`: Navigation component
