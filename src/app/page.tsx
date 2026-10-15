'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  Users2, 
  Calendar, 
  Heart, 
  SlidersHorizontal 
} from 'lucide-react';
import { Activity, CategoryType, Match, AppMode, User, UserPreferences } from '@/types';
import { CURRENT_USER } from '@/lib/mockData';
import { getRecommendedActivities } from '@/lib/recommendations';
import { Navbar } from '@/components/Navbar';
import { SwipeDeck } from '@/components/SwipeDeck';
import { CreatePlanModal } from '@/components/CreatePlanModal';
import { MatchesDrawer } from '@/components/MatchesDrawer';
import { MatchCelebrationModal } from '@/components/MatchCelebrationModal';
import { NeonSetupModal } from '@/components/NeonSetupModal';
import { AuthModal } from '@/components/AuthModal';
import { OnboardingModal } from '@/components/OnboardingModal';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [appMode, setAppMode] = useState<AppMode>('all');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [recentCelebrationMatch, setRecentCelebrationMatch] = useState<Match | null>(null);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isMatchesOpen, setIsMatchesOpen] = useState(false);
  const [isNeonModalOpen, setIsNeonModalOpen] = useState(false);
  const [isNeonConnected, setIsNeonConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load activities and check Neon DB status
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/activities');
      const data = await res.json();
      if (data.activities) {
        setActivities(data.activities);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
      const res = await fetch('/api/matches');
      const data = await res.json();
      if (data.matches) {
        setMatches(data.matches);
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
    }
  };

  const checkNeonConfig = async () => {
    try {
      const res = await fetch('/api/init-db');
      const data = await res.json();
      setIsNeonConnected(Boolean(data.configured));
    } catch (err) {
      setIsNeonConnected(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchMatches();
    checkNeonConfig();

    // Check if user needs onboarding on first visit
    if (!currentUser.isOnboarded) {
      setIsOnboardingOpen(true);
    }
  }, []);

  // Handle Login / Switch User
  const handleLogin = (user: User, needsOnboarding: boolean) => {
    setCurrentUser(user);
    setIsAuthOpen(false);
    if (needsOnboarding || !user.isOnboarded) {
      setIsOnboardingOpen(true);
    }
  };

  // Handle Preferences completed from quiz
  const handleOnboardingComplete = (preferences: UserPreferences) => {
    const updatedUser: User = {
      ...currentUser,
      preferences,
      isOnboarded: true,
    };
    setCurrentUser(updatedUser);
    setIsOnboardingOpen(false);

    // Sync app mode to preferred intent
    if (preferences.intent === 'dating') {
      setAppMode('dating');
    } else if (preferences.intent === 'friends') {
      setAppMode('friends');
    } else {
      setAppMode('all');
    }
  };

  // Filter and sort activities using the Recommendation Engine!
  const recommendedActivities = useMemo(() => {
    const scored = getRecommendedActivities(activities, currentUser.preferences, appMode);
    if (selectedCategory === 'all') return scored;
    return scored.filter((act) => act.category === selectedCategory);
  }, [activities, currentUser.preferences, appMode, selectedCategory]);

  // Handle Swipe (like, pass, superlike)
  const handleSwipe = async (activity: Activity, action: 'like' | 'pass' | 'superlike') => {
    try {
      const res = await fetch('/api/swipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityId: activity.id,
          action,
        }),
      });

      const data = await res.json();
      if (data.matched && data.match) {
        setMatches((prev) => [data.match, ...prev]);
        setRecentCelebrationMatch(data.match);
      }
    } catch (err) {
      console.error('Error recording swipe:', err);
    }
  };

  const handlePlanCreated = (newActivity: Activity) => {
    setActivities((prev) => [newActivity, ...prev]);
    setSelectedCategory('all');
  };

  const handleOpenChatFromCelebration = (match: Match) => {
    setRecentCelebrationMatch(null);
    setActiveMatch(match);
    setIsMatchesOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors selection:bg-rose-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        appMode={appMode}
        onChangeMode={setAppMode}
        onOpenCreate={() => setIsCreateOpen(true)}
        onOpenMatches={() => setIsMatchesOpen(true)}
        onOpenNeonModal={() => setIsNeonModalOpen(true)}
        onOpenPreferences={() => setIsOnboardingOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        matchCount={matches.length}
        isNeonConnected={isNeonConnected}
        currentUser={currentUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 py-6 sm:py-8 max-w-6xl mx-auto w-full">
        {/* Banner Tagline & Preferences Pill */}
        <div className="text-center mb-6 max-w-lg">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {appMode === 'dating'
                  ? 'Activity Dating Mode Active ❤️'
                  : appMode === 'friends'
                  ? 'Friendship Discovery Active 🤝'
                  : 'Intent-First Matchmaking 🔥'}
              </span>
            </div>

            {/* Quick Preference Filter Button */}
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
              title="Edit your likes & preferences"
            >
              <SlidersHorizontal className="w-3 h-3 text-rose-500" />
              <span>Likes Quiz</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
            Swipe on <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">Plans</span>, Not Small Talk
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            {currentUser.preferences
              ? `Personalized based on your likes: ${currentUser.preferences.interests.slice(0, 3).join(', ')}`
              : 'Match through real-world activities & dates happening nearby. Swipe right to join in.'}
          </p>
        </div>

        {/* Swipe Deck Container */}
        {loading ? (
          <div className="w-full max-w-sm h-[540px] rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shadow-lg">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-zinc-500">Loading recommended plans...</p>
            </div>
          </div>
        ) : (
          <SwipeDeck
            activities={recommendedActivities}
            onSwipe={handleSwipe}
            onOpenCreate={() => setIsCreateOpen(true)}
          />
        )}

        {/* Value Proposition Highlights */}
        <section className="w-full max-w-4xl mt-14 pt-8 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Activity-First Matching</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Plans are anchored to an activity, time, and venue—eliminating dry texting dead-ends.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <Heart className="w-5 h-5 fill-amber-500 stroke-none" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Dating & Friendship Blocks</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Toggle seamlessly between platonic hangouts and real-world creative activity dates.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <Users2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Preferences Recommendation</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Dynamic scoring algorithm customizes your card deck based on your selected likes and schedule.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400">
        PlanPal • Intent-First Social Discovery & Matchmaking Web App
      </footer>

      {/* Modals & Drawers */}
      <AuthModal
        isOpen={isAuthOpen}
        onLogin={handleLogin}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        userName={currentUser.name}
        onComplete={handleOnboardingComplete}
      />

      <CreatePlanModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={handlePlanCreated}
      />

      <MatchesDrawer
        isOpen={isMatchesOpen}
        onClose={() => {
          setIsMatchesOpen(false);
          setActiveMatch(null);
        }}
        matches={matches}
        currentUser={currentUser}
        activeMatch={activeMatch}
        onSelectMatch={setActiveMatch}
      />

      <MatchCelebrationModal
        match={recentCelebrationMatch}
        currentUser={currentUser}
        onClose={() => setRecentCelebrationMatch(null)}
        onOpenChat={handleOpenChatFromCelebration}
      />

      <NeonSetupModal
        isOpen={isNeonModalOpen}
        onClose={() => setIsNeonModalOpen(false)}
        isNeonConnected={isNeonConnected}
        onRefreshStatus={checkNeonConfig}
      />
    </div>
  );
}
