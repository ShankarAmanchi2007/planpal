import { NextResponse } from 'next/server';
import { isNeonConfigured, getDbClient } from '@/lib/db';
import { memoryStore } from '@/lib/memoryStore';
import { CURRENT_USER } from '@/lib/mockData';
import { Message } from '@/types';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const matchId = searchParams.get('matchId');

  if (!matchId) {
    return NextResponse.json({ error: 'matchId is required' }, { status: 400 });
  }

  if (isNeonConfigured()) {
    try {
      const sql = getDbClient();
      const rows = await sql`
        SELECT m.id, m.match_id, m.sender_id, m.text, m.created_at, u.name as sender_name
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.match_id = ${matchId}
        ORDER BY m.created_at ASC;
      `;

      if (rows && rows.length > 0) {
        const messages: Message[] = rows.map((r) => ({
          id: r.id as string,
          matchId: r.match_id as string,
          senderId: r.sender_id as string,
          senderName: r.sender_name as string,
          text: r.text as string,
          timestamp: new Date(r.created_at as string).toISOString(),
        }));
        return NextResponse.json({ messages });
      }
    } catch (err) {
      console.warn('Neon messages query error:', err);
    }
  }

  const msgs = memoryStore.messages.filter((m) => m.matchId === matchId);
  return NextResponse.json({ messages: msgs });
}

export async function POST(req: Request) {
  try {
    const { matchId, text } = await req.json();

    if (!matchId || !text?.trim()) {
      return NextResponse.json({ error: 'matchId and text are required' }, { status: 400 });
    }

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      matchId,
      senderId: CURRENT_USER.id,
      senderName: CURRENT_USER.name,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    memoryStore.messages.push(newMessage);

    // Update match lastMessage
    const match = memoryStore.matches.find((m) => m.id === matchId);
    if (match) {
      match.lastMessage = newMessage.text;
      match.lastMessageTime = 'Just now';
    }

    if (isNeonConfigured()) {
      try {
        const sql = getDbClient();
        await sql`
          INSERT INTO messages (id, match_id, sender_id, text)
          VALUES (${newMessage.id}, ${newMessage.matchId}, ${newMessage.senderId}, ${newMessage.text});
        `;
      } catch (err) {
        console.warn('Neon message insert error:', err);
      }
    }

    return NextResponse.json({ success: true, message: newMessage });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
