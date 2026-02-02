import { Avatar } from "@/components/ui/avatar";
import type { TeamMemberInfo } from "./MatchTab";

interface TeamMemberAvatarProps {
  member?: TeamMemberInfo;
}

export function TeamMemberAvatar({ member }: TeamMemberAvatarProps) {
  if (member) {
    return (
      <div className="flex items-center justify-center gap-2">
        <Avatar
          src={member.avatar_url}
          gender={member.gender}
          alt={member.name}
          size="sm"
          className="size-7 ring-2 ring-white/10"
        />
        <div className="flex flex-col items-start min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-300 font-medium truncate max-w-[70px]" title={member.name}>
              {member.name}
            </span>
            {member.achievementCount !== undefined && member.achievementCount > 0 && (
              <span className="flex items-center gap-0.5 text-yellow-500" title={`${member.achievementCount} cups`}>
                <span className="material-symbols-outlined text-xs">emoji_events</span>
                <span className="text-[10px] font-medium">{member.achievementCount}</span>
              </span>
            )}
          </div>
          {member.status && (
            <span className="text-[10px] text-gray-500 truncate max-w-[90px]" title={member.status}>
              {member.status}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="size-7 rounded-full bg-gray-700/50 border border-dashed border-gray-600 flex items-center justify-center">
        <span className="material-symbols-outlined text-gray-500 text-xs">person</span>
      </div>
      <span className="text-xs text-gray-500 italic">TBD</span>
    </div>
  );
}
