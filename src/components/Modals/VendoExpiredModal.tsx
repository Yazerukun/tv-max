import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, Smartphone, CheckCircle, ShieldAlert } from 'lucide-react';
import { syncLicensingHeartbeat } from '../../services/licensingGuard';

interface VendoExpiredModalProps {
  isOpen: boolean;
  operatorName?: string;
  onRenewed: () => void;
}

export const VendoExpiredModal: React.FC<VendoExpiredModalProps> = ({
  isOpen,
  operatorName = 'Vendo Operator',
  onRenewed
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [statusNote, setStatusNote] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckRenewal = async () => {
    setIsChecking(true);
    setStatusNote(null);
    try {
      const state = await syncLicensingHeartbeat();
      if (state.status === 'ACTIVE') {
        setStatusNote('Renewal confirmed! TV-MAX is re-activated.');
        setTimeout(() => {
          onRenewed();
        }, 1200);
      } else {
        setStatusNote('Subscription not yet renewed. Please confirm payment with Ian.');
      }
    } catch (e) {
      setStatusNote('Unable to reach server. Please ensure connection.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-fadeIn">
      <div className="w-full max-w-md bg-[#0d0914] border border-rose-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-center relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center shadow-lg">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold uppercase">
            Subscription Expired
          </span>
          <h2 className="text-xl font-black text-white tracking-tight">TV-MAX Vendo Paused</h2>
          <p className="text-xs text-slate-400">
            Node: <span className="text-slate-200 font-bold">{operatorName}</span>
          </p>
        </div>

        {/* GCash Instructions Card */}
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-left space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>How to Renew (₱300 / 30 Days):</span>
          </div>
          <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
            <li>Send <strong className="text-white">₱300</strong> to Ian via GCash.</li>
            <li>Message Ian on Messenger with your Operator Name.</li>
            <li>Ian clicks <strong className="text-cyan-400">+30 Days</strong> on the Master Panel.</li>
            <li>Click the button below to resume streaming instantly!</li>
          </ol>
        </div>

        {statusNote && (
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-cyan-300 flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4 text-cyan-400" />
            <span>{statusNote}</span>
          </div>
        )}

        <button
          onClick={handleCheckRenewal}
          disabled={isChecking}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-extrabold text-sm transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isChecking ? (
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>Check Payment & Unlock Streaming</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-slate-500">
          Once renewed by Ian, this machine reactivates automatically with zero re-login.
        </p>

      </div>
    </div>
  );
};
