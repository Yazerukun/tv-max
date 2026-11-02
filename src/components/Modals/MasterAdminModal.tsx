import React, { useState, useEffect } from 'react';
import { X, Shield, Plus, Copy, Check, RefreshCw, Key, Trash2, Smartphone, AlertOctagon } from 'lucide-react';
import { DEFAULT_AUTHORITY_URL } from '../../services/licensingGuard';

interface MasterAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MasterAdminModal: React.FC<MasterAdminModalProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!sessionStorage.getItem('tvmax_master_token');
  });
  const [userInput, setUserInput] = useState('ian');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Account Generator state
  const [opName, setOpName] = useState('');
  const [tier, setTier] = useState<'trial' | 'pro'>('pro');
  const [newlyCreated, setNewlyCreated] = useState<any | null>(null);
  const [copiedTarget, setCopiedTarget] = useState<string | null>(null);

  const copyText = (text: string, targetKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTarget(targetKey);
    setTimeout(() => setCopiedTarget(null), 2500);
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchAccounts();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await fetch(`${DEFAULT_AUTHORITY_URL}/api/master/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userInput.trim(),
          password: passwordInput.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('tvmax_master_token', data.token || 'valid');
        fetchAccounts();
      } else {
        setAuthError(data.message || 'Invalid Master Admin Username or Password.');
      }
    } catch (err: any) {
      setAuthError('Failed to reach Master Authority API. Please check server.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${DEFAULT_AUTHORITY_URL}/api/master/accounts`);
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.accounts || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    const name = opName.trim() || (tier === 'trial' ? 'New Trial Vendo' : 'Paid Vendo Operator');
    try {
      const res = await fetch(`${DEFAULT_AUTHORITY_URL}/api/master/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operator_name: name, tier })
      });
      if (res.ok) {
        const data = await res.json();
        setNewlyCreated(data.account);
        setOpName('');
        fetchAccounts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRenew = async (id: string) => {
    try {
      await fetch(`${DEFAULT_AUTHORITY_URL}/api/master/renew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_id: id, days: 30 })
      });
      fetchAccounts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetDevice = async (id: string) => {
    if (!confirm('Reset device lock? Operator can now pair a new machine.')) return;
    try {
      await fetch(`${DEFAULT_AUTHORITY_URL}/api/master/unbind`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_id: id })
      });
      fetchAccounts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Permanently delete and revoke "${name}"?`)) return;
    try {
      await fetch(`${DEFAULT_AUTHORITY_URL}/api/master/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_id: id })
      });
      fetchAccounts();
    } catch (e) {
      console.error(e);
    }
  };

  const copyDispatchMessage = () => {
    if (!newlyCreated) return;
    const planName = newlyCreated.tier === 'trial' ? '1-Day Free Trial' : '30-Day Pro Subscription';
    const text = `🎬 TV-MAX VENDO ACTIVATION DETAILS\n\n` +
                 `Operator: ${newlyCreated.operator_name}\n` +
                 `Plan: ${planName}\n` +
                 `Username: ${newlyCreated.username}\n` +
                 `PIN / Password: ${newlyCreated.password}\n\n` +
                 `How to Activate:\n` +
                 `1. Open TV-MAX on your Vendo Box.\n` +
                 `2. Enter the Username and PIN above.\n` +
                 `3. Enjoy Unlimited Offline Movies, Anime & Live TV!`;
    navigator.clipboard.writeText(text);
    setCopiedTarget('full');
    setTimeout(() => setCopiedTarget(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-4xl bg-[#090d18] border border-cyan-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center font-black text-black">
              👑
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Ian's Master Cloud Controller</h2>
              <p className="text-xs text-slate-400">TV-MAX SaaS Automated Fleet Authority</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => {
                if (window.confirm('Reset this device license? The One-Time Login activation modal will appear immediately.')) {
                  localStorage.removeItem('tvmax_license_ticket_v1');
                  localStorage.removeItem('tvmax_monotonic_highwater_v1');
                  window.location.href = '/';
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="Reset license on this device to test the one-time activation modal"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Test Login Modal</span>
            </button>
            <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step 1: Password Gate */}
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="max-w-sm mx-auto py-6 space-y-4 text-center">
            <Key className="w-12 h-12 text-cyan-400 mx-auto" />
            <div>
              <h3 className="text-base font-bold text-white">Ian's Master Cloud Login</h3>
              <p className="text-xs text-slate-400 mt-1">Verified securely by Central Authority API</p>
            </div>

            {authError && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 rounded-xl text-xs">
                {authError}
              </div>
            )}

            <div className="space-y-3 text-left">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 font-bold uppercase">Master Username</label>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="e.g. ian"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 font-bold uppercase">Master Password</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Master Password"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 text-black font-extrabold text-sm transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {isLoading ? 'Verifying with Authority...' : 'Unlock Master Controller'}
            </button>
          </form>
        ) : (
          /* Step 2: Full Master Interface */
          <div className="space-y-6">
            
            {/* Generator Card */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>⚡ Instant Account Generator</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-5 space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase font-bold">Operator Name</label>
                  <input
                    type="text"
                    value={opName}
                    onChange={(e) => setOpName(e.target.value)}
                    placeholder="e.g. Talisay Cinema Vendo"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase font-bold">Plan</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setTier('trial')}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${tier === 'trial' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-white/5 text-slate-400 border-white/10'}`}
                    >
                      1-Day Trial
                    </button>
                    <button
                      type="button"
                      onClick={() => setTier('pro')}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${tier === 'pro' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-white/5 text-slate-400 border-white/10'}`}
                    >
                      30-Day Pro (₱300)
                    </button>
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <button
                    onClick={handleGenerate}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 text-black font-extrabold text-xs transition"
                  >
                    + Generate
                  </button>
                </div>
              </div>

              {/* Newly Created Banner */}
              {newlyCreated && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border border-cyan-400/40 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Account Created Successfully!</span>
                      <span className="text-white font-bold text-sm ml-1">{newlyCreated.operator_name}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${newlyCreated.tier === 'trial' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'}`}>
                      {newlyCreated.tier === 'trial' ? '1-DAY TRIAL' : '30-DAY PRO'}
                    </span>
                  </div>

                  {/* Individual Username & PIN Copy Boxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* 1. Username Box */}
                    <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Username Only</span>
                        <span className="text-base font-black text-cyan-300 font-mono select-all truncate block">{newlyCreated.username}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyText(newlyCreated.username, 'new-user')}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                      >
                        {copiedTarget === 'new-user' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedTarget === 'new-user' ? 'Copied!' : 'Copy User'}</span>
                      </button>
                    </div>

                    {/* 2. PIN Box */}
                    <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">PIN / Password Only</span>
                        <span className="text-base font-black text-amber-300 font-mono select-all truncate block">{newlyCreated.password}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyText(newlyCreated.password, 'new-pin')}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                      >
                        {copiedTarget === 'new-pin' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedTarget === 'new-pin' ? 'Copied!' : 'Copy PIN'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 3. Full Dispatch Message */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={copyDispatchMessage}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 text-black font-extrabold text-xs transition flex items-center gap-2 shadow-md shadow-cyan-500/20"
                    >
                      {copiedTarget === 'full' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedTarget === 'full' ? 'Full Message Copied!' : '📋 Copy Full Message for Messenger / SMS'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Fleet Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Registered Vendo Fleet ({accounts.length})</span>
                <button onClick={fetchAccounts} className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </div>

              <div className="overflow-x-auto border border-white/10 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/60 text-slate-400 font-mono border-b border-white/5">
                    <tr>
                      <th className="p-3">Operator</th>
                      <th className="p-3">Credentials (Copy Separately)</th>
                      <th className="p-3">Plan</th>
                      <th className="p-3">Status / Time</th>
                      <th className="p-3">Device Lock</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {accounts.map((acc) => {
                      const isTrial = acc.tier === 'trial';
                      return (
                        <tr key={acc.id} className="hover:bg-white/[0.02]">
                          <td className="p-3 font-semibold text-white">
                            <div>{acc.operator_name}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{acc.id}</div>
                          </td>
                          <td className="p-3 font-mono">
                            <div className="flex items-center gap-2">
                              <span className="text-cyan-300 font-bold select-all">{acc.username}</span>
                              <button
                                type="button"
                                onClick={() => copyText(acc.username, `user-${acc.id}`)}
                                className="px-2 py-0.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-[10px] text-cyan-300 border border-cyan-500/30 transition flex items-center gap-1"
                                title="Copy Username Only"
                              >
                                {copiedTarget === `user-${acc.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedTarget === `user-${acc.id}` ? 'Copied' : 'User'}</span>
                              </button>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-amber-300 font-bold select-all">PIN: {acc.password}</span>
                              <button
                                type="button"
                                onClick={() => copyText(acc.password, `pin-${acc.id}`)}
                                className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-[10px] text-amber-300 border border-amber-500/30 transition flex items-center gap-1"
                                title="Copy PIN Only"
                              >
                                {copiedTarget === `pin-${acc.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedTarget === `pin-${acc.id}` ? 'Copied' : 'PIN'}</span>
                              </button>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${isTrial ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'}`}>
                              {isTrial ? '1-DAY TRIAL' : '30-DAY PRO'}
                            </span>
                          </td>
                          <td className="p-3 font-mono">
                            {acc.status === 'ACTIVE' ? (
                              <span className="text-emerald-400 font-bold">Active</span>
                            ) : (
                              <span className="text-slate-400">{acc.status}</span>
                            )}
                          </td>
                          <td className="p-3">
                            {acc.bound_hardware_hash ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300">
                                🟢 Locked
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-400">
                                ⚪ Unbound
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleRenew(acc.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition"
                            >
                              +30d
                            </button>
                            <button
                              onClick={() => handleResetDevice(acc.id)}
                              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-[11px] transition"
                            >
                              Reset
                            </button>
                            <button
                              onClick={() => handleDelete(acc.id, acc.operator_name)}
                              className="px-2 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-[11px] font-bold transition"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
