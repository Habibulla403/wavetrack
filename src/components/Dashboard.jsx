import MetricCard from "./MetricCard";
import UploadSection from "./UploadSection";
import SongTable from "./SongTable";
import { songs, platforms } from "../data";

const totalStreams = songs.reduce((a, s) => a + s.streams, 0);
const totalEarnings = songs.reduce((a, s) => a + s.earnings, 0);
const liveSongs = songs.filter(s => s.status === "live").length;

function StreamsBar() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white">Streams by Platform</h2>
        <span className="text-[11px] text-white/30">{totalStreams.toLocaleString()} total</span>
      </div>
      <div className="space-y-3.5">
        {platforms.map((p) => (
          <div key={p.name} className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-lg ${p.bg} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}>
              {p.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between mb-1">
                <span className="text-[12px] text-white/60">{p.name}</span>
                <span className="text-[12px] text-white/40">{p.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${p.pct}%`, backgroundColor: p.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentActivity() {
  const events = [
    { icon: "▶", text: "City Lights reached 5k streams", time: "2h ago", color: "text-emerald-400" },
    { icon: "✓", text: "Midnight Drive approved on Spotify", time: "1d ago", color: "text-blue-400" },
    { icon: "⬆", text: "Golden Hour submitted for review", time: "3d ago", color: "text-amber-400" },
    { icon: "✓", text: "Breathe Easy now live on Apple Music", time: "5d ago", color: "text-purple-400" },
  ];
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <h2 className="text-sm font-semibold text-white mb-4">Recent Activity</h2>
      <div className="space-y-3">
        {events.map((e, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className={`text-[13px] mt-0.5 flex-shrink-0 ${e.color}`}>{e.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-white/60 leading-tight">{e.text}</p>
              <p className="text-[11px] text-white/25 mt-0.5">{e.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Welcome back, Arif. Here's your music overview.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="Total Songs" value={songs.length} sub={`${liveSongs} live`}
          icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M2 11V6L11 4V9"/><circle cx="2" cy="11" r="1.5"/><circle cx="11" cy="9" r="1.5"/></svg>} />
        <MetricCard label="Total Streams" value={totalStreams.toLocaleString()} sub="+12% this week"
          icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><polyline points="1,10 3.5,6 6,8 9,3.5 12,5.5"/></svg>} />
        <MetricCard label="Platforms" value="4" sub="Spotify, Apple, YT, Deezer"
          icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="2.5" cy="7" r="1.5"/><circle cx="11.5" cy="2.5" r="1.5"/><circle cx="11.5" cy="11.5" r="1.5"/><line x1="4" y1="6.3" x2="10" y2="3.2"/><line x1="4" y1="7.7" x2="10" y2="10.8"/></svg>} />
        <MetricCard label="Est. Earnings" value={`$${totalEarnings.toFixed(2)}`} sub="Payouts coming soon" accent
          icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="7" cy="7" r="5.5"/><path d="M7 4.5V5m0 4v.5M5.5 8.5a1.5 1.5 0 003 0c0-.83-.67-1.5-1.5-1.5S5.5 6.33 5.5 5.5a1.5 1.5 0 013 0"/></svg>} />
      </div>
      <UploadSection />
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5">
        <SongTable limit={4} />
        <div className="space-y-4">
          <StreamsBar />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
