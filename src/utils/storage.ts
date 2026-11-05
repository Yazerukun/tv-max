// TV MAX Storage & Persistence Engine (Nuvio Mobile v0.6.7-beta & AIOStreams v2.37.0)

const STORAGE_KEYS = {
  WATCHLIST: 'tvmax_watchlist',
  SETTINGS: 'tvmax_player_settings',
  VIEW_MODE: 'tvmax_view_mode',
  LAST_PLAYED: 'tvmax_last_played',
  CONTINUE_WATCHING: 'tvmax_continue_watching',
  SUBTITLES: 'tvmax_subtitle_settings',
};

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

export interface ContinueWatchingItem {
  id: string; // unique item id (movieId or `${movieId}:${episodeId}`)
  movieId: string;
  movieTitle: string;
  posterUrl: string;
  backdropUrl: string;
  type: 'movie' | 'series';
  episodeId?: string;
  episodeNumber?: number;
  seasonNumber?: number;
  episodeTitle?: string;
  progressSeconds: number;
  durationSeconds: number;
  percentage: number;
  updatedAt: number;
  isWatched?: boolean;
}

export interface SubtitleSettings {
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  color: 'white' | 'yellow' | 'cyan' | 'green';
  background: 'none' | 'translucent' | 'solid';
  edgeStyle: 'none' | 'outline' | 'shadow';
}

export const DEFAULT_SUBTITLE_SETTINGS: SubtitleSettings = {
  fontSize: 'medium',
  color: 'yellow',
  background: 'translucent',
  edgeStyle: 'outline',
};

// 1. Watchlist Storage
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

// 2. Player Settings Storage
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

// 3. View Mode Storage
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

// 4. Continue Watching Storage (Nuvio 0.6.7 parity)
export function getStoredContinueWatching(): ContinueWatchingItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONTINUE_WATCHING);
    if (!raw) return [];
    const list: ContinueWatchingItem[] = JSON.parse(raw);
    return Array.isArray(list) ? list.sort((a, b) => b.updatedAt - a.updatedAt) : [];
  } catch {
    return [];
  }
}

export function saveWatchProgress(item: Omit<ContinueWatchingItem, 'updatedAt'>): void {
  try {
    const list = getStoredContinueWatching();
    const existingIndex = list.findIndex(x => x.id === item.id);
    const updated: ContinueWatchingItem = {
      ...item,
      updatedAt: Date.now()
    };
    let nextList: ContinueWatchingItem[];
    if (existingIndex >= 0) {
      nextList = [...list];
      nextList[existingIndex] = updated;
    } else {
      nextList = [updated, ...list];
    }
    // Cap to top 20 continue watching items
    localStorage.setItem(STORAGE_KEYS.CONTINUE_WATCHING, JSON.stringify(nextList.slice(0, 20)));
  } catch (err) {
    console.warn('Failed to save watch progress:', err);
  }
}

export function markAsWatched(id: string): ContinueWatchingItem[] {
  try {
    const list = getStoredContinueWatching();
    const next = list.map(item => item.id === id ? { ...item, isWatched: true, percentage: 100 } : item);
    localStorage.setItem(STORAGE_KEYS.CONTINUE_WATCHING, JSON.stringify(next));
    return next;
  } catch {
    return [];
  }
}

export function removeFromContinueWatching(id: string): ContinueWatchingItem[] {
  try {
    const list = getStoredContinueWatching();
    const next = list.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.CONTINUE_WATCHING, JSON.stringify(next));
    return next;
  } catch {
    return [];
  }
}

// 5. Subtitle Settings Storage
export function getStoredSubtitleSettings(): SubtitleSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBTITLES);
    return raw ? { ...DEFAULT_SUBTITLE_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SUBTITLE_SETTINGS;
  } catch {
    return DEFAULT_SUBTITLE_SETTINGS;
  }
}

export function saveStoredSubtitleSettings(settings: SubtitleSettings): void {
  localStorage.setItem(STORAGE_KEYS.SUBTITLES, JSON.stringify(settings));
}
