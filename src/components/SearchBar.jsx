import { useState, useEffect, useRef } from "react";
import { getSongs } from "../api";

export default function SearchBar({ setActivePage }) {
  const [open, setOpen]       = useState(false);
  const [query, setQuery]     = useState("");
  const [songs, setSongs]     = useState([]);
  const [results, setResults] = useState([]);
  const inputRef = useRef();
  const ref      = useRef();

  useEffect(() => {
    const token = localStorage.getItem("token");
    getSongs(token).then(d => setSongs(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    setResults(songs.filter(s =>
      s.title?.toLowerCase().includes(q) || s.genre?.toLowerCase().includes(q)
    ).slice(0, 6));
  }, [query, songs]);

  useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setQuery(""); }
    };
    document.addEventListener("mousedown", fn);
    const kb = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); } };
    document.addEventListener("keydown", kb);
    return () => { document.removeEventListener("mousedown", fn); document.removeEventListener("keydown", kb); };
  }, []);

  const statusColor = { live: "text-emerald-400", pending: "text-amber-400", draft: "text-white/30" };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] transition-all text-white/30 hover:text-white/60 text-sm">
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="6" cy="6" r="5"/><line x1="10" y1="10" x2="14" y2="14"/>
        </svg>
        <span className="hidden sm:block text-[12px]">Search songs...</span>
        <span className="hidden sm:flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.06]">⌘K</span>
      </button>
      {open && (
        <div className="absolute top-12 left-0 w-80 bg-[#13131f] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-white/30 flex-shrink-0">
              <circle cx="6" cy="6" r="5"/><line x1="10" y1="10" x2="14" y2="14"/>
            </svg>
            <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search your songs..."
              className="flex-1 bg-transparent text-sm text-white placeholder-white/20 focus:outline-none"/>
            {query && (
              <button onClick={() => setQuery("")} className="text-white/20 hover:text-white/60 transition-colors">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/>
                </svg>
              </button>
            )}
          </div>
          {!query && (
            <div className="px-4 py-3">
              <p className="text-[11px] text-white/20 mb-2 uppercase tracking-wide">Quick actions</p>
              {[
                { icon:"⬆️", label:"Upload new song", page:"music" },
                { icon:"📊", label:"View analytics",  page:"analytics" },
                { icon:"🔗", label:"Distribution",    page:"distribution" },
              ].map(a => (
                <button key={a.page} onClick={() => { setActivePage(a.page); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors text-left">
                  <span className="text-base">{a.icon}</span>
                  <span className="text-sm text-white/50">{a.label}</span>
                </button>
              ))}
            </div>
          )}
          {query && results.length === 0 && (
            <div className="px-4 py-8 text-center">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-white/25 text-sm">No songs found for "{query}"</p>
            </div>
          )}
          {results.length > 0 && (
            <div className="py-2 max-h-64 overflow-y-auto">
              <p className="text-[10px] text-white/20 uppercase tracking-wide px-4 mb-1">Songs</p>
              {results.map(s => (
                <button key={s._id} onClick={() => { setActivePage("music"); setOpen(false); setQuery(""); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-colors text-left">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <svg width="12" height="12" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M2 10V5L10 3V8"/><circle cx="2" cy="10" r="1.2"/><circle cx="10" cy="8" r="1.2"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 truncate font-medium">{s.title}</p>
                    <p className="text-[11px] text-white/30">{s.genre || "—"}</p>
                  </div>
                  <span className={`text-[10px] font-medium ${statusColor[s.status] || "text-white/30"}`}>{s.status}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
