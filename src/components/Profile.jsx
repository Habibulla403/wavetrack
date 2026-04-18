import { useState, useEffect } from "react";
import { getSongs, getStats } from "../api";

const coverColors = {
  0: "from-emerald-500 to-teal-600", 1: "from-amber-400 to-orange-500",
  2: "from-violet-500 to-purple-700", 3: "from-blue-500 to-indigo-600",
  4: "from-pink-500 to-rose-600",    5: "from-zinc-500 to-zinc-700",
};

function StatCard({ label, value, icon, color = "text-white" }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center flex-shrink-0 text-lg">{icon}</div>
      <div>
        <div className={`text-xl font-bold ${color}`}>{value}</div>
        <div className="text-[11px] text-white/30">{label}</div>
      </div>
    </div>
  );
}

const SOCIAL_PLATFORMS = [
  { key: "spotify",   label: "Spotify",   icon: "🎵" },
  { key: "instagram", label: "Instagram", icon: "📷" },
  { key: "twitter",   label: "Twitter/X", icon: "🐦" },
  { key: "youtube",   label: "YouTube",   icon: "▶️" },
  { key: "tiktok",    label: "TikTok",    icon: "🎶" },
];

function SocialLinksDisplay({ links }) {
  const active = SOCIAL_PLATFORMS.filter(p => links[p.key]);
  if (!active.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {active.map(p => (
        <a key={p.key} href={links[p.key]} target="_blank" rel="noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.09] transition-all text-[12px] text-white/50 hover:text-white/80">
          <span>{p.icon}</span>
          <span>{p.label}</span>
        </a>
      ))}
    </div>
  );
}

export default function Profile({ user }) {
  const [stats,     setStats]     = useState({ total: 0, totalStreams: 0, totalEarnings: 0, liveSongs: 0 });
  const [songs,     setSongs]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const isPro    = user?.plan && user.plan !== "free";
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "2026";

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    Promise.all([
      getStats(token).catch(() => ({})),
      getSongs(token).catch(() => []),
    ]).then(([s, sg]) => {
      setStats(s || {});
      setSongs(Array.isArray(sg) ? sg : []);
      setLoading(false);
    });
  }, []);

  const tabs = ["overview", "songs"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Artist Profile</h1>
        <p className="text-white/40 text-sm mt-1">Your public artist profile</p>
      </div>

      {/* Hero card */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="h-28 relative overflow-hidden">
          {user?.coverUrl
            ? <img src={user.coverUrl} alt="cover" className="w-full h-full object-cover"/>
            : <div className="w-full h-full bg-gradient-to-r from-emerald-600/40 via-teal-500/30 to-blue-600/20 relative">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #10b981 0%, transparent 50%), radial-gradient(circle at 80% 20%, #06b6d4 0%, transparent 50%)" }}/>
              </div>
          }
        </div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 mb-5">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl overflow-hidden flex-shrink-0">
              {user?.avatarUrl
                ? <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover"/>
                : initials
              }
            </div>
            <div className="flex-1 sm:pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold text-white">{user?.name || "Artist"}</h2>
                {isPro && <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 font-bold border border-yellow-400/30">👑 PRO</span>}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/30 border border-white/[0.08]">{isPro ? "Pro" : "Free"} Plan</span>
              </div>
              <p className="text-white/40 text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            {user?.bio && <p className="text-white/60 text-sm leading-relaxed">{user.bio}</p>}
            <div className="flex flex-wrap gap-3 text-[12px] text-white/35">
              {user?.location && <span className="flex items-center gap-1">📍 {user.location}</span>}
              {user?.genre    && <span className="flex items-center gap-1">🎵 {user.genre}</span>}
              {user?.website  && <a href={user.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300">🔗 Website</a>}
              <span className="flex items-center gap-1">📅 Joined {joinDate}</span>
            </div>
            <SocialLinksDisplay links={user?.socialLinks || {}} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Songs"   value={loading ? "—" : stats.total || 0}                            icon="🎵"/>
        <StatCard label="Live Songs"    value={loading ? "—" : stats.liveSongs || 0}                        icon="🟢" color="text-emerald-400"/>
        <StatCard label="Total Streams" value={loading ? "—" : (stats.totalStreams || 0).toLocaleString()}   icon="▶️" color="text-blue-400"/>
        <StatCard label="Est. Earnings" value={loading ? "—" : `$${(stats.totalEarnings || 0).toFixed(2)}`} icon="💰" color="text-yellow-400"/>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl w-fit border border-white/[0.05]">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
              activeTab === t ? "bg-white/10 text-white" : "text-white/35 hover:text-white/60"
            }`}>{t}</button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-white">Recent Releases</h2>
          </div>
          {loading ? (
            <div className="py-10 text-center">
              <svg className="animate-spin mx-auto mb-2" width="20" height="20" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#34d399" strokeWidth="3"/>
                <path className="opacity-75" fill="#34d399" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <p className="text-white/20 text-sm">Loading...</p>
            </div>
          ) : songs.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-4xl mb-3">🎵</div>
              <p className="text-white/30 text-sm">No songs uploaded yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.03]">
              {songs.slice(0, 5).map((song, idx) => (
                <div key={song._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <span className="text-[12px] text-white/20 w-4 font-mono">{idx + 1}</span>
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${coverColors[idx % 6]} flex-shrink-0 flex items-center justify-center overflow-hidden`}>
                    {song.coverUrl
                      ? <img src={song.coverUrl} alt="cover" className="w-full h-full object-cover"/>
                      : <svg width="12" height="12" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.8"><path d="M2 10V5L10 3V8"/><circle cx="2" cy="10" r="1.2"/><circle cx="10" cy="8" r="1.2"/></svg>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{song.title}</div>
                    <div className="text-[12px] text-white/30">{song.genre || "—"}</div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-sm text-white/50">{song.streams > 0 ? song.streams.toLocaleString() : "—"}</div>
                    <div className="text-[11px] text-white/25">streams</div>
                  </div>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${
                    song.status === "live"    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" :
                    song.status === "pending" ? "bg-amber-500/15  text-amber-400  border border-amber-500/25" :
                                                "bg-white/5        text-white/30   border border-white/10"
                  }`}>{song.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Songs tab */}
      {activeTab === "songs" && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">All Songs</h2>
            <span className="text-[12px] text-white/30">{songs.length} tracks</span>
          </div>
          {songs.length === 0 ? (
            <div className="py-12 text-center"><p className="text-white/30 text-sm">No songs yet.</p></div>
          ) : (
            <div className="divide-y divide-white/[0.03]">
              {songs.map((song, idx) => (
                <div key={song._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02]">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${coverColors[idx % 6]} flex-shrink-0 overflow-hidden`}>
                    {song.coverUrl && <img src={song.coverUrl} alt="cover" className="w-full h-full object-cover"/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{song.title}</div>
                    <div className="text-[12px] text-white/30">
                      {song.genre || "—"} · {new Date(song.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-sm text-white/50 font-medium">{song.streams > 0 ? song.streams.toLocaleString() : "0"}</div>
                    <div className="text-[11px] text-white/25">${song.earnings > 0 ? song.earnings.toFixed(2) : "0.00"}</div>
                  </div>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${
                    song.status === "live"    ? "bg-emerald-500/15 text-emerald-400" :
                    song.status === "pending" ? "bg-amber-500/15  text-amber-400" :
                                                "bg-white/5        text-white/30"
                  }`}>{song.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
