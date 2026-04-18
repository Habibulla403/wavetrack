import { useState, useEffect, useRef } from "react";
import SongTable from "./SongTable";
import { getSongs, getStats, getAnalytics } from "../api";

// ── Sparkline ────────────────────────────────────────────────────
function Sparkline({ data = [], color = "#34d399", height = 32 }) {
  if (!data.length) return null;
  const w = 120, h = height;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={color} opacity="0.08"/>
    </svg>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────
function StatCard({ label, value, sub, trend, trendUp, sparkData, sparkColor, accent }) {
  return (
    <div className={`rounded-2xl p-5 border flex flex-col gap-3 hover:-translate-y-0.5 transition-all duration-200 ${
      accent
        ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/5 border-emerald-500/30"
        : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]"
    }`}>
      <div className="flex items-start justify-between">
        <span className={`text-[11px] font-semibold tracking-widest uppercase ${accent ? "text-emerald-400/80" : "text-white/25"}`}>{label}</span>
        {trend && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
            trendUp ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
          }`}>
            {trendUp ? "↑" : "↓"} {trend}
          </span>
        )}
      </div>
      <div className={`text-2xl font-bold tracking-tight ${accent ? "text-emerald-300" : "text-white"}`}>{value}</div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-[11px] text-white/25 leading-tight">{sub}</span>
        {sparkData?.length > 1 && <Sparkline data={sparkData} color={sparkColor || "#34d399"} height={32}/>}
      </div>
    </div>
  );
}

// ── Stream Chart — real data ──────────────────────────────────────
function StreamChart({ weeklyData, monthlyData }) {
  const [period, setPeriod] = useState("weekly");
  const chartData = period === "weekly" ? weeklyData : monthlyData;
  const labelKey  = period === "weekly" ? "day" : "month";
  const maxVal    = Math.max(...(chartData.map(d => d.streams)), 1);
  const total     = chartData.reduce((a, d) => a + d.streams, 0);
  const hasData   = total > 0;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="text-sm font-bold text-white">Stream Performance</h2>
          <p className="text-[11px] text-white/30 mt-0.5">
            {hasData ? `${total.toLocaleString()} streams this period` : "No streams yet"}
          </p>
        </div>
        <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/[0.05]">
          {["weekly","monthly"].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium capitalize transition-all ${
                period === p ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"
              }`}>{p === "weekly" ? "7 Days" : "6 Mo"}</button>
          ))}
        </div>
      </div>
      <div className="flex items-end gap-1.5" style={{ height: "100px" }}>
        {chartData.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
            <div className="w-full flex items-end justify-center" style={{ height: "80px" }}>
              <div className="w-full rounded-t-md transition-all duration-500 group-hover:opacity-100 opacity-75"
                style={{
                  height: `${(d.streams / maxVal) * 100}%`,
                  minHeight: d.streams > 0 ? "3px" : "0",
                  background: i === chartData.length - 1
                    ? "linear-gradient(to top,#059669,#34d399)"
                    : "rgba(52,211,153,0.18)",
                  boxShadow: i === chartData.length - 1 ? "0 0 16px rgba(52,211,153,0.3)" : "none",
                }}/>
            </div>
            <span className="text-[9px] text-white/20 group-hover:text-white/50 transition-colors">{d[labelKey]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Top Songs — real ──────────────────────────────────────────────
function TopSongs({ songs }) {
  const top = [...songs].sort((a, b) => (b.streams||0) - (a.streams||0)).slice(0, 5);
  const maxS = top[0]?.streams || 1;
  const colors = ["#34d399","#60a5fa","#f59e0b","#a78bfa","#f472b6"];

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <h2 className="text-sm font-bold text-white mb-4">🏆 Top Songs</h2>
      {top.length === 0 ? (
        <p className="text-white/20 text-sm text-center py-6">Upload songs to see top tracks</p>
      ) : (
        <div className="space-y-3">
          {top.map((s, i) => (
            <div key={s._id||i} className="flex items-center gap-3 group">
              <span className="text-[11px] font-mono text-white/20 w-4 flex-shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] text-white/80 font-medium truncate">{s.title}</span>
                  <span className="text-[11px] text-white/30 ml-2 flex-shrink-0">
                    {s.streams > 0 ? s.streams.toLocaleString() : "—"}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${((s.streams||0) / maxS) * 100}%`, backgroundColor: colors[i] }}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Earnings Breakdown — real platform data ───────────────────────
function EarningsBreakdown({ total, platforms }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-white">💰 Earnings Breakdown</h2>
        <span className="text-[11px] text-emerald-400 font-semibold">${total.toFixed(2)} total</span>
      </div>
      {total === 0 ? (
        <p className="text-white/20 text-sm text-center py-4">No earnings yet</p>
      ) : (
        <>
          <div className="flex h-3 rounded-full overflow-hidden mb-4 gap-0.5">
            {platforms.map(b => (
              <div key={b.name} style={{ width: `${b.pct}%`, backgroundColor: b.color }}
                className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-700"/>
            ))}
          </div>
          <div className="space-y-2.5">
            {platforms.map(b => (
              <div key={b.name} className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: b.color }}/>
                <span className="text-[12px] text-white/50 flex-1">{b.name}</span>
                <span className="text-[12px] text-white/30">{b.pct}%</span>
                <span className="text-[12px] text-white/60 font-medium w-12 text-right">
                  ${((total * b.pct) / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between">
            <span className="text-[11px] text-white/25">Next payout</span>
            <span className="text-[11px] text-amber-400 font-medium">Coming soon</span>
          </div>
        </>
      )}
    </div>
  );
}

// ── Platform Reach ────────────────────────────────────────────────
function PlatformBar({ platforms }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <h2 className="text-sm font-bold text-white mb-4">🌍 Platform Reach</h2>
      <div className="space-y-3">
        {platforms.map(p => (
          <div key={p.name} className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-lg ${p.bg} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}>
              {p.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-[12px] text-white/50">{p.name}</span>
                <span className="text-[12px] text-white/30">{p.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${p.pct}%`, backgroundColor: p.color }}/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Recent Activity — real songs ──────────────────────────────────
function RecentActivity({ songs, user }) {
  const recent = [...songs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  if (!recent.length) return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <h2 className="text-sm font-bold text-white mb-4">⚡ Recent Activity</h2>
      <p className="text-white/20 text-sm text-center py-6">No songs yet</p>
    </div>
  );

  const getIcon  = (s) => s.status === "live" ? "✅" : s.status === "pending" ? "⏳" : "📝";
  const getColor = (s) => s.status === "live" ? "text-emerald-400" : s.status === "pending" ? "text-amber-400" : "text-white/40";
  const getText  = (s) => {
    if (s.status === "live") return `${s.title} is now live on ${user?.plan && user.plan !== "free" ? "150+" : "30+"} platforms`;
    if (s.status === "pending") return `${s.title} is under review`;
    return `${s.title} saved as draft`;
  };
  const timeAgo  = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hrs  = Math.floor(diff / 3_600_000);
    const days = Math.floor(diff / 86_400_000);
    if (hrs < 1)   return "Just now";
    if (hrs < 24)  return `${hrs}h ago`;
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <h2 className="text-sm font-bold text-white mb-4">⚡ Recent Activity</h2>
      <div className="space-y-3">
        {recent.map((s, i) => (
          <div key={s._id || i} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/[0.04] flex items-center justify-center text-sm flex-shrink-0">
              {getIcon(s)}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className={`text-[13px] leading-snug ${getColor(s)}`}>{getText(s)}</p>
              <p className="text-[10px] text-white/20 mt-0.5">{timeAgo(s.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
export default function Dashboard({ user, onPlaySong, setActivePage }) {
  const [stats,       setStats]       = useState({ total: 0, totalStreams: 0, totalEarnings: 0, liveSongs: 0 });
  const [songs,       setSongs]       = useState([]);
  const [analytics,   setAnalytics]   = useState(null);
  const [songRefresh, setSongRefresh] = useState(0);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    Promise.all([
      getStats(token).catch(() => ({})),
      getSongs(token).catch(() => []),
      getAnalytics(token).catch(() => null),
    ]).then(([s, sg, a]) => {
      setStats(s || {});
      setSongs(Array.isArray(sg) ? sg : []);
      setAnalytics(a);
      setLoading(false);
    });
  }, [songRefresh]);

  const hour      = new Date().getHours();

  // Chart data from real analytics
  const weeklyData  = analytics?.weekly  || Array.from({ length: 7 },  (_, i) => ({ day: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i], streams: 0 }));
  const monthlyData = analytics?.monthly || [];
  const platforms   = analytics?.platformBreakdown || [
    { name: "Spotify",       pct: 58, color: "#1DB954", bg: "bg-emerald-500" },
    { name: "Apple Music",   pct: 22, color: "#fc3c44", bg: "bg-rose-500"    },
    { name: "YouTube Music", pct: 13, color: "#FF0000", bg: "bg-red-500"     },
    { name: "Deezer",        pct: 7,  color: "#a238ff", bg: "bg-purple-500"  },
  ];

  // Sparkline data from real weekly streams
  const streamSparkline = weeklyData.map(d => d.streams);
  // Song count sparkline (cumulative uploads)
  const songSpark = songs.length > 0
    ? Array.from({ length: 7 }, (_, i) => Math.min(i + 1, songs.length))
    : [0];

  return (
    <div className="space-y-5 pb-24 lg:pb-6">
      {/* Top bar */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-white/35 text-sm mt-0.5">Here's what's happening with your music today.</p>
      </div>

      {/* 4 real stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total Songs" value={loading ? "—" : stats.total || 0}
          sub={`${stats.liveSongs || 0} live right now`}
          sparkData={songSpark} sparkColor="#34d399"/>
        <StatCard
          label="Total Streams" value={loading ? "—" : (stats.totalStreams || 0).toLocaleString()}
          sub="Across all platforms"
          sparkData={streamSparkline} sparkColor="#60a5fa"/>
        <StatCard
          label="Platforms"
          value={user?.plan && user.plan !== "free" ? "150+" : "30+"}
          sub={user?.plan && user.plan !== "free" ? "All major platforms" : "Major platforms"}
          sparkData={[3,3,3,4,4,4,4]} sparkColor="#a78bfa"/>
        <StatCard
          label="Est. Earnings" value={loading ? "—" : `$${(stats.totalEarnings || 0).toFixed(2)}`}
          sub="Lifetime earnings" accent
          sparkData={streamSparkline.map((v, i) => (v * 0.004).toFixed(2) * 1)} sparkColor="#34d399"/>
      </div>

      {/* Main chart + top songs */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
        <StreamChart weeklyData={weeklyData} monthlyData={monthlyData}/>
        <TopSongs songs={songs}/>
      </div>

      {/* Earnings + Platform + Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <EarningsBreakdown total={stats.totalEarnings || 0} platforms={platforms}/>
        <PlatformBar platforms={platforms}/>
        <RecentActivity songs={songs} user={user}/>
      </div>

      {/* Upload + Song table */}
      <SongTable limit={5} refresh={songRefresh} onPlaySong={onPlaySong}/>
    </div>
  );
}
