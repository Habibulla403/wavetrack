import { useState } from "react";
import { songs, coverColors, statusConfig } from "../data";

const dspList = [
  { name: "Spotify", color: "#1DB954", bg: "bg-emerald-500", songs: 4, status: "Connected" },
  { name: "Apple Music", color: "#fc3c44", bg: "bg-rose-500", songs: 4, status: "Connected" },
  { name: "YouTube Music", color: "#ff0000", bg: "bg-red-500", songs: 3, status: "Connected" },
  { name: "Deezer", color: "#a238ff", bg: "bg-purple-500", songs: 4, status: "Connected" },
  { name: "Amazon Music", color: "#00A8E1", bg: "bg-sky-500", songs: 0, status: "Not connected" },
  { name: "Tidal", color: "#009EE0", bg: "bg-blue-500", songs: 0, status: "Not connected" },
  { name: "TikTok", color: "#ff0050", bg: "bg-pink-500", songs: 0, status: "Not connected" },
  { name: "SoundCloud", color: "#FF5500", bg: "bg-orange-500", songs: 0, status: "Not connected" },
];

export default function Distribution() {
  const [connecting, setConnecting] = useState(null);

  const handleConnect = (name) => {
    setConnecting(name);
    setTimeout(() => setConnecting(null), 1500);
  };

  const connected = dspList.filter((d) => d.status === "Connected");
  const notConnected = dspList.filter((d) => d.status !== "Connected");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Distribution</h1>
        <p className="text-white/40 text-sm mt-1">Track where your music is distributed</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Connected Platforms", value: connected.length },
          { label: "Songs Live", value: songs.filter((s) => s.status === "live").length },
          { label: "Available Platforms", value: dspList.length },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-[12px] text-white/30 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Connected platforms */}
      <div>
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">Connected</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {connected.map((d) => (
            <div key={d.name} className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 hover:bg-emerald-500/8 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl ${d.bg} flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-sm`}>
                  {d.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{d.name}</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Connected
                  </div>
                </div>
              </div>
              <div className="text-[12px] text-white/30">{d.songs} songs live</div>
            </div>
          ))}
        </div>
      </div>

      {/* Not connected */}
      <div>
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">Available to Connect</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {notConnected.map((d) => (
            <div key={d.name} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl ${d.bg} flex items-center justify-center text-xs font-bold text-white flex-shrink-0 opacity-60`}>
                  {d.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-medium text-white/70">{d.name}</div>
                  <div className="text-[11px] text-white/25">Not connected</div>
                </div>
              </div>
              <button
                onClick={() => handleConnect(d.name)}
                className="w-full text-[12px] py-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-all font-medium"
              >
                {connecting === d.name ? "Connecting..." : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Song distribution status */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.05]">
          <h2 className="text-sm font-semibold text-white">Song Distribution Status</h2>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {songs.map((song) => {
            const sc = statusConfig[song.status];
            return (
              <div key={song.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02]">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${coverColors[song.cover]} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{song.title}</div>
                  <div className="text-[12px] text-white/30">{song.genre}</div>
                </div>
                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${sc.cls}`}>{sc.label}</span>
                <div className="hidden sm:flex gap-1.5">
                  {song.status === "live" ? dspList.slice(0, 4).map((d) => (
                    <div key={d.name} className={`w-5 h-5 rounded-md ${d.bg} opacity-80 flex items-center justify-center text-[8px] font-bold text-white`}>
                      {d.name[0]}
                    </div>
                  )) : <span className="text-[12px] text-white/20">—</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
