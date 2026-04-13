import { useState } from "react";

const PLATFORMS = [
  { name: "Spotify",       color: "#1DB954", emoji: "🎵" },
  { name: "Apple Music",   color: "#fc3c44", emoji: "🍎" },
  { name: "YouTube Music", color: "#FF0000", emoji: "▶️" },
  { name: "Amazon Music",  color: "#00A8E1", emoji: "📦" },
  { name: "Deezer",        color: "#a238ff", emoji: "🎶" },
  { name: "Tidal",         color: "#009EE0", emoji: "🌊" },
  { name: "TikTok",        color: "#ff0050", emoji: "🎤" },
  { name: "SoundCloud",    color: "#FF5500", emoji: "☁️" },
];

const FEATURES = [
  { icon: "🚀", title: "Upload in minutes", desc: "Drag and drop your MP3, WAV, or FLAC. We handle encoding, formatting, and delivery to every platform." },
  { icon: "🌍", title: "150+ platforms", desc: "Spotify, Apple Music, YouTube, Amazon, Deezer, TikTok, SoundCloud and 143 more — all in one upload." },
  { icon: "💰", title: "Keep 100% royalties", desc: "No commission, no hidden cuts. Every cent from your streams goes directly to you." },
  { icon: "📊", title: "Real-time analytics", desc: "See exactly how many streams, from where, on which platform — updated daily." },
  { icon: "⚡", title: "24–48hr distribution", desc: "Your music goes live on all platforms within 24 to 48 hours of submission." },
  { icon: "🔒", title: "Secure & reliable", desc: "Enterprise-grade security protects your music, metadata, and earnings data." },
];

const PLANS = [
  {
    id: "musician", name: "Musician", badge: "Great Value", badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    monthly: "$3.99", annual: "$2.08", annualTotal: "$24.99",
    sub: "1 artist",
    features: ["Unlimited song uploads", "150+ platforms", "Keep 100% royalties", "Basic analytics", "Spotify Registered Artist label", "Create royalty splits", "Mobile app access"],
  },
  {
    id: "musician_plus", name: "Musician Plus", badge: "Most Popular", badgeColor: "bg-emerald-500 text-white", highlighted: true,
    monthly: "$5.99", annual: "$3.75", annualTotal: "$44.99",
    sub: "2 artists · Save 15%",
    features: ["Everything in Musician", "Advanced analytics", "Daily streaming stats", "Synced lyrics in Apple Music", "Custom label name", "Custom release date", "Priority support"],
  },
  {
    id: "ultimate", name: "Ultimate", badge: "Save up to 40%", badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    monthly: "$12.99", annual: "$7.50", annualTotal: "$89.99",
    sub: "5+ artists",
    features: ["Everything in Musician Plus", "1TB instant file sharing", "Playlist contact database", "Priority distribution", "Dedicated account manager", "Advanced royalty splits"],
  },
];

const TESTIMONIALS = [
  { name: "Jarvis Okeke", role: "Afrobeats Artist", text: "WaveTrack got my EP on Spotify within 48 hours. The analytics dashboard is insane — I can see exactly which cities my fans are from.", avatar: "J" },
  { name: "Maya Chen",   role: "Lo-fi Producer",   text: "I was paying 15% royalties elsewhere. WaveTrack keeps 100% for me. Game changer for independent artists.", avatar: "M" },
  { name: "Kwame Asante", role: "Afropop Musician", text: "The upload process is so smooth. I uploaded 12 songs in one afternoon. They were all live within 2 days.", avatar: "K" },
];

