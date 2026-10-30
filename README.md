# TV MAX (v4.2.0 — Nuvio Mobile & AIOStreams Web Master Edition)

> **Pure Web & PWA Live TV, Cinema & Streaming Aggregator**  
> Inspired by **[Nuvio Mobile 0.6.5-beta](https://github.com/NuvioMedia/NuvioMobile/releases/tag/0.6.5-beta)** & **[AIOStreams v2.37.0](https://github.com/Viren070/AIOStreams/releases/tag/v2.37.0)**.  
> Designed with **UI UX PRO MAX v2.15.0** & **[ux-ui-agent-skills v3.0.0](https://github.com/plugin87/ux-ui-agent-skills/releases/tag/v3.0.0)** guidelines.  
> **100% Zero APK Dependency** — Runs directly on Phone, Tablet, PC, Laptop, and Smart TV browsers.

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

### 1. Nuvio Mobile (v0.6.5-beta) Cinema & Series Hub
- **Dynamic Multi-Slide Hero Spotlight**: Auto-rotating feature banner with high-resolution artwork, cinematic bottom gradient, IMDb rating badge, duration, 4K Dolby Vision badges, and 1-tap playback.
- **Apple TV+ / Netflix-Grade Snap Rails**:
  - 🏆 **Top 10 Trending Today**: Giant stylized rank numbers (`#1` to `#10`) with glowing cyan borders.
  - 📺 **Binge-Worthy TV Series & Sagas**: Multi-season and episodic navigation (*House of the Dragon*, *Shōgun*, *Stranger Things*) with per-episode streaming links.
  - 🇵🇭 **Pinoy Cinema Vault**: Star Cinema classics & blockbusters (*Rewind*, *Hello, Love, Goodbye*, *Four Sisters and a Wedding*).
  - 🌸 **Anime Universe & Ghibli Remasters**: *Demon Slayer: Mugen Train*, *Your Name*, *Spirited Away*.
  - ⚔️ **Action, Marvel & Sci-Fi Universe**: *Dune: Part Two*, *Spider-Man: Across the Spider-Verse*, *John Wick 4*, *Avengers*.
  - 🍿 **Family & 4K Cinema Showcase**: *Big Buck Bunny*, *Sintel*.
- **Personalized Watchlist**: 1-Tap bookmarking stored in `localStorage` with a dedicated "My Watchlist" rail and filter chip.
- **View Mode Switcher**: Seamless 1-click toggle between **Netflix-style Rails Mode** and **Stremio-style Poster Grid Mode**.

### 2. AIOStreams (v2.37.0) Super-Addon Engine
- **Aggregated Scrapers & Catalogs**:
  - `⚡ Torrentio Streams (v1.0.14)`: Multi-resolution stream resolver (4K HDR, 1080p 60fps, 720p) with live latency monitor.
  - `🎬 MediaFusion Multi-Source (v4.2.0)`: CDN scrapers, sports feeds, and TV broadcasts.
  - `🌐 Cinemeta Catalog Hub (Official)`: IMDb & TMDB metadata engine.
  - `💎 Nuvio 4K VIP CDN`: Low-latency edge video streaming (<12ms).
  - `📡 GMA Kapuso Live PST Sync`: Live Philippine broadcast with 24-hour EPG program guide.
- **Auto-Failover Logic**: If Server 1 encounters CORS, decode error, or network timeout, the player automatically switches to Server 2 or Server 3 without breaking user playback.
- **Custom Stremio Manifest Support**: Users and operators can install any custom Stremio/AIOStreams manifest URL (`https://.../manifest.json`).

### 3. Smart TV & Remote Control Spatial Navigation
- `Arrow Keys (Left/Right)`: Seek ±10 seconds / Volume
- `Arrow Keys (Up/Down)`: Channel Switching
- `Space / OK`: Play / Pause / Unmute
- `F`: True Edge-to-Edge Cinema Fullscreen
- `C`: Quick Switch between Live TV and Nuvio Cinema
- `S`: Quick Cycle AIOStreams Servers
- `1-9`: Direct Channel Keypad Switching

### 4. Piso WiFi & Hotspot 1-Minute Free Preview
- Realtime digital countdown HUD (`00:59` down to `00:00`).
- Persistent expiry lock with instant coin refill and captive portal verification.
- Dev/Test 1-tap restart preview button inside the coin modal.

### 5. Boss Master Control Panel
- **Access**: Press `Ctrl + Shift + B` or enter PIN `9999` in settings.
- 1-Click License Key Generator (`TVMAX-VENDO-1M-XXXX`, `2M`, `1Y`, `LIFE`).
- 1-Click Messenger pitch generator for clients.
- Maya (`09912255156`) and Facebook (`https://www.facebook.com/Ukauru/`) integration.
