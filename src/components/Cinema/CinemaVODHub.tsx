import React, { useState, useMemo, useEffect } from 'react';
import { 
  Play, 
  Star, 
  Sparkles, 
  Film, 
  Heart, 
  ChevronRight,
  ChevronLeft,
  Flame, 
  Search, 
  Tv, 
  Layers, 
  Zap, 
  Bookmark, 
  Check,
  Rows,
  LayoutGrid,
  Radio,
  Loader2,
  Skull,
  Compass,
  X,
  RotateCcw
} from 'lucide-react';
import { CINEMA_MOVIES, CinemaMovie, Episode } from '../../data/cinemaMovies';
import { MovieDetailModal } from './MovieDetailModal';
import { 
  getStoredWatchlist, 
  toggleStoredWatchlist, 
  getStoredWatchProgress, 
  removeWatchProgress, 
  WatchProgress 
} from '../../utils/storage';
import { 
  fetchMultiCategoryCatalogs, 
  MultiCategoryCatalogs, 
  searchRealtimeMovies, 
  fetchRealtimeCatalog 
} from '../../services/nuvioService';

interface CinemaVODHubProps {
  onPlayMovie: (movie: CinemaMovie, episode?: Episode) => void;
  onNavigateToTv: () => void;
  onNavigateToAnime?: () => void;
  onOpenAIOStreams?: () => void;
}

