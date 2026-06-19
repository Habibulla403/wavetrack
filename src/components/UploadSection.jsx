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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 90000); // 90s timeout

  let res;
  try {
    res = await fetch("https://wavetrack-backend-rggh.onrender.com/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ file: base64, type }),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("Upload timed out. Please try a smaller file (under 20MB) or check your connection.");
    }
    throw new Error("Network error during upload. Please check your connection and try again.");
  }
  clearTimeout(timeoutId);

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    // Server returned HTML (likely a timeout/proxy error page), not JSON
    throw new Error(
      res.status === 413
        ? "File too large. Please use a file under 20MB."
        : "Upload failed (server error). The file may be too large — try a smaller file or try again."
    );
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Upload failed. Please try again.");
  }
  return data;
}

const PLATFORMS = [
  { key: "spotify",     label: "Spotify",            emoji: "🎵" },
  { key: "appleMusic",  label: "Apple Music",        emoji: "🍎" },
  { key: "itunes",      label: "iTunes",              emoji: "🎶" },
  { key: "instagram",   label: "Instagram & Facebook", emoji: "📷" },
  { key: "tiktok",      label: "TikTok & ByteDance",   emoji: "🎤" },
  { key: "youtubeMusic",label: "YouTube Music",       emoji: "▶️" },
  { key: "amazon",      label: "Amazon",               emoji: "📦" },
  { key: "pandora",     label: "Pandora",              emoji: "📻" },
  { key: "deezer",      label: "Deezer",                emoji: "🎧" },
  { key: "tidal",       label: "Tidal",                 emoji: "🌊" },
  { key: "iheartradio", label: "iHeartRadio",           emoji: "💙" },
  { key: "qobuz",       label: "Qobuz",                  emoji: "🎼" },
  { key: "saavn",       label: "Saavn",                  emoji: "🎹" },
  { key: "boomplay",    label: "Boomplay",               emoji: "🌍" },
  { key: "anghami",     label: "Anghami",                emoji: "🎺" },
  { key: "netease",     label: "NetEase",                emoji: "☁️" },
  { key: "tencent",     label: "Tencent",                 emoji: "🎵" },
  { key: "claroMusica", label: "Claro Música",            emoji: "🎵" },
  { key: "joox",        label: "Joox",                    emoji: "🎵" },
  { key: "medianet",    label: "MediaNet",                emoji: "📡" },
  { key: "snapchat",    label: "Snapchat",                emoji: "👻" },
];

const GENRES = ["Afrobeats","Amapiano","R&B","Hip-Hop","Pop","Lo-fi","Soul","Jazz","Electronic","Rock","Reggae","Classical","Synthwave","Country","Folk","Metal","Latin","K-Pop","Gospel","Blues"];
const LANGUAGES = ["English","Spanish","French","Portuguese","Bengali","Hindi","Arabic","Korean","Japanese","Chinese","German","Italian","Russian","Turkish","Other"];

function StepBar({ step }) {
  const labels = ["Audio & Cover", "Track Details", "Songwriters", "Platforms", "Review"];
  return (
    <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
      {labels.map((l, i) => (
        <div key={i} className="flex items-center flex-shrink-0">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
            i < step ? "bg-emerald-500/20 text-emerald-400" :
            i === step ? "bg-white/10 text-white" : "bg-white/[0.03] text-white/25"
          }`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
              i < step ? "bg-emerald-500 text-white" : i === step ? "bg-white/20 text-white" : "bg-white/10 text-white/30"
            }`}>{i < step ? "✓" : i + 1}</span>
            {l}
          </div>
          {i < labels.length - 1 && <div className={`w-4 h-px ${i < step ? "bg-emerald-500/40" : "bg-white/10"}`}/>}
        </div>
      ))}
    </div>
  );
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
          <p className="text-[10px] text-white/20">3000×3000 JPG</p>
        </div>
      )}
    </div>
  );
}

function FieldLabel({ children, hint }) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-[11px] text-white/30 font-medium uppercase tracking-wide">{children}</label>
      {hint && <span className="text-[10px] text-white/15">{hint}</span>}
    </div>
  );
}

const inputCls = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all";
const selectCls = inputCls + " text-white/70 appearance-none";

