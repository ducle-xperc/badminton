export default function LoginPage() {
  return (
    <div className="relative mx-auto min-h-screen max-w-[480px] bg-background-dark overflow-hidden flex flex-col items-center justify-center px-8 py-12 text-white">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/4 left-0 w-full h-[2px] court-line"></div>
        <div className="absolute bottom-1/4 left-0 w-full h-[2px] court-line"></div>
        <div className="absolute left-1/2 top-0 w-[2px] h-full court-line -translate-x-1/2"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 border border-gold-accent/20 rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 border border-primary/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
          <span className="material-symbols-outlined text-[300px]">
            sports_tennis
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-primary to-blue-700 shadow-xl shadow-primary/20 mb-6">
            <span className="material-symbols-outlined text-white text-4xl font-light">
              emoji_events
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gold-accent font-bold tracking-[0.3em] text-xs uppercase">
              Official App
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight uppercase leading-none">
              XPERC <br />
              <span className="text-primary italic">BADMINTON</span> <br />
              <span className="text-white">WORLD CUP</span>
            </h1>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Nickname */}
          <div className="space-y-2">
            <label
              className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1"
              htmlFor="nickname"
            >
              Nickname
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                alternate_email
              </span>
              <input
                className="w-full bg-navy-deep/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-gold-accent/50 focus:ring-1 focus:ring-gold-accent/50 transition-all backdrop-blur-sm"
                id="nickname"
                name="nickname"
                placeholder="Choose a nickname"
                type="text"
              />
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <label
              className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1"
              htmlFor="name"
            >
              Full Name <span className="text-gray-500 normal-case tracking-normal">(Optional)</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">
                person
              </span>
              <input
                className="w-full bg-navy-deep/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-gold-accent/50 focus:ring-1 focus:ring-gold-accent/50 transition-all backdrop-blur-sm"
                id="name"
                name="name"
                placeholder="Enter your name"
                type="text"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              className="group relative w-full bg-primary hover:bg-blue-600 text-white font-extrabold py-5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/40 text-lg uppercase tracking-wider overflow-hidden cursor-pointer"
              type="submit"
            >
              <span className="relative z-10">Login</span>
              <span className="material-symbols-outlined relative z-10 text-[24px] group-hover:translate-x-1 transition-transform">
                login
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs font-medium uppercase tracking-tighter">
            Join the elite circle of world class badminton
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <div className="h-1 w-8 bg-gold-accent/30 rounded-full"></div>
            <div className="h-1 w-8 bg-primary/30 rounded-full"></div>
            <div className="h-1 w-8 bg-gold-accent/30 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
