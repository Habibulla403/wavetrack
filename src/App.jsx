import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import MyMusic from "./components/MyMusic";
import Distribution from "./components/Distribution";
import Analytics from "./components/Analytics";
import AuthPage from "./components/AuthPage";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleAuth = (userData) => setUser(userData);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) return <AuthPage onAuth={handleAuth} />;

  const pages = {
    dashboard: <Dashboard user={user} />,
    music: <MyMusic user={user} />,
    distribution: <Distribution />,
    analytics: <Analytics />,
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

      <main className="flex-1 overflow-y-auto lg:ml-0">
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#0A0A0F] sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-white/5">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="3" y1="6" x2="17" y2="6" /><line x1="3" y1="12" x2="17" y2="12" /><line x1="3" y1="18" x2="17" y2="18" />
            </svg>
          </button>
          <span className="font-semibold text-[15px] tracking-tight">WaveTrack</span>
        </div>
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {pages[activePage]}
        </div>
      </main>
    </div>
  );
}
