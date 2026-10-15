import { neon } from '@neondatabase/serverless';

export function isNeonConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres'));
}

export function getDbClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }
  return neon(process.env.DATABASE_URL);
}

// SQL Script to initialize tables in Neon PostgreSQL
export async function initializeDatabase() {
  if (!isNeonConfigured()) {
    return { success: false, message: 'DATABASE_URL is not set' };
  }

  const sql = getDbClient();

  try {
    // 1. Users table (general social profiles)
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        age INTEGER,
        avatar TEXT,
        occupation VARCHAR(255),
        city VARCHAR(255),
        bio TEXT,
        badges TEXT[],
        verified BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Activities table
    await sql`
      CREATE TABLE IF NOT EXISTS activities (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(64) NOT NULL,
        description TEXT,
        date_time TIMESTAMP WITH TIME ZONE NOT NULL,
        time_display VARCHAR(128),
        location VARCHAR(255) NOT NULL,
        max_participants INTEGER DEFAULT 2,
        current_participants INTEGER DEFAULT 1,
        tags TEXT[],
        host_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        is_urgent BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. Swipes table
    await sql`
      CREATE TABLE IF NOT EXISTS swipes (
        id VARCHAR(64) PRIMARY KEY,
        activity_id VARCHAR(64) REFERENCES activities(id) ON DELETE CASCADE,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        action VARCHAR(32) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 4. Matches table
    await sql`
      CREATE TABLE IF NOT EXISTS matches (
        id VARCHAR(64) PRIMARY KEY,
        activity_id VARCHAR(64) REFERENCES activities(id) ON DELETE CASCADE,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(32) DEFAULT 'confirmed',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 5. Messages table
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(64) PRIMARY KEY,
        match_id VARCHAR(64) REFERENCES matches(id) ON DELETE CASCADE,
        sender_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return { success: true, message: 'All Neon tables created successfully!' };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.error('Error initializing Neon DB:', errMessage);
    return { success: false, message: errMessage };
  }
}
