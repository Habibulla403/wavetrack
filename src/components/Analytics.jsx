import { useState, useEffect } from "react";
import { getAnalytics, getStats } from "../api";

function Spinner() {
  return (
    <div className="py-16 flex flex-col items-center gap-3">
      <svg className="animate-spin" width="28" height="28" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#34d399" strokeWidth="3"/>
        <path className="opacity-75" fill="#34d399" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
      <p className="text-white/30 text-sm">Loading analytics...</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-20 flex flex-col items-center gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center text-3xl">📊</div>
      <div>
        <p className="text-white/60 font-semibold">No stream data yet</p>
        <p className="text-white/25 text-sm mt-1">Upload songs and get streams to see your analytics here.</p>
      </div>
    </div>
  );
}

export default function Analytics() {
  const [period, setPeriod] = useState("weekly");
  const [data,   setData]   = useState(null);
  const [stats,  setStats]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    Promise.all([
      getAnalytics(token).catch(() => null),
      getStats(token).catch(() => null),
    ]).then(([analytics, st]) => {
      setData(analytics);
      setStats(st);
      setLoading(false);
    });
  }, []);

  const chartData  = period === "weekly" ? (data?.weekly || []) : (data?.monthly || []);
  const labelKey   = period === "weekly" ? "day" : "month";
  const maxVal     = Math.max(...chartData.map(d => d.streams), 1);
  const totalChart = chartData.reduce((a, d) => a + d.streams, 0);
  const hasStreams  = (stats?.totalStreams || 0) > 0;

  // Week-over-week change
  const weekTotal  = (data?.weekly || []).reduce((a, d) => a + d.streams, 0);
  const prevHalf   = (data?.weekly || []).slice(0, 3).reduce((a, d) => a + d.streams, 0);
  const recentHalf = (data?.weekly || []).slice(4).reduce((a, d) => a + d.streams, 0);
  const trend      = prevHalf > 0 ? Math.round(((recentHalf - prevHalf) / prevHalf) * 100) : 0;

  const platforms = data?.platformBreakdown || [];
  const topSongs  = data?.topSongs || [];

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Analytics</h1>
          <p className="text-white/40 text-sm mt-1">Your real performance across all platforms</p>
        </div>
        <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl w-fit border border-white/[0.05]">
          {["weekly", "monthly"].map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                period === p ? "bg-white/10 text-white" : "text-white/35 hover:text-white/60"
              }`}>
              {p === "weekly" ? "7 Days" : "6 Months"}
            </button>
          ))}
        </div>
      </div>

      {loading ? <Spinner /> : !hasStreams ? <EmptyState /> : (
        <>
          {/* Summary stat cards — all real */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "This Week",   value: weekTotal.toLocaleString(),                          change: trend !== 0 ? `${trend > 0 ? "+" : ""}${trend}%` : "—",    up: trend > 0 },
              { label: "Total Streams", value: (stats?.totalStreams || 0).toLocaleString(),        change: `${stats?.total || 0} songs`,                               up: null },
              { label: "Live Songs",  value: stats?.liveSongs || 0,                               change: "currently live",                                            up: null },
              { label: "Est. Earned", value: `$${(stats?.totalEarnings || 0).toFixed(2)}`,        change: "lifetime earnings",                                         up: true  },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="text-[11px] text-white/30 mb-1 uppercase tracking-wide">{s.label}</div>
                <div className="text-xl font-bold text-white">{s.value}</div>
                <div className={`text-[11px] mt-1 ${s.up === true ? "text-emerald-400" : s.up === false ? "text-red-400" : "text-white/30"}`}>
                  {s.change}
                </div>
              </div>
            ))}
          </div>

          {/* Main chart — real daily/monthly data */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  {period === "weekly" ? "Daily Streams — Last 7 Days" : "Monthly Streams — Last 6 Months"}
                </h2>
                <p className="text-[11px] text-white/30 mt-0.5">
                  {totalChart.toLocaleString()} total streams
                  {trend !== 0 && (
                    <span className={trend > 0 ? " text-emerald-400" : " text-red-400"}>
                      {" "}· {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% vs previous period
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-end gap-2 h-40">
              {chartData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer">
                  <span className="text-[10px] text-white/0 group-hover:text-white/60 transition-colors font-medium">
                    {d.streams >= 1000 ? `${(d.streams / 1000).toFixed(1)}k` : d.streams}
                  </span>
                  <div className="w-full relative flex items-end justify-center" style={{ height: "120px" }}>
                    <div
                      className="w-full rounded-t-lg transition-all duration-500 group-hover:opacity-100 opacity-75"
                      style={{
                        height: `${(d.streams / maxVal) * 100}%`,
                        minHeight: d.streams > 0 ? "4px" : "0px",
                        background: i === chartData.length - 1
                          ? "linear-gradient(to top, #059669, #34d399)"
                          : "rgba(52,211,153,0.2)",
                        boxShadow: i === chartData.length - 1 ? "0 0 12px rgba(52,211,153,0.25)" : "none",
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-white/25 group-hover:text-white/50 transition-colors">
                    {d[labelKey]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top songs + Platform breakdown — real */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Top songs */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h2 className="text-sm font-semibold text-white mb-4">🏆 Top Songs</h2>
              {topSongs.length === 0 ? (
                <p className="text-white/25 text-sm text-center py-6">No songs with streams yet</p>
              ) : (
                <div className="space-y-3">
                  {topSongs.map((song, idx) => (
                    <div key={song._id} className="flex items-center gap-3">
                      <span className="text-[12px] text-white/20 w-4 flex-shrink-0 font-mono">{idx + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-1">
                          <span className="text-[13px] text-white/70 truncate font-medium">{song.title}</span>
                          <span className="text-[12px] text-white/40 ml-2 flex-shrink-0">
                            {song.streams.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                            style={{ width: `${(song.streams / (topSongs[0]?.streams || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Platform breakdown — real percentages */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h2 className="text-sm font-semibold text-white mb-4">🌍 Platform Breakdown</h2>
              <div className="space-y-3.5 mb-5">
                {platforms.map((p) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg ${p.bg} text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0`}>
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-[12px] mb-1">
                        <span className="text-white/50">{p.name}</span>
                        <span className="text-white/30 font-medium">{p.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${p.pct}%`, backgroundColor: p.color }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Donut */}
              <div className="flex items-center justify-center">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  {(() => {
                    let offset = 0;
                    const r = 35, cx = 50, cy = 50, circ = 2 * Math.PI * r;
                    return platforms.map((p, i) => {
                      const dash = (p.pct / 100) * circ;
                      const el = (
                        <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                          stroke={p.color} strokeWidth="14"
                          strokeDasharray={`${dash} ${circ - dash}`}
                          strokeDashoffset={-offset}
                          transform="rotate(-90 50 50)" opacity="0.85" />
                      );
                      offset += dash;
                      return el;
                    });
                  })()}
                  <text x="50" y="47" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" opacity="0.7">Total</text>
                  <text x="50" y="60" textAnchor="middle" fill="white" fontSize="9" opacity="0.4">streams</text>
                </svg>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
