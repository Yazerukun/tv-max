import React, { useState } from 'react';
import { 
  Film, 
  Tv, 
  Sparkles, 
  BookOpen, 
  Clapperboard, 
  Compass, 
  Bookmark, 
  SlidersHorizontal, 
  Keyboard, 
  ChevronLeft, 
  ChevronRight,
  Search,
  RotateCcw,
  Monitor,
  Download,
  LayoutGrid,
  Rows
} from 'lucide-react';
import { NavMode } from '../../utils/storage';
import { LicensingState } from '../../services/licensingGuard';

interface SidebarProps {
  navMode: NavMode;
  onSelectNavMode: (mode: NavMode) => void;
  watchlistCount: number;
  continueWatchingCount?: number;
  onOpenAIOStreams: () => void;
  onOpenShortcutsModal: () => void;
  onOpenSpotlight: () => void;
  onOpenContinueWatching: () => void;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
  isTvMode?: boolean;
  onToggleTvMode?: () => void;
  isInstallable?: boolean;
  onInstallApp?: () => void;
  viewMode?: 'rails' | 'grid';
  onToggleViewMode?: () => void;
  licensingState?: LicensingState;
}

interface NavItem {
  id: NavMode;
  label: string;
  tagline: string;
  icon: React.ElementType;
  activeGradient: string;
  glowColor: string;
  textColor: string;
  badge?: string;
  badgeColor?: string;
  isLive?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'cinema',
    label: 'Movies',
    tagline: 'TV-MAX 4K VOD',
    icon: Film,
    activeGradient: 'from-cyan-400 to-sky-500',
    glowColor: 'shadow-cyan-500/25',
    textColor: 'text-cyan-400',
    badge: '4K',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
  },
  {
    id: 'series',
    label: 'TV Series',
    tagline: 'Shows & Sagas',
    icon: Compass,
    activeGradient: 'from-purple-500 to-indigo-600',
    glowColor: 'shadow-purple-500/25',
    textColor: 'text-purple-400',
    badge: 'SEASONS',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
  },
  {
    id: 'livetv',
    label: 'Live TV',
    tagline: '24/7 Cable Channels',
    icon: Tv,
    activeGradient: 'from-rose-500 to-red-600',
    glowColor: 'shadow-rose-500/30',
    textColor: 'text-rose-400',
    badge: 'LIVE',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    isLive: true
  },
  {
    id: 'anime',
    label: 'Anime Hub',
    tagline: 'Yomi Sub & Dub',
    icon: Sparkles,
    activeGradient: 'from-fuchsia-500 to-pink-600',
    glowColor: 'shadow-fuchsia-500/25',
    textColor: 'text-fuchsia-400',
    badge: 'YOMI',
    badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30'
  },
  {
    id: 'manga',
    label: 'Manga & Manhwa',
    tagline: 'MangaFire Reader',
    icon: BookOpen,
    activeGradient: 'from-emerald-500 to-teal-600',
    glowColor: 'shadow-emerald-500/25',
    textColor: 'text-emerald-400',
    badge: 'NO ADS',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
  },
  {
    id: 'reelshort',
    label: 'ReelShort',
    tagline: 'Viral Short Dramas',
    icon: Clapperboard,
    activeGradient: 'from-amber-500 to-orange-600',
    glowColor: 'shadow-amber-500/30',
    textColor: 'text-amber-400',
    badge: 'REELS',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  navMode,
  onSelectNavMode,
  watchlistCount,
  continueWatchingCount = 0,
  onOpenAIOStreams,
  onOpenShortcutsModal,
  onOpenSpotlight,
  onOpenContinueWatching,
  onSelectCategory,
  selectedCategory,
  isTvMode = false,
  onToggleTvMode,
  isInstallable = false,
  onInstallApp,
  viewMode = 'rails',
  onToggleViewMode,
  licensingState,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <aside 
      className={`hidden md:flex flex-col bg-[#050711] border-r border-white/10 select-none z-40 transition-all duration-300 ease-in-out relative flex-shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* 1. Header / Brand & Single Toggle */}
      {isCollapsed ? (
        /* Collapsed Header (Centered Logo + Single Expand Button) */
        <div className="h-24 flex flex-col items-center justify-center border-b border-white/10 px-2 py-3">
          <div 
            onClick={() => {
              onSelectNavMode('cinema');
              onSelectCategory('all');
            }}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 cursor-pointer hover:scale-105 transition-transform relative"
            title="TV MAX"
          >
            <div className="w-full h-full bg-[#070913] rounded-[14px] flex items-center justify-center">
              <Film className="w-5 h-5 text-cyan-400" />
            </div>
            {licensingState?.status === 'ACTIVE' && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 ring-2 ring-[#050711] animate-pulse" />
            )}
          </div>

          {/* Single Expand Button */}
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="w-8 h-7 mt-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
            title="Expand Sidebar"
            aria-label="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      ) : (
        /* Expanded Header (Logo + Brand Title + Status + Single Collapse Button) */
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
          <div 
            onClick={() => {
              onSelectNavMode('cinema');
              onSelectCategory('all');
            }}
            className="flex items-center gap-2.5 cursor-pointer group min-w-0"
            title="TV MAX"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <div className="w-full h-full bg-[#070913] rounded-[14px] flex items-center justify-center">
                <Film className="w-4 h-4 text-cyan-400" />
              </div>
            </div>

            <div className="text-left min-w-0">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-lg tracking-tighter bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent uppercase drop-shadow-sm font-sans">
                  TV MAX
                </span>
                <span className="px-1.5 py-0.2 rounded text-[8px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                  PRO
                </span>
                {licensingState?.status === 'ACTIVE' && (
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                    {licensingState.ticket?.tier === 'trial' ? '24h Trial' : `${licensingState.daysRemaining}d Left`}
                  </span>
                )}
              </div>
              <p className="text-[9px] text-slate-400 font-mono tracking-wider mt-0.5 truncate">
                MULTI-SERVER 4K
              </p>
            </div>
          </div>

          {/* Single Collapse Button */}
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="w-7 h-7 rounded-xl bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-300 flex items-center justify-center transition-all active:scale-95 cursor-pointer flex-shrink-0"
            title="Collapse Sidebar"
            aria-label="Collapse Sidebar"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* 2. Scrollable Body: Tools & Entertainment Hubs */}
      <div className="flex-1 px-3 py-3 space-y-3 overflow-y-auto scrollbar-none">
        {/* Spotlight Search Launcher */}
        <button
          onClick={onOpenSpotlight}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold transition shadow-sm cursor-pointer ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Universal Spotlight Search (⌘K / Ctrl+K)"
          data-nav="true"
        >
          <Search className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          {!isCollapsed && (
            <div className="flex-1 flex items-center justify-between text-left text-xs">
              <span>Quick Search...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] font-mono text-cyan-300 border border-cyan-500/30">
                ⌘K
              </kbd>
            </div>
          )}
        </button>

        {/* Entertainment Hubs Section */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 pb-1 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
              Entertainment Hubs
            </div>
          )}

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = navMode === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectNavMode(item.id);
                  if (item.id === 'cinema') onSelectCategory('all');
                }}
                data-nav="true"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl font-bold transition-all group relative cursor-pointer ${
                  isActive
                    ? `bg-gradient-to-r ${item.activeGradient} text-black ${item.glowColor} shadow-lg scale-[1.02]`
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={item.tagline}
              >
                <div className="relative flex-shrink-0">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black stroke-[2.5]' : item.textColor}`} />
                  {item.isLive && (
                    <span className="flex h-2 w-2 absolute -top-1 -right-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                  )}
                </div>

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between text-left min-w-0">
                    <span className="text-xs truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded tracking-wider ${
                        isActive ? 'bg-black/25 text-black' : item.badgeColor
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Library & Personal Tools Section */}
        <div className="space-y-1 pt-2 border-t border-white/5">
          {!isCollapsed && (
            <div className="px-3 pb-1 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
              Personal Library
            </div>
          )}

          {/* Continue Watching / Resume */}
          {onOpenContinueWatching && (
            <button
              onClick={onOpenContinueWatching}
              data-nav="true"
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                continueWatchingCount > 0
                  ? 'text-cyan-300 hover:bg-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title="Continue Watching"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between text-left">
                  <span>Continue Watching</span>
                  {continueWatchingCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {continueWatchingCount}
                    </span>
                  )}
                </div>
              )}
            </button>
          )}

          {/* Watchlist */}
          <button
            onClick={() => onSelectCategory(selectedCategory === 'watchlist' ? 'all' : 'watchlist')}
            data-nav="true"
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedCategory === 'watchlist'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="My Watchlist"
          >
            <Bookmark className={`w-4 h-4 flex-shrink-0 ${selectedCategory === 'watchlist' ? 'text-black' : 'text-amber-400'}`} />
            {!isCollapsed && (
              <div className="flex-1 flex items-center justify-between text-left">
                <span>Watchlist</span>
                {watchlistCount > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-black ${
                    selectedCategory === 'watchlist' ? 'bg-black text-amber-300' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {watchlistCount}
                  </span>
                )}
              </div>
            )}
          </button>
        </div>

        {/* Display, Settings & System Tools */}
        <div className="space-y-1 pt-2 border-t border-white/5">
          {!isCollapsed && (
            <div className="px-3 pb-1 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
              Display & Controls
            </div>
          )}

          {/* View Mode Switcher (Rails vs Grid) */}
          {onToggleViewMode && (
            <button
              onClick={onToggleViewMode}
              data-nav="true"
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer ${
                isCollapsed ? 'justify-center px-0' : ''
              }`}
              title={`Switch View: Currently ${viewMode === 'rails' ? 'Rails' : 'Grid'}`}
            >
              {viewMode === 'rails' ? (
                <>
                  <LayoutGrid className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  {!isCollapsed && <span>Switch to Grid View</span>}
                </>
              ) : (
                <>
                  <Rows className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  {!isCollapsed && <span>Switch to Rails View</span>}
                </>
              )}
            </button>
          )}

          {/* TV-MAX Stream Servers Settings */}
          <button
            onClick={onOpenAIOStreams}
            data-nav="true"
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition cursor-pointer ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="TV-MAX Stream Server Mirrors"
          >
            <SlidersHorizontal className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            {!isCollapsed && <span>Stream Servers</span>}
          </button>

          {/* 10-Foot Smart TV Spatial Nav Mode */}
          {onToggleTvMode && (
            <button
              onClick={onToggleTvMode}
              data-nav="true"
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                isTvMode
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title="Toggle Smart TV Remote Navigation (Key: T)"
            >
              <Monitor className={`w-4 h-4 flex-shrink-0 ${isTvMode ? 'text-purple-400' : 'text-slate-400'}`} />
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between text-left">
                  <span>10-Foot TV Mode</span>
                  <span className={`px-1.5 py-0.2 rounded text-[8px] font-mono font-bold ${
                    isTvMode ? 'bg-purple-500 text-black' : 'bg-white/10 text-slate-400'
                  }`}>
                    {isTvMode ? 'ON' : 'OFF'}
                  </span>
                </div>
              )}
            </button>
          )}

          {/* Remote & Keyboard Shortcuts */}
          <button
            onClick={onOpenShortcutsModal}
            data-nav="true"
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="TV Remote & Keyboard Shortcuts"
          >
            <Keyboard className="w-4 h-4 text-slate-400 flex-shrink-0" />
            {!isCollapsed && <span>Shortcuts (Keys)</span>}
          </button>

          {/* Install PWA App */}
          {isInstallable && onInstallApp && (
            <button
              onClick={onInstallApp}
              data-nav="true"
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 transition cursor-pointer ${
                isCollapsed ? 'justify-center px-0' : ''
              }`}
              title="Install TV-MAX Desktop / Mobile App"
            >
              <Download className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-bounce" />
              {!isCollapsed && <span>Install App</span>}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
