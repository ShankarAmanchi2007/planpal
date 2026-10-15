'use client';

import React, { useState } from 'react';
import { X, Sparkles, Calendar, MapPin, Users, Tag, AlertCircle, Heart } from 'lucide-react';
import { CategoryType } from '@/types';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newActivity: any) => void;
}

const CATEGORIES: { id: CategoryType; label: string; emoji: string }[] = [
  { id: 'dating', label: 'Activity Date', emoji: '❤️' },
  { id: 'sports', label: 'Sports & Padel', emoji: '🎾' },
  { id: 'food', label: 'Coffee & Food', emoji: '☕' },
  { id: 'social', label: 'Nightlife & Music', emoji: '🎷' },
  { id: 'fitness', label: 'Climbing & Fitness', emoji: '🧗' },
  { id: 'outdoors', label: 'Outdoors & Hikes', emoji: '🌲' },
  { id: 'gaming', label: 'Board Games', emoji: '🎲' },
];

export const CreatePlanModal: React.FC<CreatePlanModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState<'friends' | 'dating'>('friends');
  const [category, setCategory] = useState<CategoryType>('sports');
  const [timeDisplay, setTimeDisplay] = useState('Today at 6:30 PM');
  const [location, setLocation] = useState('Central Sports Hub, Downtown');
  const [maxParticipants, setMaxParticipants] = useState(2);
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('Casual, Beginners Welcome');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleModeChange = (newMode: 'friends' | 'dating') => {
    setMode(newMode);
    if (newMode === 'dating') {
      setCategory('dating');
      setMaxParticipants(2);
      setTitle('Rooftop Sunset Drinks & Small Plates');
      setLocation('Skyline Lounge, 12th Floor');
      setTagInput('Activity Date, Cocktails, Sunset Views');
    } else {
      setCategory('sports');
      setTitle('Pickleball / Padel Casual Doubles');
      setLocation('Metropolitan Sports Hub');
      setTagInput('Padel, Casual, Beginners Welcome');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) {
      setError('Please provide a title and location for the hangout.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          category,
          mode,
          timeDisplay: timeDisplay.trim(),
          location: location.trim(),
          maxParticipants,
          description: description.trim() || `Looking for people to join for ${title.trim()}!`,
          tags,
          isUrgent,
        }),
      });

      const data = await res.json();
      if (data.success && data.activity) {
        onCreated(data.activity);
        onClose();
      } else {
        setError(data.error || 'Failed to create plan');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-2 text-rose-500 mb-1">
          <Sparkles className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Broadcast a Live Plan</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white">
          Create a New Plan
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          Put up an activity and match with nearby people who want to join.
        </p>

        {/* Plan Type Selector: Friendship vs Dating */}
        <div className="grid grid-cols-2 gap-2 mb-4 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => handleModeChange('friends')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              mode === 'friends'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Users className="w-4 h-4 text-amber-500" />
            <span>🤝 Friendship Plan</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('dating')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              mode === 'dating'
                ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/25'
                : 'text-zinc-500 hover:text-rose-500'
            }`}
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>❤️ Activity Date</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Plan Title */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Plan Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Padel doubles, Specialty coffee run, Sunset cocktails"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-medium flex items-center justify-center space-x-1.5 border transition-all ${
                    category === cat.id
                      ? 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 shadow-sm'
                      : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                <span>When / Time *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Today at 6:30 PM, Tonight at 8"
                value={timeDisplay}
                onChange={(e) => setTimeDisplay(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                <span>Where / Venue *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Downtown Sports Club, Skyline Lounge"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Spots & Urgent Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <Users className="w-3.5 h-3.5 text-emerald-500" />
                <span>Max People</span>
              </label>
              <select
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value={2}>2 People (1-on-1 Date / Hangout)</option>
                <option value={3}>3 People (Small Trio)</option>
                <option value={4}>4 People (Doubles / Group)</option>
                <option value={6}>6+ People (Open Social / Party)</option>
              </select>
            </div>

            <div className="flex items-center pt-6">
              <label className="relative flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500 border-zinc-300 dark:border-zinc-700"
                />
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  ⚡ Happening in next 3 hours
                </span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows={2}
              placeholder="What are the details? (e.g., Casual vibe, extra paddle provided, rooftop view)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
              <Tag className="w-3.5 h-3.5 text-zinc-500" />
              <span>Tags (comma separated)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Casual, Friendly, Foodie"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white font-bold text-sm hover:brightness-105 active:scale-95 disabled:opacity-50 transition-all shadow-md shadow-rose-500/25 flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Broadcasting...' : `Broadcast ${mode === 'dating' ? 'Activity Date' : 'Plan'}`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
