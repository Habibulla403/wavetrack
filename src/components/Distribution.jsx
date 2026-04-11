import { useState, useEffect } from "react";
import { getSongs } from "../api";
import { coverColors, statusConfig } from "../data";

const dspList = [
  { name: "Spotify",       emoji: "🎵", color: "#1DB954", bg: "bg-emerald-500",  tier: "free",  songs: 4, status: "Connected",     reach: "600M+ users" },
  { name: "Apple Music",   emoji: "🍎", color: "#fc3c44", bg: "bg-rose-500",     tier: "free",  songs: 4, status: "Connected",     reach: "100M+ users" },
  { name: "YouTube Music", emoji: "▶️", color: "#FF0000", bg: "bg-red-500",      tier: "free",  songs: 3, status: "Connected",     reach: "80M+ users"  },
  { name: "Deezer",        emoji: "🎶", color: "#a238ff", bg: "bg-purple-500",   tier: "free",  songs: 4, status: "Connected",     reach: "16M+ users"  },
  { name: "Amazon Music",  emoji: "📦", color: "#00A8E1", bg: "bg-sky-500",      tier: "pro",   songs: 0, status: "Not connected", reach: "55M+ users"  },
  { name: "Tidal",         emoji: "🌊", color: "#009EE0", bg: "bg-blue-500",     tier: "pro",   songs: 0, status: "Not connected", reach: "10M+ users"  },
  { name: "TikTok",        emoji: "🎤", color: "#ff0050", bg: "bg-pink-500",     tier: "pro",   songs: 0, status: "Not connected", reach: "1B+ users"   },
  { name: "SoundCloud",    emoji: "☁️", color: "#FF5500", bg: "bg-orange-500",   tier: "pro",   songs: 0, status: "Not connected", reach: "76M+ users"  },
  { name: "Pandora",       emoji: "📻", color: "#3668FF", bg: "bg-indigo-500",   tier: "pro",   songs: 0, status: "Not connected", reach: "50M+ users"  },
  { name: "Napster",       emoji: "🐱", color: "#00D4FF", bg: "bg-cyan-500",     tier: "pro",   songs: 0, status: "Not connected", reach: "5M+ users"   },
  { name: "iHeartRadio",   emoji: "💙", color: "#C6002B", bg: "bg-red-600",      tier: "pro",   songs: 0, status: "Not connected", reach: "150M+ users" },
  { name: "Boomplay",      emoji: "🌍", color: "#FF6B00", bg: "bg-amber-500",    tier: "pro",   songs: 0, status: "Not connected", reach: "90M+ users"  },
];

const timelineSteps = [
  { day: "Day 1",   label: "Song Submitted",        icon: "⬆️", color: "text-white/60" },
  { day: "Day 1-2", label: "Quality Review",         icon: "🔍", color: "text-amber-400" },
  { day: "Day 2-3", label: "Sent to Platforms",      icon: "📤", color: "text-blue-400" },
  { day: "Day 3-5", label: "Platform Processing",    icon: "⚙️", color: "text-purple-400" },
  { day: "Day 5-7", label: "Live on All Platforms",  icon: "🟢", color: "text-emerald-400" },
];

