import { NextResponse } from 'next/server';
import { initializeDatabase, isNeonConfigured, getDbClient } from '@/lib/db';
import { CURRENT_USER, INITIAL_ACTIVITIES } from '@/lib/mockData';

export async function POST() {
  if (!isNeonConfigured()) {
    return NextResponse.json({
      configured: false,
      message: 'DATABASE_URL is not set in environment variables. Running in demo memory mode.',
    });
  }

  try {
    const initRes = await initializeDatabase();
    if (!initRes.success) {
      return NextResponse.json({ success: false, error: initRes.message }, { status: 500 });
    }

    const sql = getDbClient();

    // Seed current user
    await sql`
      INSERT INTO users (id, name, age, avatar, occupation, city, bio, badges, verified)
      VALUES (${CURRENT_USER.id}, ${CURRENT_USER.name}, ${CURRENT_USER.age}, ${CURRENT_USER.avatar}, ${CURRENT_USER.occupation}, ${CURRENT_USER.city}, ${CURRENT_USER.bio}, ${CURRENT_USER.badges}, ${CURRENT_USER.verified})
      ON CONFLICT (id) DO NOTHING;
    `;

    // Seed sample hosts and activities
    for (const act of INITIAL_ACTIVITIES) {
      await sql`
        INSERT INTO users (id, name, age, avatar, occupation, city, bio, badges, verified)
        VALUES (${act.host.id}, ${act.host.name}, ${act.host.age}, ${act.host.avatar}, ${act.host.occupation}, ${act.host.city}, ${act.host.bio}, ${act.host.badges}, ${act.host.verified})
        ON CONFLICT (id) DO NOTHING;
      `;

      await sql`
        INSERT INTO activities (id, title, category, description, date_time, time_display, location, max_participants, current_participants, tags, host_id, is_urgent)
        VALUES (${act.id}, ${act.title}, ${act.category}, ${act.description}, ${act.dateTime}, ${act.timeDisplay}, ${act.location}, ${act.maxParticipants}, ${act.currentParticipants}, ${act.tags}, ${act.host.id}, ${act.isUrgent ?? false})
        ON CONFLICT (id) DO NOTHING;
      `;
    }

    return NextResponse.json({
      success: true,
      configured: true,
      message: 'Neon PostgreSQL connected and seeded with social activities!',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    configured: isNeonConfigured(),
  });
}
