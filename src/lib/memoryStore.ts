import { Activity, Match, Message, SwipeAction } from '@/types';
import { CURRENT_USER, INITIAL_ACTIVITIES } from './mockData';

// In-memory store for fallback when DATABASE_URL is not set
interface MemoryStore {
  activities: Activity[];
  swipes: SwipeAction[];
  matches: Match[];
  messages: Message[];
}

// Global singleton to persist across HMR during dev
const globalForStore = globalThis as unknown as {
  planpalStore?: MemoryStore;
};

export const memoryStore: MemoryStore = globalForStore.planpalStore || {
  activities: [...INITIAL_ACTIVITIES],
  swipes: [],
  matches: [
    {
      id: 'match_sample',
      activityId: 'act_1',
      activity: INITIAL_ACTIVITIES[0],
      matchedWith: INITIAL_ACTIVITIES[0].host,
      matchedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      status: 'confirmed',
      lastMessage: "Hey Alex! Glad you can make it for padel. Court 4 is booked!",
      lastMessageTime: '15m ago',
    },
  ],
  messages: [
    {
      id: 'msg_1',
      matchId: 'match_sample',
      senderId: 'usr_sarah',
      senderName: 'Sarah Chen',
      text: "Hey Alex! Glad you can make it for padel. Court 4 is booked!",
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg_2',
      matchId: 'match_sample',
      senderId: CURRENT_USER.id,
      senderName: CURRENT_USER.name,
      text: "Awesome! I'll be there around 5:50 with some extra grip tape and balls.",
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
  ],
};

if (process.env.NODE_ENV !== 'production') {
  globalForStore.planpalStore = memoryStore;
}
