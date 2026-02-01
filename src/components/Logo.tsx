import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "icon" | "full" | "horizontal";
  size?: number;
  className?: string;
}

export function Logo({ variant = "icon", size = 40, className }: LogoProps) {
  const iconSize = variant === "icon" ? size : size;

  const IconSVG = ({ iconSize: s }: { iconSize: number }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={s}
      height={s}
      className="flex-shrink-0"
    >
      <defs>
        <linearGradient id="logo-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE55C" />
          <stop offset="100%" stopColor="#CC9900" />
        </linearGradient>
      </defs>
      {/* Medal outer circle */}
      <circle cx="256" cy="256" r="230" fill="url(#logo-gold)" />
      {/* Inner dark circle */}
      <circle cx="256" cy="256" r="190" fill="#0a0e1a" />
      {/* Shuttlecock */}
      <g fill="url(#logo-gold)">
        <ellipse cx="256" cy="300" rx="45" ry="40" />
        <polygon points="256,120 200,290 312,290" />
      </g>
      {/* Stars */}
      <g fill="url(#logo-gold)" opacity="0.8">
        <circle cx="140" cy="400" r="8" />
        <circle cx="372" cy="400" r="8" />
        <circle cx="100" cy="320" r="6" />
        <circle cx="412" cy="320" r="6" />
      </g>
    </svg>
  );

  if (variant === "icon") {
    return (
      <div className={className}>
        <IconSVG iconSize={iconSize} />
      </div>
    );
  }

  if (variant === "full") {
    return (
      <div className={cn("flex flex-col items-center gap-2", className)}>
        <IconSVG iconSize={iconSize} />
        <div className="flex flex-col items-center">
          <span
            className="font-extrabold tracking-wider bg-gradient-to-r from-primary to-gold-accent bg-clip-text text-transparent"
            style={{ fontSize: iconSize * 0.35 }}
          >
            BADMINTON
          </span>
          <span
            className="text-gold-accent tracking-[0.25em] font-light"
            style={{ fontSize: iconSize * 0.15 }}
          >
            VIETNAM ARENA
          </span>
        </div>
      </div>
    );
  }

  // horizontal variant
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <IconSVG iconSize={iconSize * 0.9} />
      <div className="flex flex-col">
        <span
          className="font-extrabold tracking-wider bg-gradient-to-r from-primary to-gold-accent bg-clip-text text-transparent leading-none"
          style={{ fontSize: iconSize * 0.4 }}
        >
          BADMINTON
        </span>
        <span
          className="text-gold-accent tracking-[0.2em] font-light"
          style={{ fontSize: iconSize * 0.18 }}
        >
          VIETNAM ARENA
        </span>
      </div>
    </div>
  );
}
