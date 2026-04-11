import { useState } from "react";

export default function Settings({ user, onUpdate, onLogout }) {
  const [form, setForm] = useState({ name: user?.name || "" });
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isPro = user?.plan === "pro";

  const handleSave = () => {
    const updated = { ...user, ...form };
    localStorage.setItem("user", JSON.stringify(updated));
    if (onUpdate) onUpdate(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-white/40 text-sm mt-1">Manage your account preferences</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-sm font-medium">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="2,7 5,10 12,3"/></svg>
            Saved!
          </div>
        )}
      </div>

      {/* Account Info */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white">Account Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] text-white/30 uppercase tracking-wide block mb-1.5">Display Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
            />
          </div>
          <div>
            <label className="text-[11px] text-white/30 uppercase tracking-wide block mb-1.5">Email</label>
            <input
              value={user?.email || ""}
              disabled
              className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl px-3.5 py-2.5 text-sm text-white/30 cursor-not-allowed"
            />
          </div>
        </div>
        <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-semibold text-white transition-all">
          Save Changes
        </button>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white">Notifications</h2>
        {[
          { label: "Song approved", desc: "When your song goes live on platforms" },
          { label: "Stream milestones", desc: "1k, 5k, 10k stream alerts" },
          { label: "Payout updates", desc: "When earnings are processed" },
          { label: "New platform added", desc: "When we add new distribution platforms" },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm text-white/70 font-medium">{item.label}</p>
              <p className="text-[11px] text-white/25">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
              <div className="w-9 h-5 bg-white/10 peer-checked:bg-emerald-500 rounded-full transition-all peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
            </label>
          </div>
        ))}
      </div>

      {/* Current Plan */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h2 className="text-sm font-semibold text-white mb-4">Current Plan</h2>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-white font-semibold text-lg">{isPro ? "👑 Pro Plan" : "Free Plan"}</div>
            <p className="text-white/30 text-sm">{isPro ? "All features unlocked" : "Up to 3 songs · 4 platforms"}</p>
          </div>
          {!isPro && (
            <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-sm font-bold text-white transition-all shadow-lg shadow-emerald-500/20">
              ✨ Upgrade to Pro
            </button>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-red-400">Danger Zone</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm text-white/60 font-medium">Log out of your account</p>
            <p className="text-[11px] text-white/25">You can log back in anytime</p>
          </div>
          <button onClick={onLogout} className="px-5 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white hover:bg-white/5 text-sm font-medium transition-all">
            Logout
          </button>
        </div>
        <div className="border-t border-red-500/10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm text-red-400 font-medium">Delete Account</p>
            <p className="text-[11px] text-white/25">Permanently delete your account and all data</p>
          </div>
          {!showDeleteConfirm ? (
            <button onClick={() => setShowDeleteConfirm(true)} className="px-5 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all">
              Delete Account
            </button>
          ) : (
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-sm font-semibold text-white transition-all">
                Confirm Delete
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded-xl bg-white/5 text-sm text-white/50 hover:bg-white/10 transition-all">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
