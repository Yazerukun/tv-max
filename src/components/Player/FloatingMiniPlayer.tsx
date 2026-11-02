import React from 'react';
import { Maximize2, X, Film, Tv, Radio } from 'lucide-react';
import { CinemaMovie, Episode } from '../../data/cinemaMovies';

interface FloatingMiniPlayerProps {
  movie: CinemaMovie;
  activeEpisode?: Episode;
  onExpand: () => void;
  onClose: () => void;
}

export const FloatingMiniPlayer: React.FC<FloatingMiniPlayerProps> = ({
  movie,
  activeEpisode,
  onExpand,
  onClose,
}) => {
  // Determine embed or stream source
  const isSeries = movie.type === 'series' || (movie.seasons && movie.seasons.length > 0);
  const streamUrl = isSeries
    ? `https://vidsrc.to/embed/tv/${movie.id}/${activeEpisode?.seasonNumber || 1}/${activeEpisode?.episodeNumber || 1}`
    : `https://vidsrc.to/embed/movie/${movie.id}`;

  return (
    <div className="fixed bottom-24 md:bottom-6 right-4 sm:right-6 z-40 w-72 sm:w-84 bg-[#090d16] border-2 border-cyan-500/50 rounded-2xl shadow-2xl shadow-cyan-950/70 overflow-hidden flex flex-col animate-slideUp">
      {/* Mini Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-white/10 select-none">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
          {isSeries ? <Tv className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" /> : <Film className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />}
          <span className="text-xs font-bold text-white truncate">{movie.title}</span>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onExpand}
            className="p-1 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition"
            title="Expand to Full Player"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
            title="Close Stream"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Video Viewport */}
      <div className="relative aspect-[16/9] w-full bg-black">
        <iframe
          src={streamUrl}
          title={movie.title}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          className="w-full h-full border-0"
        />
      </div>

      {/* Mini Footer Progress info */}
      <div className="px-3 py-1 bg-slate-950 text-[10px] text-slate-400 flex items-center justify-between">
        <span className="truncate">
          {activeEpisode ? `S${activeEpisode.seasonNumber} E${activeEpisode.episodeNumber} • ${activeEpisode.title}` : movie.quality || '1080p FHD'}
        </span>
        <button
          onClick={onExpand}
          className="text-cyan-400 hover:underline font-semibold ml-2 flex-shrink-0"
        >
          Resume Fullscreen
        </button>
      </div>
    </div>
  );
};
