export default function UpgradeModal({ onClose, user }) {
  const features = {
    free: [
      "Up to 3 songs",
      "4 major platforms",
      "Basic analytics",
      "Standard support",
    ],
    pro: [
      "Unlimited songs",
      "150+ platforms",
      "Advanced analytics",
      "Priority support",
      "Pre-save campaigns",
      "HyperFollow pages",
      "Direct sales",
      "Revenue insights",
    ],
  };

  const isPro = user?.plan === "pro";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#0f0f1a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
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
          <h2 className="text-2xl font-bold text-white mb-2">Upgrade to Pro</h2>
          <p className="text-white/40 text-sm">Unlock everything WaveTrack has to offer</p>
        </div>

        {/* Plans comparison */}
        <div className="px-8 pb-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Free */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <div className="mb-4">
                <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">Free</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">$0</span>
                  <span className="text-white/30 text-sm">/mo</span>
                </div>
              </div>
              <ul className="space-y-2.5">
                {features.free.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/40">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white/20 flex-shrink-0">
                      <line x1="3" y1="7" x2="11" y2="7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-5 py-2 text-center text-xs text-white/20 border border-white/[0.06] rounded-xl">
                Current Plan
              </div>
            </div>

            {/* Pro */}
            <div className="rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-b from-emerald-500/10 to-transparent p-5 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-[10px] font-bold text-white tracking-wide">
                RECOMMENDED
              </div>
              <div className="mb-4">
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-1">Pro</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">$9.99</span>
                  <span className="text-white/30 text-sm">/mo</span>
                </div>
              </div>
              <ul className="space-y-2.5">
                {features.pro.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/70">
                    <svg width="14" height="14" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0">
                      <polyline points="2,7 5,10 12,3" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => {
              alert("Payment integration coming soon! We will notify you when Pro is available.");
              onClose();
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-sm font-bold text-white transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/25 mb-3"
          >
            ✨ Upgrade to Pro — $9.99/month
          </button>
          <p className="text-center text-[11px] text-white/20">
            Cancel anytime · No hidden fees · 7-day free trial
          </p>
        </div>
      </div>
    </div>
  );
}