export default function LandingPage({ onGetStarted }) {
  const [billing, setBilling] = useState("annual");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0F]/90 backdrop-blur border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <path d="M1.5 8 Q3.5 4 5.5 8 Q7.5 12 9.5 8 Q11.5 4 13.5 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-bold text-[17px] tracking-tight">WaveTrack</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
            <a href="#features"  className="hover:text-white transition-colors">Features</a>
            <a href="#platforms" className="hover:text-white transition-colors">Platforms</a>
            <a href="#pricing"   className="hover:text-white transition-colors">Pricing</a>
            <a href="#reviews"   className="hover:text-white transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onGetStarted} className="hidden sm:block text-sm text-white/50 hover:text-white transition-colors">Sign in</button>
            <button onClick={onGetStarted} className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-bold text-white transition-all active:scale-95 shadow-lg shadow-emerald-500/25">
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-36 pb-24 px-6 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-500/8 rounded-full blur-3xl pointer-events-none"/>
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
            Now distributing to 150+ platforms worldwide
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
            Your music.
            <span className="block bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              The whole world.
            </span>
          </h1>
          <p className="text-white/50 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload once. Reach Spotify, Apple Music, YouTube, and 147 more platforms. Keep 100% of your royalties. Go live in 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <button onClick={onGetStarted} className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-base font-bold text-white transition-all active:scale-95 shadow-2xl shadow-emerald-500/30">
              Start for Free — No Credit Card
            </button>
            <a href="#pricing" className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 text-base font-medium text-white/60 transition-all text-center">
              See Pricing →
            </a>
          </div>
          <p className="text-white/25 text-sm">Free forever · Upgrade anytime · Cancel anytime</p>

          {/* Social proof */}
          <div className="mt-10 flex items-center justify-center gap-6 flex-wrap">
            {[["10,000+", "Artists"], ["150+", "Platforms"], ["$2M+", "Royalties Paid"]].map(([val, lab]) => (
              <div key={lab} className="text-center">
                <div className="text-2xl font-black text-white">{val}</div>
                <div className="text-xs text-white/30">{lab}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platform logos ── */}
      <section id="platforms" className="py-14 px-6 border-y border-white/[0.05] bg-white/[0.01]">
        <p className="text-center text-white/25 text-xs font-semibold uppercase tracking-widest mb-8">Distribute to every major platform</p>
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
          {PLATFORMS.map(p => (
            <div key={p.name} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-all">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: p.color + "33" }}>
                {p.emoji}
              </div>
              <span className="text-sm text-white/60 font-medium">{p.name}</span>
            </div>
          ))}
          <div className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-sm text-white/30">+142 more</span>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Everything you need to succeed</h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">From upload to royalties — WaveTrack handles everything so you can focus on making music.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:-translate-y-0.5 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center text-2xl mb-4 group-hover:bg-emerald-500/10 transition-all">{f.icon}</div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="reviews" className="py-20 px-6 bg-white/[0.01] border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">Loved by independent artists</h2>
            <p className="text-white/40">Real reviews from real WaveTrack artists</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, s) => <span key={s} className="text-yellow-400 text-sm">★</span>)}
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-[11px] text-white/30">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Simple, honest pricing</h2>
            <p className="text-white/40 text-lg mb-8">No hidden fees. Keep 100% royalties. Cancel anytime.</p>
            {/* Billing toggle */}
            <div className="inline-flex items-center gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/[0.06]">
              {["monthly", "annual"].map(b => (
                <button key={b} onClick={() => setBilling(b)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all flex items-center gap-2 ${
                    billing === b ? "bg-white/10 text-white" : "text-white/35 hover:text-white/60"
                  }`}>
                  {b === "annual" ? "Annual" : "Monthly"}
                  {b === "annual" && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">Save 40%</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map(plan => (
              <div key={plan.id} className={`p-6 rounded-2xl border flex flex-col ${
                plan.highlighted
                  ? "border-emerald-500/50 bg-gradient-to-b from-emerald-500/10 to-transparent"
                  : "border-white/[0.06] bg-white/[0.02]"
              }`}>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border w-fit mb-4 ${plan.badgeColor}`}>{plan.badge}</span>
                <h3 className="text-xl font-black text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black text-white">{billing === "annual" ? plan.annual : plan.monthly}</span>
                  <span className="text-white/30">/month</span>
                </div>
                {billing === "annual" && <p className="text-[12px] text-white/30 mb-1">{plan.annualTotal} billed annually</p>}
                <p className="text-sm text-white/40 font-medium mb-5">{plan.sub}</p>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-white/55">
                      <svg width="14" height="14" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0 mt-0.5"><polyline points="2,7 5,10 12,3"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={onGetStarted} className={`w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/25"
                    : "border border-white/10 hover:bg-white/5 text-white"
                }`}>
                  Try WaveTrack
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-[12px] text-white/20 mt-6">
            7-day free trial · No credit card required · Cancel anytime · Secured by Stripe
          </p>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-10 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"/>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 relative">Ready to share your music?</h2>
            <p className="text-white/50 text-lg mb-8 relative">Join 10,000+ independent artists already distributing with WaveTrack.</p>
            <button onClick={onGetStarted} className="px-10 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-base font-bold text-white transition-all active:scale-95 shadow-2xl shadow-emerald-500/30 relative">
              Start for Free Today
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.05] pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 mb-12">
            <div className="col-span-2 sm:col-span-3 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                    <path d="M1.5 8 Q3.5 4 5.5 8 Q7.5 12 9.5 8 Q11.5 4 13.5 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="font-bold text-[17px] tracking-tight">WaveTrack</span>
              </div>
              <p className="text-white/35 text-sm leading-relaxed">Distribute your music to 150+ platforms. Keep 100% of your royalties.</p>
            </div>
            {[
              { title: "Company", links: ["About Us", "Blog", "Careers", "Artists For Change", "Affiliate Program"] },
              { title: "Product",  links: ["Plans & Pricing", "Distribution", "Analytics", "Mobile App", "API"] },
              { title: "Partner",  links: ["Student Discount", "Education", "Influencer Program", "Label Program"] },
              { title: "Help",     links: ["Support Center", "Contact Us", "Distribution Agreement", "Sitemap"] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map(link => (
                    <li key={link}><a href="#" className="text-sm text-white/40 hover:text-white transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.05] pt-8">
            <p className="text-[13px] text-white/25">© WaveTrack 2026. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {["Privacy Policy", "Cookie Policy", "Terms of Use", "Distribution Agreement"].map(item => (
                <a key={item} href="#" className="text-[12px] text-white/25 hover:text-white/50 transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
