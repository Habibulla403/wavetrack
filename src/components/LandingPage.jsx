export default function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0A0A0F]/90 backdrop-blur border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center">
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path d="M1.5 8 Q3.5 4 5.5 8 Q7.5 12 9.5 8 Q11.5 4 13.5 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-bold text-[17px] tracking-tight">WaveTrack</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#platforms" className="hover:text-white transition-colors">Platforms</a>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onGetStarted} className="text-sm text-white/60 hover:text-white transition-colors">Sign in</button>
          <button onClick={onGetStarted} className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-semibold text-white transition-all active:scale-95">
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Now distributing to 150+ platforms
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Distribute your music
            <span className="block text-emerald-400">to the world</span>
          </h1>
          <p className="text-white/50 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload once. Reach Spotify, Apple Music, YouTube Music, and 150+ more platforms. Keep 100% of your royalties. No hidden fees.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onGetStarted} className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-base font-bold text-white transition-all active:scale-95 shadow-lg shadow-emerald-500/25">
              Start for Free — No Credit Card
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 text-base font-medium text-white/70 transition-all">
              Watch Demo
            </button>
          </div>
          <p className="text-white/25 text-sm mt-4">Free forever. Upgrade anytime.</p>
        </div>
      </section>

      {/* Platform logos */}
      <section id="platforms" className="py-12 px-6 border-y border-white/[0.05]">
        <p className="text-center text-white/25 text-sm font-medium uppercase tracking-widest mb-8">Distribute to all major platforms</p>
        <div className="flex flex-wrap items-center justify-center gap-6 max-w-4xl mx-auto">
          {[
            { name: "Spotify", color: "#1DB954", bg: "bg-[#1DB954]" },
            { name: "Apple Music", color: "#fc3c44", bg: "bg-[#fc3c44]" },
            { name: "YouTube Music", color: "#FF0000", bg: "bg-[#FF0000]" },
            { name: "Amazon Music", color: "#00A8E1", bg: "bg-[#00A8E1]" },
            { name: "Deezer", color: "#a238ff", bg: "bg-[#a238ff]" },
            { name: "Tidal", color: "#009EE0", bg: "bg-[#009EE0]" },
            { name: "TikTok", color: "#ff0050", bg: "bg-[#ff0050]" },
            { name: "SoundCloud", color: "#FF5500", bg: "bg-[#FF5500]" },
          ].map((p) => (
            <div key={p.name} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className={`w-5 h-5 rounded-md ${p.bg} flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0`}>
                {p.name.slice(0, 1)}
              </div>
              <span className="text-sm text-white/60 font-medium">{p.name}</span>
            </div>
          ))}
          <div className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-sm text-white/40">+142 more</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything you need to succeed</h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">From upload to royalties — we handle everything so you can focus on making music.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "🎵", title: "Upload in minutes", desc: "Upload your MP3, WAV, or FLAC files. We handle the rest — formatting, encoding, and delivery." },
              { icon: "🌍", title: "150+ platforms", desc: "Your music reaches Spotify, Apple Music, YouTube Music, Amazon, Deezer, TikTok, and 144 more." },
              { icon: "💰", title: "Keep 100% royalties", desc: "Unlike other services, we never take a cut of your earnings. Every cent goes straight to you." },
              { icon: "📊", title: "Real-time analytics", desc: "Track streams, earnings, and fan locations across all platforms in one unified dashboard." },
              { icon: "⚡", title: "Fast distribution", desc: "Your music goes live on all platforms within 24-48 hours of submission." },
              { icon: "🔒", title: "Secure & reliable", desc: "Your music and data are protected with enterprise-grade security. Sleep easy." },
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all group">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Simple, honest pricing</h2>
            <p className="text-white/40 text-lg">No hidden fees. No surprises. Just music.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Free</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-white/40">/month</span>
                </div>
                <p className="text-white/40 text-sm mt-2">Perfect for getting started</p>
              </div>
              <ul className="space-y-3 mb-8">
                {["Up to 3 songs", "All major platforms", "Keep 100% royalties", "Basic analytics"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/60">
                    <svg width="16" height="16" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round"><polyline points="3,8 6,11 13,4"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={onGetStarted} className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-semibold text-white transition-all">
                Get Started Free
              </button>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-xs font-bold text-white">
                MOST POPULAR
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">$9.99</span>
                  <span className="text-white/40">/month</span>
                </div>
                <p className="text-white/40 text-sm mt-2">For serious artists</p>
              </div>
              <ul className="space-y-3 mb-8">
                {["Unlimited songs", "150+ platforms", "Keep 100% royalties", "Advanced analytics", "Priority support", "Pre-save campaigns"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                    <svg width="16" height="16" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round"><polyline points="3,8 6,11 13,4"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={onGetStarted} className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-bold text-white transition-all active:scale-95 shadow-lg shadow-emerald-500/25">
                Start Pro Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to share your music with the world?</h2>
          <p className="text-white/40 text-lg mb-8">Join thousands of independent artists already distributing with WaveTrack.</p>
          <button onClick={onGetStarted} className="px-10 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-base font-bold text-white transition-all active:scale-95 shadow-lg shadow-emerald-500/25">
            Start for Free Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Top section - logo + columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                    <path d="M1.5 8 Q3.5 4 5.5 8 Q7.5 12 9.5 8 Q11.5 4 13.5 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="font-bold text-[17px] tracking-tight text-white">WaveTrack</span>
              </div>
              <p className="text-white/35 text-sm leading-relaxed">
                Distribute your music to 150+ platforms worldwide. Keep 100% of your royalties.
              </p>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">Company</h4>
              <ul className="space-y-3">
                {["About Us", "Blog / News", "Careers", "Artists For Change", "Affiliate Program"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">Product</h4>
              <ul className="space-y-3">
                {["Plans & Pricing", "Distribution", "Analytics", "HyperFollow", "Mobile App", "Direct Sales"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Partner */}
            <div>
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">Partner</h4>
              <ul className="space-y-3">
                {["Student Discount", "Education Faculty", "Influencer Program", "Label Program"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">Help</h4>
              <ul className="space-y-3">
                {["Support Center", "Contact Us", "Distribution Agreement", "Sitemap"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
              {/* App store badges */}
              <div className="mt-6 space-y-2">
                <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] transition-colors w-fit">
                  <svg width="14" height="14" fill="white" viewBox="0 0 14 14" opacity="0.6"><path d="M7 0C3.13 0 0 3.13 0 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm3.5 7.7l-5 3c-.18.11-.4-.02-.4-.23V3.53c0-.21.22-.34.4-.23l5 3c.17.1.17.37 0 .4z"/></svg>
                  <span className="text-[11px] text-white/50">iOS App</span>
                </a>
                <a href="#" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] transition-colors w-fit">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" opacity="0.6"><path d="M3 3l7.5 9L3 21h2l6.5-7.8L17 21h4L13.5 12 21 3h-2l-6 7.2L7 3H3z" fill="white"/></svg>
                  <span className="text-[11px] text-white/50">Android App</span>
                </a>
              </div>
            </div>
          </div>

          {/* Language selector row */}
          <div className="flex flex-wrap gap-1.5 mb-8 pb-8 border-b border-white/[0.05]">
            {["English", "বাংলা", "Español", "Français", "Deutsch", "Português", "日本語", "한국어", "العربية", "हिन्दी", "Türkçe", "Italiano"].map((lang, i) => (
              <button
                key={lang}
                className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${i === 0 ? "bg-white/10 text-white/70" : "text-white/25 hover:text-white/50 hover:bg-white/5"}`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[13px] text-white/25">© WaveTrack 2026</p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {["Privacy Policy", "Cookie Policy", "Terms of Use", "Distribution Agreement"].map((item) => (
                <a key={item} href="#" className="text-[12px] text-white/25 hover:text-white/50 transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
