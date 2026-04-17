import { useState, useEffect } from "react";
import { getSongs } from "../api";

const ALL_PLATFORMS = [
  { name: "Spotify",           emoji: "🎵", bg: "bg-emerald-500",  tier: "free", reach: "602M+ users",   region: "Global"      },
  { name: "Apple Music",       emoji: "🍎", bg: "bg-rose-500",     tier: "free", reach: "100M+ users",   region: "Global"      },
  { name: "YouTube Music",     emoji: "▶️", bg: "bg-red-500",      tier: "free", reach: "80M+ users",    region: "Global"      },
  { name: "Amazon Music",      emoji: "📦", bg: "bg-sky-500",      tier: "free", reach: "55M+ users",    region: "Global"      },
  { name: "Deezer",            emoji: "🎶", bg: "bg-purple-500",   tier: "free", reach: "16M+ users",    region: "Global"      },
  { name: "Tidal",             emoji: "🌊", bg: "bg-blue-500",     tier: "free", reach: "10M+ users",    region: "Global"      },
  { name: "Pandora",           emoji: "📻", bg: "bg-indigo-500",   tier: "free", reach: "50M+ users",    region: "US"          },
  { name: "SoundCloud",        emoji: "☁️", bg: "bg-orange-500",   tier: "free", reach: "76M+ users",    region: "Global"      },
  { name: "iHeartRadio",       emoji: "💙", bg: "bg-red-600",      tier: "free", reach: "150M+ users",   region: "US"          },
  { name: "Napster",           emoji: "🐱", bg: "bg-cyan-500",     tier: "free", reach: "5M+ users",     region: "Global"      },
  { name: "Boomplay",          emoji: "🌍", bg: "bg-amber-500",    tier: "free", reach: "90M+ users",    region: "Africa"      },
  { name: "Audiomack",         emoji: "🎧", bg: "bg-yellow-500",   tier: "free", reach: "30M+ users",    region: "Global"      },
  { name: "Anghami",           emoji: "🎼", bg: "bg-violet-500",   tier: "free", reach: "70M+ users",    region: "MENA"        },
  { name: "Gaana",             emoji: "🇮🇳", bg: "bg-orange-600",  tier: "free", reach: "185M+ users",   region: "India"       },
  { name: "JioSaavn",          emoji: "🎹", bg: "bg-blue-600",     tier: "free", reach: "100M+ users",   region: "India"       },
  { name: "Wynk Music",        emoji: "🎸", bg: "bg-pink-600",     tier: "free", reach: "50M+ users",    region: "India"       },
  { name: "Hungama",           emoji: "🎺", bg: "bg-red-700",      tier: "free", reach: "50M+ users",    region: "India"       },
  { name: "Resso",             emoji: "🌀", bg: "bg-pink-500",     tier: "free", reach: "20M+ users",    region: "Asia"        },
  { name: "NetEase Cloud",     emoji: "☁️", bg: "bg-rose-600",     tier: "free", reach: "200M+ users",   region: "China"       },
  { name: "QQ Music",          emoji: "🎵", bg: "bg-green-600",    tier: "free", reach: "800M+ users",   region: "China"       },
  { name: "Kugou",             emoji: "🎤", bg: "bg-teal-600",     tier: "free", reach: "700M+ users",   region: "China"       },
  { name: "Kuwo",              emoji: "🎙️", bg: "bg-cyan-600",    tier: "free", reach: "200M+ users",   region: "China"       },
  { name: "Melon",             emoji: "🍈", bg: "bg-lime-500",     tier: "free", reach: "6M+ users",     region: "Korea"       },
  { name: "Genie",             emoji: "🧞", bg: "bg-blue-700",     tier: "free", reach: "3M+ users",     region: "Korea"       },
  { name: "Flo",               emoji: "🌊", bg: "bg-sky-600",      tier: "free", reach: "2M+ users",     region: "Korea"       },
  { name: "Line Music",        emoji: "💚", bg: "bg-green-500",    tier: "free", reach: "10M+ users",    region: "Japan"       },
  { name: "AWA",               emoji: "🎵", bg: "bg-gray-600",     tier: "free", reach: "3M+ users",     region: "Japan"       },
  { name: "Yandex Music",      emoji: "🔴", bg: "bg-red-500",      tier: "free", reach: "20M+ users",    region: "Russia"      },
  { name: "VK Music",          emoji: "🇷🇺", bg: "bg-blue-800",   tier: "free", reach: "50M+ users",    region: "Russia"      },
  { name: "KKBox",             emoji: "🎵", bg: "bg-pink-900",     tier: "free", reach: "15M+ users",    region: "Taiwan/Asia" },
  { name: "TikTok",            emoji: "🎤", bg: "bg-pink-500",     tier: "pro",  reach: "1B+ users",     region: "Global"      },
  { name: "Instagram Music",   emoji: "📸", bg: "bg-purple-600",   tier: "pro",  reach: "2B+ users",     region: "Global"      },
  { name: "Facebook Music",    emoji: "👤", bg: "bg-blue-700",     tier: "pro",  reach: "3B+ users",     region: "Global"      },
  { name: "Snapchat Sound",    emoji: "👻", bg: "bg-yellow-400",   tier: "pro",  reach: "750M+ users",   region: "Global"      },
  { name: "Triller",           emoji: "🎬", bg: "bg-rose-700",     tier: "pro",  reach: "65M+ users",    region: "Global"      },
  { name: "Shazam",            emoji: "🔵", bg: "bg-blue-500",     tier: "pro",  reach: "200M+ users",   region: "Global"      },
  { name: "7digital",          emoji: "7️⃣", bg: "bg-zinc-600",    tier: "pro",  reach: "5M+ users",     region: "Global"      },
  { name: "Beatport",          emoji: "🎛️", bg: "bg-green-800",   tier: "pro",  reach: "10M+ users",    region: "Global"      },
  { name: "Traxsource",        emoji: "🔊", bg: "bg-blue-800",     tier: "pro",  reach: "3M+ users",     region: "Global"      },
  { name: "Bandcamp",          emoji: "🏕️", bg: "bg-teal-700",    tier: "pro",  reach: "5M+ users",     region: "Global"      },
  { name: "Claro Musica",      emoji: "🎵", bg: "bg-orange-700",   tier: "pro",  reach: "15M+ users",    region: "LatAm"       },
  { name: "Medianet",          emoji: "📡", bg: "bg-slate-600",    tier: "pro",  reach: "700+ partners", region: "Global"      },
  { name: "Musixmatch",        emoji: "🎤", bg: "bg-orange-700",   tier: "pro",  reach: "100M+ users",   region: "Global"      },
  { name: "Genius",            emoji: "💡", bg: "bg-yellow-800",   tier: "pro",  reach: "100M+ users",   region: "Global"      },
  { name: "Last.fm",           emoji: "📊", bg: "bg-rose-800",     tier: "pro",  reach: "20M+ users",    region: "Global"      },
  { name: "Mixcloud",          emoji: "🌀", bg: "bg-purple-800",   tier: "pro",  reach: "20M+ users",    region: "Global"      },
  { name: "Vevo",              emoji: "📺", bg: "bg-red-700",      tier: "pro",  reach: "26M+ users",    region: "Global"      },
  { name: "JOOX",              emoji: "🎵", bg: "bg-yellow-600",   tier: "pro",  reach: "45M+ users",    region: "SE Asia"     },
  { name: "Zing MP3",          emoji: "🎵", bg: "bg-purple-700",   tier: "pro",  reach: "20M+ users",    region: "SE Asia"     },
  { name: "Fizy",              emoji: "🎸", bg: "bg-blue-500",     tier: "pro",  reach: "5M+ users",     region: "EU"          },
  { name: "Qobuz",             emoji: "🎶", bg: "bg-blue-900",     tier: "pro",  reach: "4M+ users",     region: "Global"      },
  { name: "TuneIn",            emoji: "📡", bg: "bg-orange-900",   tier: "pro",  reach: "75M+ users",    region: "Global"      },
  { name: "Radio.com",         emoji: "📻", bg: "bg-red-900",      tier: "pro",  reach: "10M+ users",    region: "US"          },
  { name: "AccuRadio",         emoji: "🎵", bg: "bg-slate-800",    tier: "pro",  reach: "5M+ users",     region: "US"          },
  { name: "Naver Music",       emoji: "🇰🇷", bg: "bg-green-800",  tier: "pro",  reach: "5M+ users",     region: "Korea"       },
  { name: "Bugs",              emoji: "🐛", bg: "bg-green-700",    tier: "pro",  reach: "2M+ users",     region: "Korea"       },
  { name: "Audius",            emoji: "🎵", bg: "bg-purple-500",   tier: "pro",  reach: "7M+ users",     region: "Global"      },
  { name: "AmazonPrime Music", emoji: "📦", bg: "bg-sky-700",      tier: "pro",  reach: "200M+ users",   region: "Global"      },
  { name: "Stingray",          emoji: "🎵", bg: "bg-sky-800",      tier: "pro",  reach: "400M+ users",   region: "Canada"      },
  { name: "LiveOne",           emoji: "🎙️", bg: "bg-rose-700",    tier: "pro",  reach: "8M+ users",     region: "US"          },
  { name: "Jango",             emoji: "🎸", bg: "bg-zinc-800",     tier: "pro",  reach: "5M+ users",     region: "US"          },
  { name: "Slacker Radio",     emoji: "📻", bg: "bg-sky-700",      tier: "pro",  reach: "4M+ users",     region: "US"          },
  { name: "Pandora Plus",      emoji: "📻", bg: "bg-indigo-700",   tier: "pro",  reach: "Plus users",    region: "US"          },
  { name: "Mood Media",        emoji: "🏪", bg: "bg-teal-800",     tier: "pro",  reach: "500K+ venues",  region: "Global"      },
  { name: "TouchTunes",        emoji: "🎮", bg: "bg-purple-900",   tier: "pro",  reach: "75K+ venues",   region: "US"          },
  { name: "Rockbot",           emoji: "🤖", bg: "bg-slate-600",    tier: "pro",  reach: "B2B venues",    region: "US"          },
  { name: "Cloud Cover Music", emoji: "☁️", bg: "bg-sky-600",      tier: "pro",  reach: "B2B",           region: "Global"      },
  { name: "DMX Music",         emoji: "🎵", bg: "bg-gray-700",     tier: "pro",  reach: "B2B venues",    region: "Global"      },
  { name: "Soundtrack YBiz",   emoji: "🏢", bg: "bg-emerald-800",  tier: "pro",  reach: "B2B",           region: "Global"      },
  { name: "Pretzel",           emoji: "🥨", bg: "bg-amber-800",    tier: "pro",  reach: "Streamers",     region: "Global"      },
  { name: "Epidemic Sound",    emoji: "🎼", bg: "bg-orange-900",   tier: "pro",  reach: "Creator Lic.",  region: "Global"      },
  { name: "Artlist",           emoji: "🎨", bg: "bg-pink-800",     tier: "pro",  reach: "Creator Lic.",  region: "Global"      },
  { name: "Musicbed",          emoji: "🛏️", bg: "bg-gray-700",    tier: "pro",  reach: "Creator Lic.",  region: "Global"      },
  { name: "Pond5",             emoji: "🎵", bg: "bg-lime-700",     tier: "pro",  reach: "Creator Lic.",  region: "Global"      },
  { name: "Jamendo",           emoji: "🎶", bg: "bg-green-700",    tier: "pro",  reach: "Commercial",    region: "Global"      },
  { name: "Songtradr",         emoji: "🎵", bg: "bg-violet-800",   tier: "pro",  reach: "Sync lic.",     region: "Global"      },
  { name: "Musicgateway",      emoji: "🚪", bg: "bg-blue-800",     tier: "pro",  reach: "Sync lic.",     region: "Global"      },
  { name: "LyricFind",         emoji: "🔍", bg: "bg-slate-700",    tier: "pro",  reach: "B2B lyrics",    region: "Global"      },
  { name: "Gracenote",         emoji: "🎼", bg: "bg-gray-500",     tier: "pro",  reach: "B2B platform",  region: "Global"      },
  { name: "MusicBrainz",       emoji: "🧠", bg: "bg-amber-700",    tier: "pro",  reach: "Metadata DB",   region: "Global"      },
  { name: "AllMusic",          emoji: "🎵", bg: "bg-red-800",      tier: "pro",  reach: "DB platform",   region: "Global"      },
  { name: "Discogs",           emoji: "💿", bg: "bg-orange-800",   tier: "pro",  reach: "8M+ users",     region: "Global"      },
  { name: "Spotify Podcast",   emoji: "🎙️", bg: "bg-emerald-700", tier: "pro",  reach: "100M+ users",   region: "Global"      },
  { name: "Google Podcasts",   emoji: "🎙️", bg: "bg-blue-500",    tier: "pro",  reach: "15M+ users",    region: "Global"      },
  { name: "Pocket Casts",      emoji: "📻", bg: "bg-orange-600",   tier: "pro",  reach: "10M+ users",    region: "Global"      },
  { name: "Podbean",           emoji: "🫘", bg: "bg-green-600",    tier: "pro",  reach: "10M+ users",    region: "Global"      },
  { name: "Castbox",           emoji: "📦", bg: "bg-orange-700",   tier: "pro",  reach: "15M+ users",    region: "Global"      },
  { name: "iVoox",             emoji: "🎙️", bg: "bg-blue-600",    tier: "pro",  reach: "12M+ users",    region: "EU"          },
  { name: "Spreaker",          emoji: "📡", bg: "bg-purple-600",   tier: "pro",  reach: "5M+ users",     region: "Global"      },
  { name: "Buzzsprout",        emoji: "🐝", bg: "bg-yellow-600",   tier: "pro",  reach: "5M+ users",     region: "Global"      },
  { name: "Stitcher",          emoji: "✂️", bg: "bg-red-600",      tier: "pro",  reach: "8M+ users",     region: "US"          },
  { name: "Simplecast",        emoji: "🔊", bg: "bg-sky-500",      tier: "pro",  reach: "3M+ users",     region: "Global"      },
  { name: "Audible",           emoji: "📖", bg: "bg-orange-800",   tier: "pro",  reach: "12M+ users",    region: "Global"      },
  { name: "Calm",              emoji: "🧘", bg: "bg-teal-500",     tier: "pro",  reach: "Wellness",      region: "Global"      },
  { name: "Headspace",         emoji: "🧠", bg: "bg-orange-500",   tier: "pro",  reach: "Wellness",      region: "Global"      },
  { name: "FitRadio",          emoji: "💪", bg: "bg-green-600",    tier: "pro",  reach: "Fitness",       region: "Global"      },
  { name: "Peloton Music",     emoji: "🚴", bg: "bg-red-500",      tier: "pro",  reach: "Fitness",       region: "US"          },
  { name: "BandLab",           emoji: "🎸", bg: "bg-teal-800",     tier: "pro",  reach: "60M+ users",    region: "Global"      },
  { name: "Splice",            emoji: "✂️", bg: "bg-indigo-800",   tier: "pro",  reach: "4M+ users",     region: "Global"      },
  { name: "Soundtrap",         emoji: "🎵", bg: "bg-emerald-800",  tier: "pro",  reach: "Education",     region: "Global"      },
  { name: "LANDR",             emoji: "🎚️", bg: "bg-gray-800",    tier: "pro",  reach: "Mastering",     region: "Global"      },
  { name: "Smule",             emoji: "🎤", bg: "bg-purple-700",   tier: "pro",  reach: "50M+ users",    region: "Global"      },
  { name: "StarMaker",         emoji: "⭐", bg: "bg-yellow-700",   tier: "pro",  reach: "50M+ users",    region: "Global"      },
  { name: "Yousician",         emoji: "🎸", bg: "bg-yellow-700",   tier: "pro",  reach: "20M+ users",    region: "Global"      },
  { name: "Ultimate Guitar",   emoji: "🎸", bg: "bg-amber-900",    tier: "pro",  reach: "12M+ users",    region: "Global"      },
  { name: "Tracklib",          emoji: "📚", bg: "bg-amber-800",    tier: "pro",  reach: "Sample lic.",   region: "Global"      },
  { name: "Tencent Music",     emoji: "🎵", bg: "bg-blue-700",     tier: "pro",  reach: "800M+ users",   region: "China"       },
  { name: "Baidu Music",       emoji: "🐶", bg: "bg-blue-800",     tier: "pro",  reach: "100M+ users",   region: "China"       },
  { name: "Zvuk",              emoji: "🔉", bg: "bg-teal-800",     tier: "pro",  reach: "3M+ users",     region: "Russia"      },
  { name: "Nhac.vn",           emoji: "🇻🇳", bg: "bg-red-600",    tier: "pro",  reach: "10M+ users",    region: "SE Asia"     },
  { name: "Muud",              emoji: "🎵", bg: "bg-indigo-500",   tier: "pro",  reach: "3M+ users",     region: "EU"          },
  { name: "Boom",              emoji: "💥", bg: "bg-orange-500",   tier: "pro",  reach: "5M+ users",     region: "India"       },
  { name: "Saavn Originals",   emoji: "🎵", bg: "bg-indigo-700",   tier: "pro",  reach: "100M+ users",   region: "India"       },
  { name: "Nuuday",            emoji: "📡", bg: "bg-indigo-600",   tier: "pro",  reach: "5M+ users",     region: "Scandinavia" },
  { name: "Qsic",              emoji: "🏪", bg: "bg-violet-600",   tier: "pro",  reach: "Retail",        region: "Australia"   },
  { name: "Royal",             emoji: "👑", bg: "bg-yellow-600",   tier: "pro",  reach: "NFT royalty",   region: "Global"      },
  { name: "Opulous",           emoji: "🎵", bg: "bg-blue-600",     tier: "pro",  reach: "NFT royalty",   region: "Global"      },
  { name: "Lickd",             emoji: "👅", bg: "bg-red-800",      tier: "pro",  reach: "YouTubers",     region: "Global"      },
  { name: "Chartmetric",       emoji: "📈", bg: "bg-blue-700",     tier: "pro",  reach: "Industry",      region: "Global"      },
  { name: "CD Baby",           emoji: "💿", bg: "bg-orange-800",   tier: "pro",  reach: "Distribution",  region: "Global"      },
  { name: "TuneCore",          emoji: "🎵", bg: "bg-purple-800",   tier: "pro",  reach: "Distribution",  region: "Global"      },
  { name: "Nugs.net",          emoji: "🎸", bg: "bg-stone-600",    tier: "pro",  reach: "Live fans",     region: "US"          },
  { name: "Radionomy",         emoji: "🔊", bg: "bg-violet-900",   tier: "pro",  reach: "1500+ stn",     region: "Global"      },
  { name: "HDtracks",          emoji: "📀", bg: "bg-slate-700",    tier: "pro",  reach: "HiFi users",    region: "Global"      },
  { name: "Highresaudio",      emoji: "🔊", bg: "bg-indigo-800",   tier: "pro",  reach: "HiFi users",    region: "Global"      },
  { name: "Juno Download",     emoji: "📀", bg: "bg-gray-700",     tier: "pro",  reach: "2M+ users",     region: "Global"      },
  { name: "8tracks",           emoji: "🎛️", bg: "bg-amber-600",   tier: "pro",  reach: "5M+ users",     region: "Global"      },
  { name: "Rhapsody",          emoji: "🎶", bg: "bg-violet-700",   tier: "pro",  reach: "2M+ users",     region: "Global"      },
  { name: "Musi",              emoji: "🎶", bg: "bg-blue-600",     tier: "pro",  reach: "10M+ users",    region: "Global"      },
  { name: "Soma.fm",           emoji: "📻", bg: "bg-indigo-900",   tier: "pro",  reach: "Indie radio",   region: "Global"      },
  { name: "Digitally Imported",emoji: "💿", bg: "bg-gray-900",     tier: "pro",  reach: "EDM fans",      region: "Global"      },
  { name: "ACRCLOUD",          emoji: "🎵", bg: "bg-indigo-700",   tier: "pro",  reach: "ACR service",   region: "Global"      },
  { name: "Voloco",            emoji: "🎙️", bg: "bg-violet-700",  tier: "pro",  reach: "10M+ users",    region: "Global"      },
  { name: "Kompoz",            emoji: "🎵", bg: "bg-blue-800",     tier: "pro",  reach: "Collab",        region: "Global"      },
  { name: "MyMusic",           emoji: "🎶", bg: "bg-blue-950",     tier: "pro",  reach: "3M+ users",     region: "Taiwan/Asia" },
  { name: "Naver Music",       emoji: "🎵", bg: "bg-lime-800",     tier: "pro",  reach: "5M+ users",     region: "Korea"       },
  { name: "Bugs",              emoji: "🐛", bg: "bg-green-700",    tier: "pro",  reach: "2M+ users",     region: "Korea"       },
  { name: "AZLyrics",          emoji: "📝", bg: "bg-gray-800",     tier: "pro",  reach: "30M+ users",    region: "Global"      },
];

