import { useState, useEffect, useRef } from "react";
import { getSongs, getStats, getMe } from "../api";

const coverColors = {
  0: "from-emerald-500 to-teal-600",
  1: "from-amber-400 to-orange-500",
  2: "from-violet-500 to-purple-700",
  3: "from-blue-500 to-indigo-600",
  4: "from-pink-500 to-rose-600",
  5: "from-zinc-500 to-zinc-700",
};

function AvatarUpload({ initials, avatarUrl, onUpload }) {
  const inputRef = useRef();
  const [preview, setPreview] = useState(avatarUrl || null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    if (onUpload) onUpload(url);
  };

  return (
    <div className="relative group cursor-pointer" onClick={() => inputRef.current.click()}>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl overflow-hidden">
        {preview ? <img src={preview} alt="avatar" className="w-full h-full object-cover" /> : initials}
      </div>
      <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <svg width="20" height="20" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
          <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" transform="scale(0.8) translate(3,3)"/>
          <circle cx="12" cy="13" r="4" transform="scale(0.8) translate(3,3)"/>
        </svg>
      </div>
      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0A0A0F] flex items-center justify-center">
        <svg width="10" height="10" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <line x1="5" y1="2" x2="5" y2="8"/><line x1="2" y1="5" x2="8" y2="5"/>
        </svg>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color = "text-white" }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center flex-shrink-0 text-lg">
        {icon}
      </div>
      <div>
        <div className={`text-xl font-bold ${color}`}>{value}</div>
        <div className="text-[11px] text-white/30">{label}</div>
      </div>
    </div>
  );
}

