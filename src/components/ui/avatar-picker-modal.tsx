"use client";

import { useEffect } from "react";
import { AVATAR_OPTIONS } from "@/lib/constants/avatars";

interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string | null;
  onChange: (url: string) => void;
}

export function AvatarPickerModal({
  isOpen,
  onClose,
  value,
  onChange,
}: AvatarPickerModalProps) {
  // Close on escape key and lock body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSelect = (url: string) => {
    onChange(url);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-card-dark border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Choose Avatar</h3>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-gray-400 text-xl">
              close
            </span>
          </button>
        </div>

        {/* Avatar Grid - All 30 avatars */}
        <div className="grid grid-cols-5 gap-3">
          {AVATAR_OPTIONS.map((avatar) => (
            <button
              key={avatar.id}
              type="button"
              onClick={() => handleSelect(avatar.url)}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 ${
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

        {/* Footer hint */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Tap an avatar to select
        </p>
      </div>
    </div>
  );
}
