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
import { FloatingMiniPlayer } from './components/Player/FloatingMiniPlayer';
import { AIOStreamsModal } from './components/Modals/AIOStreamsModal';
import { ShortcutsModal } from './components/Modals/ShortcutsModal';
import { ContinueWatchingModal } from './components/Modals/ContinueWatchingModal';
import { SpotlightSearchModal } from './components/Modals/SpotlightSearchModal';
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
  getStoredWatchProgress,
  WatchProgress,
  NavMode
} from './utils/storage';
import { useSpatialNav } from './utils/useSpatialNav';
import { usePWA } from './utils/usePWA';

export const App: React.FC = () => {
  // Navigation Mode (Cinema / Movies vs Dedicated Free Live TV Hub vs Dedicated Anime Hub)
  const [navMode, setNavMode] = useState<NavMode>(() => getStoredNavMode());

  // Currently streaming movie / episode state
  const [activeMovie, setActiveMovie] = useState<CinemaMovie | null>(null);
  const [activeEpisode, setActiveEpisode] = useState<Episode | undefined>(undefined);

  // Picture-in-Picture Floating Mini-Player state
  const [miniPlayerMovie, setMiniPlayerMovie] = useState<CinemaMovie | null>(null);
  const [miniPlayerEpisode, setMiniPlayerEpisode] = useState<Episode | undefined>(undefined);

  // Continue Watching list state
  const [watchProgressList, setWatchProgressList] = useState<WatchProgress[]>(() => getStoredWatchProgress());

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'rails' | 'grid'>(() => getStoredViewMode());

  // Watchlist Count Tracking
  const [watchlistCount, setWatchlistCount] = useState<number>(() => getStoredWatchlist().length);

  // Modals
  const [isAIOStreamsOpen, setIsAIOStreamsOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isContinueWatchingOpen, setIsContinueWatchingOpen] = useState<boolean>(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState<boolean>(false);

  // Player Settings (Ambient Glow, Volume, Aspect Ratio, Speed)
  const [playerSettings, setPlayerSettings] = useState<PlayerSettings>(() => getStoredPlayerSettings());

  // Smart TV 10-Foot Spatial Nav Hook
  const { isTvMode, toggleTvMode } = useSpatialNav();

  // PWA Standalone Install Hook
  const { isInstallable, installApp } = usePWA();

  // Sync Continue Watching progress on window focus or storage update
  useEffect(() => {
    const refresh = () => setWatchProgressList(getStoredWatchProgress());
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const handleSelectNavMode = useCallback((mode: NavMode) => {
    setNavMode(mode);
    saveStoredNavMode(mode);
    // If active movie was playing, dock it into the floating mini-player instead of killing it
    if (activeMovie) {
      setMiniPlayerMovie(activeMovie);
      setMiniPlayerEpisode(activeEpisode);
      setActiveMovie(null);
      setActiveEpisode(undefined);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeMovie, activeEpisode]);

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
    setMiniPlayerMovie(null);
    setMiniPlayerEpisode(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBackToCatalog = useCallback(() => {
    setActiveMovie(null);
    setActiveEpisode(undefined);
    setWatchProgressList(getStoredWatchProgress());
  }, []);

  const handleMinimizeToMiniPlayer = useCallback(() => {
    if (activeMovie) {
      setMiniPlayerMovie(activeMovie);
      setMiniPlayerEpisode(activeEpisode);
      setActiveMovie(null);
      setActiveEpisode(undefined);
    }
  }, [activeMovie, activeEpisode]);

  const handleExpandMiniPlayer = useCallback(() => {
    if (miniPlayerMovie) {
      setActiveMovie(miniPlayerMovie);
      setActiveEpisode(miniPlayerEpisode);
      setMiniPlayerMovie(null);
      setMiniPlayerEpisode(undefined);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [miniPlayerMovie, miniPlayerEpisode]);

  const handleCloseMiniPlayer = useCallback(() => {
    setMiniPlayerMovie(null);
    setMiniPlayerEpisode(undefined);
  }, []);

  // Global Keyboard Navigation (Cmd+K, Shortcuts, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K for Universal Spotlight Search
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
        return;
      }

      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      switch (e.key) {
        case 'Escape':
          if (isSpotlightOpen) {
            setIsSpotlightOpen(false);
          } else if (isContinueWatchingOpen) {
            setIsContinueWatchingOpen(false);
          } else if (isAIOStreamsOpen) {
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
          setIsSpotlightOpen(true);
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
  }, [
    activeMovie, 
    isSpotlightOpen, 
    isContinueWatchingOpen, 
    isAIOStreamsOpen, 
    isShortcutsOpen, 
    playerSettings, 
    handleBackToCatalog, 
    handleUpdateSettings
  ]);

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
          continueWatchingCount={watchProgressList.length}
          onOpenAIOStreams={() => setIsAIOStreamsOpen(true)}
          onOpenShortcutsModal={() => setIsShortcutsOpen(true)}
          onOpenSpotlight={() => setIsSpotlightOpen(true)}
          onOpenContinueWatching={() => setIsContinueWatchingOpen(true)}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            refreshWatchlistCount();
          }}
          selectedCategory={selectedCategory}
          isTvMode={isTvMode}
          onToggleTvMode={toggleTvMode}
          isInstallable={isInstallable}
          onInstallApp={installApp}
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
            onOpenSpotlight={() => setIsSpotlightOpen(true)}
            onOpenContinueWatching={() => setIsContinueWatchingOpen(true)}
            continueWatchingCount={watchProgressList.length}
            isTvMode={isTvMode}
            onToggleTvMode={toggleTvMode}
            isInstallable={isInstallable}
            onInstallApp={installApp}
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
              onMinimizeToMiniPlayer={handleMinimizeToMiniPlayer}
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

      {/* 4. Floating Picture-in-Picture Mini-Player (Shows while browsing other hubs) */}
      {miniPlayerMovie && !activeMovie && (
        <FloatingMiniPlayer
          movie={miniPlayerMovie}
          activeEpisode={miniPlayerEpisode}
          onExpand={handleExpandMiniPlayer}
          onClose={handleCloseMiniPlayer}
        />
      )}

      {/* 5. Universal Spotlight Search Modal (Cmd+K / Ctrl+K) */}
      <SpotlightSearchModal
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        onSelectMovie={handlePlayMovie}
        onNavigateHub={handleSelectNavMode}
      />

      {/* 6. Continue Watching & Progress Resume Modal */}
      <ContinueWatchingModal
        isOpen={isContinueWatchingOpen}
        onClose={() => setIsContinueWatchingOpen(false)}
        progressList={watchProgressList}
        onProgressUpdated={(updated) => setWatchProgressList(updated)}
        onPlayItem={handlePlayMovie}
      />

      {/* 7. AIOStreams Super-Addon Aggregator Modal */}
      <AIOStreamsModal
        isOpen={isAIOStreamsOpen}
        onClose={() => setIsAIOStreamsOpen(false)}
      />

      {/* 8. TV Remote & Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};
