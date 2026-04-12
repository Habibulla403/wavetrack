import { useState } from "react";

const plans = [
  {
    id: "musician",
    name: "Musician",
    emoji: "🎵",
    monthlyPrice: 2.08,
    annualPrice: 24.99,
    artists: "1 artist",
    badge: "Great Value",
    badgeBg: "bg-blue-500/20 text-blue-300 border-blue-400/30",
    cardBg: "bg-white/[0.03]",
    border: "border-white/[0.08]",
    glow: "",
    features: [
      "Upload unlimited songs",
      "All major platforms",
      "Keep 100% royalties",
      "Lyrics in Google & more",
      "Spotify Registered Artist label",
      "Create royalty splits",
      "Mobile app access",
    ],
    cta: "Get Started",
    ctaBg: "bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/10",
  },
  {
    id: "musician_plus",
    name: "Musician Plus",
    emoji: "⭐",
    monthlyPrice: 3.75,
    annualPrice: 44.99,
    artists: "2 artists",
    badge: "Most Popular",
    badgeBg: "bg-emerald-500 text-white border-transparent",
    cardBg: "bg-gradient-to-b from-emerald-500/[0.12] via-teal-500/[0.06] to-transparent",
    border: "border-emerald-400/40",
    glow: "shadow-[0_0_40px_rgba(16,185,129,0.15)]",
    highlight: true,
    save: "Save 15%",
    features: [
      "Everything in Musician",
      "Synced lyrics in Apple Music",
      "Daily streaming stats",
      "Customizable label name",
      "Customizable release date",
      "Customizable preorder date",
      "Custom iTunes pricing",
      "Mobile app access",
    ],
    cta: "Upgrade Now",
    ctaBg: "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-white shadow-lg shadow-emerald-500/30",
  },
  {
    id: "ultimate",
    name: "Ultimate",
    emoji: "👑",
    monthlyPrice: 7.50,
    annualPrice: 89.99,
    artists: "5+ artists",
    badge: "Save up to 40%",
    badgeBg: "bg-violet-500/20 text-violet-300 border-violet-400/30",
    cardBg: "bg-gradient-to-b from-violet-500/[0.07] to-transparent",
    border: "border-violet-400/20",
    glow: "",
    features: [
      "Everything in Musician Plus",
      "Free iPhone app access",
      "1TB instant file sharing",
      "Playlist contact database",
      "Priority distribution",
      "Advanced analytics",
    ],
    cta: "Go Ultimate",
    ctaBg: "bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white shadow-lg shadow-violet-500/20",
  },
];

export default function UpgradeModal({ onClose, user }) {
  const [billing, setBilling] = useState("annual");
  const [hovered, setHovered] = useState(null);

  const getPrice = (plan) =>
    billing === "annual" ? plan.monthlyPrice : +(plan.monthlyPrice * 1.4).toFixed(2);

  const getBilled = (plan) =>
    billing === "annual" ? plan.annualPrice : +(plan.monthlyPrice * 1.4 * 12).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}/>

      {/* Modal */}
      <div className="relative w-full max-w-3xl bg-[#0c0c1a] border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">

        {/* Top shimmer line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent"/>

        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"/>

        {/* Close */}
        <button onClick={onClose}
          className="absolute right-5 top-5 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-white/40 hover:text-white transition-all z-10">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/>
          </svg>
        </button>

        {/* Header */}
        <div className="px-6 pt-8 pb-6 text-center relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 mb-4 shadow-xl shadow-emerald-500/30 text-2xl">
            👑
          </div>
          <h2 className="text-2xl font-bold text-white mb-1.5">Choose Your Plan</h2>
          <p className="text-white/40 text-sm">Distribute unlimited music. Keep 100% of your royalties.</p>

          {/* Billing toggle */}
          <div className="inline-flex items-center mt-5 p-1 bg-white/[0.04] rounded-2xl border border-white/[0.07]">
            <button onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                billing === "monthly" ? "bg-white/[0.10] text-white" : "text-white/30 hover:text-white/60"
              }`}>
              Monthly
            </button>
            <button onClick={() => setBilling("annual")}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                billing === "annual" ? "bg-white/[0.10] text-white" : "text-white/30 hover:text-white/60"
              }`}>
              Annual
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                Save 40%
              </span>
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <div className="px-5 pb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onMouseEnter={() => setHovered(plan.id)}
              onMouseLeave={() => setHovered(null)}
              className={`relative rounded-2xl border p-5 flex flex-col transition-all duration-300 cursor-default
                ${plan.cardBg} ${plan.border} ${plan.glow}
                ${hovered === plan.id ? "scale-[1.02] -translate-y-1" : ""}
                ${plan.highlight ? "ring-1 ring-emerald-400/20" : ""}
              `}
            >
              {/* Badge */}
              <span className={`inline-flex w-fit text-[10px] font-bold px-2.5 py-1 rounded-full border mb-4 ${plan.badgeBg}`}>
                {plan.badge}
              </span>

              {/* Emoji + Name */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{plan.emoji}</span>
                <h3 className="text-base font-bold text-white">{plan.name}</h3>
              </div>

              {/* Price */}
              <div className="mb-0.5">
                <span className="text-3xl font-black text-white">${getPrice(plan)}</span>
                <span className="text-white/30 text-sm ml-1">/month</span>
              </div>
              <p className="text-[11px] text-white/25 mb-1">
                ${getBilled(plan)} billed {billing === "annual" ? "annually" : "monthly"}
              </p>
              <p className="text-[12px] text-white/40 font-medium mb-5">{plan.artists}</p>

              {/* Features */}
              <ul className="space-y-2 flex-1 mb-5">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-white/55">
                    <svg width="13" height="13" fill="none" stroke={plan.highlight ? "#34d399" : plan.id === "ultimate" ? "#a78bfa" : "#60a5fa"} strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
                      <polyline points="1.5,6.5 4.5,9.5 11.5,2.5"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => {
                  alert(`${plan.name} — Payment integration coming soon! You'll be notified.`);
                  onClose();
                }}
                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-[0.97] ${plan.ctaBg}`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="px-6 pb-7">
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-white/[0.05]">
            {[
              { icon:"🔒", text:"Secure payment" },
              { icon:"↩️", text:"Cancel anytime" },
              { icon:"🎁", text:"7-day free trial" },
              { icon:"💳", text:"No hidden fees" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-white/20">
                <span>{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom shimmer */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"/>
      </div>
    </div>
  );
}
