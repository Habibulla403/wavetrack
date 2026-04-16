import { useState, useEffect } from "react";

const API = "https://wavetrack-backend-rggh.onrender.com";
const auth = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

// ── Helpers ────────────────────────────────────────────────────────
function Badge({ label, color }) {
  const colors = {
    green:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    amber:  "bg-amber-500/15  text-amber-400  border-amber-500/25",
    red:    "bg-red-500/15    text-red-400    border-red-500/25",
    blue:   "bg-blue-500/15   text-blue-400   border-blue-500/25",
    purple: "bg-violet-500/15 text-violet-400 border-violet-500/25",
    gray:   "bg-white/5       text-white/30   border-white/10",
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${colors[color] || colors.gray}`}>
      {label}
    </span>
  );
}

function StatCard({ icon, label, value, sub, color = "text-white" }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-white/[0.05] flex items-center justify-center text-xl flex-shrink-0">{icon}</div>
      <div>
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        <div className="text-[11px] text-white/30">{label}</div>
        {sub && <div className="text-[11px] text-white/20 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

// ── TABS ───────────────────────────────────────────────────────────
const TABS = [
  { id: "overview",  label: "Overview",  icon: "📊" },
  { id: "users",     label: "Users",     icon: "👥" },
  { id: "songs",     label: "Songs",     icon: "🎵" },
  { id: "payouts",   label: "Payouts",   icon: "💰" },
  { id: "messages",  label: "Messages",  icon: "💬" },
];

// ══════════════════════════════════════════════════════════════════
export default function AdminDashboard({ user }) {
  const [tab,      setTab]      = useState("overview");
  const [stats,    setStats]    = useState(null);
  const [users,    setUsers]    = useState([]);
  const [songs,    setSongs]    = useState([]);
  const [payouts,  setPayouts]  = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(false);

  // search / filter
  const [userSearch, setUserSearch] = useState("");
  const [songFilter, setSongFilter] = useState("");
  const [replyBox,   setReplyBox]   = useState({}); // messageId → text

  const isAdmin = user?.role === "admin";

  const load = async (t) => {
    setLoading(true);
    try {
      if (t === "overview" || !stats) {
        const r = await fetch(`${API}/api/admin/stats`, { headers: auth() });
        setStats(await r.json());
      }
      if (t === "users") {
        const q = userSearch ? `?search=${encodeURIComponent(userSearch)}` : "";
        const r = await fetch(`${API}/api/admin/users${q}`, { headers: auth() });
        const d = await r.json();
        setUsers(d.users || []);
      }
      if (t === "songs") {
        const q = songFilter ? `?status=${songFilter}` : "";
        const r = await fetch(`${API}/api/admin/songs${q}`, { headers: auth() });
        const d = await r.json();
        setSongs(d.songs || []);
      }
      if (t === "payouts") {
        const r = await fetch(`${API}/api/admin/payouts`, { headers: auth() });
        setPayouts(await r.json());
      }
      if (t === "messages") {
        const r = await fetch(`${API}/api/admin/messages`, { headers: auth() });
        setMessages(await r.json());
      }
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { load(tab); }, [tab]);

  const switchTab = (t) => { setTab(t); };

  // Actions
  const updateSongStatus = async (songId, status) => {
    await fetch(`${API}/api/admin/songs/${songId}/status`, {
      method: "PATCH",
      headers: { ...auth(), "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load("songs");
  };

  const updatePayout = async (userId, requestId, status) => {
    await fetch(`${API}/api/admin/payouts/${userId}/${requestId}`, {
      method: "PATCH",
      headers: { ...auth(), "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load("payouts");
  };

  const sendReply = async (userId, messageId) => {
    const reply = replyBox[messageId];
    if (!reply?.trim()) return;
    await fetch(`${API}/api/admin/messages/${userId}/${messageId}/reply`, {
      method: "POST",
      headers: { ...auth(), "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    });
    setReplyBox(r => ({ ...r, [messageId]: "" }));
    load("messages");
  };

  const updateUserPlan = async (userId, plan) => {
    await fetch(`${API}/api/admin/users/${userId}/plan`, {
      method: "PATCH",
      headers: { ...auth(), "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    load("users");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {isAdmin ? "Admin Panel" : "Mod Panel"}
            </h1>
            <Badge label={isAdmin ? "👑 Admin" : "🛡️ Mod"} color={isAdmin ? "amber" : "blue"} />
          </div>
          <p className="text-white/35 text-sm">Welcome back, {user?.name} — {user?.email}</p>
        </div>
        <button onClick={() => load(tab)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-sm border border-white/[0.06] transition-all">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
            <polyline points="23 4 23 10 17 10"/><path d="M20.5 15a9 9 0 11-2.8-6.6L23 10"/>
          </svg>
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl w-fit border border-white/[0.05] flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => switchTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              tab === t.id ? "bg-white/10 text-white" : "text-white/35 hover:text-white/60"
            }`}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-white/30 text-sm">
          <svg className="animate-spin" width="14" height="14" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#34d399" strokeWidth="3"/>
            <path className="opacity-75" fill="#34d399" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Loading...
        </div>
      )}

      {/* ── OVERVIEW ── */}
      {tab === "overview" && stats && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <StatCard icon="👤" label="Total Users"    value={stats.totalUsers}    color="text-white"/>
            <StatCard icon="👑" label="Premium Users"  value={stats.premiumUsers}  color="text-yellow-400"/>
            <StatCard icon="🎵" label="Total Songs"    value={stats.totalSongs}    color="text-blue-400"/>
            <StatCard icon="⏳" label="Pending Payouts" value={stats.pendingPayouts} color="text-amber-400"/>
            <StatCard icon="💰" label="Total Revenue"  value={`$${(stats.totalRevenue||0).toFixed(2)}`} color="text-emerald-400"/>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h2 className="text-sm font-semibold text-white mb-3">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Review Pending Songs",   tab: "songs",    filter: "pending", icon: "🎵" },
                { label: "Process Payouts",        tab: "payouts",  filter: "",        icon: "💰" },
                { label: "Unread Messages",        tab: "messages", filter: "",        icon: "💬" },
              ].map(a => (
                <button key={a.label} onClick={() => { setSongFilter(a.filter); switchTab(a.tab); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-sm text-white/60 hover:text-white transition-all">
                  {a.icon} {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── USERS ── */}
      {tab === "users" && (
        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <input value={userSearch} onChange={e => setUserSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && load("users")}
              placeholder="Search by name or email..."
              className="flex-1 min-w-48 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all"/>
            <button onClick={() => load("users")}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-semibold text-white transition-all">
              Search
            </button>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Users ({users.length})</h2>
            </div>
            <div className="divide-y divide-white/[0.03]">
              {users.length === 0 && <p className="text-white/25 text-sm text-center py-10">No users found</p>}
              {users.map(u => (
                <div key={u._id} className="flex flex-wrap items-center gap-3 px-5 py-4 hover:bg-white/[0.02]">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    {u.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-36">
                    <div className="text-sm font-medium text-white">{u.name}</div>
                    <div className="text-[11px] text-white/35">{u.email}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge label={u.plan || "free"}
                      color={u.plan === "free" ? "gray" : u.plan === "ultimate" ? "purple" : "green"}/>
                    <span className="text-[11px] text-white/30">{u.songCount} songs</span>
                    <span className="text-[11px] text-emerald-400">${u.totalEarnings?.toFixed(2)}</span>
                    {u.hasPendingPayout && <Badge label={`💰 $${u.pendingAmount?.toFixed(2)} pending`} color="amber"/>}
                  </div>
                  {isAdmin && (
                    <select value={u.plan || "free"}
                      onChange={e => updateUserPlan(u._id, e.target.value)}
                      className="bg-white/[0.05] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-[11px] text-white/60 focus:outline-none focus:border-emerald-500/50 transition-all">
                      {["free","musician","musician_plus","ultimate"].map(p => (
                        <option key={p} value={p} className="bg-[#1a1a2e]">{p}</option>
                      ))}
                    </select>
                  )}
                  <span className="text-[10px] text-white/20">
                    {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SONGS ── */}
      {tab === "songs" && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {["", "pending", "live", "draft"].map(s => (
              <button key={s} onClick={() => { setSongFilter(s); setTimeout(() => load("songs"), 0); }}
                className={`px-4 py-1.5 rounded-xl text-sm font-medium capitalize transition-all border ${
                  songFilter === s
                    ? "bg-white/10 text-white border-white/20"
                    : "text-white/35 border-white/[0.06] hover:text-white/60"
                }`}>{s || "All"}</button>
            ))}
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/[0.06]">
              <h2 className="text-sm font-semibold text-white">Songs ({songs.length})</h2>
            </div>
            <div className="divide-y divide-white/[0.03]">
              {songs.length === 0 && <p className="text-white/25 text-sm text-center py-10">No songs</p>}
              {songs.map(s => (
                <div key={s._id} className="flex flex-wrap items-center gap-3 px-5 py-4 hover:bg-white/[0.02]">
                  <div className="flex-1 min-w-40">
                    <div className="text-sm font-medium text-white">{s.title}</div>
                    <div className="text-[11px] text-white/35">
                      {s.user?.name} · {s.user?.email}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-white/30">{s.genre || "—"}</span>
                    <span className="text-[11px] text-white/30">{s.streams || 0} streams</span>
                    <Badge
                      label={s.status}
                      color={s.status === "live" ? "green" : s.status === "pending" ? "amber" : "gray"}/>
                  </div>
                  <div className="flex gap-1.5">
                    {s.status !== "live" && (
                      <button onClick={() => updateSongStatus(s._id, "live")}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-[11px] font-semibold transition-all border border-emerald-500/20">
                        ✅ Approve
                      </button>
                    )}
                    {s.status !== "draft" && (
                      <button onClick={() => updateSongStatus(s._id, "draft")}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-semibold transition-all border border-red-500/20">
                        ❌ Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PAYOUTS ── */}
      {tab === "payouts" && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-white">Payout Requests ({payouts.length})</h2>
          </div>
          <div className="divide-y divide-white/[0.03]">
            {payouts.length === 0 && <p className="text-white/25 text-sm text-center py-10">No payout requests</p>}
            {payouts.map((p, i) => (
              <div key={i} className="flex flex-wrap items-start gap-4 px-5 py-5 hover:bg-white/[0.02]">
                <div className="flex-1 min-w-44">
                  <div className="text-sm font-semibold text-white">{p.userName}</div>
                  <div className="text-[11px] text-white/35 mb-1">{p.userEmail}</div>
                  <Badge label={p.plan || "free"} color={p.plan === "free" ? "gray" : "green"}/>
                </div>
                <div className="flex-1 min-w-44">
                  <div className="text-xl font-bold text-emerald-400">${p.amount?.toFixed(2)}</div>
                  <div className="text-[11px] text-white/30 mt-0.5">
                    {p.method === "paypal"
                      ? `PayPal: ${p.payoutInfo?.paypalEmail || "—"}`
                      : `Bank: ${p.payoutInfo?.bankName || "—"} · ${p.payoutInfo?.accountNumber || "—"}`}
                  </div>
                  <div className="text-[10px] text-white/20 mt-1">
                    {new Date(p.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    label={p.status}
                    color={p.status === "paid" ? "green" : p.status === "rejected" ? "red" : "amber"}/>
                  {p.status === "pending" && (
                    <>
                      <button onClick={() => updatePayout(p.userId, p.requestId, "paid")}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-[11px] font-bold transition-all border border-emerald-500/25">
                        ✅ Mark Paid
                      </button>
                      <button onClick={() => updatePayout(p.userId, p.requestId, "rejected")}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-bold transition-all border border-red-500/20">
                        ❌ Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MESSAGES ── */}
      {tab === "messages" && (
        <div className="space-y-3">
          {messages.length === 0 && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-10 text-center text-white/25 text-sm">
              No support messages
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`rounded-2xl border bg-white/[0.02] p-5 space-y-3 ${
              m.status === "open" ? "border-amber-500/20" : "border-white/[0.06]"
            }`}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-white">{m.userName}</span>
                    <span className="text-[11px] text-white/30">{m.userEmail}</span>
                    <Badge
                      label={m.status}
                      color={m.status === "open" ? "amber" : m.status === "replied" ? "green" : "gray"}/>
                  </div>
                  <div className="text-[12px] font-semibold text-white/70">📌 {m.subject}</div>
                </div>
                <div className="text-[10px] text-white/20">
                  {new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-sm text-white/60 leading-relaxed">
                {m.body}
              </div>
              {m.reply && (
                <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl px-4 py-3">
                  <p className="text-[10px] text-emerald-400 font-semibold mb-1">
                    {user?.role === "admin" ? "👑 Admin Reply" : "🛡️ Mod Reply"}
                  </p>
                  <p className="text-sm text-white/60">{m.reply}</p>
                </div>
              )}
              {m.status !== "replied" && (
                <div className="flex gap-2">
                  <textarea
                    value={replyBox[m.messageId] || ""}
                    onChange={e => setReplyBox(r => ({ ...r, [m.messageId]: e.target.value }))}
                    placeholder="Type your reply..."
                    rows={2}
                    className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all resize-none"/>
                  <button onClick={() => sendReply(m.userId, m.messageId)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-semibold text-white transition-all flex-shrink-0 self-end">
                    Reply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
