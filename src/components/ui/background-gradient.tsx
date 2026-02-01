"use client";

export function BackgroundGradient() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-deep via-background-dark to-navy-deep" />

      {/* Primary blue blob - top left */}
      <div
        className="absolute -top-40 -left-40 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(19, 91, 236, 0.6) 0%, transparent 70%)",
        }}
      />

      {/* Primary blue blob - bottom right */}
      <div
        className="absolute -right-32 -bottom-32 h-[500px] w-[500px] rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(19, 91, 236, 0.5) 0%, transparent 70%)",
        }}
      />

      {/* Gold accent blob - center right */}
      <div
        className="absolute top-1/3 -right-20 h-72 w-72 rounded-full opacity-15 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, transparent 70%)",
        }}
      />

      {/* Small gold accent - top center */}
      <div
        className="absolute top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full opacity-10 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 215, 0, 0.5) 0%, transparent 70%)",
        }}
      />

      {/* Subtle blue glow - bottom left */}
      <div
        className="absolute -bottom-20 left-1/4 h-64 w-64 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(19, 91, 236, 0.4) 0%, transparent 70%)",
        }}
      />

      {/* Shuttlecock SVG - top right */}
      <svg
        className="absolute top-16 right-8 w-24 h-24 opacity-[0.08]"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="50" cy="85" rx="12" ry="10" fill="#FFD700" />
        <path
          d="M38 80C30 60 35 30 50 10C65 30 70 60 62 80"
          stroke="#FFD700"
          strokeWidth="2"
          fill="none"
        />
        <path d="M42 75C38 55 42 35 50 20" stroke="#FFD700" strokeWidth="1.5" />
        <path d="M58 75C62 55 58 35 50 20" stroke="#FFD700" strokeWidth="1.5" />
        <path d="M50 78V20" stroke="#FFD700" strokeWidth="1.5" />
        <ellipse
          cx="50"
          cy="85"
          rx="8"
          ry="6"
          fill="#135bec"
          fillOpacity="0.6"
        />
      </svg>

      {/* Shuttlecock SVG - bottom left (larger, rotated) */}
      <svg
        className="absolute bottom-32 left-12 w-32 h-32 opacity-[0.06] rotate-45"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="50" cy="85" rx="12" ry="10" fill="#135bec" />
        <path
          d="M38 80C30 60 35 30 50 10C65 30 70 60 62 80"
          stroke="#135bec"
          strokeWidth="2"
          fill="none"
        />
        <path d="M42 75C38 55 42 35 50 20" stroke="#135bec" strokeWidth="1.5" />
        <path d="M58 75C62 55 58 35 50 20" stroke="#135bec" strokeWidth="1.5" />
        <path d="M50 78V20" stroke="#135bec" strokeWidth="1.5" />
      </svg>

      {/* Badminton racket SVG - center left */}
      <svg
        className="absolute top-1/2 -left-8 w-40 h-40 opacity-[0.05] -rotate-30"
        viewBox="0 0 100 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Racket head */}
        <ellipse
          cx="50"
          cy="35"
          rx="28"
          ry="32"
          stroke="#FFD700"
          strokeWidth="3"
          fill="none"
        />
        {/* String pattern horizontal */}
        <line x1="26" y1="25" x2="74" y2="25" stroke="#FFD700" strokeWidth="1" />
        <line x1="24" y1="32" x2="76" y2="32" stroke="#FFD700" strokeWidth="1" />
        <line x1="24" y1="39" x2="76" y2="39" stroke="#FFD700" strokeWidth="1" />
        <line x1="26" y1="46" x2="74" y2="46" stroke="#FFD700" strokeWidth="1" />
        <line x1="30" y1="53" x2="70" y2="53" stroke="#FFD700" strokeWidth="1" />
        {/* String pattern vertical */}
        <line x1="36" y1="8" x2="36" y2="62" stroke="#FFD700" strokeWidth="1" />
        <line x1="44" y1="5" x2="44" y2="65" stroke="#FFD700" strokeWidth="1" />
        <line x1="50" y1="4" x2="50" y2="66" stroke="#FFD700" strokeWidth="1" />
        <line x1="56" y1="5" x2="56" y2="65" stroke="#FFD700" strokeWidth="1" />
        <line x1="64" y1="8" x2="64" y2="62" stroke="#FFD700" strokeWidth="1" />
        {/* Handle */}
        <rect
          x="46"
          y="67"
          width="8"
          height="50"
          rx="2"
          stroke="#FFD700"
          strokeWidth="2"
          fill="none"
        />
        <rect
          x="44"
          y="115"
          width="12"
          height="8"
          rx="2"
          fill="#FFD700"
          fillOpacity="0.4"
        />
      </svg>

      {/* Court lines pattern - bottom */}
      <svg
        className="absolute bottom-0 left-0 w-full h-48 opacity-[0.03]"
        viewBox="0 0 400 100"
        preserveAspectRatio="xMidYMax slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Court outline */}
        <rect
          x="50"
          y="10"
          width="300"
          height="80"
          stroke="#FFD700"
          strokeWidth="2"
          fill="none"
        />
        {/* Center line */}
        <line
          x1="200"
          y1="10"
          x2="200"
          y2="90"
          stroke="#FFD700"
          strokeWidth="1.5"
        />
        {/* Service lines */}
        <line
          x1="50"
          y1="50"
          x2="350"
          y2="50"
          stroke="#FFD700"
          strokeWidth="1"
        />
        {/* Short service lines */}
        <line
          x1="100"
          y1="10"
          x2="100"
          y2="90"
          stroke="#FFD700"
          strokeWidth="1"
        />
        <line
          x1="300"
          y1="10"
          x2="300"
          y2="90"
          stroke="#FFD700"
          strokeWidth="1"
        />
      </svg>

      {/* Abstract circles - decorative */}
      <svg
        className="absolute top-1/4 right-1/4 w-64 h-64 opacity-[0.04]"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="45" stroke="#135bec" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="35" stroke="#135bec" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="25" stroke="#FFD700" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="15" stroke="#135bec" strokeWidth="0.5" />
      </svg>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
