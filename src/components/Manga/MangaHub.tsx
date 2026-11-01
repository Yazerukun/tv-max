import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  RotateCcw, 
  Film, 
  Tv, 
  Sparkles, 
  Home, 
  X, 
  Expand, 
  Shrink, 
  CheckCircle2,
  Compass
} from 'lucide-react';

interface MangaHubProps {
  onBackToCinema?: () => void;
  onNavigateToSeries?: () => void;
  onNavigateToLiveTv?: () => void;
  onNavigateToAnime?: () => void;
}

const MANGA_SHORTCUTS = [
  { label: '🇰🇷 Manhwa', url: 'https://mangafire.to/filter?type[]=manhwa' },
  { label: '🇯🇵 Manga', url: 'https://mangafire.to/filter?type[]=manga' },
  { label: '🇨🇳 Manhua', url: 'https://mangafire.to/filter?type[]=manhua' },
  { label: '🔥 Most Viewed', url: 'https://mangafire.to/filter?sort=most_viewed' },
  { label: '🏆 Top Rated', url: 'https://mangafire.to/filter?sort=scores' },
  { label: '🕒 Latest', url: 'https://mangafire.to/filter?sort=recently_updated' },
  { label: 'Solo Leveling', url: 'https://mangafire.to/filter?keyword=Solo+Leveling' },
  { label: 'Omniscient Reader', url: 'https://mangafire.to/filter?keyword=Omniscient+Reader' },
  { label: 'Tower of God', url: 'https://mangafire.to/filter?keyword=Tower+of+God' },
  { label: 'One Piece', url: 'https://mangafire.to/filter?keyword=One+Piece' },
  { label: 'Lookism', url: 'https://mangafire.to/filter?keyword=Lookism' },
  { label: 'Berserk', url: 'https://mangafire.to/filter?keyword=Berserk' },
];

export const MangaHub: React.FC<MangaHubProps> = ({
  onBackToCinema,
  onNavigateToSeries,
  onNavigateToLiveTv,
  onNavigateToAnime,
}) => {
  const [currentUrl, setCurrentUrl] = useState<string>('https://mangafire.to/');
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

  // Top-level navigation redirect guard
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
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

  // Search Manga / Manhwa
  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const url = `https://mangafire.to/filter?keyword=${encodeURIComponent(searchQuery.trim())}`;
    handleNavigate(url, `"${searchQuery.trim()}"`);
  }, [searchQuery, handleNavigate]);

  // Reload iframe
  const handleReload = useCallback(() => {
    setIsLoading(true);
    setIframeKey((k) => k + 1);
    showToast('Reloading MangaFire reader...');
  }, [showToast]);

  // Reset to Home
  const handleGoHome = useCallback(() => {
    handleNavigate('https://mangafire.to/', 'MangaFire Home');
  }, [handleNavigate]);

  return (
    <div className={`w-full bg-[#03050a] flex flex-col ${
      isFullView 
        ? 'fixed inset-0 z-50 w-screen h-screen' 
        : 'h-[calc(100vh-4rem-3.5rem)] md:h-[calc(100vh-4rem)]'
    }`}>
      {/* 1. Sleek Compact Control Strip (42px height for 100% viewport reader) */}
      <div className="h-11 bg-[#060812] border-b border-white/10 px-3 sm:px-6 flex items-center justify-between gap-2.5 z-30 select-none flex-shrink-0">
        
        {/* Left: Hub Switchers & Branding */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {onBackToCinema && (
            <button
              onClick={onBackToCinema}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition"
              title="Movies Hub"
            >
              <Film className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Movies</span>
            </button>
          )}

          {onNavigateToSeries && (
            <button
              onClick={onNavigateToSeries}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition"
              title="Series Hub"
            >
              <Compass className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Series</span>
            </button>
          )}

          {onNavigateToLiveTv && (
            <button
              onClick={onNavigateToLiveTv}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition"
              title="Free Live TV"
            >
              <Tv className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Live TV</span>
            </button>
          )}

          {onNavigateToAnime && (
            <button
              onClick={onNavigateToAnime}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition"
              title="Anime Hub"
            >
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
              <span className="hidden sm:inline">Anime</span>
            </button>
          )}

          <div className="h-4 w-px bg-white/10 mx-0.5 hidden xs:block" />

          {/* MangaFire Brand Pill */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-black text-emerald-200 tracking-tight">
              MANGA & MANHWA
            </span>
          </div>
        </div>

        {/* Center: Search & Quick Shortcuts */}
        <div className="flex items-center gap-2 flex-1 max-w-2xl min-w-0 mx-2">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-40 sm:w-56 flex-shrink-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-400" />
            <input
              type="text"
              placeholder="Search manga / manhwa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 rounded-lg bg-[#0a0d1f] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </form>

          {/* Quick Scrollable Shortcut Chips */}
          <div className="hidden md:flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px] min-w-0">
            {MANGA_SHORTCUTS.slice(0, 6).map((item) => (
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
            title="MangaFire Home"
          >
            <Home className="w-3.5 h-3.5" />
          </button>

          {/* Reload */}
          <button
            onClick={handleReload}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition"
            title="Reload Reader"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Full View Toggle (Edge-to-Edge Pure Reading Mode) */}
          <button
            onClick={() => setIsFullView((prev) => !prev)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              isFullView
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white'
            }`}
            title={isFullView ? 'Exit Full Screen Reading Mode' : 'Full Screen Edge-to-Edge Reading Mode'}
          >
            {isFullView ? (
              <>
                <Shrink className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">Exit Full</span>
              </>
            ) : (
              <>
                <Expand className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Full View</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Main Reader Stage: 100% Full Viewport Unsandboxed MangaFire Engine */}
      <div className="flex-1 w-full h-full relative bg-[#04060c] overflow-hidden">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 right-4 z-40 animate-fadeIn pointer-events-none">
            <div className="px-3.5 py-1.5 rounded-xl bg-black/90 backdrop-blur-xl border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-2xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-[#04060c]/80 backdrop-blur-xs flex flex-col items-center justify-center z-20 pointer-events-none">
            <div className="w-10 h-10 rounded-full border-3 border-emerald-500/20 border-t-emerald-500 animate-spin" />
            <p className="mt-2 text-xs font-mono font-bold text-emerald-300 tracking-wider">
              Loading MangaFire Reader...
            </p>
          </div>
        )}

        {/* Floating Mini HUD in Full View Mode */}
        {isFullView && (
          <div className="absolute top-3 right-4 z-40 flex items-center gap-1.5 bg-black/85 backdrop-blur-xl border border-white/15 px-2.5 py-1.5 rounded-2xl shadow-2xl opacity-70 hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsFullView(false)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition"
              title="Exit Full View (or press Esc)"
            >
              <X className="w-3.5 h-3.5" />
              <span>Exit Full View</span>
            </button>

            {onBackToCinema && (
              <button
                onClick={onBackToCinema}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
                title="Movies"
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

            {onNavigateToAnime && (
              <button
                onClick={onNavigateToAnime}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
                title="Anime"
              >
                <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
              </button>
            )}

            <button
              onClick={handleReload}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
              title="Reload Reader"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 100% Full Viewport Unsandboxed MangaFire Iframe */}
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={currentUrl}
          title="MangaFire Manhwa & Manga Reader"
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
