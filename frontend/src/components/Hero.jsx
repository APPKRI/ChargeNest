import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero-bg min-h-screen flex items-center overflow-hidden relative pt-20">

      {/* Background orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-200/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="fade-in-up inline-flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full pulse-green" />
              <span className="text-xs font-semibold text-green-700 tracking-wide uppercase">EV charging marketplace</span>
            </div>

            {/* Headline */}
            <h1 className="fade-in-up-delay-1 text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-gray-900">
              Charge your EV{" "}
              <span className="gradient-text">anywhere</span>,{" "}
              <br className="hidden md:block" />
              anytime.
            </h1>

            <p className="fade-in-up-delay-2 text-lg text-gray-500 leading-relaxed max-w-lg">
              Find trusted home charging stations along your journey. Plan routes, book slots, and charge without range anxiety — all in one app.
            </p>

            {/* CTA Buttons */}
            <div className="fade-in-up-delay-3 flex flex-wrap gap-4 items-center">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 shadow-xl shadow-green-500/30 hover:shadow-green-500/50 hover:scale-[1.03] text-base"
              >
                <span>⚡</span> Find Chargers
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:border-green-300 hover:bg-green-50 hover:text-green-700 transition-all duration-200 shadow-sm hover:shadow-md text-base"
              >
                🏠 Become a Host
              </Link>
            </div>

          </div>

          {/* Right - Hero visual */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-green-600/20 rounded-full blur-2xl scale-110" />

              {/* Main card */}
              <div className="animate-float relative bg-white rounded-3xl shadow-2xl shadow-green-900/10 p-8 border border-green-100 w-80">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">⚡</div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Route Charger</p>
                    <p className="text-xs text-gray-400">Shown after route search</p>
                  </div>
                  <span className="ml-auto text-[10px] font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">Live Data</span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  {["Power", "Price", "Type"].map((label) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-xs font-black text-gray-800">--</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-green-500/30 hover:opacity-90 transition">
                  Book This Slot →
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
