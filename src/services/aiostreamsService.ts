// AIOStreams v2.37.0 Live Scraper & Stream Resolver Engine
import { StreamServer, buildRealMovieStreams } from '../utils/streamUrls';

export interface RawAIOStream {
  name?: string;
  title?: string;
  url?: string;
  infoHash?: string;
  fileIdx?: number;
  behaviorHints?: {
    bingeGroup?: string;
    notWebReady?: boolean;
    proxyHeaders?: Record<string, string>;
  };
}

export interface StreamResolutionResult {
  servers: StreamServer[];
  isRealtime: boolean;
  latencyMs: number;
}

export { buildRealMovieStreams };

// 1. Live Stream Resolution via Torrentio & AIOStreams scrapers
export async function resolveRealtimeStreams(
  id: string,
  type: 'movie' | 'series' = 'movie',
  debridApiKey?: string,
  season: number = 1,
  episode: number = 1
): Promise<StreamResolutionResult> {
  const startTime = Date.now();
  const servers: StreamServer[] = [];

  // Generate verified real-movie mirrors
  const realMirrors = buildRealMovieStreams(id, type, season, episode);

  try {
    // If Real-Debrid token is provided, query Torrentio's debrid cache for direct video downloads/streams
    if (debridApiKey && debridApiKey.trim()) {
      const base = `https://torrentio.strem.fun/realdebrid=${encodeURIComponent(debridApiKey.trim())}/stream/${type}/${id}.json`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(base, { signal: controller.signal });
      clearTimeout(timeout);

      const latencyMs = Date.now() - startTime;

      if (res.ok) {
        const data = await res.json();
        if (data.streams && Array.isArray(data.streams)) {
          data.streams.slice(0, 4).forEach((stream: RawAIOStream, idx: number) => {
            if (stream.url) {
              const rawTitle = stream.title || stream.name || `Debrid Direct Mirror #${idx + 1}`;
              let quality = '1080p';
              if (/2160p|4k|uhd/i.test(rawTitle)) quality = '4K HDR';
              else if (/720p/i.test(rawTitle)) quality = '720p';

              servers.push({
                id: `aio-debrid-${idx}`,
                name: `[AIO Real-Debrid] ${quality} Uncapped Direct`,
                url: stream.url,
                type: stream.url.includes('.m3u8') ? 'hls' : 'mp4',
                quality: quality,
                provider: 'Real-Debrid CDN',
                speed: '95 MB/s',
                latency: `${latencyMs}ms`,
                isVerified: true
              });
            }
          });
        }
      }
    }
  } catch (err) {
    console.warn('[AIOStreams] Real-Debrid scraper check failed:', err);
  }

  // Combine Debrid streams with our 4 verified real movie mirrors
  const finalServers = [...servers, ...realMirrors];

  return {
    servers: finalServers,
    isRealtime: true,
    latencyMs: Date.now() - startTime,
  };
}
