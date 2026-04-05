import { useState, useRef } from "react";
import { createSong } from "../api";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
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
      className={`w-full aspect-square rounded-xl border-2 border-dashed cursor-pointer overflow-hidden flex flex-col items-center justify-center transition-all duration-200 group ${drag ? "border-emerald-400 bg-emerald-500/10" : "border-white/10 hover:border-white/25 bg-white/[0.03]"}`}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
      {cover ? (
        <img src={cover} alt="cover" className="w-full h-full object-cover" />
      ) : (
        <div className="text-center p-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-2">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="text-white/40">
              <rect x="2" y="2" width="14" height="14" rx="3" /><circle cx="6.5" cy="6.5" r="1.5" /><polyline points="2,12 6,8 9,11 12,8 16,12" />
            </svg>
          </div>
          <p className="text-[11px] text-white/30">Cover art</p>
          <p className="text-[10px] text-white/20">JPG / PNG</p>
        </div>
      )}
    </div>
  );
}

export default function UploadSection({ onSongAdded }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [cover, setCover] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [done, setDone] = useState(false);
  const inputRef = useRef();

  const handleAudio = (f) => {
    if (!f) return;
    if (f.name.match(/\.(mp3|wav|flac)$/i)) setFile(f);
    else alert("Please upload MP3, WAV, or FLAC only.");
  };

  const handleSubmit = async () => {
    if (!file || !title) return;
    setUploading(true);
    try {
      let coverUrl = "";
      let audioUrl = "";

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
      await createSong({ title, genre, coverUrl, audioUrl }, token);

      setUploading(false);
      setDone(true);
      if (onSongAdded) onSongAdded();
      setTimeout(() => {
        setDone(false);
        setFile(null);
        setCover(null);
        setCoverFile(null);
        setTitle("");
        setGenre("");
        setProgress("");
      }, 2500);
    } catch (err) {
      setUploading(false);
      setProgress("");
      alert("Upload failed: " + err.message);
    }
  };

  if (done) return (
    <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-8 flex flex-col items-center text-center gap-3">
      <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
        <svg width="22" height="22" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round"><polyline points="4,12 9,17 20,6" /></svg>
      </div>
      <p className="text-emerald-300 font-semibold">Song uploaded successfully!</p>
      <p className="text-white/40 text-sm">Your song has been saved.</p>
    </div>
  );

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6">
      <h2 className="text-base font-semibold text-white mb-5">Upload New Song</h2>
      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5">
        <div className="w-full sm:w-32">
          <CoverUpload cover={cover
