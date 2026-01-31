import { z } from "zod";

const baseSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be at most 100 characters"),
  description: z.string().max(500, "Description must be at most 500 characters").optional(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  registration_deadline: z.string().optional(),
  location: z.string().min(3, "Location must be at least 3 characters"),
  max_participants: z.coerce.number().min(2, "Minimum 2 participants").max(256, "Maximum 256 participants").default(32),
  team_size: z.coerce.number().min(1).max(2).default(2),
  entry_fee: z.coerce.number().min(0, "Entry fee cannot be negative").default(0),
  prize_pool: z.string().optional(),
  banner_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  categories: z.array(z.string()).default([]),
});

export const tournamentSchema = baseSchema
  .refine((data) => new Date(data.end_date) >= new Date(data.start_date), {
    message: "End date must be after start date",
    path: ["end_date"],
  })
  .refine(
    (data) => {
      if (!data.registration_deadline) return true;
      return new Date(data.registration_deadline) <= new Date(data.start_date);
    },
    {
      message: "Registration deadline must be before start date",
      path: ["registration_deadline"],
    }
  );

export type TournamentInput = z.infer<typeof tournamentSchema>;

// Achievement tier schema for tournament configuration
export const achievementTierSchema = z.object({
  min_position: z.coerce.number().min(1, "Vị trí phải >= 1"),
  max_position: z.coerce.number().min(1, "Vị trí phải >= 1"),
  title: z.string().min(1, "Tên danh hiệu không được để trống").max(50, "Tên quá dài"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Màu phải là mã hex hợp lệ"),
  icon: z.string().optional(),
  display_order: z.coerce.number().default(0),
}).refine((data) => data.max_position >= data.min_position, {
  message: "Vị trí kết thúc phải >= vị trí bắt đầu",
  path: ["max_position"],
});

export type AchievementTierInput = z.infer<typeof achievementTierSchema>;

// Default achievement tiers
export const DEFAULT_ACHIEVEMENT_TIERS: AchievementTierInput[] = [
  { min_position: 1, max_position: 1, title: "Nhà Vô Địch", color: "#FFD700", icon: "emoji_events", display_order: 1 },
  { min_position: 2, max_position: 2, title: "Á Quân", color: "#C0C0C0", icon: "workspace_premium", display_order: 2 },
  { min_position: 3, max_position: 3, title: "Hạng Ba", color: "#CD7F32", icon: "military_tech", display_order: 3 },
  { min_position: 4, max_position: 8, title: "Top 8", color: "#4A90D9", icon: "star", display_order: 4 },
];