const TIMELINE = [
  { day: "Day 1",   label: "Song Submitted",        icon: "⬆️", color: "text-white/60"    },
  { day: "Day 1-2", label: "Quality Review",         icon: "🔍", color: "text-amber-400"   },
  { day: "Day 2-3", label: "Sent to All Platforms",  icon: "📤", color: "text-blue-400"    },
  { day: "Day 3-5", label: "Platform Processing",    icon: "⚙️", color: "text-purple-400"  },
  { day: "Day 5-7", label: "Live Worldwide",          icon: "🟢", color: "text-emerald-400" },
];

const REGIONS = ["All","Global","India","China","Korea","Japan","SE Asia","US","Africa","MENA","Russia","LatAm","EU","Scandinavia","Australia","Taiwan/Asia"];

export default function Distribution({ user }) {
  const [songs,      setSongs]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [activeTab,  setActiveTab]  = useState("platforms");
  const [search,     setSearch]     = useState("");
  const [region,     setRegion]     = useState("All");
  const [tierFilter, setTierFilter] = useState("all");

  const isPro = user?.plan && user.plan !== "free";

  useEffect(() => {
    const token = localStorage.getItem("token");
    getSongs(token)
      .then(d => setSongs(Array.isArray(d) ? d : []))
      .catch(() => setSongs([]))
      .finally(() => setLoading(false));
  }, []);

  const userPlatforms = ALL_PLATFORMS.filter(p => isPro ? true : p.tier === "free");
  const filtered = ALL_PLATFORMS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchRegion = region === "All" || p.region === region;
    const matchTier   = tierFilter === "all" || p.tier === tierFilter;
    return matchSearch && matchRegion && matchTier;
  });

  const freePlatforms = ALL_PLATFORMS.filter(p => p.tier === "free");
  const liveSongs     = songs.filter(s => s.status === "live");
  const pendingSongs  = songs.filter(s => s.status === "pending");

  const gradients = [
    "from-emerald-500 to-teal-600","from-amber-400 to-orange-500",
    "from-violet-500 to-purple-700","from-blue-500 to-indigo-600",
    "from-pink-500 to-rose-600","from-zinc-500 to-zinc-700",
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Distribution</h1>
          <p className="text-white/40 text-sm mt-1">
            Your music reaches <span className="text-emerald-400 font-semibold">{userPlatforms.length}+ platforms</span> worldwide
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
          <span className="text-[12px] text-emerald-400 font-medium">{userPlatforms.length} platforms active</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Platforms",    value: userPlatforms.length+"+", icon: "🔗", color: "text-emerald-400" },
          { label: "Songs Live",   value: loading ? "—" : liveSongs.length,    icon: "🟢", color: "text-emerald-400" },
          { label: "Pending",      value: loading ? "—" : pendingSongs.length, icon: "⏳", color: "text-amber-400"   },
          { label: "Global Reach", value: "4B+",                               icon: "🌍", color: "text-blue-400"    },
        ].map((s,i) => (
          <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{s.icon}</span>
              <span className="text-[11px] text-white/30 uppercase tracking-wide">{s.label}</span>
            </div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {!isPro && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="text-2xl">⭐</div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-400">Upgrade to reach {ALL_PLATFORMS.length}+ platforms</p>
            <p className="text-[12px] text-white/35 mt-0.5">
              Free plan: {freePlatforms.length} platforms · Pro plan: all {ALL_PLATFORMS.length}+ platforms including TikTok, Instagram, Facebook and more
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl w-fit border border-white/[0.05]">
        {["platforms","songs","timeline"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
              activeTab === t ? "bg-white/10 text-white" : "text-white/35 hover:text-white/60"
            }`}>
            {t === "timeline" ? "⏱ Timeline" : t === "platforms" ? "🔗 Platforms" : "🎵 Songs"}
          </button>
        ))}
      </div>

      {activeTab === "platforms" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search platforms..."
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-all w-48"/>
            <select value={region} onChange={e => setRegion(e.target.value)}
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white/60 focus:outline-none focus:border-emerald-500/50 transition-all appearance-none">
              {REGIONS.map(r => <option key={r} value={r} className="bg-[#1a1a2e]">{r}</option>)}
            </select>
            {["all","free","pro"].map(t => (
              <button key={t} onClick={() => setTierFilter(t)}
                className={`px-3 py-2 rounded-xl text-[12px] font-medium capitalize transition-all border ${
                  tierFilter === t ? "bg-white/10 text-white border-white/20" : "text-white/35 border-white/[0.06] hover:text-white/60"
                }`}>{t === "all" ? "All" : t === "free" ? `Free (${freePlatforms.length})` : `Pro (${ALL_PLATFORMS.length - freePlatforms.length})`}</button>
            ))}
            <span className="text-[11px] text-white/25">{filtered.length} shown</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
            {filtered.map(p => {
              const accessible = isPro || p.tier === "free";
              return (
                <div key={p.name} className={`rounded-xl border p-3 transition-all ${
                  accessible ? "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10" : "border-white/[0.05] bg-white/[0.01] opacity-50"
                }`}>
                  <div className={`w-9 h-9 rounded-xl ${p.bg} flex items-center justify-center text-base mb-2 ${!accessible ? "opacity-40" : ""}`}>
                    {p.emoji}
                  </div>
                  <div className="text-[11px] font-medium text-white/80 leading-tight mb-0.5 truncate">{p.name}</div>
                  <div className="text-[9px] text-white/25 truncate mb-1">{p.region}</div>
                  {!accessible
                    ? <div className="text-[9px] px-1.5 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 font-bold w-fit">PRO</div>
                    : <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/><span className="text-[9px] text-emerald-400">Active</span></div>
                  }
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && <div className="text-center py-10 text-white/25 text-sm">No platforms found</div>}
        </div>
      )}

      {activeTab === "songs" && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Song Distribution Status</h2>
            <span className="text-[12px] text-white/30">{songs.length} total</span>
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
            <div className="py-12 text-center"><div className="text-4xl mb-3">🎵</div><p className="text-white/30 text-sm">No songs uploaded yet.</p></div>
          ) : (
            <div className="divide-y divide-white/[0.03]">
              {songs.map((song, idx) => (
                <div key={song._id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02]">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradients[idx % 6]} flex-shrink-0 flex items-center justify-center overflow-hidden`}>
                    {song.coverUrl
                      ? <img src={song.coverUrl} alt="" className="w-full h-full object-cover"/>
                      : <svg width="12" height="12" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.8"><path d="M2 10V5L10 3V8"/><circle cx="2" cy="10" r="1.2"/><circle cx="10" cy="8" r="1.2"/></svg>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{song.title}</div>
                    <div className="text-[12px] text-white/30">{song.genre || "—"}</div>
                  </div>
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full flex-shrink-0 flex items-center gap-1.5 ${
                    song.status === "live"    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" :
                    song.status === "pending" ? "bg-amber-500/15  text-amber-400  border border-amber-500/25" :
                                                "bg-white/5        text-white/30   border border-white/10"
                  }`}>
                    {song.status === "live" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>}
                    {song.status}
                  </span>
                  <div className="hidden sm:block text-right">
                    <div className="text-[11px] text-white/40 font-medium">
                      {song.status === "live" ? `${userPlatforms.length}+ platforms` : "Not yet distributed"}
                    </div>
                    <div className="text-[10px] text-white/20">{song.status === "live" ? "Global reach" : "Pending review"}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "timeline" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <h2 className="text-sm font-semibold text-white mb-1">Distribution Timeline</h2>
            <p className="text-white/30 text-[12px] mb-6">How long it takes for your song to go live after submission</p>
            <div className="space-y-0">
              {TIMELINE.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-base flex-shrink-0">{step.icon}</div>
                    {i < TIMELINE.length - 1 && <div className="w-px flex-1 bg-white/[0.06] my-1" style={{ minHeight: 28 }}/>}
                  </div>
                  <div className="pb-6">
                    <div className={`text-sm font-semibold ${step.color}`}>{step.label}</div>
                    <div className="text-[11px] text-white/25 mt-0.5">{step.day}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <h3 className="text-sm font-semibold text-blue-400 mb-3">💡 Tips for faster distribution</h3>
            <ul className="space-y-2">
              {[
                "Submit songs at least 7 days before your release date",
                "Cover art must be 3000×3000px JPG/PNG, no text on borders",
                "Use proper song titles — no ALL CAPS or excessive punctuation",
                "Add ISRC codes for better royalty tracking",
                "Fill in all metadata (genre, language, release date) before submitting",
                "Premium users get priority processing — goes live faster",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[13px] text-white/50">
                  <svg width="14" height="14" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0 mt-0.5"><polyline points="2,7 5,10 12,3"/></svg>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
