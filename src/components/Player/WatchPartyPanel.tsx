import React, { useState, useRef, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  Send, 
  X, 
  Copy, 
  Check, 
  Sparkles, 
  Crown, 
  Radio, 
  Volume2, 
  VolumeX,
  Smile,
  Flame,
  Heart,
  Popcorn
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: string;
  isHost?: boolean;
  isSystem?: boolean;
}

interface WatchPartyPanelProps {
  movieTitle: string;
  onClose: () => void;
  onSendReaction?: (reaction: string) => void;
}

export const WatchPartyPanel: React.FC<WatchPartyPanelProps> = ({
  movieTitle,
  onClose,
  onSendReaction,
}) => {
  const [roomCode] = useState<string>(() => `TVMAX-${Math.floor(1000 + Math.random() * 9000)}`);
  const [copied, setCopied] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'chat' | 'peers'>('chat');
  const [floatingEmojis, setFloatingEmojis] = useState<Array<{ id: number; emoji: string; left: number }>>([]);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'sys-1',
      sender: 'Nuvio System',
      avatar: '🎬',
      text: `Welcome to Watch Party for "${movieTitle}". Playback is synchronized across all peers.`,
      time: 'Just now',
      isSystem: true
    },
    {
      id: 'usr-1',
      sender: 'Boss (Host)',
      avatar: '👑',
      text: 'Starting cinema stream! Enjoy the 4K experience.',
      time: '1m ago',
      isHost: true
    },
    {
      id: 'usr-2',
      sender: 'Jin (AI Partner)',
      avatar: '⚡',
      text: 'Stremio manifests & AIOStreams mirrors locked at 14ms latency!',
      time: 'Just now'
    }
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCopyInvite = () => {
    const inviteUrl = `${window.location.origin}/?party=${roomCode}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'You',
      avatar: '👤',
      text: inputMessage.trim(),
      time: 'Just now'
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
  };

  const triggerReaction = (emoji: string) => {
    const id = Date.now() + Math.random();
    const left = Math.floor(20 + Math.random() * 60);
    setFloatingEmojis((prev) => [...prev, { id, emoji, left }]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== id));
    }, 2000);

    onSendReaction?.(emoji);

    // Also inject reaction to chat
    setMessages((prev) => [
      ...prev,
      {
        id: `react-${Date.now()}`,
        sender: 'You',
        avatar: '👤',
        text: `reacted with ${emoji}`,
        time: 'Just now'
      }
    ]);
  };

  const QUICK_REACTIONS = ['🔥', '❤️', '👏', '🍿', '😱', '😂'];

  return (
    <div className="relative w-80 sm:w-96 h-full flex flex-col bg-[#070913]/95 border-l border-white/10 backdrop-blur-2xl shadow-[-20px_0_50px_rgba(0,0,0,0.8)] z-40 select-none animate-slideInRight">
      {/* Floating Emojis Burst Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
        {floatingEmojis.map((item) => (
          <span
            key={item.id}
            className="absolute bottom-16 text-3xl animate-floatUp"
            style={{ left: `${item.left}%` }}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      {/* 1. Header & Room Code */}
      <div className="p-4 border-b border-white/10 bg-slate-950/60 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider text-white uppercase font-sans">
                  Nuvio Watch Party
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  0.6.7-beta
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Synchronized Multi-Peer Cinema
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
            title="Close Watch Party"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Room Invite Link Pill */}
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 min-w-0">
            <Radio className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-pulse" />
            <span className="text-xs font-mono font-bold text-cyan-300 truncate">
              Room: {roomCode}
            </span>
          </div>

          <button
            onClick={handleCopyInvite}
            className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 flex items-center gap-1 transition active:scale-95 shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Share Link</span>
              </>
            )}
          </button>
        </div>

        {/* Navigation Tabs (Chat vs Peers) */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-white/5">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-1 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat ({messages.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('peers')}
            className={`flex-1 py-1 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'peers'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Peers (3)</span>
          </button>
        </div>
      </div>

      {/* 2. Middle Body: Chat Messages vs Peers List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
        {activeTab === 'chat' ? (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col space-y-1 ${
                  msg.isSystem ? 'items-center my-2' : msg.sender === 'You' ? 'items-end' : 'items-start'
                }`}
              >
                {msg.isSystem ? (
                  <div className="px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-[10px] text-cyan-300 text-center font-mono">
                    {msg.text}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                      <span>{msg.avatar}</span>
                      <span className="font-bold text-slate-300">{msg.sender}</span>
                      {msg.isHost && (
                        <span className="px-1 py-0.2 rounded text-[8px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          HOST
                        </span>
                      )}
                      <span>• {msg.time}</span>
                    </div>
                    <div
                      className={`px-3 py-2 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                        msg.sender === 'You'
                          ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-black font-semibold rounded-tr-none'
                          : 'bg-white/10 border border-white/10 text-white rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </>
                )}
              </div>
            ))}
            <div ref={chatBottomRef} />
          </>
        ) : (
          /* Peers Roster Tab */
          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    Boss <span className="text-[9px] font-mono text-amber-400">(Room Host)</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">Synced • 1080p FHD</p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  ⚡
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Jin (Supreme AI)</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Telemetry Active</p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  👤
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">You</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Participant</p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
          </div>
        )}
      </div>

      {/* 3. Quick Reaction Bar */}
      <div className="px-4 py-2 bg-slate-950/80 border-t border-white/5 flex items-center justify-between gap-1">
        {QUICK_REACTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => triggerReaction(emoji)}
            className="p-1.5 rounded-xl hover:bg-white/10 text-base transition hover:scale-125 active:scale-95"
            title={`Send ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* 4. Bottom Chat Input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-slate-950/90 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type message to watch party..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500 text-xs text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim()}
          className="p-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 disabled:opacity-40 text-white font-bold transition hover:scale-105 active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
