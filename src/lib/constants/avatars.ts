export interface AvatarOption {
  id: string;
  url: string;
  name: string;
}

export type AvatarGender = "male" | "female" | "other";

const BASE_URL = "https://api.dicebear.com/9.x/adventurer/svg";

// Male avatars - Blue/Green tones
const MALE_AVATARS: AvatarOption[] = [
  { id: "marcus", name: "Marcus", url: `${BASE_URL}?seed=Marcus&backgroundColor=b6e3f4` },
  { id: "james", name: "James", url: `${BASE_URL}?seed=James&backgroundColor=aec6cf` },
  { id: "oliver", name: "Oliver", url: `${BASE_URL}?seed=Oliver&backgroundColor=c9e4de` },
  { id: "lucas", name: "Lucas", url: `${BASE_URL}?seed=Lucas&backgroundColor=a2d2ff` },
  { id: "henry", name: "Henry", url: `${BASE_URL}?seed=Henry&backgroundColor=d5d6ea` },
  { id: "leo", name: "Leo", url: `${BASE_URL}?seed=Leo&backgroundColor=d1f4d1` },
  { id: "jack", name: "Jack", url: `${BASE_URL}?seed=Jack&backgroundColor=98d1d1` },
  { id: "felix", name: "Felix", url: `${BASE_URL}?seed=Felix&backgroundColor=c0aede` },
  { id: "oscar", name: "Oscar", url: `${BASE_URL}?seed=Oscar&backgroundColor=77dd77` },
  { id: "max", name: "Max", url: `${BASE_URL}?seed=Max&backgroundColor=b4d7e8` },
];

// Female avatars - Pink/Warm tones
const FEMALE_AVATARS: AvatarOption[] = [
  { id: "sophia", name: "Sophia", url: `${BASE_URL}?seed=Sophia&backgroundColor=ffd5dc` },
  { id: "emma", name: "Emma", url: `${BASE_URL}?seed=Emma&backgroundColor=ffdfbf` },
  { id: "lily", name: "Lily", url: `${BASE_URL}?seed=Lily&backgroundColor=ffb6c1` },
  { id: "mia", name: "Mia", url: `${BASE_URL}?seed=Mia&backgroundColor=f9c9b6` },
  { id: "ava", name: "Ava", url: `${BASE_URL}?seed=Ava&backgroundColor=ffe4b5` },
  { id: "luna", name: "Luna", url: `${BASE_URL}?seed=Luna&backgroundColor=f4c2c2` },
  { id: "chloe", name: "Chloe", url: `${BASE_URL}?seed=Chloe&backgroundColor=ffd1dc` },
  { id: "ella", name: "Ella", url: `${BASE_URL}?seed=Ella&backgroundColor=ffb3ba` },
  { id: "grace", name: "Grace", url: `${BASE_URL}?seed=Grace&backgroundColor=ffc8dd` },
  { id: "ruby", name: "Ruby", url: `${BASE_URL}?seed=Ruby&backgroundColor=ffb347` },
];

// Other avatars - Mixed/Neutral tones
const OTHER_AVATARS: AvatarOption[] = [
  { id: "alex", name: "Alex", url: `${BASE_URL}?seed=Alex&backgroundColor=dcd0ff` },
  { id: "jordan", name: "Jordan", url: `${BASE_URL}?seed=Jordan&backgroundColor=fdfd96` },
  { id: "riley", name: "Riley", url: `${BASE_URL}?seed=Riley&backgroundColor=cda4de` },
  { id: "casey", name: "Casey", url: `${BASE_URL}?seed=Casey&backgroundColor=f0e68c` },
  { id: "morgan", name: "Morgan", url: `${BASE_URL}?seed=Morgan&backgroundColor=e8d5b7` },
  { id: "taylor", name: "Taylor", url: `${BASE_URL}?seed=Taylor&backgroundColor=d4e6f1` },
  { id: "quinn", name: "Quinn", url: `${BASE_URL}?seed=Quinn&backgroundColor=e6e6fa` },
  { id: "avery", name: "Avery", url: `${BASE_URL}?seed=Avery&backgroundColor=ffefd5` },
  { id: "charlie", name: "Charlie", url: `${BASE_URL}?seed=Charlie&backgroundColor=dcd0ff` },
  { id: "sage", name: "Sage", url: `${BASE_URL}?seed=Sage&backgroundColor=d5f5e3` },
];

export const AVATAR_OPTIONS_BY_GENDER: Record<AvatarGender, AvatarOption[]> = {
  male: MALE_AVATARS,
  female: FEMALE_AVATARS,
  other: OTHER_AVATARS,
};

// All avatars combined (for backwards compatibility)
export const AVATAR_OPTIONS: AvatarOption[] = [
  ...MALE_AVATARS,
  ...FEMALE_AVATARS,
  ...OTHER_AVATARS,
];

export const DEFAULT_AVATAR = OTHER_AVATARS[0].url;

export function getAvatarsByGender(gender: string | null): AvatarOption[] {
  if (gender === "male" || gender === "female" || gender === "other") {
    return AVATAR_OPTIONS_BY_GENDER[gender];
  }
  return AVATAR_OPTIONS_BY_GENDER.other;
}

export function getAvatarByUrl(url: string | null): AvatarOption | undefined {
  if (!url) return undefined;
  return AVATAR_OPTIONS.find((avatar) => avatar.url === url);
}
