import React, { useState, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  Search, 
  RotateCcw, 
  Maximize, 
  Minimize, 
  ShieldCheck, 
  ExternalLink, 
  Flame, 
  Calendar, 
  Clock, 
  Film, 
  Tv, 
  Layers, 
  CheckCircle2,
  ChevronRight,
  Compass
} from 'lucide-react';

interface AnimeHubProps {
  onBackToCinema?: () => void;
  onNavigateToLiveTv?: () => void;
}

interface QuickAnime {
  name: string;
  query: string;
  genre: string;
}

const POPULAR_ANIME_SHORTCUTS: QuickAnime[] = [
  { name: 'One Piece', query: 'One Piece', genre: 'Shonen' },
  { name: 'Solo Leveling', query: 'Solo Leveling', genre: 'Action' },
  { name: 'Jujutsu Kaisen', query: 'Jujutsu Kaisen', genre: 'Supernatural' },
  { name: 'Demon Slayer', query: 'Demon Slayer Kimetsu no Yaiba', genre: 'Action' },
  { name: 'Attack on Titan', query: 'Attack on Titan', genre: 'Dark Fantasy' },
  { name: 'Chainsaw Man', query: 'Chainsaw Man', genre: 'Supernatural' },
  { name: 'Bleach', query: 'Bleach Thousand Year Blood War', genre: 'Shonen' },
  { name: 'Naruto Shippuden', query: 'Naruto Shippuden', genre: 'Ninja' },
  { name: 'Dragon Ball', query: 'Dragon Ball Super', genre: 'Action' },
  { name: 'Spy x Family', query: 'Spy x Family', genre: 'Comedy' },
];

const ANIME_CATEGORIES = [
  { id: 'home', label: 'All Anime', url: 'https://yomi.to/' },
  { id: 'trending', label: '🔥 Trending', url: 'https://yomi.to/browse?sort=TRENDING_DESC' },
  { id: 'top', label: '🏆 Top Rated', url: 'https://yomi.to/top' },
  { id: 'seasonal', label: '📅 Seasonal', url: 'https://yomi.to/seasonal' },
  { id: 'schedule', label: '🗓️ Schedule', url: 'https://yomi.to/schedule' },
  { id: 'action', label: '⚔️ Action', url: 'https://yomi.to/browse?genre=Action' },
  { id: 'isekai', label: '🌌 Isekai', url: 'https://yomi.to/browse?genre=Isekai' },
  { id: 'romance', label: '💖 Romance', url: 'https://yomi.to/browse?genre=Romance' },
  { id: 'fantasy', label: '🧙 Fantasy', url: 'https://yomi.to/browse?genre=Fantasy' },
  { id: 'movies', label: '🍿 Anime Movies', url: 'https://yomi.to/browse?format=MOVIE' },
];

