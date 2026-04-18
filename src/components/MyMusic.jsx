import { useState } from "react";
import SongTable from "./SongTable";
import UploadSection from "./UploadSection";

export default function MyMusic({ user, onPlaySong }) {
  const [tab, setTab] = useState("all");
  const [songRefresh, setSongRefresh] = useState(0);
  const tabs = ["all", "live", "pending", "draft"];

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Music</h1>
          <p className="text-white/40 text-sm mt-1">Manage and upload your songs</p>
        </div>
      </div>

      <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl w-fit border border-white/[0.05]">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
              tab === t ? "bg-white/10 text-white" : "text-white/35 hover:text-white/60"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <UploadSection onSongAdded={() => setSongRefresh((r) => r + 1)} />
      <SongTable filterStatus={tab === "all" ? null : tab} refresh={songRefresh} onPlaySong={onPlaySong} />
    </div>
  );
}
