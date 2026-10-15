import { NextResponse } from 'next/server';
import { isNeonConfigured, getDbClient } from '@/lib/db';
import { memoryStore } from '@/lib/memoryStore';
import { CURRENT_USER } from '@/lib/mockData';
import { Activity } from '@/types';

export async function GET() {
  if (isNeonConfigured()) {
    try {
      const sql = getDbClient();
      const rows = await sql`
        SELECT 
          a.id, a.title, a.category, a.description, a.date_time, a.time_display,
          a.location, a.max_participants, a.current_participants, a.tags,
          a.is_urgent, a.created_at,
          u.id as host_id, u.name as host_name, u.age as host_age, u.avatar as host_avatar,
          u.occupation as host_occupation, u.city as host_city,
          u.bio as host_bio, u.badges as host_badges, u.verified as host_verified
        FROM activities a
        JOIN users u ON a.host_id = u.id
        ORDER BY a.created_at DESC;
      `;

      if (rows && rows.length > 0) {
        const activities: Activity[] = rows.map((r) => ({
          id: r.id as string,
          title: r.title as string,
          category: r.category as Activity['category'],
          mode: (r.category === 'dating' ? 'dating' : 'friends') as Activity['mode'],
          description: r.description as string,
          dateTime: new Date(r.date_time as string).toISOString(),
          timeDisplay: r.time_display as string,
          location: r.location as string,
          maxParticipants: Number(r.max_participants),
          currentParticipants: Number(r.current_participants),
          tags: (r.tags as string[]) || [],
          isUrgent: Boolean(r.is_urgent),
          createdAt: new Date(r.created_at as string).toISOString(),
          host: {
            id: r.host_id as string,
            name: r.host_name as string,
            age: Number(r.host_age) || 25,
            avatar: r.host_avatar as string,
            occupation: (r.host_occupation as string) || 'Creative',
            city: (r.host_city as string) || 'Nearby',
            bio: r.host_bio as string,
            badges: (r.host_badges as string[]) || [],
            verified: Boolean(r.host_verified),
          },
        }));

        return NextResponse.json({ activities, source: 'neon' });
      }
    } catch (err) {
      console.warn('Neon query error, falling back to memory store:', err);
    }
  }

  return NextResponse.json({ activities: memoryStore.activities, source: 'memory' });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newActivity: Activity = {
      id: `act_${Date.now()}`,
      title: body.title,
      category: body.category || 'social',
      mode: body.mode || (body.category === 'dating' ? 'dating' : 'friends'),
      description: body.description,
      dateTime: body.dateTime || new Date().toISOString(),
      timeDisplay: body.timeDisplay || 'Soon',
      location: body.location,
      maxParticipants: Number(body.maxParticipants) || 2,
      currentParticipants: 1,
      tags: body.tags || [],
      isUrgent: Boolean(body.isUrgent),
      createdAt: new Date().toISOString(),
      host: CURRENT_USER,
    };

    if (isNeonConfigured()) {
      try {
        const sql = getDbClient();
        await sql`
          INSERT INTO activities (
            id, title, category, description, date_time, time_display,
            location, max_participants, current_participants, tags, host_id, is_urgent
          ) VALUES (
            ${newActivity.id}, ${newActivity.title}, ${newActivity.category},
            ${newActivity.description}, ${newActivity.dateTime}, ${newActivity.timeDisplay},
            ${newActivity.location}, ${newActivity.maxParticipants}, ${newActivity.currentParticipants},
            ${newActivity.tags}, ${newActivity.host.id}, ${newActivity.isUrgent}
          );
        `;
      } catch (neonErr) {
        console.warn('Neon insert error:', neonErr);
      }
    }

    // Also update in-memory store so it reflects immediately
    memoryStore.activities.unshift(newActivity);

    return NextResponse.json({ success: true, activity: newActivity });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
