import React from 'react';
import { 
  Film, 
  Search, 
  Bookmark, 
  SlidersHorizontal 
} from 'lucide-react';
import { NavMode } from '../../utils/storage';

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenAIOStreams: () => void;
  onOpenShortcutsModal?: () => void;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
  watchlistCount: number;
  continueWatchingCount?: number;
  onOpenContinueWatching?: () => void;
  onOpenSpotlight?: () => void;
  isTvMode?: boolean;
  onToggleTvMode?: () => void;
  isInstallable?: boolean;
  onInstallApp?: () => void;
  viewMode?: 'rails' | 'grid';
  onToggleViewMode?: () => void;
  navMode?: NavMode;
  onSelectNavMode?: (mode: NavMode) => void;
  licensingState?: any;
  onOpenMasterAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAIOStreams,
  onSelectCategory,
  selectedCategory,
  watchlistCount,
  onOpenSpotlight,
  licensingState,
}) => {
  return (
    <header className="md:hidden h-14 border-b border-white/10 bg-[#04060c]/95 backdrop-blur-2xl px-4 flex items-center justify-between z-40 select-none sticky top-0">
      {/* 1. Left: Brand & Badges */}
      <div 
        onClick={() => onSelectCategory('all')}
        className="flex items-center gap-2 cursor-pointer group"
        title="TV MAX"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-indigo-600 p-0.5 shadow-md shadow-cyan-500/20">
          <div className="w-full h-full bg-[#070913] rounded-[10px] flex items-center justify-center">
            <Film className="w-4 h-4 text-cyan-400" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-black text-base tracking-tighter bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent uppercase drop-shadow-sm font-sans">
            TV MAX
          </span>
          <span className="px-1.5 py-0.2 rounded text-[8px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
            PRO
          </span>
          {licensingState?.status === 'ACTIVE' && (
            <div
              className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase flex items-center gap-1 select-none cursor-default"
              title="TV-MAX Vendo Active"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{licensingState.ticket?.tier === 'trial' ? '24h' : `${licensingState.daysRemaining}d`}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Right: Quick Search, Watchlist, Servers */}
      <div className="flex items-center gap-2">
        {/* Spotlight Search Launcher */}
        {onOpenSpotlight && (
          <button
            type="button"
            onClick={onOpenSpotlight}
            className="w-9 h-9 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 flex items-center justify-center transition-all active:scale-90 shadow-sm cursor-pointer"
            title="Search Movies, Anime, Series (⌘K)"
          >
            <Search className="w-4 h-4 text-cyan-400" />
          </button>
        )}

        {/* Watchlist Quick Pill */}
        <button
          type="button"
          onClick={() => onSelectCategory(selectedCategory === 'watchlist' ? 'all' : 'watchlist')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-90 cursor-pointer ${
            selectedCategory === 'watchlist'
              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30 scale-105'
              : 'bg-white/5 text-slate-300 border border-white/10'
          }`}
          title="Watchlist"
        >
          <Bookmark className="w-4 h-4 text-amber-400" />
          {watchlistCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-black ${
              selectedCategory === 'watchlist' ? 'bg-black text-amber-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {watchlistCount}
            </span>
          )}
        </button>

        {/* Stream Server Settings Modal */}
        <button
          type="button"
          onClick={onOpenAIOStreams}
          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 flex items-center justify-center transition-all active:scale-90 shadow-sm cursor-pointer"
          title="TV-MAX Stream Servers"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
