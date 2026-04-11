import { useState, useEffect, useRef } from "react";
import UploadSection from "./UploadSection";
import SongTable from "./SongTable";
import { platforms } from "../data";
import { getSongs, getStats } from "../api";

// ── tiny sparkline ──────────────────────────────────────────────
const weeklyData = [320,580,420,890,1100,760,640];
const days = ["M","T","W","T","F","S","S"];
const maxW = Math.max(...weeklyData);

const monthlyData = [
  {m:"Oct",v:8200},{m:"Nov",v:9400},{m:"Dec",v:7800},
  {m:"Jan",v:11200},{m:"Feb",v:13500},{m:"Mar",v:11342},
];
const maxM = Math.max(...monthlyData.map(d=>d.v));

function Sparkline({ data, max, color="#34d399", height=40 }) {
  const w = 120, h = height;
  const pts = data.map((v,i)=>`${(i/(data.length-1))*w},${h - (v/max)*h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={color} opacity="0.08"/>
    </svg>
  );
}

// ── notification bell ───────────────────────────────────────────
const NOTIFS = [
  { id:1, icon:"🎵", text:"City Lights hit 5,000 streams!", time:"2h ago",  unread:true,  color:"text-emerald-400" },
  { id:2, icon:"✅", text:"Midnight Drive approved on Spotify", time:"1d ago", unread:true, color:"text-blue-400" },
  { id:3, icon:"⬆️", text:"Golden Hour submitted for review",  time:"3d ago", unread:false, color:"text-amber-400" },
  { id:4, icon:"💰", text:"Payout of $12.42 is being processed", time:"5d ago", unread:false, color:"text-yellow-400" },
];

function NotifBell() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFS);
  const ref = useRef();
  const unread = notifs.filter(n=>n.unread).length;

  useEffect(()=>{
    const fn = (e)=>{ if(ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return ()=>document.removeEventListener("mousedown", fn);
  },[]);

  const markAll = ()=> setNotifs(n=>n.map(x=>({...x,unread:false})));

  return (
    <div className="relative" ref={ref}>
      <button onClick={()=>setOpen(o=>!o)}
        className="relative w-9 h-9 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/[0.06] flex items-center justify-center transition-all">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-white/60">
          <path d="M13.73 8.79A6 6 0 1 0 2.27 8.79 10 10 0 0 1 1 12h14a10 10 0 0 1-1.27-3.21z"/>
          <path d="M9 16a2 2 0 0 1-4 0"/>
        </svg>
        {unread>0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-11 w-72 bg-[#13131f] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <span className="text-sm font-semibold text-white">Notifications</span>
            <button onClick={markAll} className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors">Mark all read</button>
          </div>
          <div className="divide-y divide-white/[0.04] max-h-64 overflow-y-auto">
            {notifs.map(n=>(
              <div key={n.id} className={`flex gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors ${n.unread?"bg-white/[0.02]":""}`}>
                <span className="text-base flex-shrink-0 mt-0.5">{n.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-[12px] leading-snug ${n.unread?"text-white/80":"text-white/40"}`}>{n.text}</p>
                  <p className="text-[10px] text-white/20 mt-0.5">{n.time}</p>
                </div>
                {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5"/>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── stat card ───────────────────────────────────────────────────
function StatCard({ label, value, sub, trend, trendUp, sparkData, sparkColor, accent }) {
  return (
    <div className={`rounded-2xl p-5 border flex flex-col gap-3 hover:-translate-y-0.5 transition-all duration-200 ${
      accent
        ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/5 border-emerald-500/30"
        : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]"
    }`}>
      <div className="flex items-start justify-between">
        <span className={`text-[11px] font-semibold tracking-widest uppercase ${accent?"text-emerald-400/80":"text-white/25"}`}>{label}</span>
        {trend && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
            trendUp ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
          }`}>
            {trendUp?"↑":"↓"} {trend}
          </span>
        )}
      </div>
      <div className={`text-2xl font-bold tracking-tight ${accent?"text-emerald-300":"text-white"}`}>{value}</div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-[11px] text-white/25 leading-tight">{sub}</span>
        {sparkData && <Sparkline data={sparkData} max={Math.max(...sparkData)} color={sparkColor||"#34d399"} height={32}/>}
      </div>
    </div>
  );
}

// ── main chart ──────────────────────────────────────────────────
function StreamChart({ period, setPeriod }) {
  const data  = period==="weekly"  ? weeklyData  : monthlyData.map(d=>d.v);
  const labels= period==="weekly"  ? days         : monthlyData.map(d=>d.m);
  const maxV  = period==="weekly"  ? maxW         : maxM;
  const total = data.reduce((a,b)=>a+b,0);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="text-sm font-bold text-white">Stream Performance</h2>
          <p className="text-[11px] text-white/30 mt-0.5">{total.toLocaleString()} total · <span className="text-emerald-400">↑ 18%</span></p>
        </div>
        <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/[0.05]">
          {["weekly","monthly"].map(p=>(
            <button key={p} onClick={()=>setPeriod(p)}
              className={`px-3 py-1 rounded-lg text-[11px] font-medium capitalize transition-all ${
                period===p ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"
              }`}>{p==="weekly"?"7 Days":"6 Mo"}</button>
          ))}
        </div>
      </div>
      <div className="flex items-end gap-1.5" style={{height:"100px"}}>
        {data.map((v,i)=>(
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
            <div className="w-full flex items-end justify-center" style={{height:"80px"}}>
              <div className="w-full rounded-t-md transition-all duration-500 group-hover:opacity-100 opacity-75"
                style={{
                  height:`${(v/maxV)*100}%`,
                  background: i===(period==="weekly"?4:4)
                    ? "linear-gradient(to top,#059669,#34d399)"
                    : "rgba(52,211,153,0.18)",
                  boxShadow: i===(period==="weekly"?4:4) ? "0 0 16px rgba(52,211,153,0.3)" : "none",
                }}/>
            </div>
            <span className="text-[9px] text-white/20 group-hover:text-white/50 transition-colors">{labels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── top songs ───────────────────────────────────────────────────
function TopSongs({ songs }) {
  if(!songs.length) return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <h2 className="text-sm font-bold text-white mb-4">Top Songs</h2>
      <p className="text-white/20 text-sm text-center py-6">No songs yet</p>
    </div>
  );
  const top = [...songs].sort((a,b)=>b.streams-a.streams).slice(0,5);
  const maxS = top[0]?.streams||1;
  const colors=["#34d399","#60a5fa","#f59e0b","#a78bfa","#f472b6"];
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <h2 className="text-sm font-bold text-white mb-4">🏆 Top Songs</h2>
      <div className="space-y-3">
        {top.map((s,i)=>(
          <div key={s._id||i} className="flex items-center gap-3 group">
            <span className="text-[11px] font-mono text-white/20 w-4 flex-shrink-0">{i+1}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] text-white/80 font-medium truncate">{s.title}</span>
                <span className="text-[11px] text-white/30 ml-2 flex-shrink-0">
                  {s.streams>0 ? s.streams.toLocaleString() : "—"}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{width:`${(s.streams/maxS)*100}%`, backgroundColor: colors[i]}}/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── earnings breakdown ──────────────────────────────────────────
function EarningsBreakdown({ total }) {
  const breakdown = [
    { label:"Spotify",      pct:58, color:"#1DB954" },
    { label:"Apple Music",  pct:22, color:"#fc3c44" },
    { label:"YouTube",      pct:13, color:"#ff0000" },
    { label:"Deezer",       pct:7,  color:"#a238ff" },
  ];
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-white">💰 Earnings Breakdown</h2>
        <span className="text-[11px] text-emerald-400 font-semibold">${total.toFixed(2)} total</span>
      </div>
      {/* Stacked bar */}
      <div className="flex h-3 rounded-full overflow-hidden mb-4 gap-0.5">
        {breakdown.map(b=>(
          <div key={b.label} style={{width:`${b.pct}%`, backgroundColor:b.color}} className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-700"/>
        ))}
      </div>
      <div className="space-y-2.5">
        {breakdown.map(b=>(
          <div key={b.label} className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{backgroundColor:b.color}}/>
            <span className="text-[12px] text-white/50 flex-1">{b.label}</span>
            <span className="text-[12px] text-white/30">{b.pct}%</span>
            <span className="text-[12px] text-white/60 font-medium w-12 text-right">
              ${((total*b.pct)/100).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between">
        <span className="text-[11px] text-white/25">Next payout</span>
        <span className="text-[11px] text-amber-400 font-medium">Coming soon</span>
      </div>
    </div>
  );
}

// ── quick stats strip ───────────────────────────────────────────
function QuickStats({ stats }) {
  const items = [
    { label:"Today",    value: Math.round((stats.totalStreams||0)*0.04).toLocaleString(), icon:"☀️" },
    { label:"This Week",value: Math.round((stats.totalStreams||0)*0.18).toLocaleString(), icon:"📅" },
    { label:"This Month",value:(stats.totalStreams||0).toLocaleString(),                  icon:"📆" },
    { label:"All Time", value:(stats.totalStreams||0).toLocaleString(),                   icon:"🏅" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((s,i)=>(
        <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 flex items-center gap-3">
          <span className="text-xl">{s.icon}</span>
          <div>
            <div className="text-[10px] text-white/25 uppercase tracking-wide">{s.label}</div>
            <div className="text-base font-bold text-white">{s.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── platform bar ────────────────────────────────────────────────
function PlatformBar({ totalStreams }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <h2 className="text-sm font-bold text-white mb-4">🌍 Platform Reach</h2>
      <div className="space-y-3">
        {platforms.map(p=>(
          <div key={p.name} className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-lg ${p.bg} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}>
              {p.name.slice(0,2).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-[12px] text-white/50">{p.name}</span>
                <span className="text-[12px] text-white/30">{p.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{width:`${p.pct}%`,backgroundColor:p.color}}/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── recent activity ─────────────────────────────────────────────
function RecentActivity() {
  const events=[
    {icon:"🎵",text:"City Lights reached 5k streams",time:"2h ago",color:"text-emerald-400"},
    {icon:"✅",text:"Midnight Drive approved on Spotify",time:"1d ago",color:"text-blue-400"},
    {icon:"⬆️",text:"Golden Hour submitted for review",time:"3d ago",color:"text-amber-400"},
    {icon:"✅",text:"Breathe Easy now live on Apple Music",time:"5d ago",color:"text-purple-400"},
  ];
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <h2 className="text-sm font-bold text-white mb-4">⚡ Recent Activity</h2>
      <div className="space-y-3">
        {events.map((e,i)=>(
          <div key={i} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/[0.04] flex items-center justify-center text-sm flex-shrink-0">{e.icon}</div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-[13px] text-white/60 leading-snug">{e.text}</p>
              <p className="text-[10px] text-white/20 mt-0.5">{e.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
export default function Dashboard({ user, onPlaySong, setActivePage }) {
  const [stats,      setStats]      = useState({total:0,totalStreams:0,totalEarnings:0,liveSongs:0});
  const [songs,      setSongs]      = useState([]);
  const [songRefresh,setSongRefresh]= useState(0);
  const [period,     setPeriod]     = useState("weekly");

  useEffect(()=>{
    const token = localStorage.getItem("token");
    getStats(token).then(setStats).catch(()=>{});
    getSongs(token).then(d=>setSongs(Array.isArray(d)?d:[])).catch(()=>{});
  },[songRefresh]);

  const firstName = user?.name?.split(" ")[0] || "Artist";
  const hour = new Date().getHours();
  const greeting = hour<12?"Good morning ☀️":hour<18?"Good afternoon 🌤️":"Good evening 🌙";

  return (
    <div className="space-y-5">

      {/* ── top bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-white/35 text-sm mt-0.5">Here's what's happening with your music today.</p>
        </div>
        <div className="flex items-center gap-2">
          <NotifBell />
          <button onClick={()=>setActivePage&&setActivePage("music")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-semibold text-white transition-all shadow-lg shadow-emerald-500/20">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="6.5" y1="1" x2="6.5" y2="12"/><line x1="1" y1="6.5" x2="12" y2="6.5"/>
            </svg>
            Upload Song
          </button>
        </div>
      </div>

      {/* ── 4 stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Songs"    value={stats.total||0}
          sub={`${stats.liveSongs||0} live right now`}
          trend="2 this month" trendUp
          sparkData={[1,2,2,3,3,4,stats.total||4]} sparkColor="#34d399" />
        <StatCard label="Total Streams"  value={(stats.totalStreams||0).toLocaleString()}
          sub="Across all platforms"
          trend="12%" trendUp
          sparkData={weeklyData} sparkColor="#60a5fa" />
        <StatCard label="Platforms"      value="4"
          sub="Spotify · Apple · YT · Deezer"
          sparkData={[3,3,3,4,4,4,4]} sparkColor="#a78bfa" />
        <StatCard label="Est. Earnings"  value={`$${(stats.totalEarnings||0).toFixed(2)}`}
          sub="Payouts coming soon"
          trend="8%" trendUp accent
          sparkData={[5,8,10,12,15,18,(stats.totalEarnings||20)]} sparkColor="#34d399" />
      </div>

      {/* ── quick stats strip ── */}
      <QuickStats stats={stats} />

      {/* ── main chart + top songs ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-4">
        <StreamChart period={period} setPeriod={setPeriod} />
        <TopSongs songs={songs} />
      </div>

      {/* ── earnings + platform + activity ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <EarningsBreakdown total={stats.totalEarnings||0} />
        <PlatformBar totalStreams={stats.totalStreams||0} />
        <RecentActivity />
      </div>

      {/* ── upload section ── */}
      <UploadSection onSongAdded={()=>setSongRefresh(r=>r+1)} />

      {/* ── song table ── */}
      <SongTable limit={5} refresh={songRefresh} onPlaySong={onPlaySong} />
    </div>
  );
}