function SocialLinks({ links, onChange }) {
  const platforms = [
    { key: "spotify", label: "Spotify Artist", placeholder: "https://open.spotify.com/artist/...", icon: "🎵" },
    { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/...", icon: "📷" },
    { key: "twitter", label: "Twitter / X", placeholder: "https://twitter.com/...", icon: "🐦" },
    { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/...", icon: "▶️" },
  ];
  return (
    <div className="space-y-3">
      {platforms.map((p) => (
        <div key={p.key} className="flex items-center gap-3">
          <span className="text-lg w-7 text-center flex-shrink-0">{p.icon}</span>
          <div className="flex-1">
            <label className="text-[10px] text-white/25 uppercase tracking-wide block mb-1">{p.label}</label>
            <input
              value={links[p.key] || ""}
              onChange={(e) => onChange({ ...links, [p.key]: e.target.value })}
              placeholder={p.placeholder}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2 text-sm text-white placeholder-white/15 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Profile({ user, onUpdate }) {
  const [stats, setStats] = useState({ total: 0, totalStreams: 0, totalEarnings: 0, liveSongs: 0 });
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
    genre: user?.genre || "",
    socialLinks: user?.socialLinks || {},
  });

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    Promise.all([
      getStats(token).catch(() => ({})),
      getSongs(token).catch(() => []),
    ]).then(([s, sg]) => {
      setStats(s || {});
      setSongs(Array.isArray(sg) ? sg : []);
      setLoading(false);
    });
  }, []);

  const handleSave = () => {
    const updated = { ...user, ...form };
    localStorage.setItem("user", JSON.stringify(updated));
    if (onUpdate) onUpdate(updated);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const isPro = user?.plan === "pro";
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "2026";

  const tabs = ["overview", "songs", "social", "settings"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Artist Profile</h1>
          <p className="text-white/40 text-sm mt-1">Manage your public artist profile</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-sm font-medium">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="2,7 5,10 12,3"/></svg>
            Profile saved!
          </div>
        )}
      </div>

      {/* Profile hero card */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        {/* Cover banner */}
        <div className="h-28 bg-gradient-to-r from-emerald-600/40 via-teal-500/30 to-blue-600/20 relative">
          <div className="absolute inset-0 opacity-30" style={{backgroundImage: "radial-gradient(circle at 20% 50%, #10b981 0%, transparent 50%), radial-gradient(circle at 80% 20%, #06b6d4 0%, transparent 50%)"}} />
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 mb-5">
            <AvatarUpload
              initials={initials}
              avatarUrl={user?.avatarUrl}
              onUpload={(url) => {
                const updated = { ...user, avatarUrl: url };
                localStorage.setItem("user", JSON.stringify(updated));
                if (onUpdate) onUpdate(updated);
              }}
            />
            <div className="flex-1 sm:pb-1">
              {editing ? (
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="text-2xl font-bold bg-transparent border-b border-emerald-500/50 text-white focus:outline-none w-full mb-1"
                  placeholder="Your name"
                />
              ) : (
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-bold text-white">{user?.name || "Artist"}</h2>
                  {isPro && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 font-bold border border-yellow-400/30">
                      👑 PRO
                    </span>
                  )}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/30 border border-white/[0.08]">
                    {isPro ? "Pro" : "Free"} Plan
                  </span>
                </div>
              )}
              <p className="text-white/40 text-sm">{user?.email}</p>
            </div>
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${
                editing
                  ? "bg-emerald-500 hover:bg-emerald-400 text-white"
                  : "bg-white/5 hover:bg-white/10 text-white/60 border border-white/[0.06]"
              }`}
            >
              {editing ? (
                <><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="2,6 5,9 11,3"/></svg> Save</>
              ) : (
                <><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 1l3 3L4 12H1V9L9 1z"/></svg> Edit Profile</>
              )}
            </button>
          </div>

          {/* Bio + info */}
          {editing ? (
            <div className="space-y-3">
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                placeholder="Tell people about yourself..."
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all resize-none"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-wide block mb-1">Location</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="City, Country"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all" />
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-wide block mb-1">Genre</label>
                  <select value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2 text-sm text-white/70 focus:outline-none focus:border-emerald-500/50 transition-all appearance-none">
                    <option value="" className="bg-[#1a1a2e]">Select genre</option>
                    {["Afrobeats","Amapiano","R&B","Hip-Hop","Pop","Lo-fi","Soul","Jazz","Electronic","Rock","Reggae","Classical","Synthwave"].map(g => (
                      <option key={g} value={g} className="bg-[#1a1a2e]">{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-wide block mb-1">Website</label>
                  <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
                    placeholder="https://yoursite.com"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-semibold text-white transition-all">Save Changes</button>
                <button onClick={() => setEditing(false)} className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium text-white/50 transition-all">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {user?.bio && <p className="text-white/60 text-sm leading-relaxed">{user.bio}</p>}
              <div className="flex flex-wrap gap-3 text-[12px] text-white/35">
                {user?.location && <span className="flex items-center gap-1">📍 {user.location}</span>}
                {user?.genre && <span className="flex items-center gap-1">🎵 {user.genre}</span>}
                {user?.website && <a href={user.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300">🔗 Website</a>}
                <span className="flex items-center gap-1">📅 Joined {joinDate}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Songs" value={loading ? "—" : stats.total || 0} icon="🎵" />
        <StatCard label="Live Songs" value={loading ? "—" : stats.liveSongs || 0} icon="🟢" color="text-emerald-400" />
        <StatCard label="Total Streams" value={loading ? "—" : (stats.totalStreams || 0).toLocaleString()} icon="▶️" color="text-blue-400" />
        <StatCard label="Est. Earnings" value={loading ? "—" : `$${(stats.totalEarnings || 0).toFixed(2)}`} icon="💰" color="text-yellow-400" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl w-fit border border-white/[0.05]">
        {tabs.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
              activeTab === t ? "bg-white/10 text-white" : "text-white/35 hover:text-white/60"
            }`}>{t}</button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-white">Recent Releases</h2>
          </div>
          {loading ? (
            <div className="py-10 text-center">
              <svg className="animate-spin mx-auto mb-2" width="20" height="20" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#34d399" strokeWidth="3"/>
                <path className="opacity-75" fill="#34d399" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <p className="text-white/20 text-sm">Loading...</p>
            </div>
          ) : songs.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-4xl mb-3">🎵</div>
              <p className="text-white/30 text-sm">No songs uploaded yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.03]">
              {songs.slice(0, 5).map((song, idx) => (
                <div key={song._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <span className="text-[12px] text-white/20 w-4 font-mono">{idx + 1}</span>
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${coverColors[idx % 6]} flex-shrink-0 flex items-center justify-center`}>
                    <svg width="12" height="12" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.8">
                      <path d="M2 10V5L10 3V8"/><circle cx="2" cy="10" r="1.2"/><circle cx="10" cy="8" r="1.2"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{song.title}</div>
                    <div className="text-[12px] text-white/30">{song.genre || "—"}</div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-sm text-white/50">{song.streams > 0 ? song.streams.toLocaleString() : "—"}</div>
                    <div className="text-[11px] text-white/25">streams</div>
                  </div>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${
                    song.status === "live" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" :
                    song.status === "pending" ? "bg-amber-500/15 text-amber-400 border border-amber-500/25" :
                    "bg-white/5 text-white/30 border border-white/10"
                  }`}>{song.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "songs" && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">All Songs</h2>
            <span className="text-[12px] text-white/30">{songs.length} tracks</span>
          </div>
          {songs.length === 0 ? (
            <div className="py-12 text-center"><p className="text-white/30 text-sm">No songs yet.</p></div>
          ) : (
            <div className="divide-y divide-white/[0.03]">
              {songs.map((song, idx) => (
                <div key={song._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02]">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${coverColors[idx % 6]} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{song.title}</div>
                    <div className="text-[12px] text-white/30">{song.genre || "—"} · {new Date(song.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-sm text-white/50 font-medium">{song.streams > 0 ? song.streams.toLocaleString() : "0"}</div>
                    <div className="text-[11px] text-white/25">${song.earnings > 0 ? song.earnings.toFixed(2) : "0.00"}</div>
                  </div>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${
                    song.status === "live" ? "bg-emerald-500/15 text-emerald-400" :
                    song.status === "pending" ? "bg-amber-500/15 text-amber-400" :
                    "bg-white/5 text-white/30"
                  }`}>{song.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "social" && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <h2 className="text-sm font-semibold text-white mb-1">Social Links</h2>
          <p className="text-white/30 text-[12px] mb-5">Add your social media links to your profile</p>
          <SocialLinks
            links={form.socialLinks}
            onChange={(links) => setForm({ ...form, socialLinks: links })}
          />
          <button onClick={handleSave} className="mt-5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-semibold text-white transition-all">
            Save Links
          </button>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="space-y-4">
          {/* Account info */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Account Settings</h2>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-white/30 uppercase tracking-wide block mb-1.5">Display Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all" />
              </div>
              <div>
                <label className="text-[11px] text-white/30 uppercase tracking-wide block mb-1.5">Email</label>
                <input value={user?.email || ""} disabled
                  className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl px-3.5 py-2.5 text-sm text-white/30 cursor-not-allowed" />
              </div>
              <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-semibold text-white transition-all">
                Save Changes
              </button>
            </div>
          </div>

          {/* Plan */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Current Plan</h2>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-semibold">{isPro ? "👑 Pro Plan" : "Free Plan"}</span>
                </div>
                <p className="text-white/30 text-sm">{isPro ? "All features unlocked" : "Up to 3 songs · 4 platforms"}</p>
              </div>
              {!isPro && (
                <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-sm font-bold text-white transition-all shadow-lg shadow-emerald-500/20">
                  ✨ Upgrade to Pro
                </button>
              )}
            </div>
          </div>

          {/* Danger zone */}
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <h2 className="text-sm font-semibold text-red-400 mb-2">Danger Zone</h2>
            <p className="text-white/30 text-sm mb-4">Once you delete your account, there is no going back.</p>
            <button className="px-5 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all">
              Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
