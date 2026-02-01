"use client";

import { signOut } from "@/lib/actions/auth";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
    >
      <span className="material-symbols-outlined text-lg">logout</span>
      Sign Out
    </button>
  );
}
