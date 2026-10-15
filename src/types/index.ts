export type CategoryType = 
  | 'all'
  | 'dating'
  | 'sports'
  | 'food'
  | 'outdoors'
  | 'gaming'
  | 'fitness'
  | 'arts'
  | 'social';

export type AppMode = 'all' | 'friends' | 'dating';

export interface UserPreferences {
  intent: 'friends' | 'dating' | 'both';
  interests: string[];
  preferredTimes: string[];
  vibe: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  age: number;
  avatar: string;
  occupation: string;
  city: string;
  bio: string;
  badges: string[];
  verified: boolean;
  preferences?: UserPreferences;
  isOnboarded?: boolean;
}

export interface Activity {
  id: string;
  title: string;
  category: CategoryType;
  mode: 'friends' | 'dating' | 'both';
  description: string;
  dateTime: string;
  timeDisplay: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  tags: string[];
  host: User;
  createdAt: string;
  isUrgent?: boolean;
  matchScore?: number; // Calculated recommendation score (e.g. 96%)
}

export interface SwipeAction {
  id: string;
  activityId: string;
  userId: string;
  action: 'like' | 'pass' | 'superlike';
  timestamp: string;
}

export interface Match {
  id: string;
  activityId: string;
  activity: Activity;
  matchedWith: User;
  matchedAt: string;
  status: 'pending' | 'confirmed' | 'completed';
  lastMessage?: string;
  lastMessageTime?: string;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}
