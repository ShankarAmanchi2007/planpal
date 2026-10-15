'use client';

import React, { useState } from 'react';
import { Flame, Mail, Lock, Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import { DEMO_USERS } from '@/lib/mockData';
import { User } from '@/types';

interface AuthModalProps {
  isOpen: boolean;
  onLogin: (user: User, isNewUser: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: name.trim() || email.split('@')[0] || 'New Explorer',
      email: email.trim(),
      age: 24,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      occupation: 'Tech & Creative',
      city: 'Downtown Core',
      bio: 'Excited to discover live hangouts and meet new people!',
      badges: ['✨ New Member', '☕ Coffee Lover'],
      verified: true,
      isOnboarded: false,
    };

    onLogin(newUser, true);
  };

  const handleDemoSelect = (user: User) => {
    // If user is Alex, we can set isOnboarded to false to let them experience the quiz
    onLogin(user, !user.isOnboarded);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Decorative Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500" />

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center mx-auto mb-3 text-white shadow-lg shadow-rose-500/25">
            <Flame className="w-7 h-7 fill-white" />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
            Welcome to <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">PlanPal</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto">
            {isSignUp
              ? 'Create your account to match on direct activities & dates'
              : 'Direct real-world connection • Zero pen-pal syndrome'}
          </p>
        </div>

        {/* 1-Click Presentation Demo Login (Key for college viva) */}
        <div className="mb-6 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick Demo Sign-In (1-Click)</span>
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {DEMO_USERS.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleDemoSelect(u)}
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-zinc-200 dark:border-zinc-700 hover:border-rose-300 dark:hover:border-rose-800 transition-all text-left group"
              >
                <div className="flex items-center space-x-2.5">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-zinc-300"
                  />
                  <div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {u.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 block -mt-0.5">
                      {u.occupation}
                    </span>
                  </div>
                </div>
                <UserCheck className="w-4 h-4 text-zinc-400 group-hover:text-rose-500" />
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-center my-4">
          <hr className="w-full border-zinc-200 dark:border-zinc-800" />
          <span className="absolute px-3 bg-white dark:bg-zinc-900 text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
            Or sign in with email
          </span>
        </div>

        {/* Regular Login / Signup Form */}
        <form onSubmit={handleCustomSubmit} className="space-y-3">
          {isSignUp && (
            <div>
              <label className="block text-[11px] font-bold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                Your Name
              </label>
              <input
                type="text"
                placeholder="e.g., Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white font-bold text-xs sm:text-sm hover:brightness-105 active:scale-95 transition-all shadow-md shadow-rose-500/25 flex items-center justify-center space-x-2"
          >
            <span>{isSignUp ? 'Create Account & Continue' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Sign Up / Sign In */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-zinc-500 hover:text-rose-500 dark:text-zinc-400 dark:hover:text-rose-400 transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
};
