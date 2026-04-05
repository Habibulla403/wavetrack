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
