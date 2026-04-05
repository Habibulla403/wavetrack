export const songs = [
  { id: 1, title: "Midnight Drive", genre: "R&B", duration: "3:42", status: "live", date: "Mar 12, 2026", streams: 3104, earnings: 12.42, cover: "emerald" },
  { id: 2, title: "Golden Hour", genre: "Afrobeats", duration: "4:10", status: "pending", date: "Mar 28, 2026", streams: 0, earnings: 0, cover: "amber" },
  { id: 3, title: "City Lights", genre: "Lo-fi", duration: "2:58", status: "live", date: "Feb 19, 2026", streams: 5136, earnings: 20.54, cover: "purple" },
  { id: 4, title: "Breathe Easy", genre: "Soul", duration: "3:55", status: "live", date: "Jan 30, 2026", streams: 892, earnings: 3.57, cover: "blue" },
  { id: 5, title: "Untitled WIP", genre: "—", duration: "—", status: "draft", date: "Apr 1, 2026", streams: 0, earnings: 0, cover: "gray" },
  { id: 6, title: "Neon Rainstorm", genre: "Synthwave", duration: "5:12", status: "live", date: "Jan 5, 2026", streams: 2210, earnings: 8.84, cover: "pink" },
];

export const platforms = [
  { name: "Spotify", pct: 58, color: "#1DB954", bg: "bg-emerald-500" },
  { name: "Apple Music", pct: 22, color: "#fc3c44", bg: "bg-rose-500" },
  { name: "YouTube Music", pct: 13, color: "#ff0000", bg: "bg-red-500" },
  { name: "Deezer", pct: 7, color: "#a238ff", bg: "bg-purple-500" },
];

export const coverColors = {
  emerald: "from-emerald-500 to-teal-600",
  amber: "from-amber-400 to-orange-500",
  purple: "from-violet-500 to-purple-700",
  blue: "from-blue-500 to-indigo-600",
  gray: "from-zinc-500 to-zinc-700",
  pink: "from-pink-500 to-rose-600",
};

export const statusConfig = {
  live: { label: "Live", cls: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" },
  pending: { label: "Pending", cls: "bg-amber-500/15 text-amber-400 border border-amber-500/25" },
  draft: { label: "Draft", cls: "bg-white/5 text-white/40 border border-white/10" },
};

export function fmt(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}