export default function Distribution() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(null);
  const [connected, setConnected] = useState(
    dspList.filter((d) => d.status === "Connected").map((d) => d.name)
  );
  const [activeTab, setActiveTab] = useState("platforms");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    getSongs(token)
      .then((d) => setSongs(Array.isArray(d) ? d : []))
      .catch(() => setSongs([]))
      .finally(() => setLoading(false));
  }, []);

  const handleConnect = (name) => {
    setConnecting(name);
    setTimeout(() => {
      setConnected((prev) => [...prev, name]);
      setConnecting(null);
    }, 1800);
  };

  const handleDisconnect = (name) => {
    if (!confirm(`Disconnect ${name}?`)) return;
    setConnected((prev) => prev.filter((n) => n !== name));
  };

  const connectedList = dspList.filter((d) => connected.includes(d.name));
  const notConnectedList = dspList
    .filter((d) => !connected.includes(d.name))
    .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  const liveSongs = songs.filter((s) => s.status === "live");
  const pendingSongs = songs.filter((s) => s.status === "pending");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Distribution</h1>
          <p className="text-white/40 text-sm mt-1">Manage where your music is distributed</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[12px] text-emerald-400 font-medium">{connectedList.length} platforms active</span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Connected",     value: connectedList.length,                          icon: "🔗", color: "text-emerald-400" },
          { label: "Songs Live",    value: loading ? "—" : liveSongs.length,              icon: "🟢", color: "text-emerald-400" },
          { label: "Pending",       value: loading ? "—" : pendingSongs.length,           icon: "⏳", color: "text-amber-400"   },
          { label: "Total Reach",   value: "1B+",                                         icon: "🌍", color: "text-blue-400"    },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{s.icon}</span>
              <span className="text-[11px] text-white/30 uppercase tracking-wide">{s.label}</span>
            </div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl w-fit border border-white/[0.05]">
        {["platforms", "songs", "timeline"].map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
              activeTab === t ? "bg-white/10 text-white" : "text-white/35 hover:text-white/60"
            }`}>{t === "timeline" ? "⏱ Timeline" : t === "platforms" ? "🔗 Platforms" : "🎵 Songs"}</button>
        ))}
      </div>

      {/* PLATFORMS TAB */}
      {activeTab === "platforms" && (
        <div className="space-y-5">
          {/* Connected */}
          <div>
            <h2 className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-3">
              ✅ Connected ({connectedList.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {connectedList.map((d) => (
                <div key={d.name} className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4 group hover:bg-emerald-500/8 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${d.bg} flex items-center justify-center text-lg flex-shrink-0 shadow-md`}>
                      {d.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">{d.name}</div>
                      <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                        Connected
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[12px] text-white/50 font-medium">{d.songs} songs live</div>
                      <div className="text-[10px] text-white/20">{d.reach}</div>
                    </div>
                    <button
                      onClick={() => handleDisconnect(d.name)}
                      className="opacity-0 group-hover:opacity-100 text-[10px] text-red-400 hover:text-red-300 transition-all px-2 py-1 rounded-lg hover:bg-red-500/10"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[11px] font-semibold text-white/40 uppercase tracking-widest">
                🔓 Available ({notConnectedList.length})
              </h2>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search platforms..."
                className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/40 transition-all w-40"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {notConnectedList.map((d) => (
                <div key={d.name} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${d.bg} flex items-center justify-center text-lg flex-shrink-0 opacity-50`}>
                      {d.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white/60 truncate">{d.name}</div>
                      <div className="text-[10px] text-white/20">{d.reach}</div>
                    </div>
                    {d.tier === "pro" && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-yellow-400/15 text-yellow-400 border border-yellow-400/25 font-bold flex-shrink-0">PRO</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleConnect(d.name)}
                    disabled={connecting === d.name}
                    className="w-full py-2 rounded-xl border border-white/10 text-[12px] font-medium text-white/50 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {connecting === d.name ? (
                      <>
                        <svg className="animate-spin" width="12" height="12" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Connecting...
                      </>
                    ) : "Connect"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SONGS TAB */}
      {activeTab === "songs" && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Song Distribution Status</h2>
            <span className="text-[12px] text-white/30">{songs.length} total</span>
          </div>
          {loading ? (
            <div className="py-10 text-center">
              <svg className="animate-spin mx-auto mb-2" width="20" height="20" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#34d399" strokeWidth="3"/>
                <path className="opacity-75" fill="#34d399" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <p className="text-white/20 text-sm">Loading songs...</p>
            </div>
          ) : songs.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-4xl mb-3">🎵</div>
              <p className="text-white/30 text-sm">No songs uploaded yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.03]">
              {songs.map((song, idx) => {
                const sc = statusConfig[song.status] || statusConfig.draft;
                const colors = ["emerald", "amber", "purple", "blue", "pink", "gray"];
                const colorKey = colors[idx % colors.length];
                const gradients = {
                  emerald: "from-emerald-500 to-teal-600", amber: "from-amber-400 to-orange-500",
                  purple: "from-violet-500 to-purple-700", blue: "from-blue-500 to-indigo-600",
                  pink: "from-pink-500 to-rose-600", gray: "from-zinc-500 to-zinc-700"
                };
                return (
                  <div key={song._id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                    {/* Cover */}
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradients[colorKey]} flex-shrink-0 flex items-center justify-center`}>
                      <svg width="12" height="12" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.8">
                        <path d="M2 10V5L10 3V8"/><circle cx="2" cy="10" r="1.2"/><circle cx="10" cy="8" r="1.2"/>
                      </svg>
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{song.title}</div>
                      <div className="text-[12px] text-white/30">{song.genre || "—"}</div>
                    </div>
                    {/* Status badge */}
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full flex-shrink-0 flex items-center gap-1.5 ${sc.cls}`}>
                      {song.status === "live" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                      {sc.label}
                    </span>
                    {/* Platform icons */}
                    <div className="hidden sm:flex gap-1.5 flex-shrink-0">
                      {song.status === "live" ? (
                        connectedList.slice(0, 4).map((d) => (
                          <div key={d.name} title={d.name} className={`w-6 h-6 rounded-lg ${d.bg} flex items-center justify-center text-[10px] shadow-sm`}>
                            {d.emoji}
                          </div>
                        ))
                      ) : (
                        <span className="text-[12px] text-white/15">Not distributed</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TIMELINE TAB */}
      {activeTab === "timeline" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h2 className="text-sm font-semibold text-white mb-2">Distribution Timeline</h2>
            <p className="text-white/30 text-[12px] mb-6">How long it takes for your song to go live after submission</p>
            <div className="space-y-0">
              {timelineSteps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  {/* Line + dot */}
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-base flex-shrink-0`}>
                      {step.icon}
                    </div>
                    {i < timelineSteps.length - 1 && (
                      <div className="w-px flex-1 bg-white/[0.06] my-1" style={{ minHeight: "28px" }} />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-6">
                    <div className={`text-sm font-semibold ${step.color}`}>{step.label}</div>
                    <div className="text-[11px] text-white/25 mt-0.5">{step.day}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <h3 className="text-sm font-semibold text-blue-400 mb-3">💡 Tips for faster distribution</h3>
            <ul className="space-y-2">
              {[
                "Submit songs at least 7 days before your release date",
                "Make sure your cover art is 3000x3000px JPG/PNG",
                "Use proper song titles — no ALL CAPS",
                "Add ISRC codes for better royalty tracking",
                "Fill in all metadata before submitting",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[13px] text-white/50">
                  <svg width="14" height="14" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
                    <polyline points="2,7 5,10 12,3"/>
                  </svg>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
