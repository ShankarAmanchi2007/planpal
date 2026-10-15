'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Heart, 
  Star, 
  RotateCcw, 
  Sparkles, 
  Plus, 
  Check, 
  PartyPopper 
} from 'lucide-react';
import { Activity } from '@/types';
import { ActivityCard } from './ActivityCard';

interface SwipeDeckProps {
  activities: Activity[];
  onSwipe: (activity: Activity, action: 'like' | 'pass' | 'superlike') => void;
  onOpenCreate: () => void;
}

export const SwipeDeck: React.FC<SwipeDeckProps> = ({
  activities,
  onSwipe,
  onOpenCreate,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastSwiped, setLastSwiped] = useState<{ activity: Activity; action: string } | null>(null);

  const currentActivity = activities[currentIndex];
  const nextActivity = activities[currentIndex + 1];

  // Motion values for swipe drag gesture
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);

  // Opacity transforms for Stamps
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const passOpacity = useTransform(x, [-20, -100], [0, 1]);
  const superlikeOpacity = useTransform(y, [-20, -100], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 110;
    const verticalThreshold = -120;

    if (info.offset.y < verticalThreshold && Math.abs(info.offset.x) < 90) {
      triggerSwipe('superlike');
    } else if (info.offset.x > threshold) {
      triggerSwipe('like');
    } else if (info.offset.x < -threshold) {
      triggerSwipe('pass');
    }
  };

  const triggerSwipe = (action: 'like' | 'pass' | 'superlike') => {
    if (!currentActivity) return;

    setLastSwiped({ activity: currentActivity, action });
    onSwipe(currentActivity, action);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setLastSwiped(null);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setLastSwiped(null);
  };

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center">
      {/* Deck Header Info */}
      <div className="w-full flex items-center justify-between px-2 mb-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Showing Plans Nearby</span>
        </span>
        <span>
          {currentActivity ? `${currentIndex + 1} of ${activities.length}` : 'Done'}
        </span>
      </div>

      {/* Card Stack Container */}
      <div className="relative w-full h-[540px] sm:h-[570px] flex items-center justify-center">
        {currentActivity ? (
          <>
            {/* Background Preview Card (Next in queue) */}
            {nextActivity && (
              <div className="absolute inset-0 scale-[0.94] translate-y-3 opacity-60 pointer-events-none transition-all">
                <ActivityCard activity={nextActivity} isFront={false} />
              </div>
            )}

            {/* Foreground Draggable Card */}
            <motion.div
              key={currentActivity.id}
              className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
              style={{ x, y, rotate }}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.8}
              onDragEnd={handleDragEnd}
              whileTap={{ cursor: 'grabbing' }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            >
              {/* "I'M DOWN" Stamp (Right Swipe) */}
              <motion.div
                style={{ opacity: likeOpacity }}
                className="absolute top-8 left-8 z-30 pointer-events-none border-4 border-emerald-500 text-emerald-500 font-black text-2xl sm:text-3xl px-4 py-1.5 rounded-2xl -rotate-12 bg-emerald-50/90 dark:bg-emerald-950/90 uppercase tracking-wider shadow-lg"
              >
                I&apos;m Down! 🤙
              </motion.div>

              {/* "PASS" Stamp (Left Swipe) */}
              <motion.div
                style={{ opacity: passOpacity }}
                className="absolute top-8 right-8 z-30 pointer-events-none border-4 border-rose-500 text-rose-500 font-black text-2xl sm:text-3xl px-4 py-1.5 rounded-2xl rotate-12 bg-rose-50/90 dark:bg-rose-950/90 uppercase tracking-wider shadow-lg"
              >
                Pass 👋
              </motion.div>

              {/* "SUPER-INTERESTED" Stamp (Up Swipe) */}
              <motion.div
                style={{ opacity: superlikeOpacity }}
                className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 pointer-events-none border-4 border-sky-500 text-sky-500 font-black text-xl sm:text-2xl px-5 py-1.5 rounded-2xl bg-sky-50/90 dark:bg-sky-950/90 uppercase tracking-wider shadow-lg"
              >
                ⭐ Super Keen!
              </motion.div>

              <ActivityCard activity={currentActivity} isFront={true} />
            </motion.div>
          </>
        ) : (
          /* Empty Deck State */
          <div className="w-full h-full rounded-3xl bg-zinc-50 dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center p-8 text-center shadow-inner">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-rose-500/25">
              <PartyPopper className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-2">
              You&apos;re All Caught Up!
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-xs">
              No more plans in this category right now. Want to broadcast your own hangout to nearby students?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
              <button
                onClick={onOpenCreate}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-sm hover:brightness-105 active:scale-95 transition-all shadow-md shadow-rose-500/20 flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Post a Plan</span>
              </button>
              <button
                onClick={handleReset}
                className="py-3 px-4 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-sm hover:bg-zinc-300 dark:hover:bg-zinc-700 active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Review Again</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Swipe Control Buttons */}
      <div className="w-full max-w-xs flex items-center justify-between mt-6 px-4">
        {/* Undo Button */}
        <button
          onClick={handleUndo}
          disabled={currentIndex === 0}
          className="p-3.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:scale-105 active:scale-95 transition-all"
          title="Rewind last plan"
        >
          <RotateCcw className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Pass Button (Red Cross) */}
        <button
          onClick={() => triggerSwipe('pass')}
          disabled={!currentActivity}
          className="p-4 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:scale-110 active:scale-95 transition-all"
          title="Pass on this plan"
        >
          <X className="w-7 h-7 stroke-[2.5]" />
        </button>

        {/* Superlike Button (Blue Star) */}
        <button
          onClick={() => triggerSwipe('superlike')}
          disabled={!currentActivity}
          className="p-3.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/40 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:scale-105 active:scale-95 transition-all"
          title="Super Interested"
        >
          <Star className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Like Button (Green Heart / Down) */}
        <button
          onClick={() => triggerSwipe('like')}
          disabled={!currentActivity}
          className="p-4 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-xl shadow-emerald-500/30 hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          title="I'm Down! (Swipe Right)"
        >
          <Heart className="w-7 h-7 fill-white stroke-none" />
        </button>
      </div>
    </div>
  );
};
