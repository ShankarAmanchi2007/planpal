'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Heart, 
  UserCheck 
} from 'lucide-react';
import { Activity } from '@/types';

interface ActivityCardProps {
  activity: Activity;
  isFront?: boolean;
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; badge: string; gradient: string }> = {
  dating: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-300',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200 border border-rose-300 dark:border-rose-700',
    gradient: 'from-rose-500/15 via-pink-500/10 to-transparent',
  },
  sports: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200',
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
  },
  food: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200',
    gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
  },
  social: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-700 dark:text-purple-300',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200',
    gradient: 'from-purple-500/10 via-indigo-500/5 to-transparent',
  },
  fitness: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    text: 'text-indigo-700 dark:text-indigo-300',
    badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200',
    gradient: 'from-indigo-500/10 via-blue-500/5 to-transparent',
  },
  outdoors: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200',
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
  },
  gaming: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-700 dark:text-purple-300',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200',
    gradient: 'from-purple-500/10 via-fuchsia-500/5 to-transparent',
  },
};

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const [showFullBio, setShowFullBio] = useState(false);
  const styles = CATEGORY_STYLES[activity.category] || CATEGORY_STYLES.social;
  const spotsLeft = activity.maxParticipants - activity.currentParticipants;
  const isDating = activity.mode === 'dating' || activity.category === 'dating';

  return (
    <div className="relative w-full h-[540px] sm:h-[570px] rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-2xl flex flex-col justify-between overflow-hidden select-none">
      {/* Decorative Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${styles.gradient} pointer-events-none`} />

      {/* Top Section: Plan Details First */}
      <div className="relative p-5 sm:p-6 z-10 flex flex-col space-y-3">
        {/* Row 1: Badges & Recommendation Score */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isDating ? (
              <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-rose-500 text-white shadow-sm shadow-rose-500/20">
                <Heart className="w-3 h-3 fill-white" />
                <span>Activity Date</span>
              </span>
            ) : (
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles.badge}`}>
                {activity.category}
              </span>
            )}

            {/* Personalized Recommendation Score */}
            {activity.matchScore && (
              <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{activity.matchScore}% Match</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            <Users className="w-3.5 h-3.5" />
            <span>
              {spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft > 1 ? 's' : ''}` : 'Full'}
            </span>
          </div>
        </div>

        {/* Activity Title */}
        <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white leading-tight tracking-tight">
          {activity.title}
        </h2>

        {/* Metadata pills: Time & Location */}
        <div className="grid grid-cols-1 gap-1.5 pt-1 text-xs sm:text-sm">
          <div className="flex items-center space-x-2.5 text-zinc-700 dark:text-zinc-300">
            <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-rose-500">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="font-semibold">{activity.timeDisplay}</span>
            {activity.isUrgent && (
              <span className="text-[10px] uppercase font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/60 px-2 py-0.5 rounded-full">
                Happening Soon
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2.5 text-zinc-700 dark:text-zinc-300">
            <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-indigo-500">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="truncate">{activity.location}</span>
          </div>
        </div>

        {/* Description Box */}
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3 leading-relaxed pt-1">
          {activity.description}
        </p>

        {/* Activity Tags */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {activity.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Section: Host Profile */}
      <div className="relative z-10 p-4 sm:p-5 bg-gradient-to-t from-zinc-50 via-zinc-50/90 to-transparent dark:from-zinc-950 dark:via-zinc-950/90 dark:to-transparent border-t border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={activity.host.avatar}
                alt={activity.host.name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white dark:ring-zinc-800 shadow-md"
              />
              {activity.host.verified && (
                <div
                  className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 shadow"
                  title="Verified Profile"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white">
                  {activity.host.name}, {activity.host.age}
                </span>
              </div>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                {activity.host.occupation} • <span className="text-zinc-500 dark:text-zinc-400">{activity.host.city}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowFullBio(!showFullBio)}
            className="p-1.5 rounded-xl hover:bg-zinc-200/70 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            title="Toggle Host Bio"
          >
            {showFullBio ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Collapsible Bio & Badges */}
        {showFullBio ? (
          <div className="mt-3 pt-3 border-t border-zinc-200/70 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 animate-fadeIn">
            <p className="italic mb-2">&ldquo;{activity.host.bio}&rdquo;</p>
            <div className="flex flex-wrap gap-1">
              {activity.host.badges.map((b, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[10px] font-semibold border border-amber-200/60 dark:border-amber-800/60"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-2 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            {activity.host.badges.slice(0, 2).map((b, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-full bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-medium whitespace-nowrap"
              >
                {b}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
