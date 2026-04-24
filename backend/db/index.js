import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on("error", (err) => {
  console.error("[DB] Unexpected client error:", err);
});

export async function initDB() {
  const client = await pool.connect();
  try {
    await client.query("CREATE EXTENSION IF NOT EXISTS vector;");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'candidate',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS resumes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        raw_text TEXT NOT NULL,
        parsed_data JSONB,
        embedding vector(768),
        filename VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS interview_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
        job_role VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        total_questions INT DEFAULT 10,
        questions_asked INT DEFAULT 0,
        average_score DECIMAL(4,2),
        asked_topics JSONB DEFAULT '[]',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        completed_at TIMESTAMPTZ
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS interview_qa (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID REFERENCES interview_sessions(id) ON DELETE CASCADE,
        question_number INT NOT NULL,
        topic VARCHAR(255),
        question TEXT NOT NULL,
        answer TEXT,
        score INT,
        feedback TEXT,
        strengths TEXT,
        improvements TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS question_bank (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        job_role VARCHAR(255) NOT NULL,
        topic VARCHAR(255),
        question TEXT NOT NULL,
        difficulty VARCHAR(50) DEFAULT 'medium',
        approved BOOLEAN DEFAULT false,
        times_used INT DEFAULT 0,
        avg_score DECIMAL(4,2),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // HNSW index for fast vector search
    await client
      .query(
        `
      CREATE INDEX IF NOT EXISTS resumes_embedding_idx
      ON resumes USING hnsw (embedding vector_cosine_ops);
    `,
      )
      .catch(() => {
        // Older pgvector versions use ivfflat
        return client
          .query(
            `
        CREATE INDEX IF NOT EXISTS resumes_embedding_idx
        ON resumes USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
      `,
          )
          .catch(() =>
            console.warn(
              "[DB] Could not create vector index — continuing anyway",
            ),
          );
      });

    // Ensure interview_feedback table exists
    await client
      .query(
        `
      CREATE TABLE IF NOT EXISTS interview_feedback (
        id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id   UUID REFERENCES interview_sessions(id) ON DELETE CASCADE,
        rating       INTEGER,
        difficulty   VARCHAR(50),
        relevance    VARCHAR(50),
        would_recommend BOOLEAN,
        comments     TEXT,
        created_at   TIMESTAMPTZ DEFAULT NOW()
      );
    `,
      )
      .catch(() => {});

    // Widen existing columns if they were created with VARCHAR(20)
    await client
      .query(
        `ALTER TABLE interview_feedback ALTER COLUMN difficulty TYPE VARCHAR(50)`,
      )
      .catch(() => {});
    await client
      .query(
        `ALTER TABLE interview_feedback ALTER COLUMN relevance TYPE VARCHAR(50)`,
      )
      .catch(() => {});
    await client
      .query(
        `ALTER TABLE interview_feedback DROP CONSTRAINT IF EXISTS interview_feedback_rating_check`,
      )
      .catch(() => {});

    // Recording columns on interview_sessions
    await client
      .query(
        `ALTER TABLE interview_sessions ADD COLUMN IF NOT EXISTS recording_url TEXT`,
      )
      .catch(() => {});
    await client
      .query(
        `ALTER TABLE interview_sessions ADD COLUMN IF NOT EXISTS recording_duration INTEGER`,
      )
      .catch(() => {});

    // Ensure report column exists (stores JSON report)
    await client
      .query(
        `
      ALTER TABLE interview_sessions ADD COLUMN IF NOT EXISTS report JSONB;
    `,
      )
      .catch(() => {});

    // Ensure notes column exists for feedback
    await client
      .query(
        `
      ALTER TABLE interview_sessions ADD COLUMN IF NOT EXISTS notes TEXT;
    `,
      )
      .catch(() => {});

    // Ensure resume_id column exists (safe migration)
    await client
      .query(
        `
      ALTER TABLE interview_sessions
      ADD COLUMN IF NOT EXISTS resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL;
    `,
      )
      .catch(() => {}); // ignore if already exists

    // Ensure candidate_name column exists
    await client
      .query(
        `
      ALTER TABLE interview_sessions
      ADD COLUMN IF NOT EXISTS candidate_name VARCHAR(255);
    `,
      )
      .catch(() => {});

    console.log("[DB] Schema initialised successfully");
  } finally {
    client.release();
  }
}

export default pool;
