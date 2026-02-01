"use client";

import { AVATAR_OPTIONS, type AvatarOption } from "@/lib/constants/avatars";

interface AvatarSelectorProps {
  value: string | null;
  onChange: (url: string) => void;
}

export function AvatarSelector({ value, onChange }: AvatarSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
        Choose Avatar
      </label>
      <div className="grid grid-cols-5 gap-3">
        {AVATAR_OPTIONS.map((avatar) => (
          <button
            key={avatar.id}
            type="button"
            onClick={() => onChange(avatar.url)}
            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
              value === avatar.url
                ? "border-primary ring-2 ring-primary/50 shadow-lg shadow-primary/30"
                : "border-white/10 hover:border-white/30"
            }`}
          >
            <img
              src={avatar.url}
              alt={avatar.name}
              className="w-full h-full object-cover"
            />
            {value === avatar.url && (
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-lg drop-shadow-lg">
                  check_circle
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
