"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Profile } from "@/types/database";
import type { ProfileInput } from "@/lib/validations/profile";

export type ProfileResult = {
  error?: string;
  success?: boolean;
  data?: Profile;
};

export async function getProfile(): Promise<ProfileResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Bạn cần đăng nhập" };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    // Profile might not exist yet, create it
    if (error.code === "PGRST116") {
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email,
          nickname: user.user_metadata?.nickname || user.email?.split("@")[0],
        })
        .select()
        .single();

      if (createError) {
        return { error: createError.message };
      }

      return { data: newProfile as Profile };
    }
    return { error: error.message };
  }

  return { data: data as Profile };
}

export async function updateProfile(input: ProfileInput): Promise<ProfileResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Bạn cần đăng nhập" };
  }

  // Check if nickname is taken by another user
  if (input.nickname) {
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("nickname", input.nickname)
      .neq("id", user.id)
      .single();

    if (existingProfile) {
      return { error: "Nickname đã được sử dụng" };
    }
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      nickname: input.nickname,
      gender: input.gender || null,
      status: input.status || null,
    })
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return { success: true, data: data as Profile };
}
