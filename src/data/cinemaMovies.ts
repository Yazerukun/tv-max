export interface StreamServer {
  id: string;
  name: string;
  url: string;
  type: 'hls' | 'mp4' | 'embed';
  quality: string;
  provider?: string;
  speed?: string;
  latency?: string;
  isVerified?: boolean;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  duration: string;
  overview: string;
  thumbnail?: string;
  servers: StreamServer[];
}

export interface Season {
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface CinemaMovie {
  id: string;
  title: string;
  type?: 'movie' | 'series';
  year: number;
  rating: string;
  imdbScore: number;
  duration: string;
  genres: string[];
  category: 'trending' | 'series' | 'pinoy' | 'action' | 'anime' | 'family';
  backdropUrl: string;
  posterUrl: string;
  synopsis: string;
  director: string;
  cast: string[];
  streamUrl: string;
  servers: StreamServer[];
  seasons?: Season[];
  quality: '4K HDR' | '1080p HD';
  isFeatured?: boolean;
}

export const CINEMA_MOVIES: CinemaMovie[] = [
  // 1. FEATURED HERO & TRENDING BLOCKBUSTERS
  {
    id: 'mov-avengers-endgame',
    title: 'Avengers: Endgame',
    type: 'movie',
    year: 2019,
    rating: 'PG-13',
    imdbScore: 8.4,
    duration: '3h 01m',
    genres: ['Action', 'Sci-Fi', 'Marvel'],
    category: 'trending',
    isFeatured: true,
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1280&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    synopsis: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos\' actions and restore balance to the cosmos.',
    director: 'Anthony & Joe Russo',
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Chris Hemsworth', 'Scarlett Johansson'],
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    servers: [
      { 
        id: 'srv-endgame-1', 
        name: '[AIO Torrentio] 4K 2160p HDR Master', 
        url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 
        type: 'hls', 
        quality: '4K HDR', 
        provider: 'Torrentio', 
        speed: '48 MB/s', 
        latency: '18ms', 
        isVerified: true 
      },
      { 
        id: 'srv-endgame-2', 
        name: '[AIO MediaFusion] 1080p FHD 60fps', 
        url: 'https://vjs.zencdn.net/v/oceans.mp4', 
        type: 'mp4', 
        quality: '1080p', 
        provider: 'MediaFusion', 
        speed: '25 MB/s', 
        latency: '24ms', 
        isVerified: true 
      },
      { 
        id: 'srv-endgame-3', 
        name: '[AIO Nuvio Edge] Direct HLS CDN', 
        url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8', 
        type: 'hls', 
        quality: '1080p', 
        provider: 'Nuvio VIP', 
        speed: '60 MB/s', 
        latency: '12ms', 
        isVerified: true 
      },
      { 
        id: 'srv-endgame-4', 
        name: '[AIO WebEmbed] Zero-Buffer Cinema', 
        url: 'https://www.youtube-nocookie.com/embed/TcMBFSGVi1c?autoplay=1&mute=0&enablejsapi=1&playsinline=1', 
        type: 'embed', 
        quality: '4K', 
        provider: 'WebEmbed', 
        latency: '30ms', 
        isVerified: true 
      },
    ],
    quality: '4K HDR'
  },
  {
    id: 'ser-house-of-dragon',
    title: 'House of the Dragon',
    type: 'series',
    year: 2024,
    rating: 'TV-MA',
    imdbScore: 8.5,
    duration: '2 Seasons • 18 Episodes',
    genres: ['Action', 'Adventure', 'Drama', 'Fantasy'],
    category: 'series',
    isFeatured: true,
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    synopsis: 'An internal succession war within House Targaryen at the height of its power, 172 years before the birth of Daenerys Targaryen.',
    director: 'Ryan J. Condal',
    cast: ['Matt Smith', 'Emma D\'Arcy', 'Olivia Cooke', 'Rhys Ifans', 'Steve Toussaint'],
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    servers: [
      { id: 'srv-hotd-1', name: '[AIO Torrentio] 4K 2160p Dolby Vision', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls', quality: '4K', provider: 'Torrentio', speed: '55 MB/s', isVerified: true },
      { id: 'srv-hotd-2', name: '[AIO Nuvio Edge] 1080p Ultra CDN', url: 'https://vjs.zencdn.net/v/oceans.mp4', type: 'mp4', quality: '1080p', provider: 'Nuvio VIP', isVerified: true },
    ],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: The Heirs of the Dragon',
        episodes: [
          {
            id: 'hotd-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Episode 1: The Heirs of the Dragon',
            duration: '66m',
            overview: 'Viserys hosts a tournament to celebrate the birth of his second child. Rhaenyra welcomes her uncle Daemon back to King\'s Landing.',
            servers: [
              { id: 'hotd-s1e1-1', name: '[AIO Torrentio] 4K HDR', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls', quality: '4K', provider: 'Torrentio' },
              { id: 'hotd-s1e1-2', name: '[AIO Direct CDN] 1080p', url: 'https://vjs.zencdn.net/v/oceans.mp4', type: 'mp4', quality: '1080p', provider: 'Direct CDN' }
            ]
          },
          {
            id: 'hotd-s1e2',
            episodeNumber: 2,
            seasonNumber: 1,
            title: 'Episode 2: The Rogue Prince',
            duration: '54m',
            overview: 'Rhaenyra disrupts the Small Council. Daemon seizes Dragonstone and steals a dragon egg.',
            servers: [
              { id: 'hotd-s1e2-1', name: '[AIO Torrentio] 4K HDR', url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8', type: 'hls', quality: '4K', provider: 'Torrentio' }
            ]
          },
          {
            id: 'hotd-s1e3',
            episodeNumber: 3,
            seasonNumber: 1,
            title: 'Episode 3: Second of His Name',
            duration: '63m',
            overview: 'Daemon and the Sea Snake battle the Crabfeeder. The realm celebrates Aegon\'s second name day.',
            servers: [
              { id: 'hotd-s1e3-1', name: '[AIO Torrentio] 1080p', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls', quality: '1080p', provider: 'Torrentio' }
            ]
          }
        ]
      }
    ],
    quality: '4K HDR'
  },
  {
    id: 'ser-stranger-things',
    title: 'Stranger Things',
    type: 'series',
    year: 2024,
    rating: 'TV-14',
    imdbScore: 8.7,
    duration: '4 Seasons • 34 Episodes',
    genres: ['Drama', 'Fantasy', 'Horror', 'Mystery'],
    category: 'series',
    isFeatured: true,
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1280&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    synopsis: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    director: 'The Duffer Brothers',
    cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'Winona Ryder', 'David Harbour', 'Gaten Matarazzo'],
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    servers: [
      { id: 'srv-st-1', name: '[AIO Torrentio] 4K 2160p HDR', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls', quality: '4K', provider: 'Torrentio', isVerified: true },
      { id: 'srv-st-2', name: '[AIO MediaFusion] 1080p Direct', url: 'https://vjs.zencdn.net/v/oceans.mp4', type: 'mp4', quality: '1080p', provider: 'MediaFusion', isVerified: true },
    ],
    seasons: [
      {
        seasonNumber: 4,
        title: 'Season 4: The Hawkins Curse',
        episodes: [
          {
            id: 'st-s4e1',
            episodeNumber: 1,
            seasonNumber: 4,
            title: 'Chapter One: The Hellfire Club',
            duration: '76m',
            overview: 'El struggles to fit in at school in California. Back in Hawkins, the high school boys join an intense D&D campaign.',
            servers: [
              { id: 'st-s4e1-1', name: '[AIO Torrentio] 4K HDR', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls', quality: '4K' },
              { id: 'st-s4e1-2', name: '[AIO Direct CDN] 1080p', url: 'https://vjs.zencdn.net/v/oceans.mp4', type: 'mp4', quality: '1080p' }
            ]
          },
          {
            id: 'st-s4e2',
            episodeNumber: 2,
            seasonNumber: 4,
            title: 'Chapter Two: Vecna\'s Curse',
            duration: '77m',
            overview: 'A plane brings Mike to California and a dead body brings Hawkins to a halt. Nancy starts asking questions.',
            servers: [
              { id: 'st-s4e2-1', name: '[AIO Torrentio] 4K HDR', url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8', type: 'hls', quality: '4K' }
            ]
          }
        ]
      }
    ],
    quality: '4K HDR'
  },
  {
    id: 'mov-interstellar',
    title: 'Interstellar',
    type: 'movie',
    year: 2014,
    rating: 'PG-13',
    imdbScore: 8.7,
    duration: '2h 49m',
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    category: 'trending',
    isFeatured: true,
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1280&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&auto=format&fit=crop&q=80',
    synopsis: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine', 'Matt Damon'],
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    servers: [
      { id: 'srv-inter-1', name: '[AIO Torrentio] 4K IMAX Remux', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls', quality: '4K HDR', provider: 'Torrentio', speed: '50 MB/s', isVerified: true },
      { id: 'srv-inter-2', name: '[AIO MediaFusion] 1080p Direct', url: 'https://vjs.zencdn.net/v/oceans.mp4', type: 'mp4', quality: '1080p', provider: 'MediaFusion', isVerified: true },
    ],
    quality: '4K HDR'
  },
  {
    id: 'mov-top-gun-maverick',
    title: 'Top Gun: Maverick',
    type: 'movie',
    year: 2022,
    rating: 'PG-13',
    imdbScore: 8.3,
    duration: '2h 10m',
    genres: ['Action', 'Drama'],
    category: 'action',
    backdropUrl: 'https://images.unsplash.com/photo-1519074069444-1ba4fff16def?w=1280&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=600&auto=format&fit=crop&q=80',
    synopsis: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN\'s elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.',
    director: 'Joseph Kosinski',
    cast: ['Tom Cruise', 'Miles Teller', 'Jennifer Connelly', 'Jon Hamm', 'Glen Powell'],
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    servers: [
      { id: 'srv-tg-1', name: '[AIO Torrentio] 4K Dolby Atmos', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls', quality: '4K HDR', provider: 'Torrentio', isVerified: true },
      { id: 'srv-tg-2', name: '[AIO Direct CDN] 1080p High Speed', url: 'https://vjs.zencdn.net/v/oceans.mp4', type: 'mp4', quality: '1080p', provider: 'Direct CDN', isVerified: true },
    ],
    quality: '4K HDR'
  },
  {
    id: 'mov-john-wick-4',
    title: 'John Wick: Chapter 4',
    type: 'movie',
    year: 2023,
    rating: 'R',
    imdbScore: 7.7,
    duration: '2h 49m',
    genres: ['Action', 'Crime', 'Thriller'],
    category: 'action',
    backdropUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1280&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80',
    synopsis: 'John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.',
    director: 'Chad Stahelski',
    cast: ['Keanu Reeves', 'Donnie Yen', 'Bill Skarsgård', 'Laurence Fishburne', 'Hiroyuki Sanada'],
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    servers: [
      { id: 'srv-jw-1', name: '[AIO Torrentio] 4K 2160p HDR', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls', quality: '4K HDR', provider: 'Torrentio', isVerified: true },
      { id: 'srv-jw-2', name: '[AIO MediaFusion] 1080p FHD', url: 'https://vjs.zencdn.net/v/oceans.mp4', type: 'mp4', quality: '1080p', provider: 'MediaFusion', isVerified: true },
    ],
    quality: '4K HDR'
  },
  // PINOY CINEMA CLASSICS
  {
    id: 'mov-hello-love-goodbye',
    title: 'Hello, Love, Goodbye',
    type: 'movie',
    year: 2019,
    rating: 'PG-13',
    imdbScore: 7.4,
    duration: '1h 58m',
    genres: ['Romance', 'Drama', 'Pinoy Cinema'],
    category: 'pinoy',
    backdropUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1280&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=80',
    synopsis: 'In Hong Kong, Joy, a domestic worker with big dreams of moving to Canada, meets Ethan, a charming bartender who loves life in the city. Together they navigate love, sacrifices, and ambitions.',
    director: 'Cathy Garcia-Molina',
    cast: ['Kathryn Bernardo', 'Alden Richards', 'Kakai Bautista', 'Maymay Entrata', 'Joross Gamboa'],
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    servers: [
      { id: 'srv-hlg-1', name: '[AIO Star Cinema CDN] 1080p FHD', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls', quality: '1080p', provider: 'Star Cinema Vault', isVerified: true },
      { id: 'srv-hlg-2', name: '[AIO MediaFusion Mirror] 1080p', url: 'https://vjs.zencdn.net/v/oceans.mp4', type: 'mp4', quality: '1080p', provider: 'MediaFusion', isVerified: true },
    ],
    quality: '1080p HD'
  },
  {
    id: 'mov-four-sisters',
    title: 'Four Sisters and a Wedding',
    type: 'movie',
    year: 2013,
    rating: 'PG-13',
    imdbScore: 7.3,
    duration: '2h 10m',
    genres: ['Comedy', 'Drama', 'Family', 'Pinoy Cinema'],
    category: 'pinoy',
    backdropUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1280&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    synopsis: 'Four sisters reunite to stop the impending wedding of their youngest brother, bringing decades of hidden sibling rivalries and heartfelt truths to the surface.',
    director: 'Cathy Garcia-Molina',
    cast: ['Bea Alonzo', 'Angel Locsin', 'Toni Gonzaga', 'Shaina Magdayao', 'Enchong Dee'],
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    servers: [
      { id: 'srv-fs-1', name: '[AIO Star Cinema CDN] 1080p Remaster', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls', quality: '1080p', provider: 'Star Cinema Vault', isVerified: true },
      { id: 'srv-fs-2', name: '[AIO Nuvio Edge] Direct MP4', url: 'https://vjs.zencdn.net/v/oceans.mp4', type: 'mp4', quality: '1080p', provider: 'Nuvio VIP', isVerified: true },
    ],
    quality: '1080p HD'
  },
  // ANIME MASTERPIECES
  {
    id: 'mov-demon-slayer-mugen',
    title: 'Demon Slayer: Mugen Train',
    type: 'movie',
    year: 2020,
    rating: 'R',
    imdbScore: 8.2,
    duration: '1h 57m',
    genres: ['Anime', 'Action', 'Fantasy'],
    category: 'anime',
    backdropUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1280&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    synopsis: 'Tanjiro, Nezuko, Zenitsu, and Inosuke board the mysterious Infinity Train alongside the Flame Hashira Kyojuro Rengoku to face a formidable demon preying on innocent passengers.',
    director: 'Haruo Sotozaki',
    cast: ['Natsuki Hanae', 'Akari Kito', 'Hiro Shimono', 'Yoshitsugu Matsuoka', 'Satoshi Hino'],
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    servers: [
      { id: 'srv-ds-1', name: '[AIO Torrentio Anime] 4K 60fps Dual Audio', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls', quality: '4K', provider: 'Torrentio Anime', isVerified: true },
      { id: 'srv-ds-2', name: '[AIO Direct CDN] 1080p Japanese Audio', url: 'https://vjs.zencdn.net/v/oceans.mp4', type: 'mp4', quality: '1080p', provider: 'Direct CDN', isVerified: true },
    ],
    quality: '4K HDR'
  },
  {
    id: 'mov-your-name',
    title: 'Your Name (Kimi no Na wa)',
    type: 'movie',
    year: 2016,
    rating: 'PG',
    imdbScore: 8.4,
    duration: '1h 46m',
    genres: ['Anime', 'Drama', 'Romance', 'Fantasy'],
    category: 'anime',
    backdropUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1280&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    synopsis: 'Two teenagers share a profound, magical connection upon discovering they are swapping bodies. Things become even more complicated when the boy and girl decide to meet in person.',
    director: 'Makoto Shinkai',
    cast: ['Ryunosuke Kamiki', 'Mone Kamishiraishi', 'Ryo Narita', 'Aoi Yuki'],
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    servers: [
      { id: 'srv-yn-1', name: '[AIO Torrentio] 1080p BluRay Remaster', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls', quality: '1080p', provider: 'Torrentio', isVerified: true },
      { id: 'srv-yn-2', name: '[AIO Nuvio Edge] Direct MP4', url: 'https://vjs.zencdn.net/v/oceans.mp4', type: 'mp4', quality: '1080p', provider: 'Nuvio VIP', isVerified: true },
    ],
    quality: '1080p HD'
  },
  // FAMILY & OPEN CINEMA SHOWCASE
  {
    id: 'mov-big-buck-bunny',
    title: 'Big Buck Bunny (4K Remaster)',
    type: 'movie',
    year: 2008,
    rating: 'G',
    imdbScore: 7.2,
    duration: '10m',
    genres: ['Animation', 'Comedy', 'Short', 'Family'],
    category: 'family',
    backdropUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1280&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    synopsis: 'A large, lovable rabbit deals with bullying forest creatures in this groundbreaking open-source animated cinema masterpiece.',
    director: 'Sacha Goedegebure',
    cast: ['Bunny', 'Rinky', 'Gimera', 'Frank'],
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    servers: [
      { id: 'srv-bbb-1', name: '[AIO OpenCinema] 4K 60fps Master HLS', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls', quality: '4K', provider: 'OpenCinema', isVerified: true },
      { id: 'srv-bbb-2', name: '[AIO Blender Studio] Direct MP4', url: 'https://vjs.zencdn.net/v/oceans.mp4', type: 'mp4', quality: '1080p', provider: 'Direct CDN', isVerified: true },
    ],
    quality: '4K HDR'
  },
  {
    id: 'mov-sintel',
    title: 'Sintel (Cinema Edition)',
    type: 'movie',
    year: 2010,
    rating: 'PG',
    imdbScore: 7.5,
    duration: '15m',
    genres: ['Animation', 'Fantasy', 'Adventure', 'Family'],
    category: 'family',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&auto=format&fit=crop&q=80',
    synopsis: 'A lonely young woman searches the dangerous wilderness for a baby dragon she befriended and nursed back to health.',
    director: 'Colin Levy',
    cast: ['Halina Reijn', 'Thom Hoffman'],
    streamUrl: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    servers: [
      { id: 'srv-sin-1', name: '[AIO Akamai Edge] 4K HLS Playlist', url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8', type: 'hls', quality: '4K', provider: 'Akamai Edge', isVerified: true },
      { id: 'srv-sin-2', name: '[AIO VideoJS] Direct Web Video', url: 'https://vjs.zencdn.net/v/oceans.mp4', type: 'mp4', quality: '1080p', provider: 'VideoJS', isVerified: true },
    ],
    quality: '4K HDR'
  },
  // EXPANDED LUXURY BLOCKBUSTERS & SERIES
  {
    id: 'mov-dune-2',
    title: 'Dune: Part Two',
    type: 'movie',
    year: 2024,
    rating: 'PG-13',
    imdbScore: 8.6,
    duration: '2h 46m',
    genres: ['Sci-Fi', 'Adventure', 'Action'],
    category: 'trending',
    isFeatured: true,
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1280&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe.',
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem', 'Austin Butler'],
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    servers: [
      { id: 'srv-dune-1', name: '[AIO Torrentio] 4K IMAX Remux HDR', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls', quality: '4K HDR', provider: 'Torrentio', speed: '58 MB/s', latency: '16ms', isVerified: true },
      { id: 'srv-dune-2', name: '[AIO MediaFusion] 1080p FHD 60fps', url: 'https://vjs.zencdn.net/v/oceans.mp4', type: 'mp4', quality: '1080p', provider: 'MediaFusion', speed: '32 MB/s', latency: '22ms', isVerified: true },
    ],
    quality: '4K HDR'
  },
  {
    id: 'ser-shogun',
    title: 'Shōgun (2024 Masterpiece)',
    type: 'series',
    year: 2024,
    rating: 'TV-MA',
    imdbScore: 8.8,
    duration: '1 Season • 10 Episodes',
    genres: ['Drama', 'History', 'War', 'Adventure'],
    category: 'series',
    isFeatured: true,
    backdropUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1280&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    synopsis: 'When a mysterious European ship is found marooned in a nearby fishing village, Lord Yoshii Toranaga discovers secrets that could tip the scales of power in feudal Japan.',
    director: 'Rachel Kondo & Justin Marks',
    cast: ['Hiroyuki Sanada', 'Cosmo Jarvis', 'Anna Sawai', 'Tadanobu Asano', 'Takehiro Hira'],
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    servers: [
      { id: 'srv-shogun-1', name: '[AIO Torrentio] 4K HDR Dolby Atmos', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls', quality: '4K HDR', provider: 'Torrentio', isVerified: true },
      { id: 'srv-shogun-2', name: '[AIO Nuvio Edge] 1080p Direct', url: 'https://vjs.zencdn.net/v/oceans.mp4', type: 'mp4', quality: '1080p', provider: 'Nuvio VIP', isVerified: true },
    ],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Feudal Japan',
        episodes: [
          {
            id: 'shogun-s1e1',
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Chapter One: Anjin',
            duration: '70m',
            overview: 'Destinies converge in Japan after an English ship runs aground in Toranaga\'s territory.',
            servers: [
              { id: 'shogun-s1e1-1', name: '[AIO Torrentio] 4K HDR', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls', quality: '4K' },
            ]
          },
          {
            id: 'shogun-s1e2',
            episodeNumber: 2,
            seasonNumber: 1,
            title: 'Chapter Two: Servants of Two Masters',
            duration: '59m',
            overview: 'Blackthorne\'s arrival in Osaka creates a storm among Christian Daimyos and Toranaga.',
            servers: [
              { id: 'shogun-s1e2-1', name: '[AIO Torrentio] 4K HDR', url: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8', type: 'hls', quality: '4K' }
            ]
          }
        ]
      }
    ],
    quality: '4K HDR'
  },
  {
    id: 'mov-rewind-pinoy',
    title: 'Rewind (Dingdong & Marian)',
    type: 'movie',
    year: 2023,
    rating: 'PG-13',
    imdbScore: 7.9,
    duration: '1h 52m',
    genres: ['Drama', 'Romance', 'Family', 'Pinoy Cinema'],
    category: 'pinoy',
    backdropUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1280&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&auto=format&fit=crop&q=80',
    synopsis: 'John is granted an extraordinary chance to turn back the hands of time to save his wife Mary after a fatal car accident, discovering what true love demands.',
    director: 'Mae Cruz-Alviar',
    cast: ['Dingdong Dantes', 'Marian Rivera', 'Jordan Lim', 'Pepe Herrera', 'Chamyto Aguedan'],
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    servers: [
      { id: 'srv-rewind-1', name: '[AIO Star Cinema CDN] 1080p Master', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls', quality: '1080p', provider: 'Star Cinema Vault', isVerified: true },
      { id: 'srv-rewind-2', name: '[AIO MediaFusion] 1080p Direct MP4', url: 'https://vjs.zencdn.net/v/oceans.mp4', type: 'mp4', quality: '1080p', provider: 'MediaFusion', isVerified: true },
    ],
    quality: '1080p HD'
  },
  {
    id: 'mov-spider-verse',
    title: 'Spider-Man: Across the Spider-Verse',
    type: 'movie',
    year: 2023,
    rating: 'PG',
    imdbScore: 8.7,
    duration: '2h 20m',
    genres: ['Animation', 'Action', 'Marvel', 'Sci-Fi'],
    category: 'action',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1280&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    synopsis: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When heroes clash, Miles must redefine heroism.',
    director: 'Joaquim Dos Santos, Kemp Powers',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Daniel Kaluuya', 'Jake Johnson'],
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    servers: [
      { id: 'srv-spider-1', name: '[AIO Torrentio] 4K HDR 60fps', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls', quality: '4K HDR', provider: 'Torrentio', speed: '62 MB/s', latency: '14ms', isVerified: true },
      { id: 'srv-spider-2', name: '[AIO Nuvio Edge] 1080p Master', url: 'https://vjs.zencdn.net/v/oceans.mp4', type: 'mp4', quality: '1080p', provider: 'Nuvio VIP', isVerified: true },
    ],
    quality: '4K HDR'
  },
  {
    id: 'mov-spirited-away',
    title: 'Spirited Away (Sen to Chihiro)',
    type: 'movie',
    year: 2001,
    rating: 'PG',
    imdbScore: 8.6,
    duration: '2h 05m',
    genres: ['Anime', 'Animation', 'Adventure', 'Fantasy'],
    category: 'anime',
    backdropUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1280&auto=format&fit=crop&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    synopsis: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.',
    director: 'Hayao Miyazaki',
    cast: ['Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki', 'Takashi Naito'],
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    servers: [
      { id: 'srv-ghibli-1', name: '[AIO Studio Ghibli Vault] 1080p Remaster', url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', type: 'hls', quality: '1080p', provider: 'Studio Ghibli CDN', isVerified: true },
      { id: 'srv-ghibli-2', name: '[AIO Torrentio Anime] 1080p Dual Audio', url: 'https://vjs.zencdn.net/v/oceans.mp4', type: 'mp4', quality: '1080p', provider: 'Torrentio Anime', isVerified: true },
    ],
    quality: '1080p HD'
  }
];
