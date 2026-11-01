import React from 'react';
import { 
  Film, 
  Tv, 
  Bookmark, 
  SlidersHorizontal,
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
  onOpenAIOStreams,
  watchlistCount,
  navMode,
  onSelectNavMode,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#04060c]/95 backdrop-blur-2xl border-t border-white/10 px-1 py-1.5 select-none safe-area-bottom shadow-2xl">
      <div className="grid grid-cols-6 gap-0.5 items-center max-w-lg mx-auto">
        {/* 1. Cinema / Movies */}
        <button
          onClick={() => {
            onSelectNavMode('cinema');
            onSelectCategory('all');
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
            navMode === 'cinema' && selectedCategory !== 'watchlist'
              ? 'text-cyan-400 bg-cyan-500/15'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Film className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] font-bold tracking-tight">Movies</span>
        </button>

        {/* 2. TV Series & Shows */}
        <button
          onClick={() => {
            onSelectNavMode('series');
            onSelectCategory('series');
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
            navMode === 'series'
              ? 'text-purple-400 bg-purple-500/15'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] font-bold tracking-tight">Series</span>
        </button>

        {/* 3. Free Live TV Hub */}
        <button
          onClick={() => onSelectNavMode('livetv')}
          className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition ${
            navMode === 'livetv'
              ? 'text-rose-400 bg-rose-500/15 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Tv className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] font-bold tracking-tight flex items-center gap-0.5">
            Live
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
            </span>
          </span>
        </button>

        {/* 4. Dedicated Anime Hub */}
        <button
          onClick={() => onSelectNavMode('anime')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
            navMode === 'anime'
              ? 'text-fuchsia-400 bg-fuchsia-500/15'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] font-bold tracking-tight">Anime</span>
        </button>

        {/* 5. Dedicated Manhwa / Manga Reader */}
        <button
          onClick={() => onSelectNavMode('manga')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
            navMode === 'manga'
              ? 'text-emerald-400 bg-emerald-500/15'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] font-bold tracking-tight">Manga</span>
        </button>

        {/* 6. Dedicated ReelShort Hub */}
        <button
          onClick={() => onSelectNavMode('reelshort')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
            navMode === 'reelshort'
              ? 'text-amber-400 bg-amber-500/15'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clapperboard className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] font-bold tracking-tight">Reels</span>
        </button>
      </div>
    </nav>
  );
};
