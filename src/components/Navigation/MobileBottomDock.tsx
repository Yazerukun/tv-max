import React from 'react';
import { 
  Film, 
  Tv, 
  Compass, 
  Sparkles, 
  BookOpen, 
  Clapperboard 
} from 'lucide-react';
import { NavMode } from '../../utils/storage';

interface MobileBottomDockProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenAIOStreams: () => void;
  watchlistCount: number;
  navMode: NavMode;
  onSelectNavMode: (mode: NavMode) => void;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({
  selectedCategory,
  onSelectCategory,
  navMode,
  onSelectNavMode,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050814]/95 backdrop-blur-2xl border-t border-white/10 px-2 py-1.5 select-none safe-area-bottom shadow-[0_-8px_30px_rgba(0,0,0,0.85)]">
      <div className="grid grid-cols-6 gap-1 items-center max-w-md mx-auto">
        {/* 1. Cinema / Movies */}
        <button
          type="button"
          onClick={() => {
            onSelectNavMode('cinema');
            onSelectCategory('all');
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-2xl transition-all duration-200 active:scale-90 ${
            navMode === 'cinema' && selectedCategory !== 'watchlist'
              ? 'bg-gradient-to-t from-cyan-500/25 to-cyan-500/5 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/25 scale-[1.02]'
              : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
          title="Cinema Movies"
        >
          <Film className={`w-4 h-4 mb-0.5 ${navMode === 'cinema' && selectedCategory !== 'watchlist' ? 'text-cyan-400 stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-extrabold tracking-tight">Movies</span>
          {navMode === 'cinema' && selectedCategory !== 'watchlist' && (
            <span className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5" />
          )}
        </button>

        {/* 2. TV Series & Shows */}
        <button
          type="button"
          onClick={() => {
            onSelectNavMode('series');
            onSelectCategory('series');
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-2xl transition-all duration-200 active:scale-90 ${
            navMode === 'series'
              ? 'bg-gradient-to-t from-purple-500/25 to-purple-500/5 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/25 scale-[1.02]'
              : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
          title="TV Series & Multi-Season Shows"
        >
          <Compass className={`w-4 h-4 mb-0.5 ${navMode === 'series' ? 'text-purple-300 stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-extrabold tracking-tight">Series</span>
          {navMode === 'series' && (
            <span className="w-1 h-1 rounded-full bg-purple-400 mt-0.5" />
          )}
        </button>

        {/* 3. Free Live TV Hub */}
        <button
          type="button"
          onClick={() => onSelectNavMode('livetv')}
          className={`relative flex flex-col items-center justify-center py-1.5 px-0.5 rounded-2xl transition-all duration-200 active:scale-90 ${
            navMode === 'livetv'
              ? 'bg-gradient-to-t from-rose-500/25 to-rose-500/5 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-500/25 scale-[1.02]'
              : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
          title="24/7 Free Live TV Channels"
        >
          <div className="relative">
            <Tv className={`w-4 h-4 mb-0.5 ${navMode === 'livetv' ? 'text-rose-400 stroke-[2.5]' : ''}`} />
            <span className="flex h-1.5 w-1.5 absolute -top-0.5 -right-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
            </span>
          </div>
          <span className="text-[10px] font-extrabold tracking-tight">Live</span>
          {navMode === 'livetv' && (
            <span className="w-1 h-1 rounded-full bg-rose-400 mt-0.5" />
          )}
        </button>

        {/* 4. Dedicated Anime Hub */}
        <button
          type="button"
          onClick={() => onSelectNavMode('anime')}
          className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-2xl transition-all duration-200 active:scale-90 ${
            navMode === 'anime'
              ? 'bg-gradient-to-t from-fuchsia-500/25 to-fuchsia-500/5 text-fuchsia-300 border border-fuchsia-500/40 shadow-sm shadow-fuchsia-500/25 scale-[1.02]'
              : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
          title="Dedicated Anime Hub"
        >
          <Sparkles className={`w-4 h-4 mb-0.5 ${navMode === 'anime' ? 'text-fuchsia-300 stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-extrabold tracking-tight">Anime</span>
          {navMode === 'anime' && (
            <span className="w-1 h-1 rounded-full bg-fuchsia-400 mt-0.5" />
          )}
        </button>

        {/* 5. Dedicated Manhwa / Manga Reader */}
        <button
          type="button"
          onClick={() => onSelectNavMode('manga')}
          className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-2xl transition-all duration-200 active:scale-90 ${
            navMode === 'manga'
              ? 'bg-gradient-to-t from-emerald-500/25 to-emerald-500/5 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/25 scale-[1.02]'
              : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
          title="Manga & Manhwa Reader"
        >
          <BookOpen className={`w-4 h-4 mb-0.5 ${navMode === 'manga' ? 'text-emerald-300 stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-extrabold tracking-tight">Manga</span>
          {navMode === 'manga' && (
            <span className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5" />
          )}
        </button>

        {/* 6. Dedicated ReelShort Hub */}
        <button
          type="button"
          onClick={() => onSelectNavMode('reelshort')}
          className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-2xl transition-all duration-200 active:scale-90 ${
            navMode === 'reelshort'
              ? 'bg-gradient-to-t from-amber-500/25 to-amber-500/5 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/25 scale-[1.02]'
              : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
          title="ReelShort Drama Hub"
        >
          <Clapperboard className={`w-4 h-4 mb-0.5 ${navMode === 'reelshort' ? 'text-amber-300 stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-extrabold tracking-tight">Reels</span>
          {navMode === 'reelshort' && (
            <span className="w-1 h-1 rounded-full bg-amber-400 mt-0.5" />
          )}
        </button>
      </div>
    </nav>
  );
};
