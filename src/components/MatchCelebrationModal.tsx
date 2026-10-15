'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, MessageCircle, ArrowRight, X } from 'lucide-react';
import { Match, User } from '@/types';

interface MatchCelebrationModalProps {
  match: Match | null;
  currentUser: User;
  onClose: () => void;
  onOpenChat: (match: Match) => void;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationModalProps> = ({
  match,
  currentUser,
  onClose,
  onOpenChat,
}) => {
  useEffect(() => {
    if (match) {
      // Fire confetti bursts!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#f97316', '#10b981', '#3b82f6', '#eab308'],
        });
      } catch (e) {
        // Safe fallback if canvas not available
      }
    }
  }, [match]);

  if (!match) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>It&apos;s a Match!</span>
        </div>

        <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mb-1">
          Lock in the Hangout! 🎉
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mb-6">
          You and <span className="font-semibold text-zinc-800 dark:text-zinc-200">{match.matchedWith.name}</span> are both down for this plan!
        </p>

        {/* Connected Avatars */}
        <div className="relative flex items-center justify-center space-x-3 mb-6">
          {/* User Avatar */}
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-rose-500 shadow-xl"
            />
            <span className="absolute -bottom-2 -left-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-900 text-white">
              You
            </span>
          </div>

          {/* Connection Pulse */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-md animate-bounce">
            ⚡
          </div>

          {/* Host Avatar */}
          <div className="relative">
            <img
              src={match.matchedWith.avatar}
              alt={match.matchedWith.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-amber-500 shadow-xl"
            />
            <span className="absolute -bottom-2 -right-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-900 text-white">
              Host
            </span>
          </div>
        </div>

        {/* Activity Details Box */}
        <div className="w-full bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl p-3.5 border border-zinc-200/80 dark:border-zinc-700/60 mb-6 text-left">
          <span className="text-[10px] uppercase font-bold text-rose-500 tracking-wider">
            {match.activity.category}
          </span>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate">
            {match.activity.title}
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            📍 {match.activity.location} • ⏰ {match.activity.timeDisplay}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2.5">
          <button
            onClick={() => onOpenChat(match)}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white font-bold text-sm hover:brightness-105 active:scale-95 transition-all shadow-md shadow-rose-500/25 flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat & Confirm Plan</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Keep Browsing Plans
          </button>
        </div>
      </div>
    </div>
  );
};
