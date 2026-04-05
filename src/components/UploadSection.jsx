import { useState, useRef } from "react";

function CoverUpload({ cover, setCover }) {
  const inputRef = useRef();
  const [drag, setDrag] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setCover(url);
  };

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
      className={`
        w-full aspect-square rounded-xl border-2 border-dashed cursor-pointer overflow-hidden
        flex flex-col items-center justify-center transition-all duration-200 group
        ${drag ? "border-emerald-400 bg-emerald-500/10" : "border-white/10 hover:border-white/25 bg-white/[0.03]"}
      `}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
      {cover ? (
        <img src={cover} alt="cover" className="w-full h-full object-cover" />
      ) : (
        <div className="text-center p-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-2 group-hover:bg-white/10 transition-colors">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="text-white/40">
              <rect x="2" y="2" width="14" height="14" rx="3" />
              <circle cx="6.5" cy="6.5" r="1.5" />
              <polyline points="2,12 6,8 9,11 12,8 16,12" />
            </svg>
          </div>
          <p className="text-[11px] text-white/30">Cover art</p>
          <p className="text-[10px] text-white/20">JPG / PNG</p>
        </div>
      )}
    </div>
  );
}

export default function UploadSection() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [cover, setCover] = useState(null);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef();

  const handleAudio = (f) => {
    if (!f) return;
    const valid = ["audio/mpeg", "audio/wav", "audio/flac", "audio/x-flac", "audio/x-wav"];
    if (valid.includes(f.type) || f.name.match(/\.(mp3|wav|flac)$/i)) setFile(f);
    else alert("Please upload MP3, WAV, or FLAC only.");
  };

  const handleSubmit = () => {
    if (!file || !title) return;
    setUploading(true);
    setTimeout(() => { setUploading(false); setDone(true); setTimeout(() => { setDone(false); setFile(null); setCover(null); setTitle(""); setGenre(""); }, 2500); }, 2000);
  };

  if (done) return (
    <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-8 flex flex-col items-center text-center gap-3">
      <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
        <svg width="22" height="22" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round"><polyline points="4,12 9,17 20,6" /></svg>
      </div>
      <p className="text-emerald-300 font-semibold">Song submitted!</p>
      <p className="text-white/40 text-sm">It'll be live within 24-48 hours.</p>
    </div>
  );

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6">
      <h2 className="text-base font-semibold text-white mb-5">Upload New Song</h2>
      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5">
        <div className="w-full sm:w-32">
          <CoverUpload cover={cover} setCover={setCover} />
        </div>
        <div className="flex flex-col gap-4">
          <div
            onClick={() => inputRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleAudio(e.dataTransfer.files[0]); }}
            className={`
              rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center py-6 px-4 text-center transition-all duration-200
              ${dragging ? "border-emerald-400 bg-emerald-500/10" : file ? "border-emerald-500/40 bg-emerald-500/5" : "border-white/10 hover:border-white/20 bg-white/[0.02]"}
            `}
          >
            <input ref={inputRef} type="file" accept=".mp3,.wav,.flac,audio/*" className="hidden" onChange={(e) => handleAudio(e.target.files[0])} />
            {file ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M3 13V7L12 5V11" /><circle cx="3" cy="13" r="1.5" /><circle cx="12" cy="11" r="1.5" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm text-emerald-300 font-medium truncate max-w-[180px]">{file.name}</p>
                  <p className="text-[11px] text-white/30">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="ml-auto text-white/20 hover:text-white/60 p-1">✕</button>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-2">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="text-white/30">
                    <path d="M12 2H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V9z" /><polyline points="14,2 14,8 20,8" />
                    <line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                </div>
                <p className="text-sm text-white/50 font-medium">Drag & drop your track</p>
                <p className="text-[12px] text-white/25 mt-1">MP3 · WAV · FLAC — up to 300 MB</p>
