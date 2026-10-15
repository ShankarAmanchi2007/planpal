'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Heart, 
  Users, 
  Clock, 
  CheckCircle2, 
  Flame 
} from 'lucide-react';
import { UserPreferences } from '@/types';

interface OnboardingModalProps {
  isOpen: boolean;
  userName: string;
  onComplete: (prefs: UserPreferences) => void;
}

const INTEREST_OPTIONS = [
  { id: 'Sports & Padel', label: 'Sports & Padel', emoji: '🎾' },
  { id: 'Coffee & Food', label: 'Coffee & Foodie Crawls', emoji: '☕' },
  { id: 'Dating & Romance', label: 'Romantic Activity Dates', emoji: '❤️' },
  { id: 'Nightlife & Music', label: 'Live Music & Jazz Nights', emoji: '🎷' },
  { id: 'Climbing & Fitness', label: 'Bouldering & Climbing', emoji: '🧗' },
  { id: 'Board Games', label: 'Board Games & Trivia', emoji: '🎲' },
  { id: 'Outdoors & Hikes', label: 'Hiking & Scenic Walks', emoji: '🌲' },
  { id: 'Arts & Design', label: 'Art, Pottery & Culture', emoji: '🎨' },
];

const TIME_OPTIONS = [
  'Weekday Evenings',
  'Friday / Weekend Nights',
  'Weekend Mornings',
  'Spontaneous (Right Now)',
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  userName,
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [intent, setIntent] = useState<'friends' | 'dating' | 'both'>('both');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Sports & Padel',
    'Coffee & Food',
  ]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([
    'Weekday Evenings',
    'Weekend Mornings',
  ]);

  if (!isOpen) return null;

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleTime = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const handleFinish = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fb923c', '#10b981', '#3b82f6'],
      });
    } catch (e) {}

    const preferences: UserPreferences = {
      intent,
      interests: selectedInterests,
      preferredTimes: selectedTimes,
      vibe: intent === 'dating' ? 'Romantic & Active' : 'Friendly & Chill',
    };

    onComplete(preferences);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Progress Bar Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
            <span>Step {step} of 3</span>
            <span>
              {step === 1 && 'What are you looking for?'}
              {step === 2 && 'Your Likes & Passions'}
              {step === 3 && 'Your Availability'}
            </span>
          </div>
          <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: What do you want to do with the app? (Intent / Mode) */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Personalize Your Experience</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                Hey {userName}! What brings you to PlanPal?
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Tell us your primary focus so we can tailor the plans on your swipe deck.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
              {/* Option 1: Friendship */}
              <button
                type="button"
                onClick={() => setIntent('friends')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start space-x-3.5 ${
                  intent === 'friends'
                    ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 ring-2 ring-rose-500/20'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 mt-0.5">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                      🤝 Find Friends & Activity Partners
                    </h4>
                    {intent === 'friends' && <Check className="w-4 h-4 text-rose-500 stroke-[3]" />}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    Meet people for padel, bouldering, coffee co-working, board games, and group hangouts.
                  </p>
                </div>
              </button>

              {/* Option 2: Dating */}
              <button
                type="button"
                onClick={() => setIntent('dating')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start space-x-3.5 ${
                  intent === 'dating'
                    ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 ring-2 ring-rose-500/20'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 mt-0.5">
                  <Heart className="w-5 h-5 fill-rose-500 stroke-none" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                      ❤️ Direct Activity Dating
                    </h4>
                    {intent === 'dating' && <Check className="w-4 h-4 text-rose-500 stroke-[3]" />}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    Skip weeks of dry texting. Match on creative dates: rooftop drinks, pottery making, stargazing.
                  </p>
                </div>
              </button>

              {/* Option 3: Both */}
              <button
                type="button"
                onClick={() => setIntent('both')}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start space-x-3.5 ${
                  intent === 'both'
                    ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 ring-2 ring-rose-500/20'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 mt-0.5">
                  <Flame className="w-5 h-5 fill-indigo-500 text-indigo-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                      ✨ Open to Everything (Both)
                    </h4>
                    {intent === 'both' && <Check className="w-4 h-4 text-rose-500 stroke-[3]" />}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    Show me the best upcoming hangouts and dates happening in my area.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Passions & Likes */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Likes & Interests</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                What do you enjoy doing?
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Select at least 2 interests to power your personalized recommendations.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2 max-h-[300px] overflow-y-auto no-scrollbar">
              {INTEREST_OPTIONS.map((item) => {
                const isSelected = selectedInterests.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleInterest(item.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center space-x-2.5 ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold shadow-sm'
                        : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-xs truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Availability */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Preferred Times</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                When are you usually free?
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                We will prioritize plans that match your schedule.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 pt-2">
              {TIME_OPTIONS.map((time) => {
                const isSelected = selectedTimes.includes(time);
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => toggleTime(time)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold'
                        : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <span className="text-xs sm:text-sm">{time}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev + 1) as any)}
              disabled={step === 2 && selectedInterests.length === 0}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs sm:text-sm hover:brightness-105 active:scale-95 disabled:opacity-50 transition-all shadow-md shadow-rose-500/20 flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs sm:text-sm hover:brightness-105 active:scale-95 transition-all shadow-md shadow-emerald-500/25 flex items-center space-x-2"
            >
              <span>Get Recommendations</span>
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
