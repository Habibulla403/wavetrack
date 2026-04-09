import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import MyMusic from "./components/MyMusic";
import Distribution from "./components/Distribution";
import Analytics from "./components/Analytics";
import AuthPage from "./components/AuthPage";
import Profile from "./components/Profile";
import LandingPage from "./components/LandingPage";
import SongPlayer from "./components/SongPlayer";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleAuth = (userData) => {
    setUser(userData);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowAuth(false);
  };

  const handleUserUpdate = (updated) => setUser(updated);

  if (!user && !showAuth) return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  if (!user && showAuth) return <AuthPage onAuth={handleAuth} />;

  const pages = {
    dashboard: <Dashboard user={user} onPlaySong={setCurrentSong} setActivePage={setActivePage} />,
    music: <MyMusic user={user} onPlaySong={setCurrentSong} />,
    distribution: <Distribution />,
    analytics: <Analytics />,
    profile: <Profile user={user} onUpdate={handleUserUpdate} />,
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
        setSidebarOpen={setSidebarOpen}
        user={user}
        onLogout={handleLogout}
      />

      <main className={`flex-1 overflow-y-auto lg:ml-0 ${currentSong ? "pb-24" : ""}`}>
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#0A0A0F] sticky top-0 z-10 backdrop-blur">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-white/5">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="3" y1="6" x2="17" y2="6" />
              <line x1="3" y1="12" x2="17" y2="12" />
              <line x1="3" y1="18" x2="17" y2="18" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center">
              <svg width="12" height="12" fill="none" viewBox="0 0 16 16">
                <path d="M1.5 8 Q3.5 4 5.5 8 Q7.5 12 9.5 8 Q11.5 4 13.5 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-semibold text-[15px] tracking-tight">WaveTrack</span>
          </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {pages[activePage]}
        </div>
      </main>

      {currentSong && (
        <SongPlayer song={currentSong} onClose={() => setCurrentSong(null)} />
      )}
    </div>
  );
}
