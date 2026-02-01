import Link from "next/link";

export default function Home() {
  return (
    <div className="relative mx-auto min-h-screen max-w-[480px] w-full  overflow-hidden flex flex-col justify-center text-white">
      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 pt-4 relative justify-center items-center">
        {/* Title Section */}
        <div className="relative z-10 mb-6">
          <div className="flex flex-col gap-1">
            <span className="text-gold-accent font-bold tracking-[0.2em] text-sm uppercase">
              VietNam Arena
            </span>
            <h1 className="text-[40px] leading-[1] font-extrabold tracking-tight uppercase">
              BADMINTON <br />
              <span className="text-primary italic">WORLD CUP</span>
            </h1>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl z-10">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(to top, #0a0e1a 5%, transparent 40%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAd913CEjtnkP4TXvCHHT5TzzIi4EXgd145VToh2WQ_eTTDao44PZAVOgB5gS4KGbmG6pAgHwifuru0O8BP5K-8cnRn9Pw3yBFxebL9lmrJx13d0zjVJAAEgmlftzhHJSUo-Fqnussen8l4ISStT7csnN4MgRSvIvBU48PpsFDvVP1rad7BwCMQ-iAh1VwOCXLYq802nSd4UaHZsZ5idLCOrCKB-vT7FsvaagtS-P2y7kJ-JtYU8bk0T2WvvTEMfFQ8ViepX81RlCQ")`,
            }}
          ></div>
          <div className="absolute top-1/4 right-1/4 size-32 bg-primary/20 blur-[60px] rounded-full"></div>
          <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">bolt</span>
            Live Event
          </div>
        </div>

        {/* Info Card */}
        <div className="relative z-20 -mt-20 mx-2">
          <div className="bg-navy-deep/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col gap-5">
              {/* Schedule */}
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                  <span className="material-symbols-outlined text-primary text-[28px]">
                    schedule
                  </span>
                </div>
                <div className="flex flex-col">
                  <p className="text-white text-lg font-bold leading-tight">
                    19:00 - 21:00
                  </p>
                  <p className="text-[#9da6b9] text-xs font-medium uppercase tracking-wider">
                    Tournament Schedule • (7 PM - 9 PM)
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-gold-accent/10 flex items-center justify-center border border-gold-accent/20">
                  <span className="material-symbols-outlined text-gold-accent text-[28px]">
                    location_on
                  </span>
                </div>
                <div className="flex flex-col">
                  <p className="text-white text-lg font-bold leading-tight">
                    Global Arena
                  </p>
                  <p className="text-[#9da6b9] text-xs font-medium uppercase tracking-wider">
                    Vietnam Center Court
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href="/auth/login"
                className="w-full bg-primary hover:bg-primary/90 text-white font-extrabold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/30 text-lg uppercase tracking-wide cursor-pointer"
              >
                JOIN NOW
                <span className="material-symbols-outlined text-[24px]">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Spacer */}
      <div className="h-10 w-full"></div>
    </div>
  );
}
