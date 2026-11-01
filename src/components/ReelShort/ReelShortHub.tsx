import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Clapperboard, 
  RotateCcw, 
  Film, 
  Tv, 
  Sparkles, 
  BookOpen, 
  Compass, 
  Home, 
  X, 
  Expand, 
  Shrink, 
  CheckCircle2,
  Flame,
  Zap,
  Play
} from 'lucide-react';

interface ReelShortHubProps {
  onBackToCinema?: () => void;
  onNavigateToSeries?: () => void;
  onNavigateToLiveTv?: () => void;
  onNavigateToAnime?: () => void;
  onNavigateToManga?: () => void;
}

const REEL_SHELVES = [
  { label: '🔥 Top Dramas', url: 'https://www.reelshort.com/shelf/top-short-movies-dramas-51003506' },
  { label: '🆕 New Releases', url: 'https://www.reelshort.com/shelf/new-release-short-movies-dramas-51003505' },
  { label: '👑 Reel Originals', url: 'https://www.reelshort.com/shelf/reel-original-short-movies-dramas-51003507' },
  { label: '🐺 Alpha Werewolf', url: 'https://www.reelshort.com/shelf/second-chance-short-movies-dramas-51003510' },
  { label: '💼 Billionaires', url: 'https://www.reelshort.com/shelf/pregnancy-babies-short-movies-dramas-51003511' },
  { label: '🎭 Hidden Identity', url: 'https://www.reelshort.com/shelf/hidden-identity-short-movies-dramas-51003508' },
  { label: '💘 Love At First Sight', url: 'https://www.reelshort.com/shelf/love-at-first-sight-short-movies-dramas-51003509' },
  { label: '🏫 Young Love', url: 'https://www.reelshort.com/shelf/young-love-short-movies-dramas-51003513' },
];

const POPULAR_SERIES = [
  { 
    title: 'Just One Kiss', 
    url: 'https://www.reelshort.com/episodes/episode-1-just-one-kiss-6a8752ac7c23cb02b40f062b-md4uq8gmvu?play_time=1' 
  },
  { 
    title: 'Cinderella for Wolf King', 
    url: 'https://www.reelshort.com/episodes/episode-1-a-cinderella-for-wolf-king-6a826e8e44e10020b10b8cae-30wesxl097?playTime=1' 
  },
  { 
    title: 'Billionaire Marriage Deal', 
    url: 'https://www.reelshort.com/episodes/episode-1-a-marriage-deal-with-the-billionaire-6a544e264e8edf02280ca29d-ueq0klimhs?playTime=1' 
  },
  { 
    title: 'Chained by Hades', 
    url: 'https://www.reelshort.com/episodes/episode-1-chained-by-hades-the-underworld-king-6a390a35f7ae1d26f00331c5-h10iienf8b?playTime=1' 
  },
  { 
    title: 'Luna Reborn', 
    url: 'https://www.reelshort.com/episodes/episode-1-luna-reborn-alpha-s-second-chance-69eed7874eaee13cfb03b52d-p8ere6c897?playTime=1' 
  },
  { 
    title: 'Firefighter I Slapped', 
    url: 'https://www.reelshort.com/episodes/episode-1-married-to-the-firefighter-i-slapped-6ad86e4d13d25fda6e09292e-7myqrrdkkq?playTime=1' 
  },
];

