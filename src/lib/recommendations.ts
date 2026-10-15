import { Activity, UserPreferences, AppMode } from '@/types';

/**
 * Calculates a match percentage (70 - 99%) based on user preferences and intent
 */
export function calculateMatchScore(activity: Activity, prefs?: UserPreferences): number {
  if (!prefs) return 80;

  let score = 65;

  // 1. Intent Match (Dating vs Friendship)
  if (prefs.intent === 'dating') {
    if (activity.mode === 'dating' || activity.category === 'dating') {
      score += 25;
    } else if (activity.mode === 'both') {
      score += 15;
    } else {
      score -= 10;
    }
  } else if (prefs.intent === 'friends') {
    if (activity.mode === 'friends') {
      score += 25;
    } else if (activity.mode === 'both') {
      score += 18;
    } else {
      score -= 15;
    }
  } else {
    // Both
    score += 15;
  }

  // 2. Category & Tag Matching
  const catKeywords: Record<string, string[]> = {
    sports: ['Sports & Padel', 'Padel', 'Pickleball', 'Tennis'],
    food: ['Coffee & Food', 'Specialty Coffee', 'Foodie'],
    dating: ['Dating & Romance', 'Romantic', 'Activity Date'],
    social: ['Nightlife & Music', 'Live Jazz', 'Music'],
    fitness: ['Climbing & Fitness', 'Bouldering', 'Gym'],
    gaming: ['Board Games', 'Games', 'Trivia'],
    outdoors: ['Outdoors & Hikes', 'Hiking', 'Nature'],
    arts: ['Arts & Design', 'Pottery', 'Art'],
  };

  const relevantKeywords = catKeywords[activity.category] || [];

  for (const userInterest of prefs.interests) {
    if (relevantKeywords.includes(userInterest)) {
      score += 12;
      break;
    }
    // Tag matching
    if (activity.tags.some((tag) => tag.toLowerCase().includes(userInterest.toLowerCase()))) {
      score += 8;
    }
  }

  // 3. Spontaneous boost
  if (activity.isUrgent && prefs.preferredTimes.includes('Spontaneous (Right Now)')) {
    score += 5;
  }

  // Clamp score between 72% and 99%
  return Math.min(99, Math.max(72, score));
}

/**
 * Filters and sorts activities according to selected AppMode (all, friends, dating) and recommendations
 */
export function getRecommendedActivities(
  activities: Activity[],
  prefs?: UserPreferences,
  modeFilter: AppMode = 'all'
): Activity[] {
  return activities
    .map((act) => ({
      ...act,
      matchScore: calculateMatchScore(act, prefs),
    }))
    .filter((act) => {
      if (modeFilter === 'dating') {
        return act.mode === 'dating' || act.category === 'dating';
      }
      if (modeFilter === 'friends') {
        return act.mode === 'friends' || act.mode === 'both';
      }
      return true; // all
    })
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
}
