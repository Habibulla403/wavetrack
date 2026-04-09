import { useState } from "react";
import { songs, platforms } from "../data";

const weeklyData = [
  { day: "Mon", streams: 320 },
  { day: "Tue", streams: 580 },
  { day: "Wed", streams: 420 },
  { day: "Thu", streams: 890 },
  { day: "Fri", streams: 1100 },
  { day: "Sat", streams: 760 },
  { day: "Sun", streams: 640 },
];
const maxStreams = Math.max(...weeklyData.map((d) => d.streams));

const monthlyData = [
  { month: "Oct", streams: 8200 },
  { month: "Nov", streams: 9400 },
  { month: "Dec", streams: 7800 },
  { month: "Jan", streams: 11200 },
  { month: "Feb", streams: 13500 },
  { month: "Mar", streams: 11342 },
];
const maxMonthly = Math.max(...monthlyData.map((d) => d.streams));

export default function Analytics() {
  const [period, setPeriod] = useState("weekly");
  const topSongs = [...songs].filter((s) => s.streams > 0).sort((a, b) => b.streams - a.streams);
  const chartData = period === "weekly" ? weeklyData : monthlyData;
  const chartMax = period === "weekly" ? maxStreams : maxMonthly;
  const labelKey = period === "weekly" ? "day" : "month";
  const totalWeekStreams = weeklyData.reduce((a, d) => a + d.streams, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Analytics</h1>
          <p className="text-white/40 text-sm mt-1">Track your performance across platforms</p>
        </div>
        <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl w-fit border border-white/[0.05]">
          {["weekly", "monthly"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                period === p ? "bg-white/10 text-white" : "text-white/35 hover:text-white/60"
              }`}
            >
              {p === "weekly" ? "7 Days" : "6 Months"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "This Week", value: totalWeekStreams.toLocaleString(), change: "+18%", up: true },
          { label: "Peak Day", value: "1,100", change: "Friday", up: true },
          { label: "Avg/Day", value: Math.round(totalWeekStreams / 7).toLocaleString(), change: "streams", up: null },
          { label: "Total Earned", value: "$45.37", change: "+$5.20 this week", up: true },
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

      {/* Main chart */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-white">
            {period === "weekly" ? "Daily Streams (Last 7 days)" : "Monthly Streams (Last 6 months)"}
          </h2>
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
                    height: `${(d.streams / chartMax) * 100}%`,
                    background: i === (period === "weekly" ? 4 : 4)
                      ? "linear-gradient(to top, #059669, #34d399)"
                      : "rgba(52,211,153,0.2)",
                    boxShadow: i === 4 ? "0 0 12px rgba(52,211,153,0.25)" : "none",
                  }}
                />
              </div>
              <span className="text-[10px] text-white/25 group-hover:text-white/50 transition-colors">{d[labelKey]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top songs + platform */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Top Songs</h2>
          <div className="space-y-3">
            {topSongs.map((song, idx) => (
              <div key={song.id} className="flex items-center gap-3">
                <span className="text-[12px] text-white/20 w-4 flex-shrink-0 font-mono">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-[13px] text-white/70 truncate font-medium">{song.title}</span>
                    <span className="text-[12px] text-white/40 ml-2 flex-shrink-0">{song.streams.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                      style={{ width: `${(song.streams / topSongs[0].streams) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Platform Breakdown</h2>
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
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${p.pct}%`, backgroundColor: p.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Donut chart */}
          <div className="flex items-center justify-center">
            <svg width="100" height="100" viewBox="0 0 100 100">
              {(() => {
                let offset = 0;
                const r = 35, cx = 50, cy = 50, circ = 2 * Math.PI * r;
                return platforms.map((p, i) => {
                  const dash = (p.pct / 100) * circ;
                  const el = (
                    <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={p.color} strokeWidth="14"
                      strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset}
                      transform="rotate(-90 50 50)" opacity="0.8" />
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
    </div>
  );
}
