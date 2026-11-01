import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  RotateCcw, 
  Maximize, 
  Minimize, 
  Film, 
  Tv, 
  Home, 
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Expand,
  Shrink,
  BookOpen
} from 'lucide-react';

interface AnimeHubProps {
  onBackToCinema?: () => void;
  onNavigateToLiveTv?: () => void;
  onNavigateToManga?: () => void;
}

const QUICK_SHORTCUTS = [
  { label: '🔥 Trending', url: 'https://yomi.to/browse?sort=TRENDING_DESC' },
  { label: '🏆 Top Rated', url: 'https://yomi.to/top' },
  { label: '📅 Seasonal', url: 'https://yomi.to/seasonal' },
  { label: '🗓️ Schedule', url: 'https://yomi.to/schedule' },
  { label: 'One Piece', url: 'https://yomi.to/search?q=One+Piece' },
  { label: 'Solo Leveling', url: 'https://yomi.to/search?q=Solo+Leveling' },
  { label: 'Jujutsu Kaisen', url: 'https://yomi.to/search?q=Jujutsu+Kaisen' },
  { label: 'Demon Slayer', url: 'https://yomi.to/search?q=Demon+Slayer' },
  { label: 'Bleach', url: 'https://yomi.to/search?q=Bleach' },
  { label: 'Attack on Titan', url: 'https://yomi.to/search?q=Attack+on+Titan' },
];

