import React from 'react';
import { X, Keyboard, Tv, Film } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause playback' },
    { key: '← / →', desc: 'Seek backward / forward (10s)' },
    { key: '↑ / ↓', desc: 'Volume up / down (5%)' },
    { key: 'F', desc: 'Toggle Fullscreen Cinema mode' },
    { key: 'S', desc: 'Cycle AIOStreams Server Mirrors' },
    { key: 'M', desc: 'Mute / Unmute audio' },
    { key: 'G', desc: 'Toggle Dynamic Ambient Glow' },
    { key: '/', desc: 'Quick focus Search Bar' },
    { key: 'Esc', desc: 'Back to Catalog / Close Modal' },
  ];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#090b11] rounded-3xl p-6 border border-white/10 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Keyboard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Smart TV & Keyboard Controls</h2>
            <p className="text-xs text-slate-400">10-Foot UI ready for PC keyboards and Smart TV D-Pad remotes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {shortcuts.map((sc) => (
            <div
              key={sc.key}
              className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between"
            >
              <span className="text-xs text-slate-300">{sc.desc}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 text-[11px] font-mono font-bold text-cyan-300 shadow-sm">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 flex items-center gap-3">
          <Film className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <p className="text-xs text-cyan-200 font-medium">
            Compatible with Smart TV browsers, Fire TV, Apple TV Safari, Android TV boxes, and Steam Deck.
          </p>
        </div>
      </div>
    </div>
  );
};