function Toggle2({ value, onChange, optionA, optionB }) {
  return (
    <div className="flex gap-2">
      {[optionA, optionB].map(opt => (
        <button key={String(opt.value)} type="button" onClick={() => onChange(opt.value)}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border ${
            value === opt.value
              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
              : "border-white/[0.08] text-white/40 hover:text-white/60"
          }`}>{opt.label}</button>
      ))}
    </div>
  );
}

export default function UploadSection({ onSongAdded, onUpgradeClick }) {
  const [step, setStep] = useState(0);
  const [uploading,  setUploading]  = useState(false);
  const [progress,   setProgress]   = useState("");
  const [done,       setDone]       = useState(false);
  const [limitError, setLimitError] = useState(false);
  const [dragging,   setDragging]   = useState(false);
  const inputRef = useRef();

  const [file,      setFile]      = useState(null);
  const [cover,     setCover]     = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const [title,        setTitle]        = useState("");
  const [artistName,   setArtistName]   = useState("");
  const [genre,        setGenre]        = useState("");
  const [secondaryGenre, setSecondaryGenre] = useState("");
  const [language,     setLanguage]     = useState("English");
  const [recordLabel,  setRecordLabel]  = useState("");
  const [releaseDate,  setReleaseDate]  = useState("");
  const [previouslyReleased, setPreviouslyReleased] = useState(false);
  const [explicit,     setExplicit]     = useState(false);
  const [instrumental, setInstrumental] = useState(false);
  const [aiGenerated,  setAiGenerated]  = useState(false);
  const [featuredArtists, setFeaturedArtists] = useState("");
  const [isrc,         setIsrc]         = useState("");

  const [isCover, setIsCover] = useState(false);
  const [songwriters, setSongwriters] = useState([{ firstName: "", middleName: "", lastName: "" }]);

  const [selectedPlatforms, setSelectedPlatforms] = useState(PLATFORMS.map(p => p.key));
  const [spotifyArtistLink, setSpotifyArtistLink] = useState("");
  const [appleMusicArtistLink, setAppleMusicArtistLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [facebookLink, setFacebookLink] = useState("");

  const [addons, setAddons] = useState({
    socialMediaPack: false, discoveryPack: false, storeMaximiser: false,
    loudnessNormalize: false, leaveLegacy: false,
  });

  const [agreed, setAgreed] = useState(false);

  const handleAudio = (f) => {
    if (!f) return;
    if (!f.name.match(/\.(mp3|wav|flac)$/i)) {
      alert("Please upload MP3, WAV, or FLAC only.");
      return;
    }
    const maxBytes = 20 * 1024 * 1024; // 20MB practical limit on current hosting
    if (f.size > maxBytes) {
      alert(`This file is ${(f.size/1024/1024).toFixed(1)}MB. Please use a file under 20MB — large files currently fail to upload due to server limits. (MP3 at 128–192kbps is usually well under this.)`);
      return;
    }
    setFile(f);
  };

  const togglePlatform = (key) => {
    setSelectedPlatforms(prev => prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]);
  };

  const updateSongwriter = (idx, field, value) => {
    setSongwriters(prev => prev.map((sw, i) => i === idx ? { ...sw, [field]: value } : sw));
  };

  const addonPrice = (
    (addons.socialMediaPack ? 4.95 : 0) +
    (addons.discoveryPack ? 0.99 : 0) +
    (addons.storeMaximiser ? 7.95 : 0) +
    (addons.loudnessNormalize ? 2.99 : 0) +
    (addons.leaveLegacy ? 29 : 0)
  );

  const canGoNext = () => {
    if (step === 0) return !!file;
    if (step === 1) return !!title && !!genre;
    if (step === 2) return true;
    if (step === 3) return selectedPlatforms.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    if (!agreed) { alert("Please agree to the Distribution Agreement to continue."); return; }
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
      setProgress("Saving release...");
      const token = localStorage.getItem("token");

      const res = await createSong({
        title, genre, secondaryGenre, language, coverUrl, audioUrl,
        artistName, recordLabel,
        releaseDate: releaseDate || null,
        previouslyReleased, isCover, songwriters,
        isrc, explicit, instrumental, aiGenerated, featuredArtists,
        selectedPlatforms, spotifyArtistLink, appleMusicArtistLink,
        instagramLink, facebookLink, addons, trackPrice: 0.99,
      }, token);

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
        setDone(false); setStep(0); setFile(null); setCover(null); setCoverFile(null);
        setTitle(""); setArtistName(""); setGenre(""); setSecondaryGenre("");
        setLanguage("English"); setRecordLabel(""); setReleaseDate("");
        setPreviouslyReleased(false); setExplicit(false); setInstrumental(false);
        setAiGenerated(false); setFeaturedArtists(""); setIsrc("");
        setIsCover(false); setSongwriters([{ firstName: "", middleName: "", lastName: "" }]);
        setSelectedPlatforms(PLATFORMS.map(p => p.key));
        setSpotifyArtistLink(""); setAppleMusicArtistLink("");
        setInstagramLink(""); setFacebookLink("");
        setAddons({ socialMediaPack: false, discoveryPack: false, storeMaximiser: false, loudnessNormalize: false, leaveLegacy: false });
        setAgreed(false); setProgress("");
      }, 3000);
    } catch (err) {
      setUploading(false);
      setProgress("");
      alert("Upload failed: " + err.message);
    }
  };

  if (limitError) return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-8 flex flex-col items-center text-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center text-3xl">🔒</div>
      <div>
        <p className="text-amber-300 font-bold text-lg mb-1">Song Limit Reached</p>
        <p className="text-white/40 text-sm">Your Free plan allows up to 3 songs. Upgrade to upload unlimited music.</p>
      </div>
      <div className="flex gap-3">
        <button onClick={() => { setLimitError(false); if (onUpgradeClick) onUpgradeClick(); }}
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
      <p className="text-emerald-300 font-semibold">Release submitted successfully!</p>
      <p className="text-white/40 text-sm">Your release has been saved and is under review.</p>
    </div>
  );

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6">
      <h2 className="text-base font-semibold text-white mb-1">New Release</h2>
      <p className="text-white/30 text-[12px] mb-5">Distribute your music to 150+ platforms worldwide</p>

      <StepBar step={step}/>

      {step === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5">
          <div className="w-full sm:w-36">
            <CoverUpload cover={cover} setCover={setCover} setCoverFile={setCoverFile} />
            <p className="text-[10px] text-white/20 mt-2 leading-relaxed">3000×3000px JPG. No text, URLs, or store logos on artwork.</p>
          </div>
          <div className="flex flex-col gap-3">
            <div
              onClick={() => inputRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleAudio(e.dataTransfer.files[0]); }}
              className={`rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center py-8 px-4 text-center transition-all duration-200 ${dragging ? "border-emerald-400 bg-emerald-500/10" : file ? "border-emerald-500/40 bg-emerald-500/5" : "border-white/10 hover:border-white/20 bg-white/[0.02]"}`}
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
                  <p className="text-[12px] text-white/25 mt-1">MP3, WAV, FLAC up to 20 MB</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <FieldLabel>Artist / Band Name</FieldLabel>
                <input value={artistName} onChange={e => setArtistName(e.target.value)} placeholder="Your artist name" className={inputCls}/>
              </div>
              <div>
                <FieldLabel>Record Label</FieldLabel>
                <input value={recordLabel} onChange={e => setRecordLabel(e.target.value)} placeholder="WaveTrack" className={inputCls}/>
              </div>
            </div>
            <div>
              <FieldLabel hint="optional">Previously released?</FieldLabel>
              <Toggle2 value={previouslyReleased} onChange={setPreviouslyReleased}
                optionA={{ value: false, label: "No" }} optionB={{ value: true, label: "Yes" }}/>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <FieldLabel>Song Title</FieldLabel>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter song title" className={inputCls}/>
            <p className="text-[10px] text-white/20 mt-1">Don't include featured artists or version info here.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <FieldLabel>Genre</FieldLabel>
              <select value={genre} onChange={(e) => setGenre(e.target.value)} className={selectCls}>
                <option value="" className="bg-[#1a1a2e]">Select genre</option>
                {GENRES.map(g => <option key={g} value={g} className="bg-[#1a1a2e]">{g}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel hint="optional">Secondary Genre</FieldLabel>
              <select value={secondaryGenre} onChange={(e) => setSecondaryGenre(e.target.value)} className={selectCls}>
                <option value="" className="bg-[#1a1a2e]">Select genre</option>
                {GENRES.map(g => <option key={g} value={g} className="bg-[#1a1a2e]">{g}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <FieldLabel>Language</FieldLabel>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className={selectCls}>
                {LANGUAGES.map(l => <option key={l} value={l} className="bg-[#1a1a2e]">{l}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel hint="set 1 week ahead for playlist chances">Release Date</FieldLabel>
              <input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} className={inputCls}/>
            </div>
          </div>
          <div>
            <FieldLabel hint="optional">Featured Artists</FieldLabel>
            <input value={featuredArtists} onChange={(e) => setFeaturedArtists(e.target.value)} placeholder="Artist, producer, or remixer" className={inputCls}/>
          </div>
          <div>
            <FieldLabel hint="leave blank if you don't have one">ISRC Code</FieldLabel>
            <input value={isrc} onChange={(e) => setIsrc(e.target.value)} placeholder="e.g. USRC17607839" className={inputCls}/>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <FieldLabel>Explicit Lyrics</FieldLabel>
              <Toggle2 value={explicit} onChange={setExplicit} optionA={{ value: false, label: "No" }} optionB={{ value: true, label: "Yes" }}/>
            </div>
            <div>
              <FieldLabel>Instrumental?</FieldLabel>
              <Toggle2 value={instrumental} onChange={setInstrumental} optionA={{ value: false, label: "Has Lyrics" }} optionB={{ value: true, label: "Instrumental" }}/>
            </div>
            <div>
              <FieldLabel hint="AI vocals/lyrics">AI-Generated?</FieldLabel>
              <Toggle2 value={aiGenerated} onChange={setAiGenerated} optionA={{ value: false, label: "No" }} optionB={{ value: true, label: "Yes" }}/>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <FieldLabel>Songwriter / Cover Song</FieldLabel>
            <Toggle2 value={isCover} onChange={setIsCover}
              optionA={{ value: false, label: "I wrote this (original)" }}
              optionB={{ value: true, label: "It's a cover song" }}/>
          </div>
          <div className="space-y-3">
            <FieldLabel hint="real names, not stage names">Songwriter(s)</FieldLabel>
            {songwriters.map((sw, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input value={sw.firstName} onChange={e => updateSongwriter(idx, "firstName", e.target.value)} placeholder="First name" className={inputCls}/>
                <input value={sw.middleName} onChange={e => updateSongwriter(idx, "middleName", e.target.value)} placeholder="Middle name" className={inputCls}/>
                <input value={sw.lastName} onChange={e => updateSongwriter(idx, "lastName", e.target.value)} placeholder="Last name" className={inputCls}/>
              </div>
            ))}
            <button type="button" onClick={() => setSongwriters([...songwriters, { firstName: "", middleName: "", lastName: "" }])}
              className="text-[12px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              <span>+</span> Add another songwriter
            </button>
          </div>

          <div className="pt-2 border-t border-white/[0.05]">
            <FieldLabel hint="optional — groups this with existing releases">Artist Profile Links</FieldLabel>
            <div className="space-y-2">
              <input value={spotifyArtistLink} onChange={e => setSpotifyArtistLink(e.target.value)} placeholder="🎵 Spotify artist URL" className={inputCls}/>
              <input value={appleMusicArtistLink} onChange={e => setAppleMusicArtistLink(e.target.value)} placeholder="🍎 Apple Music artist URL" className={inputCls}/>
              <input value={instagramLink} onChange={e => setInstagramLink(e.target.value)} placeholder="📷 Instagram profile URL" className={inputCls}/>
              <input value={facebookLink} onChange={e => setFacebookLink(e.target.value)} placeholder="👤 Facebook profile URL" className={inputCls}/>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <FieldLabel>Select Platforms</FieldLabel>
              <button type="button"
                onClick={() => setSelectedPlatforms(selectedPlatforms.length === PLATFORMS.length ? [] : PLATFORMS.map(p => p.key))}
                className="text-[11px] text-emerald-400 hover:text-emerald-300">
                {selectedPlatforms.length === PLATFORMS.length ? "Deselect all" : "Select all"}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PLATFORMS.map(p => (
                <button key={p.key} type="button" onClick={() => togglePlatform(p.key)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] font-medium transition-all border ${
                    selectedPlatforms.includes(p.key)
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "border-white/[0.06] text-white/30 hover:text-white/50"
                  }`}>
                  <span>{p.emoji}</span>
                  <span className="truncate">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.05]">
            <FieldLabel hint="optional but awesome">Extras</FieldLabel>
            <div className="space-y-2">
              {[
                { key: "socialMediaPack", label: "Social Media Pack", price: "$4.95/yr", desc: "Get paid when your music is used on YouTube, TikTok, Instagram, Facebook" },
                { key: "discoveryPack", label: "Discovery Pack", price: "$0.99/yr", desc: "Song recognition via Gracenote, SoundScan, Jaxsta, ACRCloud" },
                { key: "storeMaximiser", label: "Store Maximiser", price: "$7.95/yr", desc: "Auto-deliver to new stores as we add them" },
                { key: "loudnessNormalize", label: "Loudness Normalisation", price: "$2.99", desc: "Optimise audio levels per Spotify's recommendation" },
                { key: "leaveLegacy", label: "Leave a Legacy", price: "$29", desc: "We'll never delete this release, even if you cancel" },
              ].map(addon => (
                <label key={addon.key} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] cursor-pointer hover:bg-white/[0.04] transition-all">
                  <input type="checkbox" checked={addons[addon.key]}
                    onChange={e => setAddons(a => ({ ...a, [addon.key]: e.target.checked }))}
                    className="mt-0.5 accent-emerald-500"/>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/80 font-medium">{addon.label}</span>
                      <span className="text-[11px] text-emerald-400 font-semibold">{addon.price}</span>
                    </div>
                    <p className="text-[11px] text-white/30 mt-0.5">{addon.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
              {cover && <img src={cover} alt="cover" className="w-full h-full object-cover"/>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">{title || "Untitled"}</p>
              <p className="text-white/40 text-sm truncate">{artistName || "Unknown Artist"}</p>
              <p className="text-white/25 text-[11px]">{genre} {language && `· ${language}`}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[12px]">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <p className="text-white/25 mb-0.5">Release Date</p>
              <p className="text-white/70 font-medium">{releaseDate || "ASAP"}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <p className="text-white/25 mb-0.5">Record Label</p>
              <p className="text-white/70 font-medium">{recordLabel || "—"}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <p className="text-white/25 mb-0.5">Platforms</p>
              <p className="text-white/70 font-medium">{selectedPlatforms.length} selected</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <p className="text-white/25 mb-0.5">Extras Total</p>
              <p className="text-emerald-400 font-semibold">${addonPrice.toFixed(2)}</p>
            </div>
          </div>

          <div className="space-y-2">
            {[
              "I recorded this music and am authorized to sell it and collect all royalties.",
              "I'm not using any other artist's name without their approval.",
              "I won't use promo services that guarantee fake streams or playlisting.",
            ].map((text, i) => (
              <p key={i} className="text-[11px] text-white/30 flex items-start gap-2">
                <span className="text-emerald-400 flex-shrink-0">✓</span>{text}
              </p>
            ))}
          </div>

          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 accent-emerald-500"/>
            <span className="text-[12px] text-white/60">
              I have read and agree to the <span className="text-emerald-400 font-medium">WaveTrack Distribution Agreement</span>
            </span>
          </label>

          {uploading && (
            <div className="flex items-center gap-2 text-sm text-emerald-400">
              <svg className="animate-spin" width="14" height="14" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              {progress}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/[0.05]">
        <button type="button" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-white/50 transition-all disabled:opacity-0 disabled:pointer-events-none">
          ← Back
        </button>
        {step < 4 ? (
          <button type="button" onClick={() => setStep(s => s + 1)} disabled={!canGoNext()}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold text-white transition-all active:scale-95">
            Continue →
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={!agreed || uploading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-bold text-white transition-all active:scale-95 shadow-lg shadow-emerald-500/20">
            {uploading ? "Submitting..." : "Submit Release"}
          </button>
        )}
      </div>
    </div>
  );
}
