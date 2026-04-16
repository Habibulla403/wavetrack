import { useState, useEffect, useRef } from "react";
import { getSongs, getStats, updateProfile } from "../api";

const API = "https://wavetrack-backend-rggh.onrender.com";

// ── PayoutSection component ───────────────────────────────────────
function PayoutSection({ isPro, onUpgrade }) {
  const [status,         setStatus]         = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [requesting,     setRequesting]     = useState(false);
  const [savingInfo,     setSavingInfo]     = useState(false);
  const [showInfoForm,   setShowInfoForm]   = useState(false);
  const [msg,            setMsg]            = useState(null); // { type: "success"|"error", text }
  const [payoutForm,     setPayoutForm]     = useState({
    method: "paypal", paypalEmail: "", bankName: "", accountNumber: "", accountName: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const r     = await fetch(`${API}/api/payout/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data  = await r.json();
      setStatus(data);
      if (data.payoutInfo?.method) {
        setPayoutForm({
          method:        data.payoutInfo.method        || "paypal",
          paypalEmail:   data.payoutInfo.paypalEmail   || "",
          bankName:      data.payoutInfo.bankName      || "",
          accountNumber: data.payoutInfo.accountNumber || "",
          accountName:   data.payoutInfo.accountName   || "",
        });
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSaveInfo = async () => {
    setSavingInfo(true);
    setMsg(null);
    try {
      const token = localStorage.getItem("token");
      const r     = await fetch(`${API}/api/payout/info`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payoutForm),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message);
      setMsg({ type: "success", text: "Payout info saved!" });
      setShowInfoForm(false);
      load();
    } catch (e) {
      setMsg({ type: "error", text: e.message });
    } finally { setSavingInfo(false); }
  };

  const [sendingSupport, setSendingSupport] = useState(false);
  const [supportForm,    setSupportForm]    = useState({ subject: "", body: "" });
  const [showSupport,    setShowSupport]    = useState(false);

  const handleRequest = async () => {
    const amt = status?.available || 0;
    const vat = Math.round((status?.vatRate || 0) * 100);
    if (!confirm(`Request payout of $${amt.toFixed(2)} (after ${vat}% VAT deducted)?`)) return;
    setRequesting(true);
    setMsg(null);
    try {
      const token = localStorage.getItem("token");
      const r     = await fetch(`${API}/api/payout/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message);
      setMsg({ type: "success", text: data.message });
      load();
    } catch (e) {
      setMsg({ type: "error", text: e.message });
    } finally { setRequesting(false); }
  };

  const handleSendSupport = async () => {
    if (!supportForm.subject.trim() || !supportForm.body.trim()) return;
    setSendingSupport(true);
    try {
      const token = localStorage.getItem("token");
      const r = await fetch(`${API}/api/payout/support`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(supportForm),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message);
      setMsg({ type: "success", text: data.message });
      setSupportForm({ subject: "", body: "" });
      setShowSupport(false);
    } catch (e) {
      setMsg({ type: "error", text: e.message });
    } finally { setSendingSupport(false); }
  };

  if (loading) return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 flex items-center gap-3">
      <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#34d399" strokeWidth="3"/>
        <path className="opacity-75" fill="#34d399" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
      <span className="text-white/30 text-sm">Loading earnings...</span>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Earnings overview */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-white">💰 Earnings & Payout</h2>
          {isPro && (
            <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-semibold">
              ✅ Payout Enabled
            </span>
          )}
        </div>

        {/* VAT info banner */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] mb-4">
          <span className="text-base">📋</span>
          <p className="text-[11px] text-white/40">
            VAT deducted before payout:
            <span className="text-amber-400 font-semibold ml-1">
              {status?.isPremium ? "20% (Premium)" : "30% (Free plan)"}
            </span>
            · Minimum withdrawal: <span className="text-white/60 font-semibold">$10.00</span>
            · Monthly auto-payout for Premium
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Gross Earnings", value: `$${(status?.totalEarnings || 0).toFixed(2)}`, color: "text-white"       },
            { label: `VAT (${Math.round((status?.vatRate||0)*100)}%)`, value: `-$${(status?.vatAmount || 0).toFixed(2)}`, color: "text-red-400"   },
            { label: "Already Paid",   value: `$${(status?.paidOut       || 0).toFixed(2)}`, color: "text-white/40"    },
            { label: "Available",      value: `$${(status?.available     || 0).toFixed(2)}`, color: "text-emerald-400" },
          ].map(item => (
            <div key={item.label} className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-3 text-center">
              <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
              <div className="text-[10px] text-white/25 mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>

        {/* FREE USER — can still withdraw but 30% VAT, need $10 */}
        {!isPro && (
          <div className="space-y-3">
            <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="text-2xl">⚠️</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-400">Free Plan — 30% VAT on Earnings</p>
                <p className="text-[12px] text-white/35 mt-0.5">
                  Premium users pay only 20% VAT and get monthly auto-payout. Upgrade to save more.
                </p>
              </div>
              <button onClick={onUpgrade}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-sm font-bold text-white transition-all flex-shrink-0 text-sm">
                Upgrade ✨
              </button>
            </div>
            {/* Free users can still set payout info and request */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div>
                <p className="text-sm text-white/60 font-medium">Payout Method</p>
                {status?.payoutInfo?.method ? (
                  <p className="text-[12px] text-emerald-400">
                    {status.payoutInfo.method === "paypal"
                      ? `PayPal · ${status.payoutInfo.paypalEmail}`
                      : `Bank · ${status.payoutInfo.bankName}`}
                  </p>
                ) : (
                  <p className="text-[12px] text-amber-400">Not set — add payout info to withdraw</p>
                )}
              </div>
              <button onClick={() => setShowInfoForm(v => !v)}
                className="text-[12px] px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                {showInfoForm ? "Cancel" : "Edit"}
              </button>
            </div>
            {showInfoForm && (
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-3">
                <div className="flex gap-2">
                  {["paypal", "bank"].map(m => (
                    <button key={m} onClick={() => setPayoutForm(f => ({ ...f, method: m }))}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all border ${
                        payoutForm.method === m
                          ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                          : "border-white/[0.06] text-white/30 hover:text-white/60"
                      }`}>{m === "paypal" ? "💳 PayPal" : "🏦 Bank Transfer"}</button>
                  ))}
                </div>
                {payoutForm.method === "paypal" ? (
                  <div>
                    <label className="text-[10px] text-white/30 uppercase tracking-wide block mb-1">PayPal Email</label>
                    <input value={payoutForm.paypalEmail}
                      onChange={e => setPayoutForm(f => ({ ...f, paypalEmail: e.target.value }))}
                      placeholder="your@paypal.com"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all"/>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {[
                      { key: "accountName",   label: "Account Name",   placeholder: "Full name" },
                      { key: "bankName",      label: "Bank Name",      placeholder: "e.g. Dutch Bangla Bank" },
                      { key: "accountNumber", label: "Account Number", placeholder: "Account number" },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="text-[10px] text-white/30 uppercase tracking-wide block mb-1">{field.label}</label>
                        <input value={payoutForm[field.key]}
                          onChange={e => setPayoutForm(pf => ({ ...pf, [field.key]: e.target.value }))}
                          placeholder={field.placeholder}
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all"/>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={handleSaveInfo} disabled={savingInfo}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-semibold text-white transition-all disabled:opacity-60">
                  {savingInfo ? "Saving..." : "Save Payout Info"}
                </button>
              </div>
            )}
            <button
              onClick={handleRequest}
              disabled={requesting || !status?.payoutInfo?.method || (status?.available || 0) < 10 || (status?.pendingPayout || 0) > 0}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              {requesting ? "Submitting..." :
               (status?.pendingPayout || 0) > 0 ? `⏳ Payout Pending ($${(status?.pendingPayout||0).toFixed(2)})` :
               (status?.available || 0) < 10 ? `Need $${(10 - (status?.available||0)).toFixed(2)} more to withdraw` :
               !status?.payoutInfo?.method ? "Set payout info first" :
               `Withdraw $${(status?.available || 0).toFixed(2)} (after 30% VAT)`}
            </button>
            <div className="pt-2 border-t border-white/[0.05]">
              <button onClick={() => setShowSupport(v => !v)}
                className="flex items-center gap-2 text-[12px] text-white/35 hover:text-white/60 transition-all">
                <span>💬</span> Payout issue? Message our support team
              </button>
              {showSupport && (
                <div className="mt-3 space-y-2">
                  <input value={supportForm.subject}
                    onChange={e => setSupportForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="Subject (e.g. Payout not received)"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all"/>
                  <textarea value={supportForm.body}
                    onChange={e => setSupportForm(f => ({ ...f, body: e.target.value }))}
                    placeholder="Describe your issue..."
                    rows={3}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all resize-none"/>
                  <button onClick={handleSendSupport} disabled={sendingSupport}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-semibold text-white transition-all disabled:opacity-60">
                    {sendingSupport ? "Sending..." : "Send to Admin/Mod"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PREMIUM USER — payout controls */}
        {isPro && (
          <div className="space-y-3">
            {/* Payout info status */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div>
                <p className="text-sm text-white/60 font-medium">Payout Method</p>
                {status?.payoutInfo?.method ? (
                  <p className="text-[12px] text-emerald-400">
                    {status.payoutInfo.method === "paypal"
                      ? `PayPal · ${status.payoutInfo.paypalEmail}`
                      : `Bank · ${status.payoutInfo.bankName}`}
                  </p>
                ) : (
                  <p className="text-[12px] text-amber-400">Not set — please add payout info</p>
                )}
              </div>
              <button onClick={() => setShowInfoForm(v => !v)}
                className="text-[12px] px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                {showInfoForm ? "Cancel" : "Edit"}
              </button>
            </div>

            {/* Payout info form */}
            {showInfoForm && (
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-3">
                <div className="flex gap-2">
                  {["paypal", "bank"].map(m => (
                    <button key={m} onClick={() => setPayoutForm(f => ({ ...f, method: m }))}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all border ${
                        payoutForm.method === m
                          ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                          : "border-white/[0.06] text-white/30 hover:text-white/60"
                      }`}>{m === "paypal" ? "💳 PayPal" : "🏦 Bank Transfer"}</button>
                  ))}
                </div>
                {payoutForm.method === "paypal" ? (
                  <div>
                    <label className="text-[10px] text-white/30 uppercase tracking-wide block mb-1">PayPal Email</label>
                    <input value={payoutForm.paypalEmail}
                      onChange={e => setPayoutForm(f => ({ ...f, paypalEmail: e.target.value }))}
                      placeholder="your@paypal.com"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all"/>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {[
                      { key: "accountName",   label: "Account Name",   placeholder: "Full name" },
                      { key: "bankName",      label: "Bank Name",      placeholder: "e.g. Dutch Bangla Bank" },
                      { key: "accountNumber", label: "Account Number", placeholder: "Account number" },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="text-[10px] text-white/30 uppercase tracking-wide block mb-1">{f.label}</label>
                        <input value={payoutForm[f.key]}
                          onChange={e => setPayoutForm(pf => ({ ...pf, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all"/>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={handleSaveInfo} disabled={savingInfo}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-semibold text-white transition-all disabled:opacity-60">
                  {savingInfo ? "Saving..." : "Save Payout Info"}
                </button>
              </div>
            )}

            {/* Request payout button */}
            <button
              onClick={handleRequest}
              disabled={requesting || !status?.payoutInfo?.method || (status?.available || 0) < 10 || (status?.pendingPayout || 0) > 0}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-sm font-bold text-white transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed">
              {requesting ? "Submitting..." :
               (status?.pendingPayout || 0) > 0 ? `⏳ Payout Pending ($${(status?.pendingPayout||0).toFixed(2)})` :
               (status?.available || 0) < 10 ? `Need $${(10 - (status?.available||0)).toFixed(2)} more to withdraw` :
               !status?.payoutInfo?.method ? "Set payout info first" :
               `Withdraw $${(status?.available || 0).toFixed(2)}`}
            </button>

            <p className="text-[11px] text-white/20 text-center">
              Minimum $10.00 · Premium accounts: monthly auto-payout · Manual request available anytime
            </p>

            {/* Support / Helpline button */}
            <div className="pt-2 border-t border-white/[0.05]">
              <button onClick={() => setShowSupport(v => !v)}
                className="flex items-center gap-2 text-[12px] text-white/35 hover:text-white/60 transition-all">
                <span>💬</span>
                Payout issue? Message our support team
              </button>
              {showSupport && (
                <div className="mt-3 space-y-2">
                  <input value={supportForm.subject}
                    onChange={e => setSupportForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="Subject (e.g. Payout not received)"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all"/>
                  <textarea value={supportForm.body}
                    onChange={e => setSupportForm(f => ({ ...f, body: e.target.value }))}
                    placeholder="Describe your issue..."
                    rows={3}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all resize-none"/>
                  <button onClick={handleSendSupport} disabled={sendingSupport}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-semibold text-white transition-all disabled:opacity-60">
                    {sendingSupport ? "Sending..." : "Send to Admin/Mod"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Message */}
        {msg && (
          <div className={`mt-3 px-4 py-3 rounded-xl text-sm font-medium ${
            msg.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-400"
              : "bg-red-500/10 border border-red-500/25 text-red-400"
          }`}>{msg.text}</div>
        )}
      </div>

      {/* Payout history */}
      {isPro && (status?.payoutRequests || []).length > 0 && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Payout History</h3>
          <div className="space-y-2">
            {status.payoutRequests.map((r, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.02]">
                <div>
                  <span className="text-sm text-white/70 font-medium">${r.amount?.toFixed(2)}</span>
                  <span className="text-[11px] text-white/25 ml-2">{r.method}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-white/25">
                    {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                    r.status === "paid"     ? "bg-emerald-500/15 text-emerald-400" :
                    r.status === "rejected" ? "bg-red-500/15 text-red-400" :
                    "bg-amber-500/15 text-amber-400"
                  }`}>{r.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


async function uploadAvatarToCloudinary(file) {
  const reader = new FileReader();
  const base64 = await new Promise((res, rej) => {
    reader.onload = () => res(reader.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
  const r = await fetch("https://wavetrack-backend-rggh.onrender.com/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
    body: JSON.stringify({ file: base64, type: "image" }),
  });
  const data = await r.json();
  return data.url || null;
}

function AvatarUpload({ initials, avatarUrl, onUpload }) {
  const inputRef = useRef();
  const [preview, setPreview] = useState(avatarUrl || null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await uploadAvatarToCloudinary(file);
      if (url) { setPreview(url); onUpload(url); }
    } catch { alert("Avatar upload failed."); }
    finally { setUploading(false); }
  };

  return (
    <div className="relative group cursor-pointer w-fit" onClick={() => inputRef.current.click()}>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl overflow-hidden">
        {preview ? <img src={preview} alt="avatar" className="w-full h-full object-cover" /> : initials}
      </div>
      {uploading && (
        <div className="absolute inset-0 rounded-2xl bg-black/60 flex items-center justify-center">
          <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#34d399" strokeWidth="3"/>
            <path className="opacity-75" fill="#34d399" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
        </div>
      )}
      {!uploading && (
        <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <svg width="16" height="16" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" transform="scale(0.7) translate(5,4)"/>
            <circle cx="12" cy="13" r="4" transform="scale(0.7) translate(5,4)"/>
          </svg>
        </div>
      )}
      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0A0A0F] flex items-center justify-center">
        <svg width="8" height="8" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <line x1="4" y1="1" x2="4" y2="7"/><line x1="1" y1="4" x2="7" y2="4"/>
        </svg>
      </div>
    </div>
  );
}

// ── Toggle Switch ─────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-all ${checked ? "bg-emerald-500" : "bg-white/10"}`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${checked ? "left-5" : "left-0.5"}`}/>
    </button>
  );
}

// ── Plan Card ─────────────────────────────────────────────────────
function PlanCard({ plan, label, price, priceAnnual, features, highlighted, current, onSelect, billing }) {
  return (
    <div className={`p-5 rounded-2xl border flex flex-col transition-all ${
      highlighted
        ? "border-emerald-500/50 bg-gradient-to-b from-emerald-500/10 to-transparent"
        : current
        ? "border-white/20 bg-white/[0.04]"
        : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
    }`}>
      {highlighted && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white w-fit mb-3">Most Popular</span>}
      {current && !highlighted && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/50 w-fit mb-3">Current Plan</span>}
      <div className="text-base font-bold text-white mb-1">{label}</div>
      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-3xl font-bold text-white">{billing === "annual" ? priceAnnual : price}</span>
        <span className="text-white/30 text-sm">/mo</span>
      </div>
      <ul className="space-y-2 flex-1 mb-4">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-[12px] text-white/50">
            <svg width="12" height="12" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0 mt-0.5"><polyline points="2,6 4,9 10,3"/></svg>
            {f}
          </li>
        ))}
      </ul>
      {current
        ? <div className="w-full py-2 rounded-xl bg-white/5 text-center text-sm text-white/30 font-medium">Active</div>
        : <button onClick={() => onSelect(plan)} className={`w-full py-2 rounded-xl text-sm font-bold transition-all ${
            highlighted
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/20"
              : "border border-white/10 hover:bg-white/5 text-white"
          }`}>Upgrade</button>
      }
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
const TABS = [
  { id: "profile",       label: "Profile",        icon: "👤" },
  { id: "account",       label: "Account",         icon: "⚙️" },
  { id: "notifications", label: "Notifications",   icon: "🔔" },
  { id: "plan",          label: "Plan & Billing",  icon: "💳" },
  { id: "danger",        label: "Danger Zone",     icon: "⚠️" },
];

export default function Settings({ user, onUpdate, onLogout, initialTab }) {
  const [tab,    setTab]    = useState(initialTab || "profile");
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [billing, setBilling] = useState("annual");
  const [checkoutLoading, setCheckoutLoading] = useState(null);

  // Sync if parent changes initialTab (e.g. navigating from Profile "Settings" button)
  useEffect(() => {
    if (initialTab) setTab(initialTab);
  }, [initialTab]);

  const [notifs, setNotifs] = useState({
    songApproved: true, streamMilestone: true,
    payoutUpdate: false, newPlatform: false,
  });

  const [form, setForm] = useState({
    name: user?.name || "", bio: user?.bio || "",
    location: user?.location || "", genre: user?.genre || "",
    website: user?.website || "",
    socialLinks: user?.socialLinks || {},
    avatarUrl: user?.avatarUrl || "",
  });

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";
  const isPro   = user?.plan && user.plan !== "free";
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "2026";

  const showSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const updated = await updateProfile(form, token);
      const merged = { ...user, ...updated };
      localStorage.setItem("user", JSON.stringify(merged));
      if (onUpdate) onUpdate(merged);
      showSaved();
    } catch { alert("Failed to save. Please try again."); }
    finally { setSaving(false); }
  };

  const handleUpgrade = async (planId) => {
    setCheckoutLoading(planId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://wavetrack-backend-rggh.onrender.com/api/payment/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ planId, billing }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.message || "Failed to start checkout.");
    } catch { alert("Checkout failed. Please try again."); }
    finally { setCheckoutLoading(null); }
  };

  const plans = [
    {
      plan: "musician", label: "Musician", price: "$3.99", priceAnnual: "$2.08",
      features: ["Unlimited song uploads", "All major platforms", "Keep 100% royalties", "Basic analytics", "Mobile app access"],
    },
    {
      plan: "musician_plus", label: "Musician Plus", price: "$5.99", priceAnnual: "$3.75",
      highlighted: true,
      features: ["Everything in Musician", "Advanced analytics", "Daily streaming stats", "Custom label name", "Synced lyrics", "Priority support"],
    },
    {
      plan: "ultimate", label: "Ultimate", price: "$12.99", priceAnnual: "$7.50",
      features: ["Everything in Musician Plus", "5+ artists", "1TB file sharing", "Playlist contacts", "Priority distribution", "Dedicated support"],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-white/40 text-sm mt-1">Manage your account and preferences</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-sm font-medium">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="2,7 5,10 12,3"/></svg>
            Saved!
          </div>
        )}
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Sidebar tabs */}
        <div className="lg:w-48 flex-shrink-0">
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 lg:flex-shrink lg:w-full text-left ${
                  tab === t.id
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
                } ${t.id === "danger" ? "text-red-400/60 hover:text-red-400 hover:bg-red-500/5" : ""}`}>
                <span>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 min-w-0">

          {/* ── PROFILE TAB ── */}
          {tab === "profile" && (
            <div className="space-y-5">
              {/* Avatar + name */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                <h2 className="text-sm font-semibold text-white mb-5">Artist Profile</h2>
                <div className="flex items-start gap-5 mb-6">
                  <AvatarUpload
                    initials={initials}
                    avatarUrl={form.avatarUrl}
                    onUpload={url => setForm(f => ({ ...f, avatarUrl: url }))}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-lg font-bold text-white">{user?.name || "Artist"}</span>
                      {isPro && <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 font-bold border border-yellow-400/30">👑 PRO</span>}
                    </div>
                    <p className="text-white/40 text-sm">{user?.email}</p>
                    <p className="text-white/25 text-xs mt-1">📅 Joined {joinDate}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] text-white/30 uppercase tracking-wide block mb-1.5">Display Name</label>
                      <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"/>
                    </div>
                    <div>
                      <label className="text-[11px] text-white/30 uppercase tracking-wide block mb-1.5">Genre</label>
                      <select value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white/70 focus:outline-none focus:border-emerald-500/50 transition-all appearance-none">
                        <option value="" className="bg-[#1a1a2e]">Select genre</option>
                        {["Afrobeats","Amapiano","R&B","Hip-Hop","Pop","Lo-fi","Soul","Jazz","Electronic","Rock","Reggae","Classical","Synthwave"].map(g => (
                          <option key={g} value={g} className="bg-[#1a1a2e]">{g}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] text-white/30 uppercase tracking-wide block mb-1.5">Location</label>
                      <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                        placeholder="City, Country"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all"/>
                    </div>
                    <div>
                      <label className="text-[11px] text-white/30 uppercase tracking-wide block mb-1.5">Website</label>
                      <input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })}
                        placeholder="https://yoursite.com"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all"/>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-white/30 uppercase tracking-wide block mb-1.5">Bio</label>
                    <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                      rows={3} placeholder="Tell people about yourself..."
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all resize-none"/>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                <h2 className="text-sm font-semibold text-white mb-4">Social Links</h2>
                <div className="space-y-3">
                  {[
                    { key: "spotify",   label: "Spotify Artist", placeholder: "https://open.spotify.com/artist/...", icon: "🎵" },
                    { key: "instagram", label: "Instagram",       placeholder: "https://instagram.com/...",           icon: "📷" },
                    { key: "twitter",   label: "Twitter / X",     placeholder: "https://twitter.com/...",             icon: "🐦" },
                    { key: "youtube",   label: "YouTube",   placeholder: "https://youtube.com/...",   icon: "▶️" },
                    { key: "tiktok",    label: "TikTok",    placeholder: "https://tiktok.com/@...",   icon: "🎶" },
                  ].map(p => (
                    <div key={p.key} className="flex items-center gap-3">
                      <span className="text-lg w-7 text-center flex-shrink-0">{p.icon}</span>
                      <div className="flex-1">
                        <label className="text-[10px] text-white/25 uppercase tracking-wide block mb-1">{p.label}</label>
                        <input
                          value={form.socialLinks[p.key] || ""}
                          onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, [p.key]: e.target.value } })}
                          placeholder={p.placeholder}
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2 text-sm text-white placeholder-white/15 focus:outline-none focus:border-emerald-500/50 transition-all"/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-bold text-white transition-all disabled:opacity-60">
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          )}

          {/* ── ACCOUNT TAB ── (merged from Profile's settings tab) */}
          {tab === "account" && (
            <div className="space-y-4">
              {/* Account Information */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-4">
                <h2 className="text-sm font-semibold text-white">Account Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-white/30 uppercase tracking-wide block mb-1.5">Display Name</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"/>
                  </div>
                  <div>
                    <label className="text-[11px] text-white/30 uppercase tracking-wide block mb-1.5">Email</label>
                    <input value={user?.email || ""} disabled
                      className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl px-3.5 py-2.5 text-sm text-white/30 cursor-not-allowed"/>
                  </div>
                </div>
                <button onClick={handleSave} disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-semibold text-white transition-all disabled:opacity-60">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>

              {/* Current Plan — from Profile's settings tab */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                <h2 className="text-sm font-semibold text-white mb-4">Current Plan</h2>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold">
                        {user?.plan === "musician" ? "Musician"
                         : user?.plan === "musician_plus" ? "👑 Musician Plus"
                         : user?.plan === "ultimate" ? "⭐ Ultimate"
                         : "Free Plan"}
                      </span>
                    </div>
                    <p className="text-white/30 text-sm">
                      {isPro ? "All features unlocked · Unlimited uploads" : "Up to 3 songs · 4 platforms"}
                    </p>
                  </div>
                  {!isPro && (
                    <button
                      onClick={() => setTab("plan")}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-sm font-bold text-white transition-all shadow-lg shadow-emerald-500/20">
                      ✨ Upgrade to Pro
                    </button>
                  )}
                  {isPro && (
                    <span className="px-3 py-1.5 rounded-xl text-[12px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                      ✅ Active
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS TAB ── */}
          {tab === "notifications" && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-5">
              <div>
                <h2 className="text-sm font-semibold text-white">Email Notifications</h2>
                <p className="text-white/30 text-xs mt-1">Choose which emails you want to receive at <span className="text-white/50">{user?.email}</span></p>
              </div>
              <div className="space-y-4 divide-y divide-white/[0.04]">
                {[
                  { key: "songApproved",    label: "Song approved",       desc: "When your song goes live on all platforms" },
                  { key: "streamMilestone", label: "Stream milestones",   desc: "Get notified at 100, 1k, 5k, 10k streams" },
                  { key: "payoutUpdate",    label: "Payout updates",      desc: "When earnings are processed and sent" },
                  { key: "newPlatform",     label: "New platforms",       desc: "When we add new distribution platforms" },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between pt-4 first:pt-0">
                    <div>
                      <p className="text-sm text-white/70 font-medium">{item.label}</p>
                      <p className="text-[11px] text-white/25">{item.desc}</p>
                    </div>
                    <Toggle
                      checked={notifs[item.key]}
                      onChange={val => setNotifs(n => ({ ...n, [item.key]: val }))}
                    />
                  </div>
                ))}
              </div>
              <button onClick={showSaved}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-semibold text-white transition-all">
                Save Preferences
              </button>
            </div>
          )}

          {/* ── PLAN & BILLING TAB ── */}
          {tab === "plan" && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-[11px] text-white/30 uppercase tracking-wide mb-1">Current Plan</p>
                  <p className="text-xl font-bold text-white">
                    {user?.plan === "musician" ? "Musician"
                     : user?.plan === "musician_plus" ? "👑 Musician Plus"
                     : user?.plan === "ultimate" ? "⭐ Ultimate"
                     : "Free"}
                  </p>
                  <p className="text-white/30 text-sm mt-0.5">
                    {user?.plan === "free" ? "Up to 3 songs · 4 platforms" : "All features unlocked · Unlimited uploads"}
                  </p>
                </div>
                <span className={`px-3 py-1.5 rounded-xl text-[12px] font-bold ${
                  isPro ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" : "bg-white/5 text-white/40 border border-white/10"
                }`}>{isPro ? "✅ Active" : "Free Tier"}</span>
              </div>

              {!isPro && (
                <>
                  <div className="flex items-center justify-center gap-3">
                    <span className={`text-sm font-medium ${billing === "monthly" ? "text-white" : "text-white/30"}`}>Monthly</span>
                    <button onClick={() => setBilling(b => b === "annual" ? "monthly" : "annual")}
                      className={`relative w-12 h-6 rounded-full transition-all ${billing === "annual" ? "bg-emerald-500" : "bg-white/10"}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${billing === "annual" ? "left-7" : "left-1"}`}/>
                    </button>
                    <span className={`text-sm font-medium flex items-center gap-1.5 ${billing === "annual" ? "text-white" : "text-white/30"}`}>
                      Annual
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">Save 40%</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map(p => (
                      <PlanCard
                        key={p.plan}
                        {...p}
                        billing={billing}
                        current={user?.plan === p.plan}
                        onSelect={(planId) => handleUpgrade(planId)}
                      />
                    ))}
                  </div>
                  <p className="text-center text-[11px] text-white/20">
                    Secure payment via Stripe · Cancel anytime · 7-day free trial
                  </p>
                </>
              )}

              {isPro && (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h2 className="text-sm font-semibold text-white mb-3">Manage Subscription</h2>
                  <p className="text-white/40 text-sm mb-4">Your subscription renews automatically. You can cancel at any time.</p>
                  <button
                    onClick={async () => {
                      if (!confirm("Cancel your subscription? You will lose access at the end of your billing period.")) return;
                      const token = localStorage.getItem("token");
                      await fetch("https://wavetrack-backend-rggh.onrender.com/api/payment/cancel", {
                        method: "POST", headers: { Authorization: `Bearer ${token}` },
                      });
                      alert("Subscription cancelled.");
                    }}
                    className="px-5 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all">
                    Cancel Subscription
                  </button>
                </div>
              )}

              {/* ── PAYOUT SECTION ── */}
              <PayoutSection isPro={isPro} onUpgrade={() => setTab("plan")} />
            </div>
          )}

          {/* ── DANGER ZONE TAB ── (merged from Profile's settings tab) */}
          {tab === "danger" && (
            <div className="space-y-4">
              {/* Logout */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-white/70 font-semibold">Log Out</p>
                  <p className="text-[11px] text-white/25">Sign out of your WaveTrack account</p>
                </div>
                <button onClick={onLogout}
                  className="px-5 py-2 rounded-xl border border-white/10 text-white/50 hover:bg-white/5 text-sm font-medium transition-all">
                  Logout
                </button>
              </div>

              {/* Delete Account — from Profile's settings tab */}
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
                <h2 className="text-sm font-semibold text-red-400 mb-1">Delete Account</h2>
                <p className="text-white/30 text-sm mb-4">
                  This will permanently delete your account, all songs, and data. This cannot be undone.
                </p>
                {!showDeleteConfirm ? (
                  <button onClick={() => setShowDeleteConfirm(true)}
                    className="px-5 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all">
                    Delete Account
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-semibold text-white transition-all">
                      Confirm Delete
                    </button>
                    <button onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 rounded-xl bg-white/5 text-sm text-white/50 hover:bg-white/10 transition-all">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