export const ReelShortHub: React.FC<ReelShortHubProps> = ({
  onBackToCinema,
  onNavigateToSeries,
  onNavigateToLiveTv,
  onNavigateToAnime,
  onNavigateToManga,
}) => {
  const [currentUrl, setCurrentUrl] = useState<string>('https://www.reelshort.com/');
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

  // Reload iframe
  const handleReload = useCallback(() => {
    setIsLoading(true);
    setIframeKey((k) => k + 1);
    showToast('Reloading ReelShort dramas...');
  }, [showToast]);

  // Reset to Home
  const handleGoHome = useCallback(() => {
    handleNavigate('https://www.reelshort.com/', 'ReelShort Home');
  }, [handleNavigate]);

  return (
    <div className={`w-full bg-[#03050a] flex flex-col ${
      isFullView 
        ? 'fixed inset-0 z-50 w-screen h-screen' 
        : 'h-[calc(100vh-4rem-3.5rem)] md:h-[calc(100vh-4rem)]'
    }`}>
      {/* 1. Sleek Compact Control Strip (42px height for 100% viewport viewing) */}
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
              title="Live TV"
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

          {/* ReelShort Brand Pill */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-xl bg-amber-500/15 border border-amber-500/30">
            <Clapperboard className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-black text-amber-200 tracking-tight">
              REELSHORT DRAMAS
            </span>
          </div>
        </div>

        {/* Center: Quick Shelf Chips & Popular Series */}
        <div className="flex items-center gap-2 flex-1 max-w-2xl min-w-0 mx-2">
          {/* Quick Shelf Chips */}
          <div className="hidden md:flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px] min-w-0">
            {REEL_SHELVES.map((shelf) => (
              <button
                key={shelf.label}
                onClick={() => handleNavigate(shelf.url, shelf.label)}
                className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 whitespace-nowrap text-[11px] font-medium transition"
              >
                {shelf.label}
              </button>
            ))}
          </div>

          {/* Quick Popular Mini-Series Shortcuts */}
          <div className="hidden lg:flex items-center gap-1 overflow-x-auto scrollbar-none text-[10px] min-w-0">
            {POPULAR_SERIES.slice(0, 3).map((item) => (
              <button
                key={item.title}
                onClick={() => handleNavigate(item.url, item.title)}
                className="px-2 py-0.5 rounded-lg bg-amber-950/30 hover:bg-amber-900/50 text-amber-300 hover:text-white border border-amber-500/20 whitespace-nowrap font-medium transition"
              >
                <Play className="w-2.5 h-2.5 inline mr-1 fill-amber-400" />
                {item.title}
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
            title="ReelShort Home"
          >
            <Home className="w-3.5 h-3.5" />
          </button>

          {/* Reload */}
          <button
            onClick={handleReload}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition"
            title="Reload ReelShort"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Full View Toggle (Edge-to-Edge Pure Reading/Watching Mode) */}
          <button
            onClick={() => setIsFullView((prev) => !prev)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              isFullView
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                : 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white'
            }`}
            title={isFullView ? 'Exit Full Screen' : 'Full Screen Edge-to-Edge Mode'}
          >
            {isFullView ? (
              <>
                <Shrink className="w-3.5 h-3.5 text-black" />
                <span className="hidden sm:inline">Exit Full</span>
              </>
            ) : (
              <>
                <Expand className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Full View</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Main Video Stage: 100% Full Viewport Unsandboxed ReelShort Engine */}
      <div className="flex-1 w-full h-full relative bg-[#04060c] overflow-hidden">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 right-4 z-40 animate-fadeIn pointer-events-none">
            <div className="px-3.5 py-1.5 rounded-xl bg-black/90 backdrop-blur-xl border border-amber-500/40 text-amber-200 text-xs font-bold flex items-center gap-2 shadow-2xl">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-[#04060c]/80 backdrop-blur-xs flex flex-col items-center justify-center z-20 pointer-events-none">
            <div className="w-10 h-10 rounded-full border-3 border-amber-500/20 border-t-amber-500 animate-spin" />
            <p className="mt-2 text-xs font-mono font-bold text-amber-300 tracking-wider">
              Connecting ReelShort Drama Engine...
            </p>
          </div>
        )}

        {/* Floating Mini HUD in Full View Mode */}
        {isFullView && (
          <div className="absolute top-3 right-4 z-40 flex items-center gap-1.5 bg-black/85 backdrop-blur-xl border border-white/15 px-2.5 py-1.5 rounded-2xl shadow-2xl opacity-70 hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsFullView(false)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow transition"
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

            {onNavigateToManga && (
              <button
                onClick={onNavigateToManga}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
                title="Manga"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            )}

            <button
              onClick={handleReload}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
              title="Reload Dramas"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 100% Full Viewport Unsandboxed ReelShort Iframe (No Sandbox = Instant Streaming) */}
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={currentUrl}
          title="ReelShort Dramas & Short Series"
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
