export default function MetricCard({ label, value, sub, icon, accent = false }) {
  return (
    <div className={`
      rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-0.5
      ${accent
        ? "bg-emerald-500/10 border-emerald-500/25 hover:bg-emerald-500/15"
        : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]"
      }
    `}>
      <div className="flex items-start justify-between mb-3">
        <span className={`text-[12px] font-medium tracking-wide uppercase ${accent ? "text-emerald-400/70" : "text-white/30"}`}>
          {label}
        </span>
        <span className={`p-1.5 rounded-lg ${accent ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-white/30"}`}>
          {icon}
        </span>
      </div>
      <div className={`text-2xl font-bold tracking-tight ${accent ? "text-emerald-300" : "text-white"}`}>
        {value}
      </div>
      {sub && <div className="text-[12px] text-white/30 mt-1">{sub}</div>}
    </div>
  );
}
