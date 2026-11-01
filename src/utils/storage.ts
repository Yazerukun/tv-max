// TV MAX Storage & Persistence Engine (Nuvio & AIOStreams)

const STORAGE_KEYS = {
  WATCHLIST: 'tvmax_watchlist',
  SETTINGS: 'tvmax_player_settings',
  VIEW_MODE: 'tvmax_view_mode',
  LAST_PLAYED: 'tvmax_last_played',
  WATCH_PROGRESS: 'tvmax_watch_progress',
  NAV_MODE: 'tvmax_nav_mode',
};

export interface WatchProgress {
  movieId: string;
  movieTitle: string;
  poster: string;
  backdrop?: string;
  type: 'movie' | 'series';
  seasonNumber?: number;
  episodeNumber?: number;
  episodeTitle?: string;
  currentTime: number;
  duration: number;
  percentage: number;
  lastWatched: number;
}

export interface PlayerSettings {
  ambientGlow: boolean;
  volume: number;
  muted: boolean;
  aspectRatio: '16:9' | 'fill' | 'contain' | '4:3';
  playbackSpeed: number;
  autoPlayNext: boolean;
}

export const DEFAULT_PLAYER_SETTINGS: PlayerSettings = {
  ambientGlow: true,
  volume: 0.85,
  muted: false,
  aspectRatio: '16:9',
  playbackSpeed: 1,
  autoPlayNext: true,
};

export function getStoredWatchlist(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredWatchlist(ids: string[]): void {
  localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(ids));
}

export function toggleStoredWatchlist(id: string): string[] {
  const current = getStoredWatchlist();
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
  saveStoredWatchlist(next);
  return next;
}

export function getStoredPlayerSettings(): PlayerSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_PLAYER_SETTINGS, ...JSON.parse(raw) } : DEFAULT_PLAYER_SETTINGS;
  } catch {
    return DEFAULT_PLAYER_SETTINGS;
  }
}

export function saveStoredPlayerSettings(settings: PlayerSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getStoredViewMode(): 'rails' | 'grid' {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
    return val === 'grid' ? 'grid' : 'rails';
  } catch {
    return 'rails';
  }
}

export function saveStoredViewMode(mode: 'rails' | 'grid'): void {
  localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode);
}

// Watch Progress Persistence (Continue Watching)
export function getStoredWatchProgress(): WatchProgress[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WATCH_PROGRESS);
    if (!raw) return [];
    const list: WatchProgress[] = JSON.parse(raw);
    return Array.isArray(list) ? list.sort((a, b) => b.lastWatched - a.lastWatched) : [];
  } catch {
    return [];
  }
}

export function saveWatchProgress(item: WatchProgress): void {
  try {
    const current = getStoredWatchProgress();
    // Filter out previous entry for the same movie/series
    const filtered = current.filter((x) => x.movieId !== item.movieId);
    const updated = [item, ...filtered].slice(0, 30); // keep up to 30 recent items
    localStorage.setItem(STORAGE_KEYS.WATCH_PROGRESS, JSON.stringify(updated));
  } catch (err) {
    console.warn('[Storage] Failed to save watch progress:', err);
  }
}

export function removeWatchProgress(movieId: string): WatchProgress[] {
  try {
    const current = getStoredWatchProgress();
    const updated = current.filter((x) => x.movieId !== movieId);
    localStorage.setItem(STORAGE_KEYS.WATCH_PROGRESS, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function getMovieWatchProgress(movieId: string): WatchProgress | undefined {
  const current = getStoredWatchProgress();
  return current.find((x) => x.movieId === movieId);
}

export type NavMode = 'cinema' | 'livetv' | 'anime';

export function getStoredNavMode(): NavMode {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.NAV_MODE);
    return val === 'livetv' || val === 'anime' ? val : 'cinema';
  } catch {
    return 'cinema';
  }
}

export function saveStoredNavMode(mode: NavMode): void {
  localStorage.setItem(STORAGE_KEYS.NAV_MODE, mode);
}
