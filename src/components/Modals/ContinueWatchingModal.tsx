import React from 'react';
import { RotateCcw, X, Play, Trash2, Clock, Film, Tv } from 'lucide-react';
import { WatchProgress, removeWatchProgress } from '../../utils/storage';
import { CinemaMovie, Episode, CINEMA_MOVIES } from '../../data/cinemaMovies';

interface ContinueWatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  progressList: WatchProgress[];
  onProgressUpdated: (list: WatchProgress[]) => void;
  onPlayItem: (movie: CinemaMovie, episode?: Episode) => void;
}

export const ContinueWatchingModal: React.FC<ContinueWatchingModalProps> = ({
  isOpen,
  onClose,
  progressList,
  onProgressUpdated,
  onPlayItem,
}) => {
  if (!isOpen) return null;

  const handleRemove = (e: React.MouseEvent, movieId: string) => {
    e.stopPropagation();
    const updated = removeWatchProgress(movieId);
    onProgressUpdated(updated);
  };

  const handleClearAll = () => {
    if (confirm('Clear all your watch history and saved progress?')) {
      progressList.forEach((item) => removeWatchProgress(item.movieId));
      onProgressUpdated([]);
    }
  };

  const formatSeconds = (sec: number): string => {
    const mins = Math.floor(sec / 60);
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hrs > 0) return `${hrs}h ${remMins}m`;
    return `${remMins}m`;
  };

  const resolveMovie = (item: WatchProgress): CinemaMovie => {
    const found = CINEMA_MOVIES.find((m) => m.id === item.movieId);
    if (found) return found;

    return {
      id: item.movieId,
      title: item.movieTitle,
      type: item.type,
      year: 2024,
      rating: 'PG-13',
      imdbScore: 8.0,
      quality: '1080p HD',
      duration: item.duration ? formatSeconds(item.duration) : '2h 00m',
      genres: ['Drama', 'Action'],
      director: 'Director',
      cast: [],
      synopsis: item.movieTitle,
      posterUrl: item.poster,
      backdropUrl: item.backdrop || item.poster,
      category: item.type === 'series' ? 'series' : 'trending',
      streamUrl: `https://vidsrc.to/embed/${item.type === 'series' ? 'tv' : 'movie'}/${item.movieId}`,
      servers: [],
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#090d16] border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-950/50 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-wide">Continue Watching</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {progressList.length} Active
                </span>
              </div>
              <p className="text-xs text-slate-400">Resume your movies and TV series right where you paused</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {progressList.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 scrollbar-thin scrollbar-thumb-white/20">
          {progressList.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
                <Clock className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-300">No In-Progress Titles Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Play any movie or series in TV-MAX and your exact timestamp will be automatically saved here for instant resume.
              </p>
            </div>
          ) : (
            progressList.map((item) => {
              const movieObj = resolveMovie(item);
              const epMatch =
                item.seasonNumber && item.episodeNumber
                  ? {
                      id: `${item.movieId}:${item.seasonNumber}:${item.episodeNumber}`,
                      seasonNumber: item.seasonNumber,
                      episodeNumber: item.episodeNumber,
                      title: item.episodeTitle || `Episode ${item.episodeNumber}`,
                      duration: '45m',
                      overview: '',
                      thumbnail: item.backdrop || item.poster,
                      servers: [],
                    }
                  : undefined;

              return (
                <div
                  key={item.movieId}
                  onClick={() => {
                    onPlayItem(movieObj, epMatch);
                    onClose();
                  }}
                  className="group relative flex items-center justify-between gap-4 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/40 cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Thumbnail with progress bar */}
                    <div className="relative w-28 sm:w-36 aspect-[16/10] rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-white/10">
                      <img
                        src={item.backdrop || item.poster}
                        alt={item.movieTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition">
                        <div className="w-8 h-8 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow-md">
                          <Play className="w-4 h-4 fill-black ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-sky-400"
                          style={{ width: `${Math.max(5, item.percentage)}%` }}
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-slate-300 flex items-center gap-1">
                          {item.type === 'series' ? <Tv className="w-3 h-3 text-purple-400" /> : <Film className="w-3 h-3 text-cyan-400" />}
                          {item.type}
                        </span>
                        <span className="text-[11px] font-mono text-cyan-300">
                          {item.percentage}% ({formatSeconds(item.currentTime)} / {formatSeconds(item.duration)})
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white truncate group-hover:text-cyan-300 transition">
                        {item.movieTitle}
                      </h4>
                      {item.episodeTitle && (
                        <p className="text-xs text-slate-400 truncate">
                          S{item.seasonNumber} E{item.episodeNumber} • {item.episodeTitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => handleRemove(e, item.movieId)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Remove from history"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
