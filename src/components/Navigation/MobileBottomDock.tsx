import React from 'react';
import { 
  Film, 
  Tv, 
  Bookmark, 
  SlidersHorizontal,
  Compass,
  Sparkles
} from 'lucide-react';

interface MobileBottomDockProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenAIOStreams: () => void;
  watchlistCount: number;
  navMode: 'cinema' | 'livetv';
  onSelectNavMode: (mode: 'cinema' | 'livetv') => void;
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#04060c]/95 backdrop-blur-2xl border-t border-white/10 px-2 py-1.5 select-none safe-area-bottom shadow-2xl">
      <div className="grid grid-cols-5 gap-1 items-center max-w-lg mx-auto">
        {/* 1. Cinema VOD */}
        <button
          onClick={() => {
            onSelectNavMode('cinema');
            onSelectCategory('all');
          }}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
            navMode === 'cinema' && selectedCategory !== 'watchlist' && selectedCategory !== 'series'
              ? 'text-cyan-400 bg-cyan-500/15'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Film className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight">Cinema</span>
        </button>

        {/* 2. Free Live TV Hub (Dedicated Mode) */}
        <button
          onClick={() => onSelectNavMode('livetv')}
          className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
            navMode === 'livetv'
              ? 'text-rose-400 bg-rose-500/15 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Tv className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight flex items-center gap-1">
            Live TV
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
            </span>
          </span>
        </button>

        {/* 3. TV Series & Sagas */}
        <button
          onClick={() => {
            onSelectNavMode('cinema');
            onSelectCategory('series');
          }}
          className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
            navMode === 'cinema' && selectedCategory === 'series'
              ? 'text-purple-400 bg-purple-500/15'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight">Series</span>
        </button>

        {/* 4. Watchlist */}
        <button
          onClick={() => {
            onSelectNavMode('cinema');
            onSelectCategory('watchlist');
          }}
          className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
            navMode === 'cinema' && selectedCategory === 'watchlist'
              ? 'text-amber-400 bg-amber-500/15'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight">Watchlist</span>
          {watchlistCount > 0 && (
            <span className="absolute top-1 right-3 w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-black flex items-center justify-center">
              {watchlistCount}
            </span>
          )}
        </button>

        {/* 5. AIOStreams Addons */}
        <button
          onClick={onOpenAIOStreams}
          className="flex flex-col items-center justify-center py-1.5 rounded-xl text-slate-400 hover:text-white transition"
        >
          <SlidersHorizontal className="w-5 h-5 mb-0.5 text-cyan-400" />
          <span className="text-[10px] font-bold tracking-tight">Addons</span>
        </button>
      </div>
    </nav>
  );
};
