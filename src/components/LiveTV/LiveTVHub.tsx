import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Hls from 'hls.js';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Tv, 
  Search, 
  Radio, 
  Sparkles, 
  Flame, 
  Film, 
  Zap, 
  Compass, 
  Layers, 
  RotateCcw, 
  ChevronRight, 
  AlertCircle,
  PictureInPicture,
  CheckCircle2,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { LIVE_TV_CHANNELS, LIVE_TV_CATEGORIES, LiveChannel } from '../../data/liveTvChannels';

interface LiveTVHubProps {
  onBackToCinema?: () => void;
}

// Helper to convert any YouTube URL into an embeddable stream URL
function formatLiveStreamUrl(url: string): string {
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (videoId) {
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
    }
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) {
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
    }
  }
  if (url.includes('youtube.com/channel/') && url.includes('/live')) {
    const channelId = url.split('channel/')[1]?.split('/')[0];
    if (channelId) {
      return `https://www.youtube-nocookie.com/embed/live_stream?channel=${channelId}&autoplay=1`;
    }
  }
  return url;
}

export const LiveTVHub: React.FC<LiveTVHubProps> = ({ onBackToCinema }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeChannel, setActiveChannel] = useState<LiveChannel>(() => LIVE_TV_CHANNELS[0]);
  
  // Player state
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [volume, setVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [autoPlayToast, setAutoPlayToast] = useState<string | null>(null);

  // Filter channels based on category and search query
  const filteredChannels = useMemo(() => {
    return LIVE_TV_CHANNELS.filter((ch) => {
      const matchCat = selectedCategory === 'all' || ch.category === selectedCategory;
      const matchSearch = !searchQuery.trim() || 
        ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.currentShow.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Check if current stream is YouTube Live
  const isYouTubeStream = useMemo(() => {
    return (
      activeChannel.streamType === 'youtube' ||
      activeChannel.streamUrl.includes('youtube.com') ||
      activeChannel.streamUrl.includes('youtube-nocookie.com') ||
      activeChannel.streamUrl.includes('youtu.be')
    );
  }, [activeChannel]);

  // Load stream via HLS.js or YouTube embed
  const loadChannelStream = useCallback((streamUrl: string) => {
    const formattedUrl = formatLiveStreamUrl(streamUrl);
    if (
      formattedUrl.includes('youtube.com') || 
      formattedUrl.includes('youtube-nocookie.com') || 
      formattedUrl.includes('youtu.be')
    ) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      setIsLoading(false);
      setHasError(false);
      setErrorMessage('');
      setIsPlaying(true);
      return;
    }

    if (!videoRef.current) return;
    const video = videoRef.current;

    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 5,
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        video.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(false);
        });
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.warn('[LiveTV] Fatal HLS error:', data.type, data.details);
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              setHasError(true);
              setErrorMessage('Live feed currently reconnecting or offline.');
              setIsLoading(false);
              break;
          }
        }
      });

      hlsRef.current = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari / iOS HLS
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      });
    } else {
      setHasError(true);
      setErrorMessage('HLS playback is not supported on this browser.');
      setIsLoading(false);
    }
  }, []);

  // Tune into channel
  const handleSelectChannel = useCallback((channel: LiveChannel) => {
    setActiveChannel(channel);
    loadChannelStream(channel.streamUrl);
    setAutoPlayToast(`Tuned into ${channel.name}`);
    setTimeout(() => setAutoPlayToast(null), 3000);
  }, [loadChannelStream]);

  // Initial channel load
  useEffect(() => {
    loadChannelStream(activeChannel.streamUrl);
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);

  // Volume & Mute synchronizer
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  // Picture in Picture
  const togglePiP = useCallback(async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.warn('PiP error:', err);
    }
  }, []);

  // Toggle Play / Pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#03050a] text-white flex flex-col pb-20 md:pb-8">
      {/* 1. Header Bar: Live TV Status & Quick Stats */}
      <div className="border-b border-white/10 bg-[#060812]/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 p-0.5 shadow-lg shadow-rose-500/20 flex items-center justify-center">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg tracking-tight uppercase bg-gradient-to-r from-rose-400 via-amber-300 to-rose-300 bg-clip-text text-transparent">
                Free Live TV
              </h1>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>24/7 BROADCASTS</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Zero Buffering • Direct Verified HLS Feeds • Global & Pinoy Channels
            </p>
          </div>
        </div>

        {/* Quick Category Stats */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">
            Active: <span className="text-rose-400 font-bold">{activeChannel.name}</span> ({activeChannel.quality})
          </span>
          {onBackToCinema && (
            <button
              onClick={onBackToCinema}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition"
            >
              Back to Cinema VOD
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Live Experience: Split Theater Stage + Channel Guide */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Big Stage Live Video Player */}
        <div className="flex-1 flex flex-col gap-4">
          <div 
            ref={containerRef}
            className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl group flex items-center justify-center"
          >
            {/* Live Signal Indicator Pill */}
            <div className="absolute top-4 left-4 z-30 flex items-center gap-2 pointer-events-none">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-rose-600 text-white shadow-lg shadow-rose-600/40">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                LIVE
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-black/70 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                {activeChannel.quality}
              </span>
              <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-black/70 backdrop-blur-md text-slate-300 border border-white/10">
                {activeChannel.country}
              </span>
            </div>

            {/* Toast Notification */}
            {autoPlayToast && (
              <div className="absolute top-4 right-4 z-40 animate-fadeIn pointer-events-none">
                <div className="px-3.5 py-1.5 rounded-xl bg-black/85 backdrop-blur-xl border border-cyan-500/40 text-cyan-200 text-xs font-bold flex items-center gap-2 shadow-2xl">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>{autoPlayToast}</span>
                </div>
              </div>
            )}

            {isYouTubeStream ? (
              <iframe
                key={activeChannel.id}
                src={formatLiveStreamUrl(activeChannel.streamUrl)}
                title={activeChannel.name}
                className="w-full h-full border-0 rounded-3xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  playsInline
                  onClick={togglePlay}
                />

                {/* Spinner Overlay */}
                {isLoading && !hasError && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center z-20">
                    <div className="w-12 h-12 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin" />
                    <p className="mt-3 text-xs font-mono font-bold text-rose-300 tracking-wider">
                      Connecting Live Broadcast...
                    </p>
                  </div>
                )}

                {/* Error Overlay */}
                {hasError && (
                  <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20 space-y-3">
                    <AlertCircle className="w-10 h-10 text-rose-400" />
                    <h3 className="text-base font-bold text-white">Live Broadcast Reconnecting</h3>
                    <p className="text-xs text-slate-400 max-w-sm">{errorMessage}</p>
                    <button
                      onClick={() => loadChannelStream(activeChannel.streamUrl)}
                      className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center gap-1.5 transition shadow"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retry Broadcast</span>
                    </button>
                  </div>
                )}

                {/* Bottom HUD Player Controls */}
                <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center hover:scale-105 transition"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsMuted((prev) => !prev)}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
                      >
                        {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => {
                          setVolume(parseFloat(e.target.value));
                          setIsMuted(false);
                        }}
                        className="w-20 accent-rose-500 h-1 rounded-lg cursor-pointer hidden sm:block"
                      />
                    </div>
                  </div>

                  {/* Title ticker in player */}
                  <div className="min-w-0 text-center hidden md:block">
                    <p className="text-xs font-bold text-white truncate max-w-xs">{activeChannel.name}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-xs">{activeChannel.currentShow}</p>
                  </div>

                  {/* Right Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePiP}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
                      title="Picture in Picture"
                    >
                      <PictureInPicture className="w-4 h-4" />
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
                      title="Fullscreen"
                    >
                      {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Current Broadcast Metadata Banner */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#070914] border border-white/10 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-2 flex-shrink-0">
                <img src={activeChannel.logo} alt={activeChannel.name} className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-white">{activeChannel.name}</h2>
                  <span className="px-2 py-0.2 rounded text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                    {activeChannel.category}
                  </span>
                </div>
                <p className="text-xs font-bold text-cyan-300 mt-0.5">{activeChannel.currentShow}</p>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 max-w-2xl">{activeChannel.description}</p>
              </div>
            </div>

            {/* Equalizer animation */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/5 border border-white/10 self-start sm:self-center">
              <div className="uiverse-eq-container">
                <span className="uiverse-eq-bar bg-rose-500" />
                <span className="uiverse-eq-bar bg-rose-500" />
                <span className="uiverse-eq-bar bg-rose-500" />
                <span className="uiverse-eq-bar bg-rose-500" />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                LIVE ON AIR
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Channel Guide & Tuner */}
        <div className="w-full lg:w-96 flex flex-col gap-4">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search 24/7 channels or shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#070914] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/50 transition"
            />
          </div>

          {/* Category Chips Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {LIVE_TV_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Channels Scroll List */}
          <div className="flex-1 max-h-[560px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {filteredChannels.length === 0 ? (
              <div className="p-8 text-center bg-[#070914] rounded-2xl border border-white/5">
                <Tv className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No channels found in this category.</p>
              </div>
            ) : (
              filteredChannels.map((channel) => {
                const isActive = activeChannel.id === channel.id;
                return (
                  <div
                    key={channel.id}
                    onClick={() => handleSelectChannel(channel)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 border ${
                      isActive
                        ? 'bg-gradient-to-r from-rose-950/60 to-purple-950/40 border-rose-500/50 shadow-lg shadow-rose-500/10 scale-[1.01]'
                        : 'bg-[#070914] hover:bg-[#0c1024] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-1.5 flex-shrink-0">
                        <img src={channel.logo} alt={channel.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-200'}`}>
                            {channel.name}
                          </h3>
                          {isActive && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-cyan-400 truncate mt-0.5">{channel.currentShow}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">
                          {channel.category} • {channel.quality}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-slate-400 font-mono">
                        {channel.country}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
