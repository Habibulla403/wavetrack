// Static platform list (used as fallback / display reference only)
// Real % breakdown comes from /api/songs/analytics
export const platforms = [
  { name: "Spotify",       pct: 58, color: "#1DB954", bg: "bg-emerald-500" },
  { name: "Apple Music",   pct: 22, color: "#fc3c44", bg: "bg-rose-500"    },
  { name: "YouTube Music", pct: 13, color: "#FF0000", bg: "bg-red-500"     },
  { name: "Deezer",        pct: 7,  color: "#a238ff", bg: "bg-purple-500"  },
];

export const coverColors = {
  emerald: "from-emerald-500 to-teal-600",
  amber:   "from-amber-400 to-orange-500",
  purple:  "from-violet-500 to-purple-700",
  blue:    "from-blue-500 to-indigo-600",
  gray:    "from-zinc-500 to-zinc-700",
  pink:    "from-pink-500 to-rose-600",
};

export const statusConfig = {
  live:    { label: "Live",    cls: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" },
  pending: { label: "Pending", cls: "bg-amber-500/15 text-amber-400 border border-amber-500/25"     },
  draft:   { label: "Draft",   cls: "bg-white/5 text-white/40 border border-white/10"               },
};

export function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "k";
  return String(n);
}
