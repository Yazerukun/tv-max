import React, { useState } from 'react';
import { Lock, ShieldCheck, Sparkles, KeyRound, AlertCircle, Wifi, Play } from 'lucide-react';
import { activateWithCredentials } from '../../services/licensingGuard';

interface VendoActivationModalProps {
  isOpen: boolean;
  onActivated: () => void;
}

export const VendoActivationModal: React.FC<VendoActivationModalProps> = ({
  isOpen,
  onActivated
}) => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !pin.trim()) {
      setErrorMessage('Please enter both your Username and PIN.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await activateWithCredentials(username, pin);
      if (res.success) {
        onActivated();
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Activation failed. Please check network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-md bg-[#0a0e1a] border border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-950/60 p-6 sm:p-8 space-y-6 relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="text-center space-y-2 relative">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-indigo-600 p-0.5 shadow-xl shadow-cyan-500/25">
            <div className="w-full h-full bg-[#070913] rounded-[22px] flex items-center justify-center text-cyan-400">
              <Play className="w-7 h-7 fill-cyan-400 translate-x-0.5" />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold font-mono uppercase tracking-wider mb-1">
              <Wifi className="w-3.5 h-3.5" /> Piso WiFi Edge Cinema
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">TV-MAX Vendo Activation</h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter the credentials provided by Ian to unlock unlimited movies, anime & Kapuso/Kapamilya live TV.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Activation Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase">
              Vendo Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. trial-juan or vendo-101"
                className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono tracking-wide placeholder:text-slate-600 transition"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase">
              PIN / Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="e.g. 123"
                className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono tracking-wide placeholder:text-slate-600 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-black font-extrabold text-sm transition shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Pair & Activate TV-MAX</span>
              </>
            )}
          </button>
        </form>

        {/* One-Time Notice */}
        <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-[11px] text-slate-400 text-center space-y-1">
          <p className="font-semibold text-slate-300">
            🔒 Strictly One-Time Login
          </p>
          <p>
            Once activated, this machine stays unlocked permanently across all reboots and power outages. Connecting customers stream with zero login.
          </p>
        </div>

      </div>
    </div>
  );
};