export const AnimeHub: React.FC<AnimeHubProps> = ({ 
  onBackToCinema, 
  onNavigateToLiveTv,
  onNavigateToManga
}) => {
  const [currentUrl, setCurrentUrl] = useState<string>('https://yomi.to/');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [isFullView, setIsFullView] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  }, []);

  // Top-level navigation redirect guard (prevents ad networks from redirecting parent TV MAX page)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // If a script tries to navigate parent page, show browser confirmation prompt
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Keyboard shortcut: Escape exits Full View mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullView) {
        setIsFullView(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullView]);

  // Navigate to URL
  const handleNavigate = useCallback((url: string, label?: string) => {
    setCurrentUrl(url);
    setIsLoading(true);
    setIframeKey((k) => k + 1);
    if (label) showToast(`Loading ${label}...`);
  }, [showToast]);

  // Search anime
  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const url = `https://yomi.to/search?q=${encodeURIComponent(searchQuery.trim())}`;
    handleNavigate(url, `"${searchQuery.trim()}"`);
  }, [searchQuery, handleNavigate]);

  // Reload iframe
  const handleReload = useCallback(() => {
    setIsLoading(true);
    setIframeKey((k) => k + 1);
    showToast('Reloading Yomi stream...');
  }, [showToast]);

  // Reset to Home
  const handleGoHome = useCallback(() => {
    handleNavigate('https://yomi.to/', 'Yomi Home');
  }, [handleNavigate]);

  return (
    <div className={`w-full bg-[#03050a] flex flex-col ${
      isFullView 
        ? 'fixed inset-0 z-50 w-screen h-screen' 
        : 'h-[calc(100vh-4rem-3.5rem)] md:h-[calc(100vh-4rem)]'
    }`}>
      {/* 1. Sleek Compact Control Strip (Only 42px height so yomi.to gets 100% of the screen) */}
      <div className="h-11 bg-[#060812] border-b border-white/10 px-3 sm:px-6 flex items-center justify-between gap-2.5 z-30 select-none flex-shrink-0">
        
        {/* Left: Hub Switchers & Branding */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {onBackToCinema && (
            <button
              onClick={onBackToCinema}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition"
              title="Back to Cinema Movies"
            >
              <Film className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Cinema</span>
            </button>
          )}

          {onNavigateToLiveTv && (
            <button
              onClick={onNavigateToLiveTv}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition"
              title="Watch Free Live TV"
            >
              <Tv className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Live TV</span>
            </button>
          )}

          {onNavigateToManga && (
            <button
              onClick={onNavigateToManga}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition"
              title="Manga & Manhwa Reader"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Manga</span>
            </button>
          )}

          <div className="h-4 w-px bg-white/10 mx-0.5 hidden xs:block" />

          {/* Yomi Brand Pill */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-xl bg-fuchsia-500/15 border border-fuchsia-500/30">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
            <span className="text-xs font-black text-fuchsia-200 tracking-tight">
              YOMI ANIME
            </span>
          </div>
        </div>

        {/* Center: Search & Quick Shortcuts */}
        <div className="flex items-center gap-2 flex-1 max-w-2xl min-w-0 mx-2">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-40 sm:w-56 flex-shrink-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-fuchsia-400" />
            <input
              type="text"
              placeholder="Search anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 rounded-lg bg-[#0a0d1f] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-fuchsia-500/50"
            />
          </form>

          {/* Quick Scrollable Shortcut Chips */}
          <div className="hidden md:flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px] min-w-0">
            {QUICK_SHORTCUTS.slice(0, 6).map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigate(item.url, item.label)}
                className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 whitespace-nowrap text-[11px] font-medium transition"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Home */}
          <button
            onClick={handleGoHome}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition"
            title="Go to Yomi Home"
          >
            <Home className="w-3.5 h-3.5" />
          </button>

          {/* Reload */}
          <button
            onClick={handleReload}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition"
            title="Reload Stream"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Full View Toggle (Edge-to-Edge Pure View) */}
          <button
            onClick={() => setIsFullView((prev) => !prev)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              isFullView
                ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/30'
                : 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white'
            }`}
            title={isFullView ? 'Exit Edge-to-Edge View' : 'Full Screen Edge-to-Edge (100% Pure Yomi View)'}
          >
            {isFullView ? (
              <>
                <Shrink className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">Exit Full</span>
              </>
            ) : (
              <>
                <Expand className="w-3.5 h-3.5 text-fuchsia-400" />
                <span className="hidden sm:inline">Full View</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Main Stage: 100% Full Viewport Unsandboxed Yomi Stream Engine */}
      <div className="flex-1 w-full h-full relative bg-[#04060c] overflow-hidden">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 right-4 z-40 animate-fadeIn pointer-events-none">
            <div className="px-3.5 py-1.5 rounded-xl bg-black/90 backdrop-blur-xl border border-fuchsia-500/40 text-fuchsia-200 text-xs font-bold flex items-center gap-2 shadow-2xl">
              <CheckCircle2 className="w-4 h-4 text-fuchsia-400" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-[#04060c]/80 backdrop-blur-xs flex flex-col items-center justify-center z-20 pointer-events-none">
            <div className="w-10 h-10 rounded-full border-3 border-fuchsia-500/20 border-t-fuchsia-500 animate-spin" />
            <p className="mt-2 text-xs font-mono font-bold text-fuchsia-300 tracking-wider">
              Connecting Yomi Anime Engine...
            </p>
          </div>
        )}

        {/* Floating Mini HUD in Full View Mode */}
        {isFullView && (
          <div className="absolute top-3 right-4 z-40 flex items-center gap-1.5 bg-black/85 backdrop-blur-xl border border-white/15 px-2.5 py-1.5 rounded-2xl shadow-2xl opacity-70 hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsFullView(false)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold shadow transition"
              title="Exit Full View (or press Esc)"
            >
              <X className="w-3.5 h-3.5" />
              <span>Exit Full View</span>
            </button>

            {onBackToCinema && (
              <button
                onClick={onBackToCinema}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
                title="Cinema Movies"
              >
                <Film className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            )}

            {onNavigateToLiveTv && (
              <button
                onClick={onNavigateToLiveTv}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
                title="Live TV"
              >
                <Tv className="w-3.5 h-3.5 text-rose-400" />
              </button>
            )}

            {onNavigateToManga && (
              <button
                onClick={onNavigateToManga}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
                title="Manga & Manhwa"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            )}

            <button
              onClick={handleReload}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
              title="Reload Stream"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 100% Full Viewport Unsandboxed Iframe (No Sandbox = No Player Crash) */}
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={currentUrl}
          title="Yomi Anime"
          className="w-full h-full border-0 select-none block bg-[#04060c]"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          referrerPolicy="no-referrer-when-downgrade"
          loading="eager"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
};
