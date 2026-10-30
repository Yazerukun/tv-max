import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Star, 
  Clock, 
  Calendar, 
  Film, 
  User, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  ChevronDown,
  Tv,
  Zap,
  Activity,
  Bookmark,
  Check,
  Server
} from 'lucide-react';
import { CinemaMovie, Episode, StreamServer } from '../../data/cinemaMovies';
import { getStoredWatchlist, toggleStoredWatchlist } from '../../utils/storage';

interface MovieDetailModalProps {
  movie: CinemaMovie;
  onClose: () => void;
  onPlayMovie: (movie: CinemaMovie, episode?: Episode) => void;
  onWatchlistChanged?: () => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  onClose,
  onPlayMovie,
  onWatchlistChanged,
}) => {
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number>(() => {
    return movie.seasons && movie.seasons.length > 0 ? movie.seasons[0].seasonNumber : 1;
  });
  const [isInWatchlist, setIsInWatchlist] = useState<boolean>(() => {
    return getStoredWatchlist().includes(movie.id);
  });

  const handleToggleWatchlist = () => {
    const updated = toggleStoredWatchlist(movie.id);
    setIsInWatchlist(updated.includes(movie.id));
    onWatchlistChanged?.();
  };

  const selectedSeason = movie.seasons?.find(s => s.seasonNumber === selectedSeasonNumber);

  // Play movie specifically on a chosen server mirror
  const handlePlayOnServer = (srv: StreamServer) => {
    const customMovie: CinemaMovie = {
      ...movie,
      streamUrl: srv.url,
      // Put selected server first so player activates it immediately
      servers: [srv, ...movie.servers.filter(s => s.id !== srv.id)]
    };
    onPlayMovie(customMovie);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-[#090b11] border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Backdrop Image Header */}
        <div className="relative h-64 md:h-84 w-full overflow-hidden shrink-0">
          <img 
            src={movie.backdropUrl} 
            alt={movie.title}
            className="w-full h-full object-cover filter brightness-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090b11] via-[#090b11]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090b11]/80 via-transparent to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-2xl bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition-colors z-10 hover:scale-105"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title and Badges overlayed on Backdrop */}
          <div className="absolute bottom-4 left-6 right-6 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 shadow">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {movie.imdbScore} IMDb
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow">
                {movie.quality}
              </span>
              {movie.type === 'series' && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-purple-950/80 text-purple-300 border border-purple-500/40 shadow">
                  TV SERIES
                </span>
              )}
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 text-slate-200">
                {movie.year}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 text-slate-200">
                {movie.rating}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 text-slate-200">
                {movie.duration}
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black text-white font-sans tracking-tight drop-shadow-md">
              {movie.title}
            </h1>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Action Row & Synopsis */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onPlayMovie(movie)}
                className="uiverse-glow-btn group"
              >
                <div className="uiverse-glow-btn-inner !bg-gradient-to-r !from-cyan-400 !to-sky-400 !text-black font-black">
                  <Play className="w-4 h-4 fill-black" />
                  <span>{movie.type === 'series' ? 'Play Episode 1' : 'Play Cinema Movie'}</span>
                </div>
              </button>

              <button
                onClick={handleToggleWatchlist}
                className={`px-4 py-3 rounded-2xl font-semibold text-sm flex items-center gap-2 border transition-all ${
                  isInWatchlist
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                }`}
              >
                {isInWatchlist ? (
                  <>
                    <Check className="w-4 h-4 text-amber-400" />
                    <span>In Watchlist</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Add to Watchlist</span>
                  </>
                )}
              </button>

              <div className="flex flex-wrap gap-1.5 ml-auto">
                {movie.genres.map((g) => (
                  <span key={g} className="px-2.5 py-1 rounded-xl text-xs bg-white/5 border border-white/5 text-slate-300 font-medium">
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {movie.synopsis}
            </p>
          </div>

          {/* Cast & Director */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block mb-1">Director:</span>
              <span className="text-white font-medium">{movie.director}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block mb-1">Starring Cast:</span>
              <span className="text-white font-medium">{movie.cast.join(', ')}</span>
            </div>
          </div>

          {/* Multi-Server AIOStreams Failover Providers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Layers className="w-4 h-4 text-cyan-400" />
                AIOStreams Multi-Provider Mirrors ({movie.servers.length} Streams Available)
              </div>
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Auto-Failover Enabled
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {movie.servers.map((srv, idx) => (
                <div 
                  key={srv.id}
                  className="p-3 rounded-2xl bg-slate-900/70 border border-white/5 hover:border-cyan-500/40 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold shrink-0">
                      #{idx + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{srv.name}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                        <span className="text-cyan-300">{srv.quality}</span>
                        {srv.provider && <span>• {srv.provider}</span>}
                        {srv.speed && <span className="text-emerald-400">• {srv.speed}</span>}
                        {srv.latency && <span className="text-amber-300">• {srv.latency}</span>}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePlayOnServer(srv)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-black border border-cyan-500/30 text-xs font-bold transition flex items-center gap-1 shrink-0"
                    title="Stream directly with this mirror"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Play</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* TV SERIES SEASONS & EPISODES (Nuvio Feature) */}
          {movie.type === 'series' && movie.seasons && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Tv className="w-4 h-4 text-purple-400" />
                  Episodes & Seasons
                </div>

                {/* Season Selector */}
                {movie.seasons.length > 1 && (
                  <div className="flex items-center gap-1">
                    {movie.seasons.map((s) => (
                      <button
                        key={s.seasonNumber}
                        onClick={() => setSelectedSeasonNumber(s.seasonNumber)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          selectedSeasonNumber === s.seasonNumber
                            ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        Season {s.seasonNumber}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Episodes List */}
              {selectedSeason && (
                <div className="space-y-2">
                  {selectedSeason.episodes.map((ep) => (
                    <div
                      key={ep.id}
                      onClick={() => onPlayMovie(movie, ep)}
                      className="group p-3.5 rounded-2xl bg-white/5 hover:bg-slate-800/80 border border-white/5 hover:border-purple-500/40 flex items-center justify-between cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 group-hover:bg-purple-500 text-purple-400 group-hover:text-black flex items-center justify-center transition-colors">
                          <Play className="w-4 h-4 ml-0.5" />
                        </div>
                        <div>
                          <div className="text-xs md:text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                            {ep.title}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {ep.overview}
                          </div>
                        </div>
                      </div>

                      <div className="text-right pl-3 shrink-0">
                        <span className="text-xs font-mono text-slate-400 block">{ep.duration}</span>
                        <span className="text-[10px] text-purple-400 font-mono">Stream Ready</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
