import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  Film, 
  Tv, 
  Radio, 
  Sparkles, 
  BookOpen, 
  PlaySquare, 
  ArrowRight,
  TrendingUp,
  Star
} from 'lucide-react';
import { CINEMA_MOVIES, CinemaMovie, Episode } from '../../data/cinemaMovies';
import { LIVE_TV_CHANNELS, LiveChannel } from '../../data/liveTvChannels';
import { NavMode } from '../../utils/storage';

export type SearchResultItem = 
  | { type: 'movie'; data: CinemaMovie; title: string; subtitle: string; badge: string; image: string }
  | { type: 'channel'; data: LiveChannel; title: string; subtitle: string; badge: string; image: string }
  | { type: 'anime'; query: string; title: string; subtitle: string; badge: string; image: string }
  | { type: 'manga'; query: string; title: string; subtitle: string; badge: string; image: string }
  | { type: 'reelshort'; query: string; title: string; subtitle: string; badge: string; image: string };

interface SpotlightSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMovie: (movie: CinemaMovie, episode?: Episode) => void;
  onSelectLiveChannel?: (channel: LiveChannel) => void;
  onNavigateHub: (mode: NavMode) => void;
}

export const SpotlightSearchModal: React.FC<SpotlightSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectMovie,
  onNavigateHub,
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'movies' | 'series' | 'livetv' | 'anime' | 'manga' | 'reelshort'>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Aggregate results across all 6 hubs
  const results = useMemo<SearchResultItem[]>(() => {
    const q = query.trim().toLowerCase();
    const items: SearchResultItem[] = [];

    // 1. Cinema Movies & Series
    if (activeFilter === 'all' || activeFilter === 'movies' || activeFilter === 'series') {
      const filteredMovies = CINEMA_MOVIES.filter((m) => {
        if (activeFilter === 'movies' && m.type === 'series') return false;
        if (activeFilter === 'series' && m.type !== 'series') return false;
        if (!q) return true;
        return (
          m.title.toLowerCase().includes(q) ||
          m.genres.some((g) => g.toLowerCase().includes(q)) ||
          m.cast.some((c) => c.toLowerCase().includes(q)) ||
          m.year.toString().includes(q)
        );
      }).slice(0, q ? 10 : 6);

      filteredMovies.forEach((m) => {
        items.push({
          type: 'movie',
          data: m,
          title: m.title,
          subtitle: `${m.year} • ${m.genres.slice(0, 2).join(', ')} • ★ ${m.imdbScore}`,
          badge: m.type === 'series' ? 'TV SERIES' : '4K MOVIE',
          image: m.posterUrl,
        });
      });
    }

    // 2. Live TV Channels
    if (activeFilter === 'all' || activeFilter === 'livetv') {
      const filteredChannels = LIVE_TV_CHANNELS.filter((ch) => {
        if (!q) return true;
        return (
          ch.name.toLowerCase().includes(q) ||
          ch.category.toLowerCase().includes(q) ||
          ch.currentShow.toLowerCase().includes(q)
        );
      }).slice(0, q ? 6 : 4);

      filteredChannels.forEach((ch) => {
        items.push({
          type: 'channel',
          data: ch,
          title: ch.name,
          subtitle: `${ch.quality} • ${ch.currentShow}`,
          badge: `LIVE ${ch.category.toUpperCase()}`,
          image: ch.logo,
        });
      });
    }

    // 3. Anime Hub (Yomi)
    if (activeFilter === 'all' || activeFilter === 'anime') {
      const animePicks = [
        { title: 'Solo Leveling (Arise)', genre: 'Action, Fantasy', badge: 'ANIME • YOMI' },
        { title: 'Jujutsu Kaisen', genre: 'Shounen, Supernatural', badge: 'ANIME • YOMI' },
        { title: 'Demon Slayer: Hashira Training', genre: 'Action, Demons', badge: 'ANIME • YOMI' },
        { title: 'Attack on Titan: The Final Season', genre: 'Dark Fantasy', badge: 'ANIME • YOMI' },
      ].filter((a) => !q || a.title.toLowerCase().includes(q) || a.genre.toLowerCase().includes(q));

      animePicks.forEach((a) => {
        items.push({
          type: 'anime',
          query: a.title,
          title: a.title,
          subtitle: a.genre,
          badge: a.badge,
          image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&q=80',
        });
      });
    }

    // 4. Manga & Manhwa (MangaFire)
    if (activeFilter === 'all' || activeFilter === 'manga') {
      const mangaPicks = [
        { title: 'Solo Leveling: Ragnarok', genre: 'Action, Webtoon', badge: 'MANGAFIRE' },
        { title: 'One Piece (Color Edition)', genre: 'Adventure, Fantasy', badge: 'MANGAFIRE' },
        { title: 'Omniscient Reader Viewpoint', genre: 'Action, System', badge: 'MANGAFIRE' },
      ].filter((m) => !q || m.title.toLowerCase().includes(q) || m.genre.toLowerCase().includes(q));

      mangaPicks.forEach((m) => {
        items.push({
          type: 'manga',
          query: m.title,
          title: m.title,
          subtitle: m.genre,
          badge: m.badge,
          image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&q=80',
        });
      });
    }

    // 5. ReelShort Trending Dramas
    if (activeFilter === 'all' || activeFilter === 'reelshort') {
      const reelPicks = [
        { title: 'The Billionaire’s Accidental Bride', tag: 'Alpha Billionaire, Romance', badge: 'REELSHORT' },
        { title: 'Cinderella for Wolf King', tag: 'Werewolf, Fantasy, Luna', badge: 'REELSHORT' },
        { title: 'Just One Kiss', tag: 'Secret Romance, CEO', badge: 'REELSHORT' },
        { title: 'The Firefighter I Slapped', tag: 'Enemies to Lovers', badge: 'REELSHORT' },
      ].filter((r) => !q || r.title.toLowerCase().includes(q) || r.tag.toLowerCase().includes(q));

      reelPicks.forEach((r) => {
        items.push({
          type: 'reelshort',
          query: r.title,
          title: r.title,
          subtitle: r.tag,
          badge: r.badge,
          image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&q=80',
        });
      });
    }

    return items;
  }, [query, activeFilter]);

  // Reset index when query or results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeFilter]);

  // Execute selected item
  const handleExecute = (item: SearchResultItem) => {
    if (item.type === 'movie') {
      onSelectMovie(item.data);
    } else if (item.type === 'channel') {
      onNavigateHub('livetv');
    } else if (item.type === 'anime') {
      onNavigateHub('anime');
    } else if (item.type === 'manga') {
      onNavigateHub('manga');
    } else if (item.type === 'reelshort') {
      onNavigateHub('reelshort');
    }
    onClose();
  };

  // Keyboard navigation inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleExecute(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#090d16] border border-cyan-500/35 rounded-3xl shadow-2xl shadow-cyan-950/60 overflow-hidden flex flex-col max-h-[75vh]"
        onKeyDown={handleKeyDown}
      >
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-slate-900/70">
          <Search className="w-5 h-5 text-cyan-400 flex-shrink-0 animate-pulse" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Movies, Series, Live TV, Anime, Manga, ReelShort... (⌘K / Ctrl+K)"
            className="w-full bg-transparent text-white text-base sm:text-lg placeholder:text-slate-500 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-mono text-slate-400 bg-white/10 border border-white/10">
              ESC to exit
            </span>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-950/50 border-b border-white/5 overflow-x-auto scrollbar-none">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'movies', label: '🎬 Movies' },
            { id: 'series', label: '🍿 Series' },
            { id: 'livetv', label: '📺 Live TV' },
            { id: 'anime', label: '🌸 Anime' },
            { id: 'manga', label: '📖 Manga' },
            { id: 'reelshort', label: '📱 ReelShort' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeFilter === tab.id
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-white/20"
        >
          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No matching titles or streams found for "<span className="text-cyan-400">{query}</span>"
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={`${item.type}-${idx}`}
                  onClick={() => handleExecute(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between gap-3 p-2.5 rounded-2xl cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'bg-cyan-500/20 border border-cyan-500/50 text-white shadow-md shadow-cyan-500/10'
                      : 'bg-white/5 hover:bg-white/10 border border-transparent text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Thumbnail */}
                    <div className="w-12 h-14 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-white/10">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Meta */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                            item.type === 'movie'
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : item.type === 'channel'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : item.type === 'anime'
                              ? 'bg-pink-500/20 text-pink-300'
                              : item.type === 'manga'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-purple-500/20 text-purple-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                      <p className="text-xs text-slate-400 truncate">{item.subtitle}</p>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 flex-shrink-0 transition-transform ${
                      isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Key Hints */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-slate-950/70 border-t border-white/5 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">ENTER</kbd> Open</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">ESC</kbd> Close</span>
          </div>
          <span className="text-cyan-400 font-semibold">{results.length} results</span>
        </div>
      </div>
    </div>
  );
};