export const CinemaVODHub: React.FC<CinemaVODHubProps> = ({
  onPlayMovie,
  onNavigateToTv,
  onNavigateToAnime,
  onOpenAIOStreams,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalMovie, setActiveModalMovie] = useState<CinemaMovie | null>(null);
  const [viewMode, setViewMode] = useState<'rails' | 'grid'>('rails');
  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => getStoredWatchlist());
  const [watchProgressList, setWatchProgressList] = useState<WatchProgress[]>(() => getStoredWatchProgress());

  // Keep watch progress synced on focus
  useEffect(() => {
    const refresh = () => setWatchProgressList(getStoredWatchProgress());
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, []);

  const handleRemoveProgress = (e: React.MouseEvent, movieId: string) => {
    e.stopPropagation();
    const updated = removeWatchProgress(movieId);
    setWatchProgressList(updated);
  };

  // Realtime Live Data State from Nuvio Cinemeta API (Multi-Category Engine)
  const [multiCatalogs, setMultiCatalogs] = useState<MultiCategoryCatalogs | null>(null);
  const [extraMovies, setExtraMovies] = useState<CinemaMovie[]>([]);
  const [skipCount, setSkipCount] = useState<number>(100);
  const [isLiveLoading, setIsLiveLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [liveSearchMatches, setLiveSearchMatches] = useState<CinemaMovie[]>([]);
  const [isSearchingLive, setIsSearchingLive] = useState<boolean>(false);

  // 1. Fetch Realtime Live Multi-Category Catalogs on Mount (Cinemeta API: 350+ to 450+ titles)
  useEffect(() => {
    let isMounted = true;
    const fetchLive = async () => {
      try {
        setIsLiveLoading(true);
        const data = await fetchMultiCategoryCatalogs();
        if (isMounted) {
          setMultiCatalogs(data);
        }
      } catch (err) {
        console.warn('Realtime multi-catalog fetch error:', err);
      } finally {
        if (isMounted) setIsLiveLoading(false);
      }
    };

    fetchLive();
    return () => { isMounted = false; };
  }, []);

  // 2. Realtime Live Global Search with Debounce (350ms)
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setLiveSearchMatches([]);
      setIsSearchingLive(false);
      return;
    }

    setIsSearchingLive(true);
    const debounceTimer = setTimeout(async () => {
      try {
        const results = await searchRealtimeMovies(searchQuery);
        setLiveSearchMatches(results);
      } catch (err) {
        console.warn('Realtime search error:', err);
      } finally {
        setIsSearchingLive(false);
      }
    }, 350);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Combined master catalog: Curated movies + Multi-category Cinemeta movies & series + Paginated Extras + Search matches (deduplicated)
  const allCatalogMovies = useMemo(() => {
    const map = new Map<string, CinemaMovie>();
    CINEMA_MOVIES.forEach(m => map.set(m.id, m));
    if (multiCatalogs) {
      multiCatalogs.allMovies.forEach(m => {
        if (!map.has(m.id)) map.set(m.id, m);
      });
    }
    extraMovies.forEach(m => {
      if (!map.has(m.id)) map.set(m.id, m);
    });
    liveSearchMatches.forEach(m => {
      if (!map.has(m.id)) map.set(m.id, m);
    });
    return Array.from(map.values());
  }, [multiCatalogs, extraMovies, liveSearchMatches]);

  // Handle Loading Next 50 Titles on demand
  const handleLoadMore = async () => {
    try {
      setIsLoadingMore(true);
      const newBatch = await fetchRealtimeCatalog('movie', undefined, skipCount);
      if (newBatch && newBatch.length > 0) {
        setExtraMovies(prev => [...prev, ...newBatch]);
        setSkipCount(prev => prev + 50);
      }
    } catch (err) {
      console.warn('Load more error:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Multi-Slide Hero Carousel State
  const featuredMovies = useMemo(() => {
    return CINEMA_MOVIES.filter((m) => m.isFeatured);
  }, []);

  const [heroIndex, setHeroIndex] = useState<number>(0);
  const [isHeroPaused, setIsHeroPaused] = useState<boolean>(false);

  // Auto-cycle Hero Banner every 6.5 seconds when not paused
  useEffect(() => {
    if (isHeroPaused || featuredMovies.length <= 1) return;

    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 6500);

    return () => clearInterval(interval);
  }, [isHeroPaused, featuredMovies.length]);

  const activeHeroMovie = featuredMovies[heroIndex] || featuredMovies[0] || CINEMA_MOVIES[0];

  const handleToggleWatchlist = (e: React.MouseEvent, movieId: string) => {
    e.stopPropagation();
    const updated = toggleStoredWatchlist(movieId);
    setWatchlistIds(updated);
  };

  const handleRefreshWatchlist = () => {
    setWatchlistIds(getStoredWatchlist());
  };

  // Filtered movies according to category and search query (searching curated + live)
  const filteredMovies = useMemo(() => {
    return allCatalogMovies.filter((m) => {
      if (selectedCategory === 'watchlist') {
        if (!watchlistIds.includes(m.id)) return false;
      } else if (selectedCategory === 'movies') {
        if (m.type === 'series') return false;
      } else if (selectedCategory === 'series') {
        if (m.type !== 'series') return false;
      } else if (selectedCategory === 'trending') {
        if (m.category !== 'trending' && !m.isFeatured) return false;
      } else if (selectedCategory === 'action') {
        if (m.type === 'series') return false;
        if (m.category !== 'action' && !m.genres.some(g => /action|sci-fi|adventure|thriller/i.test(g))) return false;
      } else if (selectedCategory === 'anime') {
        if (m.category !== 'anime' && !m.genres.some(g => /anim/i.test(g))) return false;
      } else if (selectedCategory === 'family') {
        if (m.category !== 'family' && !m.genres.some(g => /family|comedy/i.test(g))) return false;
      } else if (selectedCategory === 'pinoy') {
        if (m.category !== 'pinoy' && !m.genres.some(g => /pinoy/i.test(g))) return false;
      } else if (selectedCategory !== 'all') {
        if (m.category !== selectedCategory) return false;
      }

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.genres.some((g) => g.toLowerCase().includes(q)) ||
        m.cast.some((c) => c.toLowerCase().includes(q)) ||
        m.director.toLowerCase().includes(q)
      );
    });
  }, [allCatalogMovies, selectedCategory, searchQuery, watchlistIds]);

  // Rails categorized lists for Apple TV+ / Netflix Snap Rails
  const top10Trending = useMemo(() => {
    return allCatalogMovies
      .filter(m => m.type !== 'series')
      .sort((a, b) => b.imdbScore - a.imdbScore)
      .slice(0, 10);
  }, [allCatalogMovies]);

  const liveTrendingMovies = useMemo(() => {
    if (multiCatalogs && multiCatalogs.topTrending.length > 0) {
      return multiCatalogs.topTrending;
    }
    return allCatalogMovies.filter(m => m.type !== 'series').slice(0, 30);
  }, [multiCatalogs, allCatalogMovies]);

  const tvSeriesList = useMemo(() => {
    if (multiCatalogs && multiCatalogs.series.length > 0) {
      return multiCatalogs.series;
    }
    return allCatalogMovies.filter((m) => m.type === 'series');
  }, [multiCatalogs, allCatalogMovies]);

  const actionBlockbusters = useMemo(() => {
    if (multiCatalogs && multiCatalogs.action.length > 0) {
      return multiCatalogs.action;
    }
    return allCatalogMovies.filter((m) => m.type !== 'series' && (m.category === 'action' || m.genres.some(g => /action|sci-fi/i.test(g))));
  }, [multiCatalogs, allCatalogMovies]);

  const animeHub = useMemo(() => {
    if (multiCatalogs && multiCatalogs.anime.length > 0) {
      return multiCatalogs.anime;
    }
    return allCatalogMovies.filter((m) => m.category === 'anime' || m.genres.some(g => /anim/i.test(g)));
  }, [multiCatalogs, allCatalogMovies]);

  const familyOpenCinema = useMemo(() => {
    if (multiCatalogs && multiCatalogs.family.length > 0) {
      return multiCatalogs.family;
    }
    return allCatalogMovies.filter((m) => m.category === 'family' || m.genres.some(g => /family|comedy/i.test(g)));
  }, [multiCatalogs, allCatalogMovies]);

  const horrorHub = useMemo(() => {
    if (multiCatalogs && multiCatalogs.horror.length > 0) {
      return multiCatalogs.horror;
    }
    return allCatalogMovies.filter((m) => m.genres.some(g => /horror|mystery/i.test(g)));
  }, [multiCatalogs, allCatalogMovies]);

  const pinoyMovies = useMemo(() => {
    return allCatalogMovies.filter((m) => m.category === 'pinoy' || m.genres.some(g => /pinoy/i.test(g)));
  }, [allCatalogMovies]);

  const categories = [
    { id: 'all', label: `All Catalog (${allCatalogMovies.length})`, icon: Film },
    { id: 'watchlist', label: `My Watchlist (${watchlistIds.length})`, icon: Bookmark },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'series', label: 'TV Shows & Series', icon: Tv },
    { id: 'action', label: 'Action & Marvel', icon: Sparkles },
    { id: 'pinoy', label: 'Pinoy Classics', icon: Heart },
    { id: 'anime', label: 'Anime Hub', icon: Zap },
    { id: 'family', label: 'Family & 4K Cinema', icon: Star },
  ];

  // Helper for scrolling horizontal snap rails
  const scrollRail = (railId: string, direction: 'left' | 'right') => {
    const el = document.getElementById(railId);
    if (!el) return;
    const scrollAmount = direction === 'left' ? -600 : 600;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] pb-28 md:pb-16 bg-[#04060c] text-slate-100 overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* 1. NUVIO & AIOSTREAMS TOP TELEMETRY RIBBON */}
      <div className="px-4 sm:px-8 pt-4 pb-2">
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-purple-950/40 border border-cyan-500/25 backdrop-blur-xl shadow-lg shadow-cyan-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-pulse">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-white tracking-wider uppercase">
                  Nuvio Mobile & AIOStreams v2.37.0
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 uiverse-radar" />
                  ONLINE • 14ms
                </span>
                <span className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                  {isLiveLoading ? 'Syncing Cinemeta...' : `Cinemeta Live (${allCatalogMovies.length} Streamable Titles)`}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Multi-server scraper failover, Stremio manifests & direct 4K CDN playback (Zero APK Required)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle: Rails vs Grid */}
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              <button
                onClick={() => setViewMode('rails')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                  viewMode === 'rails'
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Netflix-style horizontal rails"
              >
                <Rows className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">Rails</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                  viewMode === 'grid'
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Stremio-style poster grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">Grid</span>
              </button>
            </div>

            {onOpenAIOStreams && (
              <button
                onClick={onOpenAIOStreams}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>AIO Addons</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC MULTI-SLIDE HERO SPOTLIGHT CAROUSEL */}
      {selectedCategory === 'all' && !searchQuery.trim() && activeHeroMovie && (
        <div 
          className="relative px-4 sm:px-8 py-3"
          onMouseEnter={() => setIsHeroPaused(true)}
          onMouseLeave={() => setIsHeroPaused(false)}
        >
          <div className="relative h-[440px] sm:h-[500px] md:h-[560px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Background Backdrop Image */}
            <img
              src={activeHeroMovie.backdropUrl}
              alt={activeHeroMovie.title}
              className="absolute inset-0 w-full h-full object-cover filter brightness-70 transform scale-105 transition-all duration-700 ease-out"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('metahub.space')) {
                  target.src = `https://images.metahub.space/background/medium/${activeHeroMovie.id}/img`;
                }
              }}
            />

            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#04060c] via-[#04060c]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#04060c]/90 via-[#04060c]/40 to-transparent" />

            {/* Left/Right Carousel Nav Arrows */}
            {featuredMovies.length > 1 && (
              <>
                <button
                  onClick={() => setHeroIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-all z-20 hover:scale-110"
                  aria-label="Previous Featured"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setHeroIndex((prev) => (prev + 1) % featuredMovies.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-all z-20 hover:scale-110"
                  aria-label="Next Featured"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Hero Information Dock */}
            <div className="absolute bottom-8 left-6 sm:left-12 max-w-2xl space-y-3 z-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black tracking-widest bg-cyan-400 text-black uppercase shadow-sm">
                  {activeHeroMovie.type === 'series' ? 'FEATURED SERIES' : 'FEATURED BLOCKBUSTER'}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {activeHeroMovie.imdbScore} IMDb
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-500/30">
                  {activeHeroMovie.quality}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10">
                  {activeHeroMovie.duration}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none drop-shadow-md">
                {activeHeroMovie.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed drop-shadow">
                {activeHeroMovie.synopsis}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => onPlayMovie(activeHeroMovie)}
                  className="px-6 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs sm:text-sm tracking-wide shadow-xl shadow-cyan-400/30 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 uiverse-glow-btn"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>STREAM NOW (AIO PRO)</span>
                </button>

                <button
                  onClick={() => setActiveModalMovie(activeHeroMovie)}
                  className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all hover:scale-105"
                >
                  Details & Episodes
                </button>

                <button
                  onClick={(e) => handleToggleWatchlist(e, activeHeroMovie.id)}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    watchlistIds.includes(activeHeroMovie.id)
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
                  }`}
                  title={watchlistIds.includes(activeHeroMovie.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                >
                  {watchlistIds.includes(activeHeroMovie.id) ? (
                    <Check className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Slide Indicator Dots & Mini Bar */}
              {featuredMovies.length > 1 && (
                <div className="flex items-center gap-2 pt-3">
                  {featuredMovies.map((m, idx) => (
                    <button
                      key={m.id}
                      onClick={() => setHeroIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        heroIndex === idx
                          ? 'w-8 bg-cyan-400 shadow-sm shadow-cyan-400'
                          : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                      title={m.title}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. CATEGORY PILLS & REALTIME SEARCH BAR */}
      <div className="px-4 sm:px-8 py-3 space-y-3 sticky top-16 z-30 bg-[#04060c]/90 backdrop-blur-xl border-y border-white/5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Scrollable Category Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {onNavigateToTv && (
              <button
                type="button"
                onClick={onNavigateToTv}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-200 bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white shadow-lg shadow-rose-600/30 hover:scale-105 active:scale-95 border border-rose-400/40"
                title="Switch to 24/7 Free Live TV Channels Hub"
              >
                <Tv className="w-3.5 h-3.5 text-rose-200" />
                <span>Live TV</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-200 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
              </button>
            )}

            {onNavigateToAnime && (
              <button
                type="button"
                onClick={onNavigateToAnime}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-200 bg-gradient-to-r from-fuchsia-600 via-pink-600 to-purple-700 text-white shadow-lg shadow-fuchsia-600/30 hover:scale-105 active:scale-95 border border-fuchsia-400/40"
                title="Switch to Dedicated Anime Hub (Yomi - Zero Ads)"
              >
                <Sparkles className="w-3.5 h-3.5 text-fuchsia-200" />
                <span>Anime Hub</span>
              </button>
            )}

            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25 scale-105'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 hover:border-white/10'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-cyan-400'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Search Box */}
          <div className="relative min-w-[260px] md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search global movies, series, cast, directors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:bg-white/10 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
            {isSearchingLive ? (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-cyan-400 font-mono">
                <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
                <span>Live...</span>
              </div>
            ) : searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* 4. CONTENT DISPLAY: RAILS MODE VS GRID MODE */}
      {viewMode === 'rails' && !searchQuery.trim() && selectedCategory === 'all' ? (
        <div className="space-y-8 px-4 sm:px-8 pt-4">
          {/* CONTINUE WATCHING RAIL */}
          {watchProgressList.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Continue Watching
                  </h2>
                  <span className="text-[11px] font-mono text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30">
                    {watchProgressList.length} in progress
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => scrollRail('rail-continue', 'left')}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition hover:scale-105"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollRail('rail-continue', 'right')}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition hover:scale-105"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Continue Row */}
              <div
                id="rail-continue"
                className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory"
              >
                {watchProgressList.map((item) => {
                  const foundMovie = CINEMA_MOVIES.find((m) => m.id === item.movieId) || {
                    id: item.movieId,
                    title: item.movieTitle,
                    type: item.type,
                    year: 2024,
                    rating: 'PG-13',
                    imdbScore: 8.0,
                    quality: '1080p FHD',
                    duration: '2h 00m',
                    genres: ['Drama', 'Action'],
                    director: 'Director',
                    cast: [],
                    description: item.movieTitle,
                    posterUrl: item.poster,
                    backdropUrl: item.backdrop || item.poster,
                    category: item.type === 'series' ? 'series' : 'trending',
                    streamUrl: `https://vidsrc.to/embed/${item.type === 'series' ? 'tv' : 'movie'}/${item.movieId}`,
                    servers: [],
                  };

                  const epMatch = item.seasonNumber && item.episodeNumber
                    ? {
                        id: `${item.movieId}:${item.seasonNumber}:${item.episodeNumber}`,
                        seasonNumber: item.seasonNumber,
                        episodeNumber: item.episodeNumber,
                        title: item.episodeTitle || `Episode ${item.episodeNumber}`,
                        duration: '45m',
                        overview: '',
                        thumbnail: item.backdrop || item.poster,
                        servers: [],
                      }
                    : undefined;

                  return (
                    <div
                      key={item.movieId}
                      onClick={() => onPlayMovie(foundMovie as CinemaMovie, epMatch)}
                      className="relative flex-shrink-0 w-44 sm:w-52 group cursor-pointer snap-start"
                    >
                      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10 group-hover:border-cyan-500/60 shadow-lg group-hover:shadow-cyan-500/20 transition-all duration-300">
                        <img
                          src={item.backdrop || item.poster}
                          alt={item.movieTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />

                        {/* Top Dimmer & Delete Button */}
                        <div className="absolute top-2 right-2 z-20">
                          <button
                            onClick={(e) => handleRemoveProgress(e, item.movieId)}
                            className="p-1 rounded-lg bg-black/60 hover:bg-rose-500 text-slate-400 hover:text-white transition"
                            title="Remove from Continue Watching"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Play Icon Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-10">
                          <div className="w-10 h-10 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow-lg transform group-hover:scale-110 transition">
                            <Play className="w-5 h-5 fill-black ml-0.5" />
                          </div>
                        </div>

                        {/* Progress Bar Line */}
                        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-white/20">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-400 to-sky-500 shadow-sm shadow-cyan-400"
                            style={{ width: `${Math.max(5, item.percentage)}%` }}
                          />
                        </div>
                      </div>

                      {/* Title & Progress Label */}
                      <div className="mt-2 flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition">
                            {item.movieTitle}
                          </h3>
                          <p className="text-[10px] text-slate-400 truncate">
                            {item.seasonNumber ? `S${item.seasonNumber} E${item.episodeNumber}` : 'Movie'} • {item.percentage}% watched
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* RAIL 1: TOP 10 TRENDING TODAY (With Giant Stylized Numbers) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Flame className="w-4 h-4" />
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Top 10 Trending Today
                </h2>
                <span className="text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30">
                  Global & Pinoy
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollRail('rail-top10', 'left')}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition hover:scale-105"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollRail('rail-top10', 'right')}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition hover:scale-105"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Row */}
            <div
              id="rail-top10"
              className="flex items-center gap-4 overflow-x-auto pb-4 pt-2 scrollbar-none snap-x snap-mandatory"
            >
              {top10Trending.map((movie, index) => (
                <div
                  key={movie.id}
                  onClick={() => setActiveModalMovie(movie)}
                  className="relative flex-shrink-0 w-48 sm:w-56 group cursor-pointer snap-start"
                >
                  <div className="flex items-end">
                    {/* Big Stylized Rank Number (#1 to #10) */}
                    <span className="tvmax-top10-number group-hover:tvmax-top10-number-active transform translate-x-3 z-10 shrink-0">
                      {index + 1}
                    </span>

                    {/* Movie Card */}
                    <div className="relative aspect-[2/3] w-36 sm:w-44 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 group-hover:border-cyan-500/60 shadow-lg group-hover:shadow-cyan-500/20 transition-all duration-300 uiverse-card">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.includes('metahub.space')) {
                            target.src = `https://images.metahub.space/poster/medium/${movie.id}/img`;
                          }
                        }}
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-300 flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-amber-400" />
                        {movie.imdbScore}
                      </div>

                      {/* Quick Play Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlayMovie(movie);
                          }}
                          className="p-3.5 rounded-full bg-cyan-400 text-black shadow-lg shadow-cyan-500/40 hover:scale-110 transition"
                        >
                          <Play className="w-5 h-5 fill-black ml-0.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pl-6 pt-1">
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-400 truncate">
                      {movie.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {movie.year} • {movie.quality}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* RAIL 2: NUVIO CINEMETA LIVE TRENDING MOVIES */}
          {liveTrendingMovies.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Nuvio Cinemeta Live Trending Movies
                  </h2>
                  <span className="text-[10px] font-mono font-bold text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    LIVE REALTIME API ({liveTrendingMovies.length})
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => scrollRail('rail-cinemeta-trending', 'left')}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition hover:scale-105"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollRail('rail-cinemeta-trending', 'right')}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition hover:scale-105"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div
                id="rail-cinemeta-trending"
                className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory"
              >
                {liveTrendingMovies.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => setActiveModalMovie(movie)}
                    className="relative flex-shrink-0 w-40 sm:w-48 group cursor-pointer snap-start rounded-2xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/50 p-2 transition-all uiverse-card"
                  >
                    <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-slate-950">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.includes('metahub.space')) {
                            target.src = `https://images.metahub.space/poster/medium/${movie.id}/img`;
                          }
                        }}
                      />
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 backdrop-blur-md">
                        {movie.quality}
                      </span>
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-300 flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-amber-400" />
                        {movie.imdbScore}
                      </div>

                      {/* Quick Play Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlayMovie(movie);
                          }}
                          className="p-3 rounded-full bg-cyan-400 text-black shadow-lg shadow-cyan-500/40 hover:scale-110 transition"
                        >
                          <Play className="w-4 h-4 fill-black ml-0.5" />
                        </button>
                      </div>
                    </div>
                    <div className="pt-2">
                      <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                        {movie.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {movie.year} • {movie.genres.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* RAIL 3: BINGE-WORTHY TV SERIES & SAGAS */}
          {tvSeriesList.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <Tv className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Binge-Worthy TV Series & Sagas
                  </h2>
                  <span className="text-[10px] font-mono font-bold text-purple-300 px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40">
                    {tvSeriesList.length} Series
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => scrollRail('rail-series', 'left')}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition hover:scale-105"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollRail('rail-series', 'right')}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition hover:scale-105"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div
                id="rail-series"
                className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory"
              >
                {tvSeriesList.map((series) => (
                  <div
                    key={series.id}
                    onClick={() => setActiveModalMovie(series)}
                    className="relative flex-shrink-0 w-40 sm:w-48 group cursor-pointer snap-start rounded-2xl bg-slate-900/60 border border-white/5 hover:border-purple-500/50 p-2 transition-all uiverse-card"
                  >
                    <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-slate-950">
                      <img
                        src={series.posterUrl}
                        alt={series.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.includes('metahub.space')) {
                            target.src = `https://images.metahub.space/poster/medium/${series.id}/img`;
                          }
                        }}
                      />
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-950/80 text-purple-300 border border-purple-500/40 backdrop-blur-md">
                        SERIES
                      </span>
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-300 flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-amber-400" />
                        {series.imdbScore}
                      </div>
                    </div>
                    <div className="pt-2">
                      <h3 className="text-xs font-bold text-white group-hover:text-purple-300 truncate">
                        {series.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {series.year} • {series.duration}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* RAIL 4: ACTION, MARVEL & SCI-FI BLOCKBUSTERS */}
          {actionBlockbusters.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Action, Marvel & Sci-Fi Masters
                  </h2>
                  <span className="text-[10px] font-mono font-bold text-indigo-300 px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/40">
                    {actionBlockbusters.length} Titles
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => scrollRail('rail-action', 'left')}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition hover:scale-105"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollRail('rail-action', 'right')}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition hover:scale-105"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div
                id="rail-action"
                className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory"
              >
                {actionBlockbusters.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => setActiveModalMovie(movie)}
                    className="relative flex-shrink-0 w-40 sm:w-48 group cursor-pointer snap-start rounded-2xl bg-slate-900/60 border border-white/5 hover:border-indigo-500/50 p-2 transition-all uiverse-card"
                  >
                    <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-slate-950">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.includes('metahub.space')) {
                            target.src = `https://images.metahub.space/poster/medium/${movie.id}/img`;
                          }
                        }}
                      />
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 backdrop-blur-md">
                        {movie.quality}
                      </span>
                    </div>
                    <div className="pt-2">
                      <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">
                        {movie.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {movie.year} • {movie.duration}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* RAIL 5: ANIME MASTERPIECES & ANIMATION */}
          {animeHub.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Anime Masterpieces & Animation
                  </h2>
                  <span className="text-[10px] font-mono font-bold text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40">
                    {animeHub.length} Films
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => scrollRail('rail-anime', 'left')}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition hover:scale-105"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollRail('rail-anime', 'right')}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition hover:scale-105"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div
                id="rail-anime"
                className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory"
              >
                {animeHub.map((anime) => (
                  <div
                    key={anime.id}
                    onClick={() => setActiveModalMovie(anime)}
                    className="relative flex-shrink-0 w-40 sm:w-48 group cursor-pointer snap-start rounded-2xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/50 p-2 transition-all uiverse-card"
                  >
                    <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-slate-950">
                      <img
                        src={anime.posterUrl}
                        alt={anime.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.includes('metahub.space')) {
                            target.src = `https://images.metahub.space/poster/medium/${anime.id}/img`;
                          }
                        }}
                      />
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 backdrop-blur-md">
                        ANIME
                      </span>
                    </div>
                    <div className="pt-2">
                      <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                        {anime.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {anime.year} • {anime.quality}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* RAIL 6: PINOY CINEMA VAULT & STAR CINEMA */}
          {pinoyMovies.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    <Heart className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Pinoy Cinema Vault & Star Cinema
                  </h2>
                  <span className="text-[10px] font-mono font-bold text-rose-300 px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/40">
                    Pinoy Blockbusters
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => scrollRail('rail-pinoy', 'left')}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition hover:scale-105"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollRail('rail-pinoy', 'right')}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition hover:scale-105"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div
                id="rail-pinoy"
                className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory"
              >
                {pinoyMovies.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => setActiveModalMovie(movie)}
                    className="relative flex-shrink-0 w-40 sm:w-48 group cursor-pointer snap-start rounded-2xl bg-slate-900/60 border border-white/5 hover:border-rose-500/50 p-2 transition-all uiverse-card"
                  >
                    <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-slate-950">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.includes('media-amazon.com') && !target.src.includes('metahub.space')) {
                            target.src = `https://images.metahub.space/poster/medium/${movie.id}/img`;
                          }
                        }}
                      />
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-500/40 backdrop-blur-md">
                        PINOY
                      </span>
                    </div>
                    <div className="pt-2">
                      <h3 className="text-xs font-bold text-white group-hover:text-rose-300 truncate">
                        {movie.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {movie.year} • {movie.director}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* RAIL 7: FAMILY & COMEDY CINEMA */}
          {familyOpenCinema.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Star className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Family & Comedy Favorites
                  </h2>
                  <span className="text-[10px] font-mono font-bold text-amber-300 px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40">
                    {familyOpenCinema.length} Films
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => scrollRail('rail-family', 'left')}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition hover:scale-105"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollRail('rail-family', 'right')}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition hover:scale-105"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div
                id="rail-family"
                className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory"
              >
                {familyOpenCinema.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => setActiveModalMovie(movie)}
                    className="relative flex-shrink-0 w-40 sm:w-48 group cursor-pointer snap-start rounded-2xl bg-slate-900/60 border border-white/5 hover:border-amber-500/50 p-2 transition-all uiverse-card"
                  >
                    <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-slate-950">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.includes('metahub.space')) {
                            target.src = `https://images.metahub.space/poster/medium/${movie.id}/img`;
                          }
                        }}
                      />
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                        FAMILY
                      </span>
                    </div>
                    <div className="pt-2">
                      <h3 className="text-xs font-bold text-white group-hover:text-amber-300 truncate">
                        {movie.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {movie.year} • {movie.duration}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* RAIL 8: DARK HORROR & SUSPENSE NIGHT */}
          {horrorHub.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                    <Skull className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Dark Horror & Psychological Suspense
                  </h2>
                  <span className="text-[10px] font-mono font-bold text-red-300 px-2 py-0.5 rounded-full bg-red-950/80 border border-red-500/40">
                    {horrorHub.length} Films
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => scrollRail('rail-horror', 'left')}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition hover:scale-105"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollRail('rail-horror', 'right')}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition hover:scale-105"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div
                id="rail-horror"
                className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory"
              >
                {horrorHub.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => setActiveModalMovie(movie)}
                    className="relative flex-shrink-0 w-40 sm:w-48 group cursor-pointer snap-start rounded-2xl bg-slate-900/60 border border-white/5 hover:border-red-500/50 p-2 transition-all uiverse-card"
                  >
                    <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-slate-950">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.includes('metahub.space')) {
                            target.src = `https://images.metahub.space/poster/medium/${movie.id}/img`;
                          }
                        }}
                      />
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-red-950/80 text-red-300 border border-red-500/40 backdrop-blur-md">
                        HORROR
                      </span>
                    </div>
                    <div className="pt-2">
                      <h3 className="text-xs font-bold text-white group-hover:text-red-300 truncate">
                        {movie.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {movie.year} • {movie.duration}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Quick Switch to Full Grid Browse at the Bottom of Rails */}
          <div className="pt-6 pb-2 text-center">
            <button
              onClick={() => setViewMode('grid')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs inline-flex items-center gap-2 transition hover:scale-105 shadow-lg shadow-cyan-950/40"
            >
              <LayoutGrid className="w-4 h-4 text-cyan-400" />
              <span>Browse All {allCatalogMovies.length} Titles in Poster Grid View</span>
            </button>
          </div>
        </div>
      ) : (
        /* GRID MODE OR SEARCH / FILTER RESULTS */
        <div className="px-4 sm:px-8 space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : categories.find((c) => c.id === selectedCategory)?.label || 'All Cinema Titles'}
                {isSearchingLive && (
                  <span className="text-xs font-normal text-cyan-400 font-mono flex items-center gap-1.5 ml-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Searching Live Cinemeta...
                  </span>
                )}
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                ({filteredMovies.length} Streamable)
              </span>
            </div>
          </div>

          {filteredMovies.length === 0 ? (
            <div className="py-24 text-center space-y-3 bg-white/[0.02] rounded-3xl border border-white/5 max-w-xl mx-auto">
              <Film className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">No movies found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {selectedCategory === 'watchlist'
                  ? 'Your watchlist is empty. Tap the bookmark icon on any movie to save it here!'
                  : 'Try adjusting your search query or switching to another category.'}
              </p>
              {selectedCategory === 'watchlist' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs shadow hover:bg-cyan-400 transition"
                >
                  Browse Catalog
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5">
              {filteredMovies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => setActiveModalMovie(movie)}
                  className="group relative flex flex-col rounded-2xl overflow-hidden bg-slate-900/60 border border-white/5 hover:border-cyan-500/50 shadow-lg hover:shadow-cyan-500/10 cursor-pointer uiverse-card"
                >
                  {/* Poster Image */}
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes('metahub.space')) {
                          target.src = `https://images.metahub.space/poster/medium/${movie.id}/img`;
                        }
                      }}
                    />

                    {/* Rating Badge */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-bold text-amber-300 flex items-center gap-1 shadow">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      {movie.imdbScore}
                    </div>

                    {/* Quality & Series Badges */}
                    <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 backdrop-blur-md shadow">
                        {movie.quality}
                      </span>
                      {movie.type === 'series' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-950/80 text-purple-300 border border-purple-500/40 backdrop-blur-md shadow">
                          SERIES
                        </span>
                      )}
                    </div>

                    {/* Bookmark Indicator */}
                    {watchlistIds.includes(movie.id) && (
                      <div className="absolute bottom-2 left-2 p-1 rounded-md bg-amber-500 text-black shadow">
                        <Bookmark className="w-3 h-3 fill-black" />
                      </div>
                    )}

                    {/* Hover Overlay Play Icon */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlayMovie(movie);
                        }}
                        className="p-3.5 rounded-full bg-cyan-400 text-black shadow-lg shadow-cyan-500/40 transform scale-75 group-hover:scale-100 transition-transform duration-300 hover:bg-cyan-300"
                        title="Stream 4K Cinema"
                      >
                        <Play className="w-5 h-5 fill-black ml-0.5" />
                      </button>
                    </div>
                  </div>

                  {/* Movie Metadata */}
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-1">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {movie.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>{movie.year}</span>
                        <span>•</span>
                        <span>{movie.duration}</span>
                      </div>
                    </div>

                    <div className="pt-1 flex flex-wrap gap-1">
                      {movie.genres.slice(0, 2).map((g) => (
                        <span key={g} className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 text-slate-400">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LOAD MORE TITLES BUTTON (+50 TITLES PAGINATION) */}
          {selectedCategory === 'all' && !searchQuery.trim() && (
            <div className="pt-8 pb-8 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center gap-2.5 transition-all shadow-xl shadow-cyan-950/40 hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>Loading 50 More Real Movies & Series...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Load More Movies (+50 Titles)</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. MOVIE DETAIL MODAL */}
      {activeModalMovie && (
        <MovieDetailModal
          movie={activeModalMovie}
          onClose={() => setActiveModalMovie(null)}
          onPlayMovie={(movie, episode) => {
            setActiveModalMovie(null);
            onPlayMovie(movie, episode);
          }}
          onWatchlistChanged={handleRefreshWatchlist}
        />
      )}
    </div>
  );
};
