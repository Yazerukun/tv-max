import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navigation/Navbar';
import { Sidebar } from './components/Navigation/Sidebar';
import { MobileBottomDock } from './components/Navigation/MobileBottomDock';
import { CinemaVODHub } from './components/Cinema/CinemaVODHub';
import { LiveTVHub } from './components/LiveTV/LiveTVHub';
import { AnimeHub } from './components/Anime/AnimeHub';
import { MangaHub } from './components/Manga/MangaHub';
import { ReelShortHub } from './components/ReelShort/ReelShortHub';
import { CinemaPlayer } from './components/Player/CinemaPlayer';
import { AIOStreamsModal } from './components/Modals/AIOStreamsModal';
import { ShortcutsModal } from './components/Modals/ShortcutsModal';
import { CinemaMovie, Episode } from './data/cinemaMovies';
import { 
  getStoredPlayerSettings, 
  saveStoredPlayerSettings, 
  PlayerSettings, 
  getStoredWatchlist,
  getStoredViewMode,
  saveStoredViewMode,
  getStoredNavMode,
  saveStoredNavMode,
  NavMode
} from './utils/storage';

export const App: React.FC = () => {
  // Navigation Mode (Cinema / Movies vs Dedicated Free Live TV Hub vs Dedicated Anime Hub)
  const [navMode, setNavMode] = useState<NavMode>(() => getStoredNavMode());

  // Currently streaming movie / episode state
  const [activeMovie, setActiveMovie] = useState<CinemaMovie | null>(null);
  const [activeEpisode, setActiveEpisode] = useState<Episode | undefined>(undefined);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'rails' | 'grid'>(() => getStoredViewMode());

  // Watchlist Count Tracking
  const [watchlistCount, setWatchlistCount] = useState<number>(() => getStoredWatchlist().length);

  // Modals
  const [isAIOStreamsOpen, setIsAIOStreamsOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  // Player Settings (Ambient Glow, Volume, Aspect Ratio, Speed)
  const [playerSettings, setPlayerSettings] = useState<PlayerSettings>(() => getStoredPlayerSettings());

  const handleSelectNavMode = useCallback((mode: NavMode) => {
    setNavMode(mode);
    saveStoredNavMode(mode);
    if (activeMovie) {
      setActiveMovie(null);
      setActiveEpisode(undefined);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeMovie]);

  const handleUpdateSettings = useCallback((updated: Partial<PlayerSettings>) => {
    setPlayerSettings((prev) => {
      const next = { ...prev, ...updated };
      saveStoredPlayerSettings(next);
      return next;
    });
  }, []);

  const handleToggleViewMode = useCallback(() => {
    setViewMode((prev) => {
      const next = prev === 'rails' ? 'grid' : 'rails';
      saveStoredViewMode(next);
      return next;
    });
  }, []);

  const handlePlayMovie = useCallback((movie: CinemaMovie, episode?: Episode) => {
    setActiveMovie(movie);
    setActiveEpisode(episode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBackToCatalog = useCallback(() => {
    setActiveMovie(null);
    setActiveEpisode(undefined);
  }, []);

  // Global Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      switch (e.key) {
        case 'Escape':
          if (isAIOStreamsOpen) {
            setIsAIOStreamsOpen(false);
          } else if (isShortcutsOpen) {
            setIsShortcutsOpen(false);
          } else if (activeMovie) {
            handleBackToCatalog();
          }
          break;
        case 's':
        case 'S':
          setIsAIOStreamsOpen((prev) => !prev);
          break;
        case '?':
          setIsShortcutsOpen((prev) => !prev);
          break;
        case '/':
          e.preventDefault();
          const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
          searchInput?.focus();
          break;
        case 'g':
        case 'G':
          handleUpdateSettings({ ambientGlow: !playerSettings.ambientGlow });
          break;
        case 'm':
        case 'M':
          handleUpdateSettings({ muted: !playerSettings.muted });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMovie, isAIOStreamsOpen, isShortcutsOpen, playerSettings, handleBackToCatalog, handleUpdateSettings]);

  // Keep watchlist count in sync
  const refreshWatchlistCount = () => {
    setWatchlistCount(getStoredWatchlist().length);
  };

  return (
    <div className="min-h-screen bg-[#04060c] text-slate-100 flex flex-col md:flex-row font-sans selection:bg-cyan-500 selection:text-black">
      {/* 1. Left Sidebar Navigation (Desktop / Tablet) featuring all 6 Entertainment Hubs */}
      {!activeMovie && (
        <Sidebar
          navMode={navMode}
          onSelectNavMode={handleSelectNavMode}
          watchlistCount={watchlistCount}
          onOpenAIOStreams={() => setIsAIOStreamsOpen(true)}
          onOpenShortcutsModal={() => setIsShortcutsOpen(true)}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            refreshWatchlistCount();
          }}
          selectedCategory={selectedCategory}
        />
      )}

      {/* 2. Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Navbar */}
        {!activeMovie && (
          <Navbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenAIOStreams={() => setIsAIOStreamsOpen(true)}
            onOpenShortcutsModal={() => setIsShortcutsOpen(true)}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              if (activeMovie) setActiveMovie(null);
              refreshWatchlistCount();
            }}
            selectedCategory={selectedCategory}
            watchlistCount={watchlistCount}
            viewMode={viewMode}
            onToggleViewMode={handleToggleViewMode}
            navMode={navMode}
            onSelectNavMode={handleSelectNavMode}
          />
        )}

        {/* Main Viewport: Cinema Player vs 6 Core Hubs */}
        <main className="flex-1 w-full relative">
          {activeMovie ? (
            <CinemaPlayer
              movie={activeMovie}
              activeEpisode={activeEpisode}
              onBackToCatalog={handleBackToCatalog}
              onSelectEpisode={(ep) => setActiveEpisode(ep)}
              settings={playerSettings}
              onUpdateSettings={handleUpdateSettings}
            />
          ) : navMode === 'livetv' ? (
            <LiveTVHub onBackToCinema={() => handleSelectNavMode('cinema')} />
          ) : navMode === 'anime' ? (
            <AnimeHub
              onBackToCinema={() => handleSelectNavMode('cinema')}
              onNavigateToLiveTv={() => handleSelectNavMode('livetv')}
              onNavigateToManga={() => handleSelectNavMode('manga')}
              onNavigateToReelShort={() => handleSelectNavMode('reelshort')}
            />
          ) : navMode === 'manga' ? (
            <MangaHub
              onBackToCinema={() => handleSelectNavMode('cinema')}
              onNavigateToSeries={() => handleSelectNavMode('series')}
              onNavigateToLiveTv={() => handleSelectNavMode('livetv')}
              onNavigateToAnime={() => handleSelectNavMode('anime')}
              onNavigateToReelShort={() => handleSelectNavMode('reelshort')}
            />
          ) : navMode === 'reelshort' ? (
            <ReelShortHub
              onBackToCinema={() => handleSelectNavMode('cinema')}
              onNavigateToSeries={() => handleSelectNavMode('series')}
              onNavigateToLiveTv={() => handleSelectNavMode('livetv')}
              onNavigateToAnime={() => handleSelectNavMode('anime')}
              onNavigateToManga={() => handleSelectNavMode('manga')}
            />
          ) : (
            <CinemaVODHub
              initialCategory={navMode === 'series' ? 'series' : selectedCategory}
              onPlayMovie={handlePlayMovie}
              onNavigateToTv={() => handleSelectNavMode('livetv')}
              onNavigateToAnime={() => handleSelectNavMode('anime')}
              onNavigateToManga={() => handleSelectNavMode('manga')}
              onNavigateToReelShort={() => handleSelectNavMode('reelshort')}
              onOpenAIOStreams={() => setIsAIOStreamsOpen(true)}
            />
          )}
        </main>

        {/* 3. Mobile Thumb Navigation Dock */}
        {!activeMovie && (
          <MobileBottomDock
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              refreshWatchlistCount();
            }}
            onOpenAIOStreams={() => setIsAIOStreamsOpen(true)}
            watchlistCount={watchlistCount}
            navMode={navMode}
            onSelectNavMode={handleSelectNavMode}
          />
        )}
      </div>

      {/* 4. AIOStreams Super-Addon Aggregator Modal */}
      <AIOStreamsModal
        isOpen={isAIOStreamsOpen}
        onClose={() => setIsAIOStreamsOpen(false)}
      />

      {/* 5. TV Remote & Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};
