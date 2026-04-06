import { useState, useRef, useEffect } from "react";

export default function SongPlayer({ song, onClose }) {
  const audioRef = useRef();
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setProgress(audioRef.current.currentTime);
  };

  const handleLoadedData = () => {
    setDuration(audioRef.current.duration);
    setLoading(false);
  };

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    audioRef.current.currentTime = val;
    setProgress(val);
  };

  const fmt = (s) => {
    if (isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0D0D14] border-t border-white/[0.06] px-4 py-3">
      <audio
        ref={audioRef}
        src={song.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={handleLoadedData}
        onEnded={() => setPlaying(false)}
      />

      <div className="max-w-7xl mx-auto flex items-center gap-4">
        {/* Song info */}
        <div className="flex items-center gap-3 w-48 flex-shrink-0">
          {song.coverUrl ? (
            <img src={song.coverUrl} alt="cover" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round">
                <path d="M2.5 11V6L11.5 4V9"/><circle cx="2.5" cy="11" r="1.5"/><circle cx="11.5" cy="9" r="1.5"/>
              </svg>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{song.title}</p>
            <p className="text-[11px] text-white/40 truncate">{song.genre || "—"}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              disabled={loading}
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-40"
            >
              {loading ? (
                <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#000" strokeWidth="3"/>
                  <path className="opacity-75" fill="#000" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : playing ? (
                <svg width="14" height="14" fill="#000" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                </svg>
              ) : (
                <svg width="14" height="14" fill="#000" viewBox="0 0 24 24">
                  <polygon points="5,3 19,12 5,21"/>
                </svg>
              )}
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full flex items-center gap-2">
            <span className="text-[10px] text-white/30 w-8 text-right">{fmt(progress)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={progress}
              onChange={handleSeek}
              className="flex-1 h-1 accent-emerald-400 cursor-pointer"
            />
            <span className="text-[10px] text-white/30 w-8">{fmt(duration)}</span>
          </div>
        </div>

        {/* Volume + Close */}
        <div className="flex items-center gap-3 w-48 justify-end flex-shrink-0">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="text-white/30">
            <polygon points="1,9 6,9 11,4 11,16 6,11 1,11"/><path d="M13 6c1 1 1.5 2 1.5 3s-.5 2-1.5 3"/>
          </svg>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1 accent-emerald-400 cursor-pointer"
          />
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white transition-colors ml-2">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="2" y1="2" x2="12" y2="12"/><line x1="12" y1="2" x2="2" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