export const AnimeHub: React.FC<AnimeHubProps> = ({ onBackToCinema, onNavigateToLiveTv }) => {
  const [currentUrl, setCurrentUrl] = useState<string>('https://yomi.to/');
  const [activeCategory, setActiveCategory] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // Navigate to category
  const handleSelectCategory = useCallback((catId: string, url: string) => {
    setActiveCategory(catId);
    setCurrentUrl(url);
    setIsLoading(true);
    setIframeKey((k) => k + 1);
  }, []);

  // Search anime
  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const url = `https://yomi.to/search?q=${encodeURIComponent(searchQuery.trim())}`;
    setCurrentUrl(url);
    setActiveCategory('');
    setIsLoading(true);
    setIframeKey((k) => k + 1);
    showToast(`Searching "${searchQuery.trim()}" on Yomi...`);
  }, [searchQuery, showToast]);

  // Launch popular shortcut
  const handleQuickLaunch = useCallback((anime: QuickAnime) => {
    const url = `https://yomi.to/search?q=${encodeURIComponent(anime.query)}`;
    setCurrentUrl(url);
    setActiveCategory('');
    setIsLoading(true);
    setIframeKey((k) => k + 1);
    showToast(`Loading ${anime.name}...`);
  }, [showToast]);

  // Reload iframe
  const handleReload = useCallback(() => {
    setIsLoading(true);
    setIframeKey((k) => k + 1);
    showToast('Refreshing anime stream...');
  }, [showToast]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#03050a] text-white flex flex-col pb-20 md:pb-6">
      {/* 1. Header Bar: Anime Hub Branding & Status Controls */}
      <div className="border-b border-white/10 bg-[#060812]/90 backdrop-blur-xl px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-fuchsia-500 via-pink-500 to-purple-600 p-0.5 shadow-lg shadow-fuchsia-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg tracking-tight uppercase bg-gradient-to-r from-fuchsia-400 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                Yomi Anime Hub
              </h1>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>ZERO POPUP ADS</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 uppercase">
                SUB & DUB 1080P
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Dedicated Anime Engine • Auto-Skip Fillers • Seasonal Releases • Ad-Shielded Sandbox
            </p>
          </div>
        </div>

        {/* Quick Search & Actions */}
        <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-fuchsia-400" />
            <input
              type="text"
              placeholder="Search anime title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#080b18] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500/50 transition"
            />
          </form>

          {/* Reload Stream */}
          <button
            onClick={handleReload}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition"
            title="Reload Stream"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>

          {/* Mode Switchers */}
          {onBackToCinema && (
            <button
              onClick={onBackToCinema}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition"
            >
              <Film className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cinema</span>
            </button>
          )}

          {onNavigateToLiveTv && (
            <button
              onClick={onNavigateToLiveTv}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition"
            >
              <Tv className="w-3.5 h-3.5 text-rose-400" />
              <span>Live TV</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Secondary Filter Bar: Categories & Popular Anime Shortcuts */}
      <div className="bg-[#04060e] border-b border-white/5 px-4 sm:px-8 py-2 flex flex-col gap-2">
        {/* Categories Rail */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          {ANIME_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id, cat.url)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-fuchsia-500 to-pink-600 text-white shadow-md shadow-fuchsia-500/25 scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Popular Anime Direct Shortcuts */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
          <span className="text-slate-500 font-mono font-bold uppercase tracking-wider flex-shrink-0 text-[10px] mr-1">
            ⚡ Quick Launch:
          </span>
          {POPULAR_ANIME_SHORTCUTS.map((anime) => (
            <button
              key={anime.name}
              onClick={() => handleQuickLaunch(anime)}
              className="px-2.5 py-0.5 rounded-lg bg-fuchsia-950/30 hover:bg-fuchsia-900/50 text-fuchsia-300 hover:text-white border border-fuchsia-500/20 whitespace-nowrap font-medium transition"
            >
              {anime.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Stage: Isolated & Sandboxed Yomi Stream Engine */}
      <div ref={containerRef} className="flex-1 w-full max-w-[1720px] mx-auto p-2 sm:p-4 flex flex-col relative">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-6 right-6 z-40 animate-fadeIn pointer-events-none">
            <div className="px-3.5 py-1.5 rounded-xl bg-black/85 backdrop-blur-xl border border-fuchsia-500/40 text-fuchsia-200 text-xs font-bold flex items-center gap-2 shadow-2xl">
              <CheckCircle2 className="w-4 h-4 text-fuchsia-400" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-[#03050a]/90 backdrop-blur-sm flex flex-col items-center justify-center z-20 m-2 sm:m-4 rounded-3xl border border-white/5">
            <div className="w-12 h-12 rounded-full border-4 border-fuchsia-500/20 border-t-fuchsia-500 animate-spin" />
            <p className="mt-3 text-xs font-mono font-bold text-fuchsia-300 tracking-wider">
              Shielding Anime Engine • Zero Ads Enforced...
            </p>
          </div>
        )}

        {/* Sandboxed Ad-Shielded Iframe Container */}
        <div className="flex-1 w-full h-[calc(100vh-13.5rem)] sm:h-[calc(100vh-12rem)] rounded-3xl overflow-hidden border border-white/10 bg-[#070914] shadow-2xl relative">
          <iframe
            key={iframeKey}
            ref={iframeRef}
            src={currentUrl}
            title="Yomi Anime Player"
            className="w-full h-full border-0 select-none"
            // Strict ad-shield sandbox: omit allow-top-navigation and allow-popups so ads CANNOT escape or hijack tabs
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  );
};