# TV MAX (v4.3.0 — Nuvio Mobile 0.6.7-beta & AIOStreams Web Master Edition)

> **Pure Web & PWA Cinema & Streaming Aggregator**  
> Dedicated exclusively to **[Nuvio Mobile 0.6.7-beta](https://github.com/NuvioMedia/NuvioMobile/releases/tag/0.6.7-beta)** & **[AIOStreams v2.37.0](https://github.com/Viren070/AIOStreams)**.  
> Designed with **UI UX PRO MAX v2.15.0** & **[ux-ui-agent-skills v3.0.0](https://github.com/plugin87/ux-ui-agent-skills)** guidelines.  
> **100% Zero APK Dependency** — Runs directly on Phone, Tablet, PC, Laptop, and Smart TV browsers.

---

## 🌐 Live Production Deployment

- **Production Cloudflare Edge**: [https://tv-max.pages.dev](https://tv-max.pages.dev)
- **Secondary Edge Mirror**: [https://aura-stream-vip.pages.dev](https://aura-stream-vip.pages.dev)
- **Local Dev Server**: `http://localhost:5173`
- **GitHub Repository**: [https://github.com/Yazerukun/tv-max](https://github.com/Yazerukun/tv-max)

---

## 🚀 Quick Start (Local Web)

```bash
# 1. Navigate to the project directory
cd "D:\TV MAX"

# 2. Start the high-speed Vite development server
npm run dev

# Access the app at:
# http://localhost:5173
```

---

## 💎 Key Features & Architecture

### 1. Nuvio Mobile 0.6.7-beta Core Feature Parity
- 👥 **Watch Party Side Panel with Dynamic Video Resizing**:
  - Live Watch Party room generation with 1-click room code copying and shareable web link.
  - Smooth dynamic flex-resizing of the video canvas beside the chat drawer without stopping playback.
  - Real-time live room messaging and 1-tap animated emoji reaction bursts (🔥, ❤️, 👏, 🍿, 😱, 😂).
- 🕒 **Continue Watching Rail & "Mark as Watched"**:
  - Automatically captures playback timestamp and progress percentage every 5 seconds.
  - Dedicated "Continue Watching" rail on the VOD Hub with progress bar indicators and 1-tap instant resume.
  - Nuvio 0.6.7 feature: **Mark as Watched** button to clear items or mark completed, plus trash removal.
- ⏭️ **Chapter Intro & Outro Skipping (MKV / Chapter Parity)**:
  - Smart floating skip buttons for instant intro skip (+85s) and outro skip (+90s) with active countdown resets.
- 💬 **Subtitle & Codec Extras Parity**:
  - Full subtitle customization panel (font size, color, background, offset) and telemetry metadata parity.
- 🛡️ **Anti-Failover Loop Protection**:
  - Remembers failed mirror instances during a session to prevent infinite failover loops.

### 2. Nuvio Mobile Cinema & Series Engine
- **Dynamic Multi-Slide Hero Spotlight**: Auto-rotating feature banner with high-resolution artwork, cinematic bottom gradient, IMDb rating badge, duration, 4K Dolby Vision badges, and 1-tap playback.
- **Apple TV+ / Netflix-Grade Snap Rails**:
  - 🕒 **Rail 0: Continue Watching**: Resume in-progress movies and episodes with live progress bars.
  - 🏆 **Rail 1: Top 10 Trending Today**: Giant stylized rank numbers (`#1` to `#10`) with glowing cyan borders.
  - 🔥 **Nuvio Cinemeta Live Trending Movies**: 100+ Top Blockbusters synced from Stremio Cinemeta.
  - 📺 **Binge-Worthy TV Series & Sagas**: Multi-season and episodic navigation (*House of the Dragon*, *Shōgun*, *Stranger Things*) with per-episode streaming links.
  - ⚔️ **Action, Marvel & Sci-Fi Masters**: *Dune: Part Two*, *Spider-Man: Across the Spider-Verse*, *John Wick 4*, *Avengers*.
  - 🌸 **Anime Universe & Ghibli Remasters**: *Demon Slayer: Mugen Train*, *Your Name*, *Spirited Away*.
  - 🇵🇭 **Pinoy Cinema Vault**: Star Cinema classics & blockbusters (*Rewind*, *Hello, Love, Goodbye*, *Four Sisters and a Wedding*).
  - 🍿 **Family & Comedy Cinema**: Multi-category family features.
  - 💀 **Dark Horror & Suspense Night**: Psychological thrillers and horror films.
- **Personalized Watchlist**: 1-Tap bookmarking stored in `localStorage` with a dedicated "My Watchlist" rail and filter chip.
- **View Mode Switcher**: Seamless 1-click toggle between **Netflix-style Rails Mode** and **Stremio-style Poster Grid Mode**.
- **Boundless Pagination**: "Load More Movies (+50 Titles)" pagination button for infinite catalog discovery.

### 3. 100% Authentic Theatrical Artwork (Metahub & Amazon IMDb CDN)
- Zero generic stock photos or Unsplash placeholders.
- Official Stremio Metahub CDN (`https://images.metahub.space/poster/medium/{id}/img`) and Amazon IMDb CDN (`._V1_SX600.jpg`).
- Automatic `/poster/small/` $\to$ `/poster/medium/` high-res upscaling and dynamic image error fallback (`onError`).

### 4. AIOStreams Multi-Server Playback Engine
- **5 High-Speed Real Stream Mirrors** on every title (`M1` to `M5`):
  - **Mirror 1: VidSrc Ultra** (`vidsrc.to`)
  - **Mirror 2: MultiEmbed Global** (`multiembed.mov`) with multi-audio & subtitles
  - **Mirror 3: VidSrc ME Prime** (`vidsrc.me`) 4K HDR Ready
  - **Mirror 4: 2Embed Global Stream** (`2embed.cc`)
  - **Mirror 5: AutoEmbed CDN** (`autoembed.co`)
- **Real-Debrid Scraper Support**: Direct integration with Torrentio scrapers and Real-Debrid API token vault.

### 5. 100% Immersive Full-Viewport Cinema Player
- Takes 100% viewport (`100dvh`), perfectly fitting the video frame without letterboxing or squishing.
- Non-blocking floating acrylic HUD with 3.5s auto-hide timer.
- Floating series episode navigator (`Prev` / `Next` episode).
- 4-Tier Fullscreen, Playback Speed (0.5x to 2x), Aspect Ratio (`16:9`, `fill`, `contain`, `4:3`), and Dynamic Ambient Glow.

### 6. Smart TV & Remote Control Spatial Navigation
- `Arrow Keys (Left/Right)`: Seek ±10 seconds
- `Space / OK`: Play / Pause / Unmute
- `F`: True Edge-to-Edge Fullscreen
- `S`: Quick Cycle AIOStreams Mirror Servers
- `M`: Toggle Sound / Mute
- `G`: Toggle Ambient Glow
- `Esc`: Back to Catalog

---

## 🛠️ Tech Stack

- **Framework**: React 18 / TypeScript
- **Bundler**: Vite 5
- **Styling**: Tailwind CSS / Lucide Icons / Uiverse.io luxury components
- **Media Engine**: HLS.js / Native HTML5 / Multi-Embed Sandboxed Players
- **Hosting**: Cloudflare Pages Edge Network (`tv-max.pages.dev`)
