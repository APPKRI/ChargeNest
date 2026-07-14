const features = [
  {
    icon: "📍",
    gradient: "from-emerald-400 to-green-600",
    shadow: "shadow-green-500/20",
    title: "Route Aware Search",
    desc: "Find charging stations that lie directly along your journey — no detours, no guessing.",
  },
  {
    icon: "📅",
    gradient: "from-blue-400 to-cyan-600",
    shadow: "shadow-blue-500/20",
    title: "Instant Booking",
    desc: "Reserve your charging slot in just a few clicks. Get confirmations in real-time.",
  },
  {
    icon: "💳",
    gradient: "from-violet-400 to-purple-600",
    shadow: "shadow-purple-500/20",
    title: "Secure Payments",
    desc: "Pay securely through our nestPay wallet. Full refunds for cancellations.",
  },
  {
    icon: "🏠",
    gradient: "from-orange-400 to-amber-600",
    shadow: "shadow-orange-500/20",
    title: "Host Your Charger",
    desc: "List your home charger and earn passive income while helping EV drivers.",
  },
  {
    icon: "⚡",
    gradient: "from-yellow-400 to-orange-500",
    shadow: "shadow-yellow-500/20",
    title: "Battery Planner",
    desc: "Enter your battery level and get predicted stop counts for long-distance trips.",
  },
  {
    icon: "🗺️",
    gradient: "from-teal-400 to-emerald-600",
    shadow: "shadow-teal-500/20",
    title: "Live Route Map",
    desc: "Interactive map with full turn-by-turn routing powered by OpenStreetMap.",
  },
];

function Features() {
  return (
    <section className="py-28 bg-white relative overflow-hidden">
      {/* Subtle background decor */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-200 to-transparent" />
      <div className="absolute top-10 right-20 w-64 h-64 bg-green-50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-20">
          <span className="inline-block text-xs font-bold text-green-600 uppercase tracking-widest bg-green-50 border border-green-100 px-4 py-1.5 rounded-full mb-4">
            Why ChargeNest
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
            Everything you need to{" "}
            <span className="gradient-text">charge smarter</span>
          </h2>
          <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            Making EV charging simple, affordable and accessible across India.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group card-lift bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:border-green-100"
            >
              {/* Icon */}
              <div className={`w-14 h-14 bg-gradient-to-br ${f.gradient} rounded-2xl flex items-center justify-center text-2xl shadow-lg ${f.shadow} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {f.icon}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-20 bg-gradient-to-br from-emerald-500 to-green-700 rounded-3xl p-10 text-center text-white relative overflow-hidden shadow-xl shadow-green-900/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent)]" />
          <h3 className="text-3xl font-black mb-3 relative">Ready to go green? 🌱</h3>
          <p className="text-green-100 mb-7 text-base relative">Join thousands of EV drivers saving time and money with ChargeNest.</p>
          <div className="flex flex-wrap gap-4 justify-center relative">
            <a href="/signup" className="px-8 py-3.5 bg-white text-green-700 font-bold rounded-2xl hover:bg-green-50 transition shadow-lg text-sm">
              Start for Free →
            </a>
            <a href="/about" className="px-8 py-3.5 bg-white/10 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition text-sm">
              Learn More
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Features;