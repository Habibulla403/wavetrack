import { useState, useEffect } from "react";
import { getSongs, deleteSong } from "../api";
import { coverColors, statusConfig, fmt } from "../data";

function SongCover({ color, coverUrl }) {
  if (coverUrl) return (
    <img src={coverUrl} alt="cover" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
  );
  const gradient = coverColors[color] || coverColors.gray;
  return (
    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
      <svg width="14" height="14" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.8">
        <path d="M2.5 11V6L11.5 4V9" /><circle cx="2.5" cy="11" r="1.5" /><circle cx="11.5" cy="9" r="1.5" />
      </svg>
    </div>
  );
}

export default function SongTable({ limit, showHeader = true, refresh }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);

  const loadSongs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const data = await getSongs(token);
      setSongs(Array.isArray(data) ? data : []);
    } catch {
      setSongs([]);
    }
    setLoading(false);
  };

  useEffect(() => { loadSongs(); }, [refresh]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this song?")) return;
    const token = localStorage.getItem("token");
    await deleteSong(id, token);
    setSongs(s => s.filter(x => x._id !== id));
    setMenuOpen(null);
  };

  const display = limit ? songs.slice(0, limit) : songs;

  if (loading) return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
      <svg className="animate-spin mx-auto mb-3" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#34d399" strokeWidth="3" />
        <path className="opacity-75" fill="#34d399" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      <p className="text-white/30 text-sm">Loading songs...</p>
    </div>
  );

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      {showHeader && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h2 className="text-base font-semibold text-white">Your Songs</h2>
          <span className="text-[12px] text-white/30">{songs.length} tracks</span>
        </div>
      )}

      {/* Desktop table */}
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
              const sc = statusConfig[song.status] || statusConfig.draft;
              const colors = ["emerald", "amber", "purple", "blue", "pink", "gray"];
              const color = colors[idx % colors.length];
              return (
                <tr key={song._id} className="border-b border-white/[0.03] hover:bg-white/[0.025] group transition-colors">
                  <td className="px-5 py-3.5 text-sm text-white/20 w-10">{idx + 1}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <SongCover color={color} coverUrl={song.coverUrl} />
                      <div>
                        <div className="text-sm font-medium text-white leading-tight">{song.title}</div>
                        <div className="text-[12px] text-white/30">{song.genre || "—"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full ${sc.cls}`}>
                      {song.status === "live" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-white/40">
                    {new Date(song.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-white/60 font-medium">{song.streams > 0 ? fmt(song.streams) : "—"}</td>
                  <td className="px-5 py-3.5 text-sm text-white/40">{song.earnings > 0 ? `$${song.earnings.toFixed(2)}` : "—"}</td>
                  <td className="px-5 py-3.5 relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === song._id ? null : song._id)}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                    >
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                        <circle cx="8" cy="3" r="1.5" /><circle cx="8" cy="8" r="1.5" /><circle cx="8" cy="13" r="1.5" />
                      </svg>
                    </button>
                    {menuOpen === song._id && (
                      <div className="absolute right-4 top-12 z-10 w-40 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl py-1 overflow-hidden">
                        {song.audioUrl && (
                          <a href={song.audioUrl} target="_blank" rel="noreferrer"
                            className="w-full text-left px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2">
                            Play song
                          </a>
                        )}
                        <div className="my-1 border-t border-white/5" />
                        <button onClick={() => handleDelete(song._id)}
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

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-white/[0.04]">
        {display.map((song, idx) => {
          const sc = statusConfig[song.status] || statusConfig.draft;
          const colors = ["emerald", "amber", "purple", "blue", "pink", "gray"];
          return (
            <div key={song._id} className="flex items-center gap-3 px-4 py-3.5">
              <SongCover color={colors[idx % colors.length]} coverUrl={song.coverUrl} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{song.title}</div>
                <div className="text-[12px] text-white/30">{song.genre || "—"}</div>
              </div>
              <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${sc.cls}`}>{sc.label}</span>
            </div>
          );
        })}
      </div>

      {!loading && songs.length === 0 && (
        <div className="py-12 text-center text-white/20 text-sm">No songs yet. Upload your first track!</div>
      )}
    </div>
  );
}
