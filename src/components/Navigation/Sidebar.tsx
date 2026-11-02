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
  Layers,
  Zap,
  Flame,
  Radio,
  Search,
  RotateCcw,
  Monitor,
  Download
} from 'lucide-react';
import { NavMode } from '../../utils/storage';

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
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <aside 
      className={`hidden md:flex flex-col bg-[#050711] border-r border-white/10 select-none z-40 transition-all duration-300 ease-in-out relative flex-shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* 0. Floating Rail Toggle Handle */}
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-5 w-7 h-7 rounded-full bg-[#0a0e22] hover:bg-cyan-500 border border-cyan-500/50 hover:border-cyan-300 text-cyan-300 hover:text-black shadow-lg shadow-cyan-500/25 flex items-center justify-center transition-all hover:scale-110 active:scale-90 z-50 cursor-pointer"
        title={isCollapsed ? 'Expand Sidebar Menu' : 'Collapse Sidebar Menu'}
        aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4 stroke-[2.5]" /> : <ChevronLeft className="w-4 h-4 stroke-[2.5]" />}
      </button>

      {/* 1. Header / Brand */}
      <div className={`h-16 flex items-center border-b border-white/10 ${
        isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
      }`}>
        <div 
          onClick={() => {
            if (isCollapsed) {
              setIsCollapsed(false);
            } else {
              onSelectNavMode('cinema');
              onSelectCategory('all');
            }
          }}
          className={`flex items-center gap-3 cursor-pointer group min-w-0 ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Click to Expand Sidebar' : 'TV MAX'}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
            <div className="w-full h-full bg-[#070913] rounded-[14px] flex items-center justify-center">
              <Film className="w-5 h-5 text-cyan-400" />
            </div>
          </div>

          {!isCollapsed && (
            <div className="text-left min-w-0 animate-fadeIn">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-lg tracking-tighter bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent uppercase drop-shadow-sm font-sans">
                  TV MAX
                </span>
                <span className="px-1.5 py-0.2 rounded text-[8px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider mt-0.5 truncate">
                6-IN-1 STREAM HUB
              </p>
            </div>
          )}
        </div>

        {/* Header Collapse Toggle Button (When Expanded) */}
        {!isCollapsed && (
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition-all active:scale-95 flex-shrink-0"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* 2. Primary 6 Entertainment Hubs Navigation */}
      <div className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto scrollbar-none">
        {/* Spotlight Search Launcher */}
        <button
          onClick={onOpenSpotlight}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold transition mb-2 shadow-sm ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Universal Spotlight Search (⌘K / Ctrl+K)"
          data-nav="true"
        >
          <Search className="w-4 h-4 text-cyan-400 flex-shrink-0 animate-pulse" />
          {!isCollapsed && (
            <div className="flex-1 flex items-center justify-between text-left text-xs">
              <span>Spotlight Search</span>
              <kbd className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] font-mono text-cyan-300 border border-cyan-500/30">
                ⌘K
              </kbd>
            </div>
          )}
        </button>

        {!isCollapsed && (
          <div className="px-3 pb-1 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
            Entertainment Hubs (6)
          </div>
        )}

        {NAV_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const isActive = navMode === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectNavMode(item.id)}
              data-nav="true"
              className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl font-bold transition-all duration-200 group relative ${
                isActive
                  ? `bg-gradient-to-r ${item.activeGradient} text-white shadow-lg ${item.glowColor} scale-[1.02]`
                  : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title={`${index + 1}. ${item.label} — ${item.tagline}`}
            >
              {/* Icon Container */}
              <div className={`relative flex items-center justify-center flex-shrink-0 ${
                isActive ? 'text-white' : item.textColor
              }`}>
                <Icon className="w-5 h-5" />
                {item.isLive && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                )}
              </div>

              {/* Labels & Tags (Hidden when collapsed) */}
              {!isCollapsed && (
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-black tracking-tight truncate ${
                      isActive ? 'text-white' : 'text-slate-200'
                    }`}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className={`px-1.5 py-0.2 rounded text-[8px] font-mono font-bold uppercase border ${
                        isActive 
                          ? 'bg-black/30 text-white border-white/20' 
                          : item.badgeColor
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className={`text-[10px] truncate ${
                    isActive ? 'text-white/80' : 'text-slate-500'
                  }`}>
                    {item.tagline}
                  </p>
                </div>
              )}

              {/* Collapsed Tooltip Indicator Number */}
              {isCollapsed && (
                <span className={`absolute top-1 right-2 text-[9px] font-mono font-black ${
                  isActive ? 'text-white' : 'text-slate-500'
                }`}>
                  #{index + 1}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Bottom Section: Continue Watching, Watchlist, TV Mode, AIO Addons, Shortcuts */}
      <div className="p-3 border-t border-white/10 bg-[#04060e] space-y-1 flex-shrink-0">
        {/* Continue Watching */}
        <button
          onClick={onOpenContinueWatching}
          data-nav="true"
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Continue Watching (Resume Playback)"
        >
          <RotateCcw className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          {!isCollapsed && (
            <div className="flex-1 flex items-center justify-between text-left">
              <span>Continue Watching</span>
              {continueWatchingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black bg-cyan-500/20 text-cyan-300">
                  {continueWatchingCount}
                </span>
              )}
            </div>
          )}
        </button>

        {/* Watchlist */}
        <button
          onClick={() => {
            onSelectNavMode('cinema');
            onSelectCategory(selectedCategory === 'watchlist' ? 'all' : 'watchlist');
          }}
          data-nav="true"
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition ${
            selectedCategory === 'watchlist' && navMode === 'cinema'
              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          } ${isCollapsed ? 'justify-center px-0' : ''}`}
          title="My Watchlist"
        >
          <Bookmark className="w-4 h-4 text-amber-400 flex-shrink-0" />
          {!isCollapsed && (
            <div className="flex-1 flex items-center justify-between text-left">
              <span>Watchlist</span>
              {watchlistCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black bg-amber-500/20 text-amber-300">
                  {watchlistCount}
                </span>
              )}
            </div>
          )}
        </button>

        {/* Smart TV / 10-Foot Spatial Nav Mode */}
        {onToggleTvMode && (
          <button
            onClick={onToggleTvMode}
            data-nav="true"
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition ${
              isTvMode
                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
            title="Toggle Smart TV 10-Foot Remote Navigation (Key: T)"
          >
            <Monitor className={`w-4 h-4 flex-shrink-0 ${isTvMode ? 'text-purple-400' : 'text-slate-400'}`} />
            {!isCollapsed && (
              <div className="flex-1 flex items-center justify-between text-left">
                <span>10-Foot TV Mode</span>
                <span className={`px-1.5 py-0.2 rounded text-[8px] font-mono font-bold ${
                  isTvMode ? 'bg-purple-500 text-black' : 'bg-white/10 text-slate-400'
                }`}>
                  {isTvMode ? 'ACTIVE' : 'OFF'}
                </span>
              </div>
            )}
          </button>
        )}

        {/* Install PWA App */}
        {isInstallable && onInstallApp && (
          <button
            onClick={onInstallApp}
            data-nav="true"
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 transition ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Install TV-MAX Desktop / Mobile App"
          >
            <Download className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-bounce" />
            {!isCollapsed && <span>Install TV-MAX</span>}
          </button>
        )}

        {/* TV-MAX Stream Servers */}
        <button
          onClick={onOpenAIOStreams}
          data-nav="true"
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="TV-MAX Stream Server Manager"
        >
          <SlidersHorizontal className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          {!isCollapsed && <span>Stream Servers</span>}
        </button>

        {/* Remote & Keyboard Shortcuts */}
        <button
          onClick={onOpenShortcutsModal}
          data-nav="true"
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="TV Remote & Keyboard Shortcuts"
        >
          <Keyboard className="w-4 h-4 text-slate-400 flex-shrink-0" />
          {!isCollapsed && <span>Shortcuts</span>}
        </button>

        {/* Dedicated High-Visibility Expand / Collapse Action */}
        <div className="pt-2 border-t border-white/5 mt-2">
          {isCollapsed ? (
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="w-full py-2.5 px-1 rounded-xl bg-gradient-to-r from-cyan-500/20 to-sky-500/20 hover:from-cyan-500/30 hover:to-sky-500/30 border border-cyan-500/40 text-cyan-300 hover:text-white flex flex-col items-center justify-center gap-0.5 transition-all hover:scale-105 active:scale-95 shadow-md shadow-cyan-500/10 cursor-pointer"
              title="Expand Full Sidebar Menu"
            >
              <ChevronRight className="w-5 h-5 text-cyan-400 stroke-[2.5]" />
              <span className="text-[9px] font-mono font-bold tracking-wider uppercase">Expand</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95 cursor-pointer"
              title="Collapse Sidebar"
            >
              <span className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4 text-slate-400 stroke-[2.5]" />
                <span>Collapse Menu</span>
              </span>
              <kbd className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] font-mono text-slate-400">
                Hide
              </kbd>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

