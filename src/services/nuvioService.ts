// Nuvio Media Live Realtime Metadata Service (Cinemeta & TMDB API)
import { CinemaMovie, Season, Episode, StreamServer } from '../data/cinemaMovies';
import { buildRealMovieStreams } from '../utils/streamUrls';

const CINEMETA_BASE = 'https://v3-cinemeta.strem.io';

export interface CinemetaMetaItem {
  id: string;
  type: 'movie' | 'series';
  name: string;
  year?: string | number;
  poster?: string;
  background?: string;
  imdbRating?: string | number;
  runtime?: string;
  genres?: string[];
  description?: string;
  director?: string[] | string;
  cast?: string[];
  videos?: Array<{
    id: string;
    name?: string;
    season: number;
    episode: number;
    overview?: string;
    thumbnail?: string;
    released?: string;
  }>;
}

// Convert Cinemeta item into TV MAX CinemaMovie structure
export function formatCinemetaMovie(item: CinemetaMetaItem, defaultCategory: CinemaMovie['category'] = 'trending'): CinemaMovie {
  const isSeries = item.type === 'series';
  const yearNumber = typeof item.year === 'string' ? parseInt(item.year) || 2024 : item.year || 2024;
  const ratingNumber = typeof item.imdbRating === 'string' ? parseFloat(item.imdbRating) || 7.5 : item.imdbRating || 7.5;
  
  const poster = item.poster || `https://images.metahub.space/poster/medium/${item.id}/img`;
  const backdrop = item.background || `https://images.metahub.space/background/medium/${item.id}/img`;

  // Process series episodes if present
  let seasons: Season[] | undefined = undefined;
  if (isSeries && item.videos && item.videos.length > 0) {
    const seasonsMap = new Map<number, Episode[]>();
    item.videos.forEach((vid) => {
      if (vid.season <= 0) return; // skip specials
      const ep: Episode = {
        id: vid.id || `${item.id}:${vid.season}:${vid.episode}`,
        seasonNumber: vid.season,
        episodeNumber: vid.episode,
        title: vid.name || `Episode ${vid.episode}`,
        duration: item.runtime || '45m',
        overview: vid.overview || `Season ${vid.season}, Episode ${vid.episode} of ${item.name}`,
        thumbnail: vid.thumbnail || backdrop,
        servers: buildRealMovieStreams(item.id, 'series', vid.season, vid.episode)
      };
      if (!seasonsMap.has(vid.season)) {
        seasonsMap.set(vid.season, []);
      }
      seasonsMap.get(vid.season)!.push(ep);
    });

    seasons = Array.from(seasonsMap.entries()).map(([seasonNumber, episodes]) => ({
      seasonNumber,
      title: `Season ${seasonNumber}`,
      episodes: episodes.sort((a, b) => a.episodeNumber - b.episodeNumber)
    }));
  }

  const castArray = Array.isArray(item.cast) ? item.cast : [];
  const directorString = Array.isArray(item.director) ? item.director.join(', ') : item.director || 'Cinemeta Director';
  const genresArray = Array.isArray(item.genres) && item.genres.length > 0 ? item.genres : ['Action', 'Drama'];

  const realServers = buildRealMovieStreams(item.id, isSeries ? 'series' : 'movie');

  return {
    id: item.id,
    title: item.name,
    type: isSeries ? 'series' : 'movie',
    year: yearNumber,
    rating: isSeries ? 'TV-MA' : 'PG-13',
    imdbScore: ratingNumber,
    duration: item.runtime || (isSeries ? 'Series' : '2h 10m'),
    genres: genresArray,
    category: isSeries ? 'series' : defaultCategory,
    backdropUrl: backdrop,
    posterUrl: poster,
    synopsis: item.description || `${item.name} (${yearNumber}) is an acclaimed ${genresArray.join(', ')} title.`,
    director: directorString,
    cast: castArray.length > 0 ? castArray : ['Leading Cast'],
    streamUrl: realServers[0].url,
    servers: realServers,
    seasons,
    quality: ratingNumber >= 8.0 ? '4K HDR' : '1080p HD',
    isFeatured: ratingNumber >= 8.2
  };
}

// 1. Fetch Realtime Trending Catalog from Cinemeta
export async function fetchRealtimeCatalog(type: 'movie' | 'series' = 'movie'): Promise<CinemaMovie[]> {
  try {
    const res = await fetch(`${CINEMETA_BASE}/catalog/${type}/top.json`);
    if (!res.ok) throw new Error(`Cinemeta error: ${res.status}`);
    const data = await res.json();
    if (!data.metas || !Array.isArray(data.metas)) return [];

    return data.metas.slice(0, 20).map((item: CinemetaMetaItem) => formatCinemetaMovie(item, type === 'series' ? 'series' : 'trending'));
  } catch (err) {
    console.warn('[NuvioService] Failed to fetch realtime catalog:', err);
    return [];
  }
}

// 2. Realtime Search across Cinemeta
export async function searchRealtimeMovies(query: string): Promise<CinemaMovie[]> {
  if (!query.trim()) return [];
  try {
    const encoded = encodeURIComponent(query.trim());
    const [movieRes, seriesRes] = await Promise.allSettled([
      fetch(`${CINEMETA_BASE}/catalog/movie/top/search=${encoded}.json`),
      fetch(`${CINEMETA_BASE}/catalog/series/top/search=${encoded}.json`)
    ]);

    const results: CinemaMovie[] = [];

    if (movieRes.status === 'fulfilled' && movieRes.value.ok) {
      const data = await movieRes.value.json();
      if (data.metas && Array.isArray(data.metas)) {
        results.push(...data.metas.slice(0, 10).map((m: CinemetaMetaItem) => formatCinemetaMovie(m, 'trending')));
      }
    }

    if (seriesRes.status === 'fulfilled' && seriesRes.value.ok) {
      const data = await seriesRes.value.json();
      if (data.metas && Array.isArray(data.metas)) {
        results.push(...data.metas.slice(0, 10).map((s: CinemetaMetaItem) => formatCinemetaMovie(s, 'series')));
      }
    }

    return results;
  } catch (err) {
    console.warn('[NuvioService] Realtime search error:', err);
    return [];
  }
}

// 3. Fetch Full Realtime Metadata including cast & full seasons/episodes
export async function fetchRealtimeDetails(id: string, type: 'movie' | 'series' = 'movie'): Promise<CinemaMovie | null> {
  try {
    const res = await fetch(`${CINEMETA_BASE}/meta/${type}/${id}.json`);
    if (!res.ok) throw new Error(`Cinemeta meta error: ${res.status}`);
    const data = await res.json();
    if (!data.meta) return null;

    return formatCinemetaMovie(data.meta, type === 'series' ? 'series' : 'trending');
  } catch (err) {
    console.warn(`[NuvioService] Failed to fetch details for ${id}:`, err);
    return null;
  }
}
