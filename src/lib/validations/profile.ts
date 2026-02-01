import { z } from "zod";

export const profileSchema = z.object({
  nickname: z
    .string()
    .min(2, "Minimum 2 characters")
    .max(30, "Maximum 30 characters"),
  gender: z.enum(["male", "female", "other"]).nullable().optional(),
  status: z
    .string()
    .max(100, "Maximum 100 characters")
    .optional()
    .or(z.literal("")),
  avatar_url: z.string().url().nullable().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
