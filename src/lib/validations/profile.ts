import { z } from "zod";

export const profileSchema = z.object({
  nickname: z
    .string()
    .min(2, "Tối thiểu 2 ký tự")
    .max(30, "Tối đa 30 ký tự"),
  gender: z.enum(["male", "female", "other"]).nullable().optional(),
  status: z
    .string()
    .max(100, "Tối đa 100 ký tự")
    .optional()
    .or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;
