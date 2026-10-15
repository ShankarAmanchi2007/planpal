import { NextResponse } from 'next/server';
import { isNeonConfigured, getDbClient } from '@/lib/db';
import { memoryStore } from '@/lib/memoryStore';
import { CURRENT_USER } from '@/lib/mockData';
import { Match, SwipeAction } from '@/types';

export async function POST(req: Request) {
  try {
    const { activityId, action } = await req.json();
    const swipeId = `swp_${Date.now()}`;

    const swipe: SwipeAction = {
      id: swipeId,
      activityId,
      userId: CURRENT_USER.id,
      action,
      timestamp: new Date().toISOString(),
    };

    memoryStore.swipes.push(swipe);

    let matchCreated: Match | null = null;

    // If swiped right (like or superlike), trigger an instant match for direct interaction!
    if (action === 'like' || action === 'superlike') {
      const activity = memoryStore.activities.find((a) => a.id === activityId);
      if (activity) {
        const matchId = `match_${Date.now()}`;
        matchCreated = {
          id: matchId,
          activityId: activity.id,
          activity,
          matchedWith: activity.host,
          matchedAt: new Date().toISOString(),
          status: 'confirmed',
          lastMessage: `You connected for "${activity.title}"! Say hello to lock in the plan.`,
          lastMessageTime: 'Just now',
        };

        memoryStore.matches.unshift(matchCreated);

        // Add welcome icebreaker message
        memoryStore.messages.push({
          id: `msg_${Date.now()}`,
          matchId: matchCreated.id,
          senderId: activity.host.id,
          senderName: activity.host.name,
          text: `Hey Alex! Saw you're interested in "${activity.title}". Let's do it! Does ${activity.timeDisplay} work for you?`,
          timestamp: new Date().toISOString(),
        });
      }
    }

    if (isNeonConfigured()) {
      try {
        const sql = getDbClient();
        await sql`
          INSERT INTO swipes (id, activity_id, user_id, action)
          VALUES (${swipe.id}, ${swipe.activityId}, ${swipe.userId}, ${swipe.action});
        `;

        if (matchCreated) {
          await sql`
            INSERT INTO matches (id, activity_id, user_id, status)
            VALUES (${matchCreated.id}, ${matchCreated.activityId}, ${CURRENT_USER.id}, 'confirmed');
          `;
        }
      } catch (err) {
        console.warn('Neon swipe recording error:', err);
      }
    }

    return NextResponse.json({
      success: true,
      matched: Boolean(matchCreated),
      match: matchCreated,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
