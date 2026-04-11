import { useState } from "react";

const plans = [
  {
    id: "musician",
    name: "Musician",
    monthlyPrice: 2.08,
    annualPrice: 24.99,
    artists: "1 artist",
    badge: "Great Value",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    borderColor: "border-white/[0.06]",
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
    ctaClass: "bg-white/[0.06] hover:bg-white/10 text-white border border-white/10",
  },
  {
    id: "musician_plus",
    name: "Musician Plus",
    monthlyPrice: 3.75,
    annualPrice: 44.99,
    artists: "2 artists",
    badge: "Most Popular",
    badgeColor: "bg-emerald-500 text-white border-emerald-600",
    borderColor: "border-emerald-500/50",
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
    ctaClass: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/25",
  },
  {
    id: "ultimate",
    name: "Ultimate",
    monthlyPrice: 7.50,
    annualPrice: 89.99,
    artists: "5+ artists",
    badge: "Save up to 40%",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    borderColor: "border-white/[0.06]",
    features: [
      "Everything in Musician Plus",
      "Free iPhone app access",
      "1TB instant file sharing",
      "Playlist contact database",
      "Priority distribution",
      "Advanced analytics",
    ],
    cta: "Go Ultimate",
    ctaClass: "bg-white/[0.06] hover:bg-white/10 text-white border border-white/10",
  },
];

export default function UpgradeModal({ onClose, user }) {
  const [billing, setBilling] = useState("annual");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-[#0f0f1a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Top gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="2" y1="2" x2="12" y2="12" /><line x1="12" y1="2" x2="2" y2="12" />
            </svg>
          </button>

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
            <span className="text-2xl">👑</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Choose Your Plan</h2>
          <p className="text-white/40 text-sm mb-6">Distribute unlimited music. Keep 100% of your royalties.</p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/[0.06]">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${billing === "monthly" ? "bg-white/10 text-white" : "text-white/35 hover:text-white/60"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${billing === "annual" ? "bg-white/10 text-white" : "text-white/35 hover:text-white/60"}`}
            >
              Annual
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                Save 40%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="px-6 pb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const price = billing === "annual" ? plan.monthlyPrice : plan.monthlyPrice * 1.4;
            const billed = billing === "annual" ? plan.annualPrice : (plan.monthlyPrice * 1.4 * 12).toFixed(2);

            return (
              <div
                key={plan.id}
                className={`rounded-2xl border p-5 flex flex-col relative transition-all ${plan.borderColor} ${plan.highlight ? "bg-gradient-to-b from-emerald-500/10 to-transparent" : "bg-white/[0.02]"}`}
              >
                {/* Badge */}
                <div className="mb-4">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${plan.badgeColor}`}>
                    {plan.badge}
                  </span>
                </div>

                {/* Name + price */}
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-white">${price.toFixed(2)}</span>
                  <span className="text-white/30 text-sm">/month</span>
                </div>
                <p className="text-[11px] text-white/30 mb-1">
                  ${billed} billed {billing === "annual" ? "annually" : "monthly"}
                </p>
                <p className="text-[12px] text-white/50 mb-4 font-medium">{plan.artists}</p>

                {/* Features */}
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px] text-white/60">
                      <svg width="14" height="14" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
                        <polyline points="2,7 5,10 12,3" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => {
                    alert(`${plan.name} plan — Payment integration coming soon! We will notify you.`);
                    onClose();
                  }}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98] ${plan.ctaClass}`}
                >
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="px-8 pb-6 text-center">
          <p className="text-[11px] text-white/20">
            Cancel anytime · No hidden fees · 7-day free trial · Secure payment via Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
