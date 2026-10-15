'use client';

import React, { useState } from 'react';
import { 
  Flame, 
  Plus, 
  MessageCircle, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Heart, 
  Users, 
  SlidersHorizontal, 
  LogOut, 
  ChevronDown 
} from 'lucide-react';
import { CategoryType, AppMode, User } from '@/types';

interface NavbarProps {
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  appMode: AppMode;
  onChangeMode: (mode: AppMode) => void;
  onOpenCreate: () => void;
  onOpenMatches: () => void;
  onOpenNeonModal: () => void;
  onOpenPreferences: () => void;
  onOpenAuth: () => void;
  matchCount: number;
  isNeonConnected: boolean;
  currentUser: User;
}

const CATEGORIES: { id: CategoryType; label: string; emoji: string }[] = [
  { id: 'all', label: 'All Plans', emoji: '🔥' },
  { id: 'dating', label: 'Activity Dates', emoji: '❤️' },
  { id: 'sports', label: 'Sports & Padel', emoji: '🎾' },
  { id: 'food', label: 'Coffee & Food', emoji: '☕' },
  { id: 'social', label: 'Nightlife & Music', emoji: '🎷' },
  { id: 'fitness', label: 'Climbing & Fitness', emoji: '🧗' },
  { id: 'outdoors', label: 'Outdoors & Hikes', emoji: '🌲' },
  { id: 'gaming', label: 'Board Games', emoji: '🎲' },
];

export const Navbar: React.FC<NavbarProps> = ({
  selectedCategory,
  onSelectCategory,
  appMode,
  onChangeMode,
  onOpenCreate,
  onOpenMatches,
  onOpenNeonModal,
  onOpenPreferences,
  onOpenAuth,
  matchCount,
  isNeonConnected,
  currentUser,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Slogan */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center shadow-md shadow-rose-500/20 text-white font-bold">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                  PlanPal
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                  Live
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
                Skip the small talk • Find friends & dates through direct plans
              </p>
            </div>
          </div>

          {/* Mode Switcher Pill (All | 🤝 Friends | ❤️ Dating) */}
          <div className="hidden md:flex items-center p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <button
              onClick={() => onChangeMode('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                appMode === 'all'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
              }`}
            >
              <span>🔥</span>
              <span>All</span>
            </button>
            <button
              onClick={() => onChangeMode('friends')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                appMode === 'friends'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-amber-500" />
              <span>Friends</span>
            </button>
            <button
              onClick={() => onChangeMode('dating')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                appMode === 'dating'
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/25'
                  : 'text-zinc-500 hover:text-rose-500'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Dating</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Neon DB status badge */}
            <button
              onClick={onOpenNeonModal}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                isNeonConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
              }`}
              title="Click to view Neon Database config"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Neon DB:</span>
              <span className="font-semibold">{isNeonConnected ? 'Connected' : 'Demo'}</span>
              {isNeonConnected ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              ) : (
                <AlertCircle className="w-3 h-3 text-amber-500" />
              )}
            </button>

            {/* Broadcast a Plan button */}
            <button
              onClick={onOpenCreate}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-medium text-xs sm:text-sm hover:brightness-105 active:scale-95 transition-all shadow-sm shadow-rose-500/25"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Create Plan</span>
              <span className="sm:hidden">Plan</span>
            </button>

            {/* Matches & Chats button */}
            <button
              onClick={onOpenMatches}
              className="relative p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-all active:scale-95"
              title="View Matches & Chats"
            >
              <MessageCircle className="w-5 h-5" />
              {matchCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-zinc-950">
                  {matchCount}
                </span>
              )}
            </button>

            {/* User Profile Menu Button */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-1.5 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-rose-500/40 shadow-sm"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-zinc-950" />
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 shadow-xl z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-zinc-400 truncate">
                      {currentUser.occupation}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenPreferences();
                      }}
                      className="w-full px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl flex items-center space-x-2 text-left transition-colors"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-rose-500" />
                      <span>Edit Preferences / Quiz</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenAuth();
                      }}
                      className="w-full px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl flex items-center space-x-2 text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-amber-500" />
                      <span>Switch User / Log In</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Categories Bar & Mobile Mode Switcher */}
        <div className="flex items-center justify-between py-2 overflow-x-auto no-scrollbar scroll-smooth border-t border-zinc-100 dark:border-zinc-800/60">
          <div className="flex items-center space-x-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const isDatingCat = cat.id === 'dating';
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? isDatingCat
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                      : isDatingCat
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-800'
                      : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
