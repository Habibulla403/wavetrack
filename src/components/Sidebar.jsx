const navItems = [
  {
    id: "dashboard", label: "Dashboard",
    icon: (
      <svg width="17" height="17" fill="none" viewBox="0 0 17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.5" /><rect x="10" y="1.5" width="5.5" height="5.5" rx="1.5" />
        <rect x="1.5" y="10" width="5.5" height="5.5" rx="1.5" /><rect x="10" y="10" width="5.5" height="5.5" rx="1.5" />
      </svg>
    )
  },
  {
    id: "music", label: "My Music",
    icon: (
      <svg width="17" height="17" fill="none" viewBox="0 0 17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M3 13V6.5L14 4V10.5" /><circle cx="3" cy="13" r="1.8" /><circle cx="14" cy="10.5" r="1.8" />
      </svg>
    )
  },
  {
    id: "distribution", label: "Distribution",
    icon: (
      <svg width="17" height="17" fill="none" viewBox="0 0 17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="3" cy="8.5" r="1.8" /><circle cx="14" cy="3" r="1.8" /><circle cx="14" cy="14" r="1.8" />
        <line x1="4.7" y1="7.6" x2="12.3" y2="3.9" /><line x1="4.7" y1="9.4" x2="12.3" y2="13.1" />
      </svg>
    )
  },
  {
    id: "analytics", label: "Analytics",
    icon: (
      <svg width="17" height="17" fill="none" viewBox="0 0 17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1.5,13 5,8 8.5,10.5 12,5 15.5,7" />
      </svg>
    )
  },
];

export default function Sidebar({ activePage, setActivePage, sidebarOpen, user, onLogout }) {
  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  return (
    <aside className={`
      fixed top-0 left-0 h-full w-60 bg-[#0D0D14] border-r border-white/5 flex flex-col z-30
      transition-transform duration-300 ease-in-out
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0 lg:static lg:z-auto
    `}>
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path d="M1.5 8 Q3.5 4 5.5 8 Q7.5 12 9.5 8 Q11.5 4 13.5 8" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-[15px] tracking-tight text-white">WaveTrack</div>
            <div className="text-[10px] text-white/30 tracking-wide">MUSIC PLATFORM</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-white/25 tracking-widest uppercase px-3 mb-3">Menu</p>
        {navItems.map((item) => {
          const active = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 text-left
                ${active ? "bg-emerald-500/15 text-emerald-400 font-medium" : "text-white/40 hover:text-white/70 hover:bg-white/5"}
              `}
            >
              <span className={active ? "text-emerald-400" : "text-white/30"}>{item.icon}</span>
              {item.label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white/80 truncate">{user?.name || "User"}</div>
            <div className="text-[11px] text-white/30 truncate">{user?.email || ""}</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full mt-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all text-left flex items-center gap-2"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M9 2H3a1 1 0 00-1 1v10a1 1 0 001 1h6M12 9l3-3-3-3M7 9h8" />
          </svg>
          Logout
        </button>
        <div className="mt-2 mx-0 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-[11px] text-emerald-400 font-medium">Upgrade to Pro</p>
          <p className="text-[10px] text-white/30 mt-0.5">Unlimited uploads + analytics</p>
        </div>
      </div>
    </aside>
  );
}
