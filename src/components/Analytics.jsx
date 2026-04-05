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

const maxStreams = Math.max(...weeklyData.map(d => d.streams));

export default function Analytics() {
  const topSongs = [...songs].filter(s => s.streams > 0).sort((a, b) => b.streams - a.streams);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Analytics</h1>
        <p className="text-white/40 text-sm mt-1">Track your performance across platforms</p>
      </div>
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-white">Weekly Streams</h2>
          <span className="text-[11px] text-white/30">Last 7 days</span>
        </div>
        <div className="flex items-end gap-2 h-32">
          {weeklyData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
              <span className="text-[10px] text-white/0 group-hover:text-white/50 transition-colors">{d.streams}</span>
              <div className="w-full relative flex items-end justify-center" style={{ height: "100px" }}>
                <div
                  className="w-full rounded-t-lg bg-emerald-500/30 group-hover:bg-emerald-500/50 transition-all duration-200 relative"
                  style={{ height: `${(d.streams / maxStreams) * 100}%` }}
                >
                  <div className="absolute inset-x-0 top-0 h-1 rounded-t-lg bg-emerald-400 opacity-80" />
                </div>
              </div>
              <span className="text-[10px] text-white/25">{d.day}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Top Songs</h2>
          <div className="space-y-3">
            {topSongs.map((song, idx) => (
              <div key={song.id} className="flex items-center gap-3">
                <span className="text-[12px] text-white/20 w-4 flex-shrink-0">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-[13px] text-white/70 truncate">{song.title}</span>
                    <span className="text-[12px] text-white/40 ml-2 flex-shrink-0">{song.streams.toLocaleString()}</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500/60" style={{ width: `${(song.streams / topSongs[0].streams) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Platform Breakdown</h2>
          <div className="space-y-3.5">
            {platforms.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-lg ${p.bg} text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0`}>
                  {p.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="text-white/50">{p.name}</span>
                    <span className="text-white/30">{p.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${p.pct}%`, backgroundColor: p.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-white/[0.05] flex items-center justify-center">
            <svg width="100" height="100" viewBox="0 0 100 100">
              {(() => {
                let offset = 0;
                const r = 35, cx = 50, cy = 50, circ = 2 * Math.PI * r;
                return platforms.map((p, i) => {
                  const dash = (p.pct / 100) * circ;
                  const el = (
                    <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={p.color} strokeWidth="14"
                      strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset}
                      transform="rotate(-90 50 50)" opacity="0.75" />
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
