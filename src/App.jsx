import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import MyMusic from "./components/MyMusic";
import Distribution from "./components/Distribution";
import Analytics from "./components/Analytics";
import AuthPage from "./components/AuthPage";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import LandingPage from "./components/LandingPage";
import SongPlayer from "./components/SongPlayer";

export default function App() {
  const [activePage,   setActivePage]   = useState("dashboard");
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [user,         setUser]         = useState(null);
  const [showAuth,     setShowAuth]     = useState(false);
  const [currentSong,  setCurrentSong]  = useState(null);
  const [songQueue,    setSongQueue]    = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleAuth    = (u) => { setUser(u); setShowAuth(false); };
  const handleLogout  = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); setUser(null); setShowAuth(false); };
  const handleUpdate  = (u) => setUser(u);

  const handlePlaySong = (song, queue = []) => { setCurrentSong(song); if (queue.length) setSongQueue(queue); };
  const handleNext = () => {
    if (!songQueue.length) return;
    const idx = songQueue.findIndex(s => s._id === currentSong?._id);
    if (idx < songQueue.length - 1) setCurrentSong(songQueue[idx + 1]);
  };
  const handlePrev = () => {
    if (!songQueue.length) return;
    const idx = songQueue.findIndex(s => s._id === currentSong?._id);
    if (idx > 0) setCurrentSong(songQueue[idx - 1]);
  };

  if (!user && !showAuth) return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  if (!user && showAuth)  return <AuthPage onAuth={handleAuth} />;

  const pages = {
    dashboard:    <Dashboard    user={user} onPlaySong={handlePlaySong} setActivePage={setActivePage} />,
    music:        <MyMusic      user={user} onPlaySong={handlePlaySong} />,
    distribution: <Distribution />,
    analytics:    <Analytics />,
    profile:      <Profile      user={user} onUpdate={handleUpdate} onNavigate={setActivePage} />,
    settings:     <Settings     user={user} onUpdate={handleUpdate} onLogout={handleLogout} />,
  };

  return (
    <div className="flex h-screen bg-[#0A0A0F] text-white overflow-hidden font-sans">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        activePage={activePage}
        setActivePage={(p) => { setActivePage(p); setSidebarOpen(false); }}
        sidebarOpen={sidebarOpen}
        user={user}
        onLogout={handleLogout}
      />

      <main className={`flex-1 overflow-y-auto ${currentSong ? "pb-24" : ""}`}>
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-[#0A0A0F]/90 backdrop-blur border-b border-white/[0.04] flex items-center gap-3 px-4 py-3">
          {/* Mobile menu button */}
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 rounded-lg hover:bg-white/5">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="3" y1="6" x2="17" y2="6"/><line x1="3" y1="12" x2="17" y2="12"/><line x1="3" y1="18" x2="17" y2="18"/>
            </svg>
          </button>
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center">
              <svg width="12" height="12" fill="none" viewBox="0 0 16 16">
                <path d="M1.5 8 Q3.5 4 5.5 8 Q7.5 12 9.5 8 Q11.5 4 13.5 8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-bold text-[15px]">WaveTrack</span>
          </div>

          <div className="flex-1" />
        </div>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {pages[activePage]}
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0D0D14]/95 backdrop-blur-xl border-t border-white/[0.06] flex items-center justify-around px-2 py-2"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        {[
          { id:"dashboard", label:"Home",    icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 17 17"><rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.5"/><rect x="10" y="1.5" width="5.5" height="5.5" rx="1.5"/><rect x="1.5" y="10" width="5.5" height="5.5" rx="1.5"/><rect x="10" y="10" width="5.5" height="5.5" rx="1.5"/></svg> },
          { id:"music",     label:"Music",   icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" viewBox="0 0 17 17"><path d="M3 13V6.5L14 4V10.5"/><circle cx="3" cy="13" r="1.8"/><circle cx="14" cy="10.5" r="1.8"/></svg> },
          { id:"analytics", label:"Stats",   icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" viewBox="0 0 17 17"><polyline points="1.5,13 5,8 8.5,10.5 12,5 15.5,7"/></svg> },
          { id:"profile",   label:"Profile", icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" viewBox="0 0 17 17"><circle cx="8.5" cy="5.5" r="3"/><path d="M2 14.5c0-3.5 13-3.5 13 0"/></svg> },
          { id:"settings",  label:"Settings",icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" viewBox="0 0 17 17"><circle cx="8.5" cy="8.5" r="2.5"/><path d="M8.5 1v2M8.5 14v2M1 8.5h2M14 8.5h2M3.1 3.1l1.4 1.4M12.5 12.5l1.4 1.4M3.1 13.9l1.4-1.4M12.5 4.5l1.4-1.4"/></svg> },
        ].map(item => {
          const active = activePage === item.id;
          return (
            <button key={item.id} onClick={() => setActivePage(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${active ? "text-emerald-400" : "text-white/25 hover:text-white/50"}`}>
              {item.icon}
              <span className={`text-[10px] font-medium ${active ? "text-emerald-400" : "text-white/25"}`}>{item.label}</span>
              {active && <span className="w-1 h-1 rounded-full bg-emerald-400"/>}
            </button>
          );
        })}
      </nav>

      {currentSong && (
        <SongPlayer
          song={currentSong}
          onClose={() => setCurrentSong(null)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
}
