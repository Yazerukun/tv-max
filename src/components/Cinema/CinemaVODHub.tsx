import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Play, 
  Info, 
  Star, 
  Clock, 
  Sparkles, 
  Film, 
  TrendingUp, 
  Heart, 
  ChevronRight,
  ChevronLeft,
  Flame, 
  Search, 
  CheckCircle2, 
  Tv, 
  Layers, 
  Zap, 
  SlidersHorizontal, 
  FolderOpen,
  Bookmark,
  Check,
  LayoutGrid,
  Rows,
  Sliders,
  ShieldCheck,
  RotateCcw,
  Compass
} from 'lucide-react';
import { CINEMA_MOVIES, CinemaMovie, Episode } from '../../data/cinemaMovies';
import { MovieDetailModal } from './MovieDetailModal';
import { getStoredWatchlist, toggleStoredWatchlist } from '../../utils/storage';

interface CinemaVODHubProps {
  onPlayMovie: (movie: CinemaMovie, episode?: Episode) => void;
  onNavigateToTv: () => void;
  onOpenAIOStreams?: () => void;
}

export const CinemaVODHub: React.FC<CinemaVODHubProps> = ({
  onPlayMovie,
  onNavigateToTv,
  onOpenAIOStreams,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalMovie, setActiveModalMovie] = useState<CinemaMovie | null>(null);
  const [viewMode, setViewMode] = useState<'rails' | 'grid'>('rails');
  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => getStoredWatchlist());

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

  // Filtered movies according to category and search query
  const filteredMovies = useMemo(() => {
    return CINEMA_MOVIES.filter((m) => {
      if (selectedCategory === 'watchlist') {
        if (!watchlistIds.includes(m.id)) return false;
      } else if (selectedCategory === 'movies') {
        if (m.type === 'series') return false;
      } else if (selectedCategory === 'series') {
        if (m.type !== 'series') return false;
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
  }, [selectedCategory, searchQuery, watchlistIds]);

  // Rails categorized lists for Apple TV+ / Netflix Snap Rails
  const top10Trending = useMemo(() => {
    return [...CINEMA_MOVIES]
      .sort((a, b) => b.imdbScore - a.imdbScore)
      .slice(0, 10);
  }, []);

  const tvSeriesList = useMemo(() => {
    return CINEMA_MOVIES.filter((m) => m.type === 'series');
  }, []);

  const pinoyMovies = useMemo(() => {
    return CINEMA_MOVIES.filter((m) => m.category === 'pinoy');
  }, []);

  const actionBlockbusters = useMemo(() => {
    return CINEMA_MOVIES.filter((m) => m.category === 'action' || m.category === 'trending');
  }, []);

  const animeHub = useMemo(() => {
    return CINEMA_MOVIES.filter((m) => m.category === 'anime');
  }, []);

  const familyOpenCinema = useMemo(() => {
    return CINEMA_MOVIES.filter((m) => m.category === 'family');
  }, []);

  const watchlistMovies = useMemo(() => {
    return CINEMA_MOVIES.filter((m) => watchlistIds.includes(m.id));
  }, [watchlistIds]);

  const categories = [
    { id: 'all', label: 'All Catalog', icon: Film },
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
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ONLINE • 14ms
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Configure Addons</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC AUTO-CYCLING HERO SPOTLIGHT BANNER */}
      {activeHeroMovie && !searchQuery.trim() && selectedCategory === 'all' && (
        <div 
          className="relative px-4 sm:px-8 py-2 sm:py-3 select-none"
          onMouseEnter={() => setIsHeroPaused(true)}
          onMouseLeave={() => setIsHeroPaused(false)}
        >
          <div className="relative w-full h-[58vh] min-h-[420px] max-h-[620px] rounded-3xl overflow-hidden border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] group">
            {/* Background Backdrop Image */}
            <img 
              key={activeHeroMovie.id}
              src={activeHeroMovie.backdropUrl} 
              alt={activeHeroMovie.title}
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-50 scale-105 transform group-hover:scale-100 transition-all duration-1000 ease-out" 
            />

            {/* Cinematic Vignette Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#04060c] via-[#04060c]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#04060c] via-[#04060c]/85 to-transparent w-full md:w-3/4" />

            {/* Left & Right Chevron Controls */}
            {featuredMovies.length > 1 && (
              <>
                <button
                  onClick={() => setHeroIndex((prev) => (prev === 0 ? featuredMovies.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-20"
                  aria-label="Previous Spotlight"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setHeroIndex((prev) => (prev + 1) % featuredMovies.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-20"
                  aria-label="Next Spotlight"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Hero Details Content */}
            <div className="absolute bottom-0 left-0 p-6 sm:p-12 max-w-2xl sm:max-w-3xl space-y-3.5 z-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-cyan-400 to-indigo-500 text-black tracking-wider uppercase shadow-lg shadow-cyan-500/25 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 fill-black" />
                  NUVIO SPOTLIGHT
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 shadow">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {activeHeroMovie.imdbScore} IMDb
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 text-slate-200 backdrop-blur-md">
                  {activeHeroMovie.year}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 text-slate-200 backdrop-blur-md">
                  {activeHeroMovie.duration}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow">
                  {activeHeroMovie.quality}
                </span>
                {activeHeroMovie.type === 'series' && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-purple-950/80 text-purple-300 border border-purple-500/40 shadow">
                    SERIES
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white font-sans drop-shadow-lg leading-tight">
                {activeHeroMovie.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 sm:line-clamp-4 leading-relaxed drop-shadow max-w-2xl">
                {activeHeroMovie.synopsis}
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onPlayMovie(activeHeroMovie)}
                  className="px-6 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-cyan-500/35 hover:scale-105 active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>Stream 4K Cinema</span>
                </button>

                <button
                  onClick={() => setActiveModalMovie(activeHeroMovie)}
                  className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm flex items-center gap-2 backdrop-blur-md border border-white/15 hover:border-white/25 active:scale-95 transition-all"
                >
                  <Info className="w-4 h-4" />
                  <span>Details & Addons</span>
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
              placeholder="Search movies, cast, genres, directors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:bg-white/10 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. CONTENT DISPLAY: RAILS MODE VS GRID MODE */}
      {viewMode === 'rails' && !searchQuery.trim() && selectedCategory === 'all' ? (
        <div className="space-y-8 px-4 sm:px-8 pt-4">
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
                    <div className="relative aspect-[2/3] w-36 sm:w-44 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 group-hover:border-cyan-500/60 shadow-lg group-hover:shadow-cyan-500/20 transition-all duration-300 group-hover:scale-105">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
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

          {/* RAIL 2: BINGE-WORTHY TV SERIES & SAGAS */}
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
                    className="relative flex-shrink-0 w-40 sm:w-48 group cursor-pointer snap-start rounded-2xl bg-slate-900/60 border border-white/5 hover:border-purple-500/50 p-2 transition-all hover:-translate-y-1"
                  >
                    <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-slate-950">
                      <img
                        src={series.posterUrl}
                        alt={series.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
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
                        {series.duration}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* RAIL 3: PINOY CINEMA CLASSICS & BLOCKBUSTERS */}
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
                    className="relative flex-shrink-0 w-40 sm:w-48 group cursor-pointer snap-start rounded-2xl bg-slate-900/60 border border-white/5 hover:border-rose-500/50 p-2 transition-all hover:-translate-y-1"
                  >
                    <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-slate-950">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
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

          {/* RAIL 4: ANIME UNIVERSE & FANTASY */}
          {animeHub.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Anime Masterpieces & Ghibli Remasters
                  </h2>
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
                    className="relative flex-shrink-0 w-40 sm:w-48 group cursor-pointer snap-start rounded-2xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/50 p-2 transition-all hover:-translate-y-1"
                  >
                    <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-slate-950">
                      <img
                        src={anime.posterUrl}
                        alt={anime.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
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

          {/* RAIL 5: ACTION & MARVEL BLOCKBUSTERS */}
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
                    className="relative flex-shrink-0 w-40 sm:w-48 group cursor-pointer snap-start rounded-2xl bg-slate-900/60 border border-white/5 hover:border-indigo-500/50 p-2 transition-all hover:-translate-y-1"
                  >
                    <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-slate-950">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
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
        </div>
      ) : (
        /* GRID MODE OR SEARCH / FILTER RESULTS */
        <div className="px-4 sm:px-8 space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : categories.find((c) => c.id === selectedCategory)?.label || 'All Cinema Titles'}
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                ({filteredMovies.length} Available)
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
                  className="group relative flex flex-col rounded-2xl overflow-hidden bg-slate-900/60 border border-white/5 hover:border-cyan-500/50 shadow-lg hover:shadow-cyan-500/10 cursor-pointer transform hover:-translate-y-1.5 transition-all duration-300"
                >
                  {/* Poster Image */}
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                      loading="lazy"
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