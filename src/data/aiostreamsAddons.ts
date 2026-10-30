export interface AIOStreamAddon {
  id: string;
  name: string;
  version: string;
  description: string;
  manifestUrl: string;
  type: 'scraper' | 'catalog' | 'subtitles' | 'live-tv' | 'debrid';
  icon: string;
  status: 'online' | 'latency-high' | 'offline';
  latencyMs: number;
  enabled: boolean;
  isBuiltIn: boolean;
  supportedTypes: ('movie' | 'series' | 'anime' | 'tv')[];
}

export const DEFAULT_AIO_ADDONS: AIOStreamAddon[] = [
  {
    id: 'addon-cinemeta',
    name: 'Cinemeta Catalog Hub',
    version: 'v3.0.12',
    description: 'Official IMDb & TMDB catalog metadata engine for movies, series, posters, synopses, and cast.',
    manifestUrl: 'https://v3-cinemeta.strem.io/manifest.json',
    type: 'catalog',
    icon: 'Film',
    status: 'online',
    latencyMs: 14,
    enabled: true,
    isBuiltIn: true,
    supportedTypes: ['movie', 'series', 'anime']
  },
  {
    id: 'addon-torrentio',
    name: 'Torrentio Streams Aggregator',
    version: 'v1.0.14',
    description: 'Multi-resolution stream provider aggregating 4K HDR, 1080p 60fps, and 720p high-speed video feeds.',
    manifestUrl: 'https://torrentio.strem.fun/manifest.json',
    type: 'scraper',
    icon: 'Zap',
    status: 'online',
    latencyMs: 28,
    enabled: true,
    isBuiltIn: true,
    supportedTypes: ['movie', 'series', 'anime']
  },
  {
    id: 'addon-mediafusion',
    name: 'MediaFusion Multi-Source',
    version: 'v4.2.0',
    description: 'Multi-server failover scraper indexing direct CDNs, global sports feeds, and TV broadcasts.',
    manifestUrl: 'https://mediafusion.elfhosted.com/manifest.json',
    type: 'scraper',
    icon: 'Sparkles',
    status: 'online',
    latencyMs: 36,
    enabled: true,
    isBuiltIn: true,
    supportedTypes: ['movie', 'series', 'tv']
  },
  {
    id: 'addon-comet',
    name: 'Comet Streams Fast Debrid',
    version: 'v2.1.0',
    description: 'High-speed torrent and debrid stream resolver with smart caching and fast indexers.',
    manifestUrl: 'https://comet.elfhosted.com/manifest.json',
    type: 'scraper',
    icon: 'Zap',
    status: 'online',
    latencyMs: 18,
    enabled: true,
    isBuiltIn: true,
    supportedTypes: ['movie', 'series', 'anime']
  },
  {
    id: 'addon-nuvio-vip',
    name: 'Nuvio 4K VIP CDN Engine',
    version: 'v0.6.5',
    description: 'Ultra-low latency edge delivery network with adaptive HLS bitrate switching and zero buffering.',
    manifestUrl: 'https://edge.nuvio.media/manifest.json',
    type: 'scraper',
    icon: 'Crown',
    status: 'online',
    latencyMs: 19,
    enabled: true,
    isBuiltIn: true,
    supportedTypes: ['movie', 'series', 'anime', 'tv']
  },
  {
    id: 'addon-cyberflix',
    name: 'CyberFlix VOD Catalog',
    version: 'v1.5.2',
    description: 'Trending and curated feeds from top worldwide streaming platforms with IMDb ratings.',
    manifestUrl: 'https://cyberflix.strem.fun/manifest.json',
    type: 'catalog',
    icon: 'Flame',
    status: 'online',
    latencyMs: 42,
    enabled: true,
    isBuiltIn: true,
    supportedTypes: ['movie', 'series']
  }
];

export interface AIOStreamsConfig {
  autoFailover: boolean;
  preferredQuality: '4K' | '1080p' | '720p' | 'Auto';
  maxFailoverAttempts: number;
  sortOrder: 'quality-first' | 'latency-first' | 'provider-first';
  realDebridApiKey?: string;
  addons: AIOStreamAddon[];
}

const STORAGE_KEY = 'tvmax_aiostreams_config';

export function getAIOStreamsConfig(): AIOStreamsConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        autoFailover: parsed.autoFailover ?? true,
        preferredQuality: parsed.preferredQuality ?? '1080p',
        maxFailoverAttempts: parsed.maxFailoverAttempts ?? 3,
        sortOrder: parsed.sortOrder ?? 'quality-first',
        realDebridApiKey: parsed.realDebridApiKey || '',
        addons: Array.isArray(parsed.addons) && parsed.addons.length > 0 ? parsed.addons : DEFAULT_AIO_ADDONS
      };
    }
  } catch (err) {
    console.warn('Failed to parse AIOStreams config:', err);
  }

  return {
    autoFailover: true,
    preferredQuality: '1080p',
    maxFailoverAttempts: 3,
    sortOrder: 'quality-first',
    realDebridApiKey: '',
    addons: DEFAULT_AIO_ADDONS
  };
}

export function saveAIOStreamsConfig(config: AIOStreamsConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save AIOStreams config:', err);
  }
}
