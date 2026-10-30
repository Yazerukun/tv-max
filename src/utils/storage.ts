// TV MAX Storage & Persistence Engine (Nuvio & AIOStreams)

const STORAGE_KEYS = {
  WATCHLIST: 'tvmax_watchlist',
  SETTINGS: 'tvmax_player_settings',
  VIEW_MODE: 'tvmax_view_mode',
  LAST_PLAYED: 'tvmax_last_played',
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
