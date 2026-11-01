// Live TV Channels Roster for TV MAX (Verified High-Speed Streams with Full CORS Support)

export interface LiveChannel {
  id: string;
  name: string;
  category: 'pinoy' | 'news' | 'movies' | 'sports' | 'anime' | 'tech' | 'music';
  logo: string;
  streamUrl: string;
  streamType?: 'hls' | 'youtube' | 'embed';
  quality: string;
  country: string;
  currentShow: string;
  description: string;
}

export const LIVE_TV_CATEGORIES = [
  { id: 'all', label: 'All Channels', icon: 'Tv' },
  { id: 'pinoy', label: '🇵🇭 Pinoy & Asia', icon: 'Flame' },
  { id: 'news', label: '📰 Global News', icon: 'Radio' },
  { id: 'movies', label: '🎬 24/7 Cinema', icon: 'Film' },
  { id: 'sports', label: '⚽ Sports & Action', icon: 'Zap' },
  { id: 'anime', label: '🌸 Anime & Toons', icon: 'Sparkles' },
  { id: 'tech', label: '🚀 Science & Docs', icon: 'Compass' },
  { id: 'music', label: '🎵 Music & Live', icon: 'Layers' },
];

export const LIVE_TV_CHANNELS: LiveChannel[] = [
  // 1. Pinoy & Asia
  {
    id: 'ch-gma-kapuso',
    name: 'GMA Network (Kapuso Stream)',
    category: 'pinoy',
    logo: 'https://yt3.googleusercontent.com/_ZJZCMxEI1PZW3WHr4-lvvq2cua4oKcLAtXET1ecklKeTMRoqBDHTp3hHshe3rozByRxwOb5SA=s900-c-k-c0x00ffffff-no-rj',
    streamUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCKL5hAuzgFQsyrsQKgU0Qng&autoplay=1',
    streamType: 'youtube',
    quality: '1080p HD',
    country: 'PH',
    currentShow: 'Kapuso 24/7 Live Stream & News',
    description: 'Official 24/7 GMA Network flagship live stream: breaking news, Kapuso teleseryes, public affairs, and entertainment programs.'
  },
  {
    id: 'ch-tfc-guam',
    name: 'TFC Global (ABS-CBN)',
    category: 'pinoy',
    logo: 'https://images.metahub.space/logo/medium/tt10156112/img',
    streamUrl: 'https://tfcguam-abscbn-ono.amagi.tv/index.m3u8',
    quality: '1080p',
    country: 'PH',
    currentShow: 'TFC Primetime Entertainment',
    description: 'The Filipino Channel flagship global programming, teleseryes, news, and Pinoy blockbuster movies.'
  },
  {
    id: 'ch-bilyonario',
    name: 'Bilyonario News Channel',
    category: 'pinoy',
    logo: 'https://cdn-icons-png.flaticon.com/512/3208/3208707.png',
    streamUrl: 'https://amg19223-amg19223c11-amgplt0352.playout.now3.amagi.tv/playlist/amg19223-amg19223c11-amgplt0352/playlist.m3u8',
    quality: '720p',
    country: 'PH',
    currentShow: 'Bilyonario Market & Business Live',
    description: 'Premier Philippine financial, corporate news, investigative lifestyle, and market reports.'
  },
  {
    id: 'ch-cltv36',
    name: 'CLTV 36 Regional',
    category: 'pinoy',
    logo: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png',
    streamUrl: 'https://live.cltv36.tv:5443/LiveApp/streams/cltvlive.m3u8',
    quality: '720p',
    country: 'PH',
    currentShow: 'Central Luzon Live News',
    description: 'Regional Philippine broadcast news, cultural programs, and community updates.'
  },
  {
    id: 'ch-arirang',
    name: 'Arirang TV Korea',
    category: 'pinoy',
    logo: 'https://cdn-icons-png.flaticon.com/512/197/197582.png',
    streamUrl: 'https://amdlive-ch03-ctnd-com.akamaized.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8',
    quality: '1080p',
    country: 'KR',
    currentShow: 'K-Pop & Asian Trends Live',
    description: '24/7 English-language South Korean cultural network, K-Pop shows, and Asian lifestyle.'
  },

  // 2. Global News
  {
    id: 'ch-bbc-asia',
    name: 'BBC News Asia Pacific',
    category: 'news',
    logo: 'https://cdn-icons-png.flaticon.com/512/732/732245.png',
    streamUrl: 'https://cdn4.skygo.mn/live/disk1/BBC_News/HLSv3-FTA/BBC_News.m3u8',
    quality: '720p',
    country: 'UK',
    currentShow: 'BBC World News Asia Today',
    description: 'Authoritative breaking global coverage, investigative journalism, and analysis from BBC News.'
  },
  {
    id: 'ch-bbc-world',
    name: 'BBC World News Prime',
    category: 'news',
    logo: 'https://cdn-icons-png.flaticon.com/512/732/732245.png',
    streamUrl: 'https://vs-hls-push-ww-live.akamaized.net/x=4/i=urn:bbc:pips:service:bbc_news_channel_hd/t=3840/v=pv14/b=5070016/main.m3u8',
    quality: '1080p',
    country: 'UK',
    currentShow: 'Global News Hour with BBC',
    description: 'Direct high-bitrate live stream from BBC broadcasting headquarters in London.'
  },
  {
    id: 'ch-bloomberg-asia',
    name: 'Bloomberg Television Asia',
    category: 'news',
    logo: 'https://cdn-icons-png.flaticon.com/512/2838/2838912.png',
    streamUrl: 'https://www.bloomberg.com/media-manifest/streams/asia.m3u8',
    quality: '1080p',
    country: 'US',
    currentShow: 'Bloomberg Markets: Asia Pacific',
    description: 'Live global financial markets, Wall Street analysis, stock indices, and tech economy insights.'
  },
  {
    id: 'ch-cnn',
    name: 'CNN International',
    category: 'news',
    logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968820.png',
    streamUrl: 'https://turnerlive.warnermediacdn.com/hls/live/586495/cnngo/cnn_slate/VIDEO_0_3564000.m3u8',
    quality: '1080p',
    country: 'US',
    currentShow: 'CNN Newsroom Live Worldwide',
    description: 'Leading international breaking news, politics, world events, and in-depth reporting.'
  },
  {
    id: 'ch-dw-english',
    name: 'DW News Global (Germany)',
    category: 'news',
    logo: 'https://cdn-icons-png.flaticon.com/512/197/197571.png',
    streamUrl: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    quality: '1080p',
    country: 'DE',
    currentShow: 'DW News Asia & Europe Review',
    description: 'Deutsche Welle verified 24/7 international English broadcast with independent global perspectives.'
  },
  {
    id: 'ch-yahoo-finance',
    name: 'Yahoo! Finance Live',
    category: 'news',
    logo: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png',
    streamUrl: 'https://yahoo-samsung.amagi.tv/playlist.m3u8',
    quality: '1080p',
    country: 'US',
    currentShow: 'Market Opening Bell & Crypto Watch',
    description: 'Live stocks, market tickers, earnings analysis, macroeconomic reports, and investing insights.'
  },

  // 3. Movies & 24/7 Cinema
  {
    id: 'ch-moviesphere',
    name: 'MovieSphere UK Cinema',
    category: 'movies',
    logo: 'https://cdn-icons-png.flaticon.com/512/2809/2809590.png',
    streamUrl: 'https://moviesphereuk-samsunguk.amagi.tv/playlist.m3u8',
    quality: '1080p',
    country: 'UK',
    currentShow: '24/7 Blockbuster Feature Film',
    description: 'Lionsgate flagship free 24/7 movie channel showcasing critically acclaimed feature films and classics.'
  },
  {
    id: 'ch-amc-thrillers',
    name: 'AMC Rush: Thrillers & Horror',
    category: 'movies',
    logo: 'https://cdn-icons-png.flaticon.com/512/4221/4221419.png',
    streamUrl: 'https://amc-rushbyamc-1-us.vizio.wurl.tv/playlist.m3u8',
    quality: '1080p',
    country: 'US',
    currentShow: 'High-Octane Suspense Night',
    description: 'Non-stop psychological thrillers, edge-of-your-seat suspense, and premium horror cinema from AMC.'
  },

  // 4. Sports & Action
  {
    id: 'ch-redbull-tv',
    name: 'Red Bull TV Extreme',
    category: 'sports',
    logo: 'https://cdn-icons-png.flaticon.com/512/732/732240.png',
    streamUrl: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
    quality: '1080p 60fps',
    country: 'AT',
    currentShow: 'World Extreme Motorsports & Freeride',
    description: 'Unfiltered live adrenaline: downhill mountain biking, Formula 1 lifestyle, cliff diving, and action sports.'
  },
  {
    id: 'ch-outdoor-channel',
    name: 'Outdoor Channel Adventure',
    category: 'sports',
    logo: 'https://cdn-icons-png.flaticon.com/512/824/824239.png',
    streamUrl: 'https://cdn-apse1-prod.tsv2.amagi.tv/linear/amg00718-outdoorchannela-outdoortvnz-samsungnz/playlist.m3u8',
    quality: '1080p',
    country: 'NZ',
    currentShow: 'Wilderness Survival & Expeditions',
    description: 'Off-road exploration, wilderness survival, deep-sea fishing, and outdoor adventure documentaries.'
  },

  // 5. Anime & Cartoons
  {
    id: 'ch-cartoon-network',
    name: 'Cartoon Network 24/7 Live',
    category: 'anime',
    logo: 'https://cdn.iconscout.com/icon/free/png-256/free-cartoon-network-3628704-3029929.png',
    streamUrl: 'https://www.youtube.com/watch?v=fT1vVg8_B7E',
    streamType: 'youtube',
    quality: '1080p HD',
    country: 'US',
    currentShow: 'Trick-Or-Toon & Cartoon Network Classics Marathon',
    description: 'Official Cartoon Network 24/7 live broadcast: non-stop iconic cartoons, animated marathons, Adventure Time, Regular Show, Ben 10, and classic favorites.'
  },
  {
    id: 'ch-japanim-tv',
    name: 'Japanim TV 24/7 (1080p)',
    category: 'anime',
    logo: 'https://cdn-icons-png.flaticon.com/512/10041/10041417.png',
    streamUrl: 'https://foxkidstv.be:3369/stream/play.m3u8',
    quality: '1080p FHD',
    country: 'JP',
    currentShow: 'Anime Marathon & Cult Series',
    description: 'Continuous 24-hour stream of vintage and modern Japanese animation, shonen classics, and OVA gems.'
  },
  {
    id: 'ch-persiana-junior',
    name: 'Persiana Junior Kids',
    category: 'anime',
    logo: 'https://cdn-icons-png.flaticon.com/512/3074/3074767.png',
    streamUrl: 'https://junhls.persiana.live/hls/stream.m3u8',
    quality: '1080p',
    country: 'INT',
    currentShow: 'Family Cartoons & Animated Adventures',
    description: 'Wholesome entertainment for kids and families with animated comedies and adventure series.'
  },
  {
    id: 'ch-3abn-kids',
    name: '3ABN Kids Cartoon Club',
    category: 'anime',
    logo: 'https://cdn-icons-png.flaticon.com/512/2666/2666505.png',
    streamUrl: 'https://3abn.bozztv.com/3abn2/Kids_live/smil:Kids_live.smil/playlist.m3u8',
    quality: '720p',
    country: 'US',
    currentShow: 'Nature Explorers & Storytime',
    description: 'Educational stories, nature exploration, and positive family programming.'
  },

  // 6. Science, Tech & Docs
  {
    id: 'ch-nasa-tv',
    name: 'NASA TV Space Operations HD',
    category: 'tech',
    logo: 'https://cdn-icons-png.flaticon.com/512/1089/1089129.png',
    streamUrl: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
    quality: '1080p 60fps',
    country: 'US',
    currentShow: 'ISS Live Earth Views & Space Walk',
    description: 'Live mission coverage, rocket launches, International Space Station views, and NASA deep space research.'
  },
  {
    id: 'ch-cgtn-docs',
    name: 'CGTN Documentaries',
    category: 'tech',
    logo: 'https://cdn-icons-png.flaticon.com/512/3062/3062634.png',
    streamUrl: 'https://english-livebkali.cgtn.com/live/doccgtn_1.m3u8',
    quality: '1080p',
    country: 'CN',
    currentShow: 'Silk Road Expeditions & Wild China',
    description: 'Award-winning nature documentaries, cultural histories, engineering feats, and geography specials.'
  },

  // 7. Music
  {
    id: 'ch-blues-tv',
    name: 'Blues TV Live Sessions',
    category: 'music',
    logo: 'https://cdn-icons-png.flaticon.com/512/3844/3844724.png',
    streamUrl: 'https://2-fss-2.streamhoster.com/pl_138/205510-3094608-1/playlist.m3u8',
    quality: '720p',
    country: 'US',
    currentShow: 'Live Concert & Festival Recordings',
    description: '24/7 live blues, acoustic jam sessions, jazz legends, and soul concerts.'
  }
];
