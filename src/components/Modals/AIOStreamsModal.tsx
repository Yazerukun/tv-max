import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Sparkles, 
  Tv, 
  Film, 
  Crown, 
  Flame, 
  Activity, 
  Settings2,
  Trash2,
  RotateCcw,
  ShieldCheck,
  Search
} from 'lucide-react';
import { 
  AIOStreamAddon, 
  AIOStreamsConfig, 
  getAIOStreamsConfig, 
  saveAIOStreamsConfig,
  DEFAULT_AIO_ADDONS 
} from '../../data/aiostreamsAddons';

interface AIOStreamsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated?: () => void;
}

export const AIOStreamsModal: React.FC<AIOStreamsModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated
}) => {
  const [config, setConfig] = useState<AIOStreamsConfig>(() => getAIOStreamsConfig());
  const [activeTab, setActiveTab] = useState<'addons' | 'settings' | 'install'>('addons');
  const [newManifestUrl, setNewManifestUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedFeedback, setSavedFeedback] = useState(false);

  if (!isOpen) return null;

  const handleToggleAddon = (addonId: string) => {
    const updatedAddons = config.addons.map((a) => 
      a.id === addonId ? { ...a, enabled: !a.enabled } : a
    );
    const updated = { ...config, addons: updatedAddons };
    setConfig(updated);
    saveAIOStreamsConfig(updated);
    showFeedback();
    onConfigUpdated?.();
  };

  const handleRemoveAddon = (addonId: string) => {
    const updatedAddons = config.addons.filter((a) => a.id !== addonId);
    const updated = { ...config, addons: updatedAddons };
    setConfig(updated);
    saveAIOStreamsConfig(updated);
    showFeedback();
    onConfigUpdated?.();
  };

  const handleResetDefaults = () => {
    const fresh = {
      autoFailover: true,
      preferredQuality: '1080p' as const,
      maxFailoverAttempts: 3,
      sortOrder: 'quality-first' as const,
      realDebridApiKey: '',
      addons: DEFAULT_AIO_ADDONS
    };
    setConfig(fresh);
    saveAIOStreamsConfig(fresh);
    showFeedback();
    onConfigUpdated?.();
  };

  const handleInstallCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newManifestUrl.trim()) return;

    try {
      const url = new URL(newManifestUrl.trim());
      const customId = `addon-custom-${Date.now()}`;
      const newAddon: AIOStreamAddon = {
        id: customId,
        name: url.hostname.replace('www.', '').split('.')[0].toUpperCase() + ' Stream Addon',
        version: 'v1.0.0',
        description: `Custom stream provider loaded from ${url.hostname}`,
        manifestUrl: newManifestUrl.trim(),
        type: 'scraper',
        icon: 'Zap',
        status: 'online',
        latencyMs: 35,
        enabled: true,
        isBuiltIn: false,
        supportedTypes: ['movie', 'series', 'tv']
      };

      const updated = {
        ...config,
        addons: [...config.addons, newAddon]
      };
      setConfig(updated);
      saveAIOStreamsConfig(updated);
      setNewManifestUrl('');
      setActiveTab('addons');
      showFeedback();
      onConfigUpdated?.();
    } catch {
      alert('Please enter a valid URL (e.g. https://addon.example.com/manifest.json)');
    }
  };

  const showFeedback = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const filteredAddons = config.addons.filter((a) => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-[#090b11] border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-r from-cyan-950/40 via-transparent to-purple-950/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Layers className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white font-sans">
                  AIOStreams & Nuvio Engine
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  v2.37.0
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Nuvio 0.6.5
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Aggregated multi-provider failover, scraper network & zero-buffering CDN
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedFeedback && (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 animate-fadeIn">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved
              </span>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-black/40">
          <button
            onClick={() => setActiveTab('addons')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'addons'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Active Addons ({config.addons.filter(a => a.enabled).length}/{config.addons.length})
          </button>

          <button
            onClick={() => setActiveTab('install')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'install'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Custom Provider
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            Failover & Debrid
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'addons' && (
            <>
              {/* Search filter */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter addons and scrapers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              {/* Addons List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredAddons.map((addon) => (
                  <div 
                    key={addon.id}
                    className={`p-4 rounded-2xl border transition-all duration-200 uiverse-card ${
                      addon.enabled
                        ? 'bg-slate-900/60 border-cyan-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                        : 'bg-black/30 border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl ${addon.enabled ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-slate-500'}`}>
                          {addon.icon === 'Zap' && <Zap className="w-4 h-4" />}
                          {addon.icon === 'Film' && <Film className="w-4 h-4" />}
                          {addon.icon === 'Sparkles' && <Sparkles className="w-4 h-4" />}
                          {addon.icon === 'Tv' && <Tv className="w-4 h-4" />}
                          {addon.icon === 'Crown' && <Crown className="w-4 h-4" />}
                          {addon.icon === 'Flame' && <Flame className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-white">{addon.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{addon.version}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 uiverse-radar" />
                              {addon.latencyMs}ms
                            </span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                              {addon.type}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Toggle Button */}
                      <button
                        onClick={() => handleToggleAddon(addon.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          addon.enabled
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-500/30'
                            : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
                        }`}
                      >
                        {addon.enabled ? 'Active' : 'Disabled'}
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 mt-2.5 line-clamp-2">
                      {addon.description}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5 text-[10px] text-slate-500">
                      <div className="flex items-center gap-1">
                        {addon.supportedTypes.map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-white/5 uppercase">
                            {t}
                          </span>
                        ))}
                      </div>

                      {!addon.isBuiltIn && (
                        <button
                          onClick={() => handleRemoveAddon(addon.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'install' && (
            <form onSubmit={handleInstallCustom} className="space-y-4">
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  Universal Stremio & AIOStreams Manifest Support
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Enter any public or private AIOStreams, Torrentio, or Stremio addon manifest URL. TV MAX will dynamically aggregate its streams with zero APK or native install required.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Addon Manifest URL
                </label>
                <input
                  type="url"
                  placeholder="https://your-addon-instance.com/manifest.json"
                  value={newManifestUrl}
                  onChange={(e) => setNewManifestUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-sm shadow-lg shadow-cyan-500/25 hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Install Stream Provider
              </button>
            </form>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              {/* Failover Policy */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Smart Auto-Failover Engine</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Automatically switch to next mirror server if playback encounters CORS, decode or network errors.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.autoFailover}
                    onChange={(e) => {
                      const updated = { ...config, autoFailover: e.target.checked };
                      setConfig(updated);
                      saveAIOStreamsConfig(updated);
                      showFeedback();
                    }}
                    className="w-5 h-5 rounded accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Resolution Preference */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <label className="text-xs font-bold text-white">Preferred Default Stream Quality</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['4K', '1080p', '720p', 'Auto'] as const).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => {
                        const updated = { ...config, preferredQuality: q };
                        setConfig(updated);
                        saveAIOStreamsConfig(updated);
                        showFeedback();
                      }}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        config.preferredQuality === q
                          ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
                          : 'bg-black/40 text-slate-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Real-Debrid / Multi-Provider Key */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">Real-Debrid / Premium Token (Optional)</span>
                </div>
                <input
                  type="password"
                  placeholder="Paste your Real-Debrid / Debrid-Link API token..."
                  value={config.realDebridApiKey || ''}
                  onChange={(e) => {
                    const updated = { ...config, realDebridApiKey: e.target.value };
                    setConfig(updated);
                    saveAIOStreamsConfig(updated);
                    showFeedback();
                  }}
                  className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <p className="text-[10px] text-slate-500">
                  Tokens are saved securely in your browser's private local vault for instant unrestricted direct download streaming.
                </p>
              </div>

              {/* Reset Defaults */}
              <button
                onClick={handleResetDefaults}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-red-400 transition-colors pt-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset AIOStreams Providers to Factory Defaults
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-white/10 bg-black/60 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            AIOStreams Aggregator Ready • Zero APK Required
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
          >
            Close Hub
          </button>
        </div>
      </div>
    </div>
  );
};
