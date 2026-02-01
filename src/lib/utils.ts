import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDefaultAvatar(gender?: string | null): string {
  switch (gender) {
    case "male":
      return "https://api.dicebear.com/9.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4"
    case "female":
      return "https://api.dicebear.com/9.x/adventurer/svg?seed=Jasmine&backgroundColor=ffd5dc"
    default:
      return "https://api.dicebear.com/9.x/adventurer/svg?seed=Bubba&backgroundColor=d1d4f9"
  }
}
