import React from 'react';
import { 
  Tv, 
  Search, 
  Layers, 
  Keyboard, 
  X, 
  Film, 
  Sparkles,
  Bookmark,
  SlidersHorizontal,
  LayoutGrid,
  Rows,
  Zap
} from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAIOStreams: () => void;
  onOpenShortcutsModal: () => void;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
  watchlistCount: number;
  viewMode: 'rails' | 'grid';
  onToggleViewMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenAIOStreams,
  onOpenShortcutsModal,
  onSelectCategory,
  selectedCategory,
  watchlistCount,
  viewMode,
  onToggleViewMode,
}) => {
  return (
    <header className="h-16 border-b border-white/10 bg-[#04060c]/95 backdrop-blur-2xl px-4 sm:px-8 flex items-center justify-between gap-3 sm:gap-6 z-40 select-none sticky top-0">
      {/* 1. Left: Brand & Badges */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div 
          onClick={() => onSelectCategory('all')}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="TV MAX — Nuvio & AIOStreams"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#070913] rounded-[14px] flex items-center justify-center">
              <Film className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-2 leading-none">
              <span className="font-black text-lg sm:text-xl tracking-tighter bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent uppercase drop-shadow-sm font-sans">
                TV MAX
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                NUVIO
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                AIOStreams v2.37
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              MULTI-SERVER 4K STREAM ENGINE
            </span>
          </div>
        </div>
      </div>

      {/* 2. Center: Quick Search Input */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Quick search movies, series, cast, or genres..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:bg-white/10 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Right: Navigation Actions & Addons */}
      <div className="flex items-center gap-2">
        {/* Watchlist Quick Pill */}
        <button
          onClick={() => onSelectCategory(selectedCategory === 'watchlist' ? 'all' : 'watchlist')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedCategory === 'watchlist'
              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30 scale-105'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
          }`}
          title="View My Watchlist"
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Watchlist</span>
          {watchlistCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black ${
              selectedCategory === 'watchlist' ? 'bg-black text-amber-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {watchlistCount}
            </span>
          )}
        </button>

        {/* View Mode Switcher (Rails vs Grid) */}
        <button
          onClick={onToggleViewMode}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold transition"
          title={`Switch to ${viewMode === 'rails' ? 'Poster Grid' : 'Netflix Rails'}`}
        >
          {viewMode === 'rails' ? (
            <>
              <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
              <span>Grid View</span>
            </>
          ) : (
            <>
              <Rows className="w-3.5 h-3.5 text-cyan-400" />
              <span>Rails View</span>
            </>
          )}
        </button>

        {/* AIOStreams Provider Config Modal */}
        <button
          onClick={onOpenAIOStreams}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-sm"
          title="AIOStreams Scrapers & Addon Providers"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Addons</span>
        </button>

        {/* Keyboard / Remote Shortcuts */}
        <button
          onClick={onOpenShortcutsModal}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition"
          title="Smart TV Remote & Keyboard Shortcuts"
        >
          <Keyboard className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
