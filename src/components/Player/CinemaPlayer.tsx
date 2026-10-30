import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Hls from 'hls.js';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Sparkles, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Tv, 
  AlertCircle,
  Eye,
  EyeOff,
  Server,
  Star,
  Clock,
  ArrowLeft,
  FastForward,
  Rewind,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { CinemaMovie, Episode, StreamServer } from '../../data/cinemaMovies';
import { PlayerSettings } from '../../utils/storage';

interface CinemaPlayerProps {
  movie: CinemaMovie;
  activeEpisode?: Episode;
  onBackToCatalog: () => void;
  onSelectEpisode?: (episode: Episode) => void;
  settings: PlayerSettings;
  onUpdateSettings: (settings: Partial<PlayerSettings>) => void;
}

export const CinemaPlayer: React.FC<CinemaPlayerProps> = ({
  movie,
  activeEpisode,
  onBackToCatalog,
  onSelectEpisode,
  settings,
  onUpdateSettings,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPseudoFullscreen, setIsPseudoFullscreen] = useState<boolean>(false);
  const isTrulyFullscreen = isFullscreen || isPseudoFullscreen;
  const [showControls, setShowControls] = useState<boolean>(true);
  const [currentServerIndex, setCurrentServerIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [showAspectMenu, setShowAspectMenu] = useState<boolean>(false);
  const [showEpisodeDrawer, setShowEpisodeDrawer] = useState<boolean>(false);
  const [failoverToast, setFailoverToast] = useState<string | null>(null);

  const controlsTimeoutRef = useRef<number | null>(null);

  // Available servers (from active episode if present, or from movie)
  const availableServers: StreamServer[] = useMemo(() => {
    if (activeEpisode && activeEpisode.servers && activeEpisode.servers.length > 0) {
      return activeEpisode.servers;
    }
    return movie.servers && movie.servers.length > 0
      ? movie.servers
      : [
          {
            id: 'srv-default',
            name: 'AIO Default Stream',
            url: movie.streamUrl,
            type: /vidsrc|multiembed|2embed|embed|autoembed|player|youtube/i.test(movie.streamUrl) ? 'embed' : (movie.streamUrl.includes('.m3u8') ? 'hls' : 'mp4'),
            quality: movie.quality,
            provider: 'AIOStreams',
          },
        ];
  }, [movie, activeEpisode]);

  // Reset server index when movie or episode changes
  useEffect(() => {
    setCurrentServerIndex(0);
    setHasError(false);
    setErrorMessage('');
  }, [movie.id, activeEpisode?.id]);

  const activeServer = availableServers[currentServerIndex] || availableServers[0];
  const activeStreamUrl = activeServer.url;

  // Detect whether the URL is a Web Embed (e.g. VidSrc, MultiEmbed, 2Embed, YouTube)
  const isEmbedStream = useMemo(() => {
    if (activeServer?.type === 'embed') return true;
    return /vidsrc|multiembed|2embed|embed|autoembed|player|youtube(-nocookie)?\.com|youtu\.be|dailymotion\.com|vimeo\.com/i.test(activeStreamUrl);
  }, [activeServer, activeStreamUrl]);

  // Clean Embed URL with unmuted autoplay parameters
  const normalizeEmbedUrl = (url: string): string => {
    try {
      if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
        const vidMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
        if (vidMatch && vidMatch[1]) {
          return `https://www.youtube-nocookie.com/embed/${vidMatch[1]}?autoplay=1&mute=0&enablejsapi=1&playsinline=1&rel=0`;
        }
      }
    } catch {}
    return url;
  };

  // Auto-failover handler: switches to the next available AIOStreams server
  const handleServerFailover = useCallback(() => {
    if (currentServerIndex < availableServers.length - 1) {
      const nextIdx = currentServerIndex + 1;
      const nextServer = availableServers[nextIdx];
      setFailoverToast(`Server issue detected. Auto-switched to Mirror #${nextIdx + 1} (${nextServer.name})`);
      setTimeout(() => setFailoverToast(null), 4000);
      setCurrentServerIndex(nextIdx);
    } else {
      setHasError(true);
      setErrorMessage('All AIOStreams mirrors for this title are currently unresponsive. Please try again later.');
    }
  }, [availableServers, currentServerIndex]);

  // Load and attach video stream
  const loadStream = useCallback((url: string) => {
    if (!videoRef.current || isEmbedStream) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const video = videoRef.current;
    video.volume = settings.muted ? 0 : settings.volume;
    video.playbackRate = settings.playbackSpeed || 1;

    const isHlsUrl = url.includes('.m3u8') || url.includes('application/x-mpegURL');

    if (isHlsUrl && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });

      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.warn('[AIOStreams] Network error encountered, attempting recovery...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.warn('[AIOStreams] Media decode error encountered, attempting recovery...');
              hls.recoverMediaError();
              break;
            default:
              console.error('[AIOStreams] Fatal player error, initiating mirror failover:', data);
              hls.destroy();
              handleServerFailover();
              break;
          }
        }
      });
    } else {
      // Standard MP4 direct playback or native Safari HLS
      video.src = url;
      video.load();
      video.play().then(() => {
        setIsLoading(false);
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Autoplay prevented or load issue:', err);
        setIsLoading(false);
      });
    }
  }, [isEmbedStream, settings.volume, settings.muted, settings.playbackSpeed, handleServerFailover]);

  useEffect(() => {
    loadStream(activeStreamUrl);

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [activeStreamUrl, loadStream]);

  // Video playback time updates
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    setDuration(videoRef.current.duration || 0);
  };

  // Play / Pause Toggle
  const togglePlay = () => {
    if (!videoRef.current || isEmbedStream) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  // Seek ±10 seconds
  const seekRelative = (seconds: number) => {
    if (!videoRef.current || isEmbedStream) return;
    const target = Math.max(0, Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + seconds));
    videoRef.current.currentTime = target;
    setCurrentTime(target);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current || isEmbedStream) return;
    const target = parseFloat(e.target.value);
    videoRef.current.currentTime = target;
    setCurrentTime(target);
  };

  // 4-Tier Fullscreen Architecture
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isTrulyFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => setIsPseudoFullscreen(true));
      } else {
        setIsPseudoFullscreen(true);
      }
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(console.error);
      }
      setIsFullscreen(false);
      setIsPseudoFullscreen(false);
    }
  };

  // Auto-hide controls timer
  const handleUserActivity = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSpeedMenu(false);
        setShowAspectMenu(false);
      }
    }, 3500);
  };

  // Aspect ratio class helper
  const getAspectRatioClass = () => {
    switch (settings.aspectRatio) {
      case 'fill':
        return 'w-full h-full object-fill';
      case 'contain':
        return 'w-full h-full object-contain';
      case '4:3':
        return 'w-auto h-full aspect-[4/3] mx-auto object-cover';
      case '16:9':
      default:
        return 'w-full h-full object-contain';
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Series Next / Previous Episode helpers
  const allEpisodes = useMemo(() => {
    if (movie.type !== 'series' || !movie.seasons) return [];
    return movie.seasons.flatMap((s) => s.episodes);
  }, [movie]);

  const currentEpisodeIndex = useMemo(() => {
    if (!activeEpisode) return -1;
    return allEpisodes.findIndex((ep) => ep.id === activeEpisode.id);
  }, [allEpisodes, activeEpisode]);

  const handleNextEpisode = () => {
    if (currentEpisodeIndex >= 0 && currentEpisodeIndex < allEpisodes.length - 1) {
      onSelectEpisode?.(allEpisodes[currentEpisodeIndex + 1]);
    }
  };

  const handlePrevEpisode = () => {
    if (currentEpisodeIndex > 0) {
      onSelectEpisode?.(allEpisodes[currentEpisodeIndex - 1]);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleUserActivity}
      onTouchStart={handleUserActivity}
      onClick={handleUserActivity}
      className={`relative w-full h-full bg-black select-none overflow-hidden flex flex-col items-center justify-center ${
        isTrulyFullscreen ? '!fixed !inset-0 !z-[999999] !w-screen !h-[100dvh]' : 'min-h-[500px]'
      }`}
    >
      {/* 1. Dynamic Ambient Glow (Ambilight) */}
      {settings.ambientGlow && !isEmbedStream && (
        <div
          className="absolute inset-0 pointer-events-none opacity-40 blur-[80px] transform scale-110 -z-10"
          style={{
            backgroundImage: `url(${movie.backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* 2. Failover Toast Notification */}
      {failoverToast && (
        <div className="absolute top-20 z-50 animate-fadeIn">
          <div className="px-4 py-2.5 rounded-2xl bg-cyan-950/90 border border-cyan-500/40 text-cyan-200 text-xs font-bold flex items-center gap-2 shadow-2xl backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{failoverToast}</span>
          </div>
        </div>
      )}

      {/* 3. Media Player Container */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {isEmbedStream ? (
          <iframe
            key={activeStreamUrl}
            src={normalizeEmbedUrl(activeStreamUrl)}
            className="w-full h-full border-0 bg-black"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            title={movie.title}
          />
        ) : (
          <video
            ref={videoRef}
            className={getAspectRatioClass()}
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => {
              setIsPlaying(false);
              if (settings.autoPlayNext && movie.type === 'series') {
                handleNextEpisode();
              }
            }}
            onClick={togglePlay}
          />
        )}

        {/* Loading Spinner */}
        {isLoading && !hasError && !isEmbedStream && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs z-20 pointer-events-none">
            <div className="w-14 h-14 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
            <p className="mt-4 text-xs font-bold tracking-widest text-cyan-200 uppercase font-mono">
              Resolving AIOStream Mirror #{currentServerIndex + 1}...
            </p>
          </div>
        )}

        {/* Error Fallback Card */}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 p-6 text-center space-y-3">
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Stream Unavailable</h3>
            <p className="text-xs text-slate-400 max-w-md">{errorMessage}</p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => loadStream(activeStreamUrl)}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs flex items-center gap-1.5 shadow hover:bg-cyan-400 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Stream</span>
              </button>
              <button
                onClick={onBackToCatalog}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition"
              >
                Back to Catalog
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Top Header Overlay (Aligned Left & Right) */}
      <div
        className={`absolute top-0 inset-x-0 h-20 px-4 sm:px-8 bg-gradient-to-b from-black/95 via-black/60 to-transparent z-30 transition-all duration-300 flex items-center justify-between ${
          showControls ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCatalog}
            className="p-2.5 rounded-2xl bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition hover:scale-105"
            title="Back to Catalog"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                {activeServer.quality}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {movie.year} • {movie.genres.slice(0, 2).join(', ')}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-white truncate max-w-md">
              {activeEpisode ? `${movie.title}: ${activeEpisode.title}` : movie.title}
            </h1>
          </div>
        </div>

        {/* Right Mirrors Switcher Pill */}
        {availableServers.length > 1 && (
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/70 backdrop-blur-md border border-cyan-500/30">
            <span className="text-[10px] font-bold text-slate-400 px-2 flex items-center gap-1">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span>AIO Mirrors:</span>
            </span>
            {availableServers.map((srv, idx) => (
              <button
                key={srv.id}
                onClick={() => setCurrentServerIndex(idx)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition flex items-center gap-1 ${
                  currentServerIndex === idx
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30 font-black'
                    : 'text-slate-300 hover:text-white bg-white/5'
                }`}
                title={srv.name}
              >
                <span>M{idx + 1}</span>
                <span className="opacity-75 font-mono text-[9px]">({srv.quality})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 5. Bottom Cinema Player Controls Dock */}
      <div
        className={`absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent z-30 transition-all duration-300 space-y-2.5 ${
          showControls ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-full pointer-events-none'
        }`}
      >
        {/* Scrubber / Progress Bar (HTML5 video only) */}
        {!isEmbedStream && (
          <div className="flex items-center gap-3 w-full">
            <span className="text-[11px] font-mono text-cyan-300 min-w-[38px] font-bold">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeekChange}
              className="flex-1 uiverse-slider cursor-pointer"
            />
            <span className="text-[11px] font-mono text-slate-400 min-w-[38px] text-right">
              {formatTime(duration)}
            </span>
          </div>
        )}

        {/* Buttons Control Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            {!isEmbedStream && (
              <>
                <button
                  onClick={togglePlay}
                  className="p-2.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold shadow-lg shadow-cyan-500/25 transition hover:scale-105"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
                </button>

                <button
                  onClick={() => seekRelative(-10)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
                  title="Rewind 10 seconds"
                >
                  <Rewind className="w-4 h-4" />
                </button>

                <button
                  onClick={() => seekRelative(10)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
                  title="Forward 10 seconds"
                >
                  <FastForward className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Volume & Mute */}
            <div className="flex items-center gap-1.5 ml-1">
              <button
                onClick={() => onUpdateSettings({ muted: !settings.muted })}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
                title={settings.muted ? 'Unmute' : 'Mute'}
              >
                {settings.muted ? <VolumeX className="w-4 h-4 text-amber-300" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.muted ? 0 : settings.volume}
                onChange={(e) => onUpdateSettings({ volume: parseFloat(e.target.value), muted: false })}
                className="w-16 sm:w-24 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-cyan-400 hidden xs:block"
              />
            </div>
          </div>

          {/* Center Episode Navigation (Series Only) */}
          {movie.type === 'series' && allEpisodes.length > 0 && (
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 p-1 rounded-2xl">
              <button
                onClick={handlePrevEpisode}
                disabled={currentEpisodeIndex <= 0}
                className="p-1.5 rounded-xl text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                title="Previous Episode"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono font-bold text-purple-300 px-2">
                Ep {currentEpisodeIndex >= 0 ? currentEpisodeIndex + 1 : 1} / {allEpisodes.length}
              </span>
              <button
                onClick={handleNextEpisode}
                disabled={currentEpisodeIndex >= allEpisodes.length - 1}
                className="p-1.5 rounded-xl text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                title="Next Episode"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Ambient Glow Toggle */}
            <button
              onClick={() => onUpdateSettings({ ambientGlow: !settings.ambientGlow })}
              className={`p-2 rounded-xl border text-xs font-semibold transition ${
                settings.ambientGlow
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-white/5 text-slate-400 border-white/10'
              }`}
              title="Toggle Dynamic Ambient Glow"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Playback Speed */}
            {!isEmbedStream && (
              <button
                onClick={() => {
                  const speeds = [1, 1.25, 1.5, 2, 0.75];
                  const currentIdx = speeds.indexOf(settings.playbackSpeed || 1);
                  const nextSpeed = speeds[(currentIdx + 1) % speeds.length];
                  onUpdateSettings({ playbackSpeed: nextSpeed });
                  if (videoRef.current) videoRef.current.playbackRate = nextSpeed;
                }}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-mono font-bold text-white transition"
                title="Cycle Playback Speed"
              >
                {settings.playbackSpeed || 1}x
              </button>
            )}

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition hover:scale-105"
              title="Toggle Fullscreen"
            >
              {isTrulyFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
