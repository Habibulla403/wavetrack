import { useState } from "react";
import { songs as initialSongs, coverColors, statusConfig, fmt } from "../data";

function SongCover({ color }) {
  return (
    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${coverColors[color]} flex items-center justify-center flex-shrink-0`}>
      <svg width="14" height="14" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.8">
        <path d="M2.5 11V6L11.5 4V9" /><circle cx="2.5" cy="11" r="1.5" /><circle cx="11.5" cy="9" r="1.5" />
      </svg>
    </div>
  );
}

export default function SongTable({ limit, showHeader = true }) {
  const [songs, setSongs] = useState(initialSongs);
  const [menuOpen, setMenuOpen] = useState(null);

  const deleteSong = (id) => { setSongs(s => s.filter(x => x.id !== id)); setMenuOpen(null); };
  const display = limit ? songs.slice(0, limit) : songs;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      {showHeader && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h2 className="text-base font-semibold text-white">Your Songs</h2>
          <span className="text-[12px] text-white/30">{songs.length} tracks</span>
        </div>
      )}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.04]">
              {["#", "Title", "Status", "Uploaded", "Streams", "Earnings", ""].map((h, i) => (
                <th key={i} className="px-5 py-3 text-left text-[10px] font-semibold text-white/20 tracking-widest uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {display.map((song, idx) => {
              const sc = statusConfig[song.status];
              return (
                <tr key={song.id} className="border-b border-white/[0.03] hover:bg-white/[0.025] group transition-colors">
                  <td className="px-5 py-3.5 text-sm text-white/20 w-10">{idx + 1}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <SongCover color={song.cover} />
                      <div>
                        <div className="text-sm font-medium text-white leading-tight">{song.title}</div>
                        <div className="text-[12px] text-white/30">{song.genre} · {song.duration}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full ${sc.cls}`}>
                      {song.status === "live" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-white/40">{song.date}</td>
                  <td className="px-5 py-3.5 text-sm text-white/60 font-medium">{song.streams > 0 ? fmt(song.streams) : "—"}</td>
                  <td className="px-5 py-3.5 text-sm text-white/40">{song.earnings > 0 ? `$${song.earnings.toFixed(2)}` : "—"}</td>
                  <td className="px-5 py-3.5 relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === song.id ? null : song.id)}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                    >
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                        <circle cx="8" cy="3" r="1.5" /><circle cx="8" cy="8" r="1.5" /><circle cx="8" cy="13" r="1.5" />
                      </svg>
                    </button>
                    {menuOpen === song.id && (
                      <div className="absolute right-4 top-12 z-10 w-40 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl py-1 overflow-hidden">
                        {["Edit details", "View on Spotify", "Duplicate"].map(action => (
                          <button key={action} onClick={() => setMenuOpen(null)}
                            className="w-full text-left px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                            {action}
                          </button>
                        ))}
                        <div className="my-1 border-t border-white/5" />
                        <button onClick={() => deleteSong(song.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="md:hidden divide-y divide-white/[0.04]">
        {display.map((song) => {
          const sc = statusConfig[song.status];
          return (
            <div key={song.id} className="flex items-center gap-3 px-4 py-3.5">
              <SongCover color={song.cover} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{song.title}</div>
                <div className="text-[12px] text-white/30">{song.genre} · {song.streams > 0 ? fmt(song.streams) + " streams" : "—"}</div>
              </div>
              <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${sc.cls}`}>{sc.label}</span>
            </div>
          );
        })}
      </div>
      {songs.length === 0 && (
        <div className="py-12 text-center text-white/20 text-sm">No songs yet. Upload your first track!</div>
      )}
    </div>
  );
}
