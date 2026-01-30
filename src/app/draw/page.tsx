export default function DrawPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-background-dark" />
        {/* Dynamic Background Image with Overlay */}
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center mix-blend-overlay"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCNDys1jBU0rccJhoEEnpk98RyWcbhcdtepFH_Zm12xSDmZlSWa0m23gcXUTdfZLZExJF67Z3rmpNghL8gk5QlBudZ4Rv-0N_XhHQXHq3eDvNzgSfE9wUC_mq8Vep3af2fomky7UJZ4cAUinnC7fvv6GASWvSO7vxrjLtfaLcxYLsgZD9Edh4gaMBG90WljtiUm89dj9CPZODgjYSzS7Uz0eA70NV9EjXlh7kRRxfD2JaY_7ieQeHJBaOSMpw2V_KiYkGe5VvqvIlE")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background-dark/80 to-background-dark" />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col h-full min-h-screen max-w-[480px] mx-auto w-full">
        {/* TopAppBar */}
        <div className="flex items-center p-4 justify-between bg-navy-deep/50 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
          <div className="text-white flex size-12 shrink-0 items-center justify-start cursor-pointer">
            <span className="material-symbols-outlined text-[24px]">
              arrow_back
            </span>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center truncate px-2">
            XPERC Badminton WC
          </h2>
          <div className="flex size-12 items-center justify-end">
            <button className="flex items-center justify-center bg-transparent text-white p-2 rounded-full hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-[24px]">
                settings
              </span>
            </button>
          </div>
        </div>

        {/* Main Display Stage */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 w-full">
          {/* HeadlineText */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary text-xs font-bold uppercase tracking-wider">
                Live Draw
              </span>
            </div>
            <h1 className="text-white tracking-tight text-[32px] font-bold leading-tight">
              Lucky Number
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Spin to generate a winner
            </p>
          </div>

          {/* Number Display Card */}
          <div className="w-full relative group">
            {/* Glow effects behind */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex flex-col items-center justify-center p-8 rounded-2xl bg-card-dark border border-white/10 shadow-xl overflow-hidden min-h-[280px]">
              {/* Decorative background inside card */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <span className="material-symbols-outlined text-6xl rotate-12">
                  sports_tennis
                </span>
              </div>

              {/* The Number */}
              <div className="flex flex-col items-center z-10">
                <span
                  className="text-[120px] font-extrabold leading-none text-transparent bg-clip-text bg-gradient-to-b from-primary to-blue-400 drop-shadow-sm font-display tracking-tighter tabular-nums"
                  style={{ textShadow: "0 0 40px rgba(19, 91, 236, 0.2)" }}
                >
                  42
                </span>
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-primary to-transparent mt-2 rounded-full opacity-50" />
              </div>

              {/* Status Badge */}
              <div className="mt-8 flex items-center justify-between w-full px-4 border-t border-white/5 pt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    Category
                  </span>
                  <span className="text-sm font-medium text-slate-300">
                    Gold Tier
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    Status
                  </span>
                  <span className="text-sm font-bold text-green-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      check_circle
                    </span>
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="w-full px-4 pb-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              History
            </h3>
            <button className="text-xs text-primary font-bold hover:text-blue-400 transition-colors">
              VIEW ALL
            </button>
          </div>

          {/* Horizontal Scroll Container */}
          <div className="flex gap-3 overflow-x-auto pb-4 snap-x hide-scroll -mx-4 px-4">
            {/* History Item 1 */}
            <div className="snap-center shrink-0 w-[240px]">
              <div className="flex flex-row items-center p-3 rounded-lg bg-card-dark border border-white/5 shadow-sm">
                <div
                  className="size-12 shrink-0 bg-slate-800 rounded-lg bg-cover bg-center mr-3"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAMXtJVaB81d2V12v5OyK3Myu7KDza__oOwgXImvh-By1Qmv0p_AU_-x0_Y4x-usM_alV7ELh-tQXjHRdhwwzf2Onhb976XZMD-98ZSU6tdfbRH1oAQMp9mt61KWrA-a9bwU4E3oSTsPnV_mvn2Jr7CKPT_DIm-zhlQjP-dHd9QlmCn68aN9KbcpiXlBdncMleBFxuiN3Zn2VSpJheXsJLQrrUknrPuhQzBv3p-Z5kwnW7wFiEp--L5CvA7QAEv0h68Kh1T7-gamP0")',
                  }}
                />
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-white text-lg font-bold leading-none">
                      #88
                    </p>
                    <span className="text-[10px] text-slate-500">2m ago</span>
                  </div>
                  <p className="text-slate-400 text-xs truncate mt-1">
                    Silver Tier Winner
                  </p>
                </div>
              </div>
            </div>

            {/* History Item 2 */}
            <div className="snap-center shrink-0 w-[240px]">
              <div className="flex flex-row items-center p-3 rounded-lg bg-card-dark border border-white/5 shadow-sm">
                <div
                  className="size-12 shrink-0 bg-slate-800 rounded-lg bg-cover bg-center mr-3"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDuRGLW4s6DPr8iSSdweNZdL_Y5bx2g__ivn7-hxx4VJMRx2ZdtcITVyuqfLa7WGJRCBIFa_KXveFXqKyTWzW24EpPE0od-vr0Wp0eTHiwmIQ9ntrjHCUKq2NQ4A1JKaUOx27RWxhIS_ox918DXTfKttK6cQc-7zI2BMLnnU1Ab5dSguJ2NHeMZkvVGsuEbVasMD8Q3_fQWS5lYWAKsrYOgKghmIzPnZM1MYDnJNdZIv69LqG2qoTqn1yPdDQvZ3a7qYxgHKgwX0H0")',
                  }}
                />
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-white text-lg font-bold leading-none">
                      #12
                    </p>
                    <span className="text-[10px] text-slate-500">5m ago</span>
                  </div>
                  <p className="text-slate-400 text-xs truncate mt-1">
                    Bronze Tier Winner
                  </p>
                </div>
              </div>
            </div>

            {/* History Item 3 */}
            <div className="snap-center shrink-0 w-[240px]">
              <div className="flex flex-row items-center p-3 rounded-lg bg-card-dark border border-white/5 shadow-sm">
                <div
                  className="size-12 shrink-0 bg-slate-800 rounded-lg bg-cover bg-center mr-3"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCKphP5u7gsC01PpwbSNYCPIKar2p1fQeIYshaKXdeJSev_N7sKS2M_Zdd5AwG1yQct9TlUQ5H88DoBrqKe9AS72Y5EJYIGgWCu4r1c5-kxCLqfI32_BT3w109u_r_5fwHiUmHRjb_Av91ShfFBTAPpu8J6u2aoP2YWFNJRmePVw-yC55KfjsZ7_0Ge1k6wOWRfm8ONIM_EUDAHZMOfAav41tP6xfJfjpsoJtNvHPkz-SYjY7IqJn5E-VRF4bNK6gak5x6avxnBFVA")',
                  }}
                />
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-white text-lg font-bold leading-none">
                      #05
                    </p>
                    <span className="text-[10px] text-slate-500">8m ago</span>
                  </div>
                  <p className="text-slate-400 text-xs truncate mt-1">
                    Bronze Tier Winner
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SingleButton (Action Area) */}
        <div className="p-4 pt-2 bg-gradient-to-t from-background-dark via-background-dark to-transparent sticky bottom-0 z-40 w-full">
          <button className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-16 bg-primary text-white gap-3 px-6 shadow-[0_0_20px_rgba(19,91,236,0.4)] hover:shadow-[0_0_30px_rgba(19,91,236,0.6)] hover:bg-blue-600 transition-all active:scale-[0.98]">
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-xl" />
            <span
              className="material-symbols-outlined text-[28px] animate-spin-slow"
              style={{ animationDuration: "3s" }}
            >
              cached
            </span>
            <span className="text-lg font-bold leading-normal tracking-wider">
              DRAW NOW
            </span>
          </button>
          <div className="h-2" />
          {/* Spacing for safe area */}
        </div>
      </div>
    </div>
  );
}
