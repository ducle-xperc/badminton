import { Avatar } from "@/components/ui/avatar";
import type { TeamMemberInfo } from "./MatchTab";

interface TeamMemberAvatarProps {
  member?: TeamMemberInfo;
}

export function TeamMemberAvatar({ member }: TeamMemberAvatarProps) {
  if (member) {
    return (
      <Avatar
        src={member.avatar_url}
        gender={member.gender}
        alt={member.name}
        size="sm"
        className="size-6"
      />
    );
  }

  return (
    <div className="size-6 rounded-full bg-gray-700 flex items-center justify-center">
      <span className="material-symbols-outlined text-gray-500 text-xs">person</span>
    </div>
  );
}
