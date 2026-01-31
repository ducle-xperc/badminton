export default function TournamentsPage() {
  return (
    <div className="relative mx-auto min-h-screen max-w-[480px] bg-background-dark overflow-hidden flex flex-col">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/4 left-0 w-full h-[2px] court-line"></div>
        <div className="absolute bottom-1/4 left-0 w-full h-[2px] court-line"></div>
        <div className="absolute left-1/2 top-0 w-[2px] h-full court-line -translate-x-1/2"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 border border-gold-accent/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
          <span className="material-symbols-outlined text-[300px]">emoji_events</span>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-6 pt-8 bg-gradient-to-b from-navy-deep to-transparent">
        <div className="flex items-center gap-2">
          <button className="size-10 rounded-xl bg-card-dark/50 border border-white/5 flex items-center justify-center text-white backdrop-blur-md hover:bg-card-dark transition-colors">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
        <h1 className="text-lg font-bold tracking-wide uppercase text-white/90">
          Tournaments
        </h1>
        <div className="flex items-center gap-4">
          <button className="size-10 rounded-xl bg-card-dark/50 border border-white/5 flex items-center justify-center text-white relative backdrop-blur-md hover:bg-card-dark transition-colors">
            <span className="material-symbols-outlined text-xl">search</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="relative z-10 px-6 mb-6">
        <div className="flex gap-3 overflow-x-auto hide-scroll pb-2">
          <button className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold shadow-lg shadow-primary/25 whitespace-nowrap transition-transform active:scale-95">
            Upcoming
          </button>
          <button className="px-5 py-2.5 rounded-full bg-card-dark border border-white/10 text-gray-400 text-sm font-medium hover:text-white hover:border-white/30 transition-colors whitespace-nowrap">
            Ongoing
          </button>
          <button className="px-5 py-2.5 rounded-full bg-card-dark border border-white/10 text-gray-400 text-sm font-medium hover:text-white hover:border-white/30 transition-colors whitespace-nowrap">
            Completed
          </button>
          <button className="px-5 py-2.5 rounded-full bg-card-dark border border-white/10 text-gray-400 text-sm font-medium hover:text-white hover:border-white/30 transition-colors whitespace-nowrap">
            My Events
          </button>
        </div>
      </div>

      {/* Tournament Cards */}
      <div className="relative z-10 flex-1 px-6 overflow-y-auto hide-scroll pb-28 space-y-5">
        {/* Card 1: XPERC World Cup 2024 */}
        <div className="group relative w-full h-72 rounded-3xl overflow-hidden shadow-xl shadow-black/40 border border-white/5">
          <img
            alt="Tournament"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuByZzkkClOrk1O9b7Yw6OPeeMBnUlxnVgoHvIFX45_8IYXyqsxKBrm8SRDI2ru1D_IMDNOmfA9zC1gXpqmy4WzUVjREdqZHHD5-oH_Ve6JfUK8SHUR40QiEym2A8OWALBSaau8nr_l2qmkg1xFjc0F0nSgFxEoTg5d8pMpRLc_4EQo2a4gslVSEWBZm0HOWgZ33usE4eWkR81thRF2EUIlP8nVlI_SDdoocMxqKOdhJEhDlVz0A-zPSNoHM9gFC9odfK4qFl1QHRBE"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/70 to-transparent"></div>
          <div className="absolute top-4 right-4 bg-gold-accent text-navy-deep text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 z-10">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            OCT 24-30
          </div>
          <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col gap-2 z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-primary/30 border border-primary/30 text-primary text-[10px] font-bold uppercase backdrop-blur-sm">
                Major
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 border border-white/10 text-gray-300 text-[10px] font-bold uppercase backdrop-blur-sm">
                Singles
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white leading-tight">
              XPERC World Cup 2024
            </h2>
            <div className="flex items-center text-gray-300 text-sm gap-1.5 mb-2">
              <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
              Vietnam Center Court
            </div>
            <button className="w-full mt-1 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all">
              Join Tournament
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Card 2: Asia Pacific Open */}
        <div className="group relative w-full h-72 rounded-3xl overflow-hidden shadow-xl shadow-black/40 border border-white/5">
          <img
            alt="Tournament"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzHJlz1IjuA4gUjP_1xmm4URgVoANCTc3E9MS-x4AJKW4Nnw3T7UdjcBlOrzHOGN9FtPjc6XDPPZ3ck5-_VmeudPLUA6_nT29WRDrTv4pMVGpnCwrrBf1GGE8fBiQWiYh1e06CtUWDNbNyvMxDjpdE-bfljgLKQgcdgtp7w3k2IeZNEXhEtMM9MMMcz13Ff8YnOJ0OWJXRqOwqTS6K8bTAT1JbYD5Tn90WeNs9Cq9ZiQzLNDfyYOapj9XNgW5TUjRTlw2SzcIwE20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/60 to-transparent"></div>
          <div className="absolute top-4 right-4 bg-card-dark/80 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1 z-10">
            <span className="material-symbols-outlined text-[14px] text-primary">schedule</span>
            NOV 12-15
          </div>
          <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col gap-2 z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-purple-500/30 border border-purple-500/30 text-purple-400 text-[10px] font-bold uppercase backdrop-blur-sm">
                Regional
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 border border-white/10 text-gray-300 text-[10px] font-bold uppercase backdrop-blur-sm">
                Doubles
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white leading-tight">
              Asia Pacific Open
            </h2>
            <div className="flex items-center text-gray-300 text-sm gap-1.5 mb-2">
              <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
              Jakarta Arena, Indonesia
            </div>
            <button className="w-full mt-1 bg-primary hover:bg-blue-600 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20">
              View Details
            </button>
          </div>
        </div>

        {/* Card 3: Winter Championship '23 (Completed) */}
        <div className="group relative w-full h-64 rounded-3xl overflow-hidden shadow-xl shadow-black/40 border border-white/5 grayscale opacity-80">
          <img
            alt="Tournament"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCobkSSKJ0PZ2gvi_7BMhmbKuH61GIoPg9DgI6QPWVsNzy0Iwhi2OMpp0VWgbbPfg03vWuE40W4mcZkF0usCtOINv3qbGPrywRjs_t9uhSYYiSK20vac0VjILwlKiVZRwHd1iCIDTEErWxOnP_CP-iOHAifaLnZ3Ssa9b2U_z8K_YtSWNyB5nINwwA61yotOomkDLtCQTy9uCVvw6KGsWJnLEkoL_44V2hXftL735Yik-u1TIXpgiTTaoHU8GkD3J1gbtqW8hQE4AM"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/80 to-transparent"></div>
          <div className="absolute top-4 right-4 bg-gray-800/80 backdrop-blur text-gray-300 text-xs font-bold px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-1 z-10">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            COMPLETED
          </div>
          <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col gap-2 z-10">
            <h2 className="text-2xl font-bold text-gray-300 leading-tight">
              Winter Championship &apos;23
            </h2>
            <div className="flex items-center text-gray-400 text-sm gap-1.5 mb-2">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
              Seoul Gymnasium
            </div>
            <button className="w-full mt-1 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
              See Results
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 w-full z-20 pb-6 pt-4 bg-gradient-to-t from-navy-deep via-navy-deep to-transparent">
        <div className="mx-6 bg-card-dark/80 backdrop-blur-xl border border-white/5 rounded-2xl p-2 flex justify-between items-center px-4 shadow-2xl shadow-black/50">
          <button className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-white transition-colors w-12 group">
            <span className="material-symbols-outlined text-2xl group-hover:scale-105 transition-transform">grid_view</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-primary w-12 group">
            <span className="material-symbols-outlined text-2xl fill-1 group-hover:scale-105 transition-transform">calendar_month</span>
          </button>
          <div className="relative -top-8">
            <button className="size-14 rounded-full bg-primary shadow-lg shadow-primary/40 border-4 border-background-dark flex items-center justify-center text-white group">
              <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">sports_tennis</span>
            </button>
          </div>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-white transition-colors w-12 group">
            <span className="material-symbols-outlined text-2xl group-hover:scale-105 transition-transform">leaderboard</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-white transition-colors w-12 group">
            <span className="material-symbols-outlined text-2xl group-hover:scale-105 transition-transform">person</span>
          </button>
        </div>
      </div>
    </div>
  );
}
