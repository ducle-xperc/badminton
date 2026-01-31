"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type {
  SignInInput,
  SignUpInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "@/lib/validations/auth";

export type AuthResult = {
  error?: string;
  success?: string;
};

export async function signIn(data: SignInInput): Promise<AuthResult> {
  const supabase = await createClient();

  const { email, password } = data;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signUp(data: SignUpInput): Promise<AuthResult> {
  const supabase = await createClient();

  const { nickname, email, password } = data;

  // Check if nickname is already taken
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("nickname", nickname)
    .single();

  if (existingProfile) {
    return { error: "Nickname is already taken" };
  }

  // Sign up with Supabase Auth
  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nickname,
        display_name: nickname,
        full_name: nickname,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "Email is already registered" };
    }
    return { error: error.message };
  }

  // Manually insert profile if trigger doesn't work
  if (authData.user) {
    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: authData.user.id,
        nickname,
        email,
      },
      { onConflict: "id" }
    );

    if (profileError) {
      console.error("Failed to create profile:", profileError);
    }
  }

  // When email confirmation is disabled in Supabase, user is auto-logged in
  redirect("/dashboard");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}

export async function forgotPassword(
  data: ForgotPasswordInput
): Promise<AuthResult> {
  const supabase = await createClient();

  const { email } = data;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback?next=/auth/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Check your email for a password reset link" };
}

export async function resetPassword(
  data: ResetPasswordInput
): Promise<AuthResult> {
  const supabase = await createClient();

  const { password } = data;

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/auth/login?message=Password updated successfully");
}

export async function checkNicknameAvailability(
  nickname: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("nickname", nickname)
    .single();

  return !data;
}
