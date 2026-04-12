import { useState, useRef } from "react";
import { createSong } from "../api";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
  });

async function uploadToCloudinary(file, type) {
  const base64 = await toBase64(file);
  const res = await fetch("https://wavetrack-backend-rggh.onrender.com/api/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ file: base64, type }),
  });
  return res.json();
}

function CoverUpload({ cover, setCover, setCoverFile }) {
  const inputRef = useRef();
  const [drag, setDrag] = useState(false);
  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setCoverFile(file);
    setCover(URL.createObjectURL(file));
  };
  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
      className={`w-full aspect-square rounded-xl border-2 border-dashed cursor-pointer overflow-hidden flex flex-col items-center justify-center transition-all duration-200 ${drag ? "border-emerald-400 bg-emerald-500/10" : "border-white/10 hover:border-white/25 bg-white/[0.03]"}`}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
      {cover ? (
        <img src={cover} alt="cover" className="w-full h-full object-cover" />
      ) : (
        <div className="text-center p-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-2">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="text-white/40">
              <rect x="2" y="2" width="14" height="14" rx="3"/><circle cx="6.5" cy="6.5" r="1.5"/><polyline points="2,12 6,8 9,11 12,8 16,12"/>
            </svg>
          </div>
          <p className="text-[11px] text-white/30">Cover art</p>
          <p className="text-[10px] text-white/20">JPG / PNG</p>
        </div>
      )}
    </div>
  );
}

export default function UploadSection({ onSongAdded, onUpgradeClick }) {
  const [dragging,   setDragging]   = useState(false);
  const [file,       setFile]       = useState(null);
  const [cover,      setCover]      = useState(null);
  const [coverFile,  setCoverFile]  = useState(null);
  const [title,      setTitle]      = useState("");
  const [genre,      setGenre]      = useState("");
  const [uploading,  setUploading]  = useState(false);
  const [progress,   setProgress]   = useState("");
  const [done,       setDone]       = useState(false);
  const [limitError, setLimitError] = useState(false);
  const inputRef = useRef();

  const handleAudio = (f) => {
    if (!f) return;
    if (f.name.match(/\.(mp3|wav|flac)$/i)) setFile(f);
    else alert("Please upload MP3, WAV, or FLAC only.");
  };

  const handleSubmit = async () => {
    if (!file || !title) return;
    setUploading(true);
    setLimitError(false);
    try {
      let coverUrl = "", audioUrl = "";
      if (coverFile) {
        setProgress("Uploading cover image...");
        const coverRes = await uploadToCloudinary(coverFile, "image");
        coverUrl = coverRes.url || "";
      }
      setProgress("Uploading audio file...");
      const audioRes = await uploadToCloudinary(file, "audio");
      audioUrl = audioRes.url || "";
      setProgress("Saving song...");
      const token = localStorage.getItem("token");
      const res = await createSong({ title, genre, coverUrl, audioUrl }, token);

      // Check if plan limit hit
      if (res.upgradeRequired) {
        setLimitError(true);
        setUploading(false);
        setProgress("");
        return;
      }

      setUploading(false);
      setDone(true);
      if (onSongAdded) onSongAdded();
      setTimeout(() => {
        setDone(false); setFile(null); setCover(null);
        setCoverFile(null); setTitle(""); setGenre(""); setProgress("");
      }, 2500);
    } catch (err) {
      setUploading(false);
      setProgress("");
      alert("Upload failed: " + err.message);
    }
  };

  // Plan limit reached
  if (limitError) return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-8 flex flex-col items-center text-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center text-3xl">🔒</div>
      <div>
        <p className="text-amber-300 font-bold text-lg mb-1">Song Limit Reached</p>
        <p className="text-white/40 text-sm">Your Free plan allows up to 3 songs. Upgrade to upload unlimited music.</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => { setLimitError(false); if (onUpgradeClick) onUpgradeClick(); }}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all">
          ✨ Upgrade to Pro
        </button>
        <button onClick={() => setLimitError(false)} className="px-6 py-2.5 rounded-xl bg-white/5 text-sm text-white/50 hover:bg-white/10 transition-all border border-white/10">
          Cancel
        </button>
      </div>
    </div>
  );

  if (done) return (
    <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-8 flex flex-col items-center text-center gap-3">
      <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
        <svg width="22" height="22" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round"><polyline points="4,12 9,17 20,6"/></svg>
      </div>
      <p className="text-emerald-300 font-semibold">Song uploaded successfully!</p>
      <p className="text-white/40 text-sm">Your song has been saved and is pending review.</p>
    </div>
  );

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6">
      <h2 className="text-base font-semibold text-white mb-5">Upload New Song</h2>
      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5">
        <div className="w-full sm:w-32">
          <CoverUpload cover={cover} setCover={setCover} setCoverFile={setCoverFile} />
        </div>
        <div className="flex flex-col gap-4">
          <div
            onClick={() => inputRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleAudio(e.dataTransfer.files[0]); }}
            className={`rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center py-6 px-4 text-center transition-all duration-200 ${dragging ? "border-emerald-400 bg-emerald-500/10" : file ? "border-emerald-500/40 bg-emerald-500/5" : "border-white/10 hover:border-white/20 bg-white/[0.02]"}`}
          >
            <input ref={inputRef} type="file" accept=".mp3,.wav,.flac" className="hidden" onChange={(e) => handleAudio(e.target.files[0])} />
            {file ? (
              <div className="flex items-center gap-3 w-full">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round"><path d="M3 13V7L12 5V11"/><circle cx="3" cy="13" r="1.5"/><circle cx="12" cy="11" r="1.5"/></svg>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-sm text-emerald-300 font-medium truncate">{file.name}</p>
                  <p className="text-[11px] text-white/30">{(file.size/1024/1024).toFixed(1)} MB</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-white/20 hover:text-white/60 p-1">✕</button>
              </div>
            ) : (
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-2 mx-auto">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="text-white/30">
                    <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                </div>
                <p className="text-sm text-white/50 font-medium">Drag and drop your track</p>
                <p className="text-[12px] text-white/25 mt-1">MP3, WAV, FLAC up to 300 MB</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-white/30 font-medium uppercase tracking-wide block mb-1.5">Song Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter song title"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all"/>
            </div>
            <div>
              <label className="text-[11px] text-white/30 font-medium uppercase tracking-wide block mb-1.5">Genre</label>
              <select value={genre} onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white/70 focus:outline-none focus:border-emerald-500/50 transition-all appearance-none">
                <option value="" className="bg-[#1a1a2e]">Select genre</option>
                {["Afrobeats","Amapiano","R&B","Hip-Hop","Pop","Lo-fi","Soul","Jazz","Electronic","Rock","Reggae","Classical","Synthwave"].map(g => (
                  <option key={g} value={g} className="bg-[#1a1a2e]">{g}</option>
                ))}
              </select>
            </div>
          </div>
          {uploading && (
            <div className="flex items-center gap-2 text-sm text-emerald-400">
              <svg className="animate-spin" width="14" height="14" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              {progress}
            </div>
          )}
          <button onClick={handleSubmit} disabled={!file || !title || uploading}
            className="self-start flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold text-white transition-all active:scale-95">
            {uploading ? "Uploading..." : "Submit Song"}
          </button>
        </div>
      </div>
    </div>
  );
}
