import { useState, useEffect } from "react";
import { getSongs, getStats } from "../api";

export default function Profile({ user, onUpdate }) {
  const [stats, setStats] = useState({ total: 0, totalStreams: 0, totalEarnings: 0, liveSongs: 0 });
  const [songs, setSongs] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", bio: user?.bio || "", location: user?.location || "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    getStats(token).then(setStats).catch(() => {});
    getSongs(token).then(d => setSongs(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  const handleSave = () => {
    const updated = { ...user, ...form };
    localStorage.setItem("user", JSON.stringify(updated));
    if (onUpdate) onUpdate(updated);
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Artist Profile</h1>
        <p className="text-white/40 text-sm mt-1">Manage your public artist profile</p>
      </div>

      {/* Profile card */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0A0A0F]" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-white/30 uppercase tracking-wide block mb-1">Display Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-white/30 uppercase tracking-wide block mb-1">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={3}
                    placeholder="Tell people about yourself..."
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-white/30 uppercase tracking-wide block mb-1">Location</label>
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="City, Country"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave} className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-medium text-white transition-all">Save</button>
                  <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium text-white/60 transition-all">Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold text-white">{user?.name || "Artist"}</h2>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-medium">
                    {user?.plan === "pro" ? "Pro" : "Free"}
                  </span>
                </div>
                <p className="text-white/40 text-sm mb-1">{user?.email}</p>
                {user?.location && <p className="text-white/30 text-sm mb-2">📍 {user.location}</p>}
                {user?.bio && <p className="text-white/60 text-sm mb-3">{user.bio}</p>}
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium text-white/60 transition-all border border-white/[0.06]"
                >
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M9 1l3 3L4 12H1V9L9 1z"/>
                  </svg>
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Songs", value: stats.total || 0 },
          { label: "Live Songs", value: stats.liveSongs || 0 },
          { label: "Total Streams", value: (stats.totalStreams || 0).toLocaleString() },
          { label: "Est. Earnings", value: `$${(stats.totalEarnings || 0).toFixed(2)}` },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
            <div className="text-[12px] text-white/30 mb-1">{s.label}</div>
            <div className="text-xl font-bold text-white">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Recent songs */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white">Recent Releases</h2>
        </div>
        {songs.length === 0 ? (
          <div className="py-8 text-center text-white/20 text-sm">No songs uploaded yet.</div>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {songs.slice(0, 5).map((song, idx) => (
              <div key={song._id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02]">
                <span className="text-[12px] text-white/20 w-4">{idx + 1}</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="12" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M2 10V5L10 3V8"/><circle cx="2" cy="10" r="1.2"/><circle cx="10" cy="8" r="1.2"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{song.title}</div>
                  <div className="text-[12px] text-white/30">{song.genre || "—"}</div>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                  song.status === "live" ? "bg-emerald-500/15 text-emerald-400" :
                  song.status === "pending" ? "bg-amber-500/15 text-amber-400" :
                  "bg-white/5 text-white/30"
                }`}>{song.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
