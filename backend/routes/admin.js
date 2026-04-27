import express from "express";
import { requireAdmin } from "../middleware/auth.js";
import pool from "../db/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RECORDINGS_DIR = path.join(process.cwd(), "uploads", "recordings");
if (!fs.existsSync(RECORDINGS_DIR))
  fs.mkdirSync(RECORDINGS_DIR, { recursive: true });

const router = express.Router();

// GET /api/admin/stats
router.get("/stats", requireAdmin, async (req, res) => {
  try {
    const [users, sessions, answers, resumes] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM users"),
      pool.query(
        "SELECT COUNT(*), AVG(average_score) FROM interview_sessions WHERE status='completed'",
      ),
      pool.query("SELECT COUNT(*) FROM interview_qa WHERE answer IS NOT NULL"),
      pool.query("SELECT COUNT(*) FROM resumes"),
    ]);
    res.json({
      totalUsers: parseInt(users.rows[0].count),
      completedInterviews: parseInt(sessions.rows[0].count),
      averageScore: parseFloat(sessions.rows[0].avg || 0).toFixed(1),
      totalAnswers: parseInt(answers.rows[0].count),
      totalResumes: parseInt(resumes.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats." });
  }
});

// GET /api/admin/users — all users with their resumes and sessions
router.get("/users", requireAdmin, async (req, res) => {
  try {
    const users = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.created_at,
              COUNT(DISTINCT r.id) as resume_count,
              COUNT(DISTINCT s.id) as session_count,
              ROUND(AVG(s.average_score)::numeric, 1) as avg_score
       FROM users u
       LEFT JOIN resumes r ON r.user_id = u.id
       LEFT JOIN interview_sessions s ON s.user_id = u.id AND s.status = 'completed'
       GROUP BY u.id ORDER BY u.created_at DESC`,
    );
    res.json(users.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

// GET /api/admin/users/:id — single user full detail
router.get("/users/:id", requireAdmin, async (req, res) => {
  try {
    const [userRes, resumesRes, sessionsRes] = await Promise.all([
      pool.query(
        "SELECT id, name, email, role, created_at FROM users WHERE id=$1",
        [req.params.id],
      ),
      pool.query(
        `SELECT id, filename, parsed_data, created_at
         FROM resumes WHERE user_id=$1 ORDER BY created_at DESC`,
        [req.params.id],
      ),
      pool.query(
        `SELECT s.id, s.job_role, s.status, s.total_questions, s.questions_asked,
                s.average_score, s.created_at, s.completed_at,
                COUNT(q.id) as qa_count
         FROM interview_sessions s
         LEFT JOIN interview_qa q ON q.session_id = s.id AND q.answer IS NOT NULL
         WHERE s.user_id=$1
         GROUP BY s.id ORDER BY s.created_at DESC`,
        [req.params.id],
      ),
    ]);

    if (!userRes.rows.length)
      return res.status(404).json({ error: "User not found." });

    // Parse parsed_data for each resume
    const resumes = resumesRes.rows.map((r) => ({
      ...r,
      parsed_data:
        typeof r.parsed_data === "string"
          ? (() => {
              try {
                return JSON.parse(r.parsed_data);
              } catch {
                return {};
              }
            })()
          : r.parsed_data || {},
    }));

    res.json({
      user: userRes.rows[0],
      resumes,
      sessions: sessionsRes.rows,
    });
  } catch (err) {
    console.error("[admin] user detail error:", err);
    res.status(500).json({ error: "Failed to fetch user details." });
  }
});

// DELETE /api/admin/users/:id — permanently delete a user and ALL their data
router.delete("/users/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Verify user exists
    const check = await client.query(
      "SELECT id, name, email FROM users WHERE id=$1",
      [id],
    );
    if (!check.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "User not found." });
    }
    const user = check.rows[0];

    // Get recording URLs before deletion so we can remove files from disk
    const recResult = await client.query(
      `SELECT recording_url FROM interview_sessions
       WHERE user_id=$1 AND recording_url IS NOT NULL`,
      [id],
    );
    const recordingPaths = recResult.rows
      .map((r) => r.recording_url)
      .filter(Boolean);

    // Delete child data explicitly (belt + suspenders alongside CASCADE)
    await client.query(
      `
      DELETE FROM interview_feedback
      WHERE session_id IN (SELECT id FROM interview_sessions WHERE user_id=$1)
    `,
      [id],
    );

    await client.query(
      `
      DELETE FROM interview_qa
      WHERE session_id IN (SELECT id FROM interview_sessions WHERE user_id=$1)
    `,
      [id],
    );

    await client.query("DELETE FROM interview_sessions WHERE user_id=$1", [id]);
    await client.query("DELETE FROM resumes WHERE user_id=$1", [id]);
    await client.query("DELETE FROM users WHERE id=$1", [id]);

    await client.query("COMMIT");

    // Delete recording files from disk (after successful DB commit)
    let deletedFiles = 0;
    for (const recPath of recordingPaths) {
      try {
        // recPath may be a URL like /recordings/recording-xxx.webm
        // or a filesystem path
        const filename = recPath.split("/").pop();
        const filePath = path.join(
          process.cwd(),
          "uploads",
          "recordings",
          filename,
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          deletedFiles++;
        }
      } catch (fileErr) {
        console.warn(
          `[admin] Could not delete recording file: ${fileErr.message}`,
        );
      }
    }

    console.log(
      `[admin] Deleted user ${user.name} (${user.email}) — id: ${id}, recordings deleted: ${deletedFiles}`,
    );
    res.json({
      success: true,
      message: `User "${user.name}" and all their data deleted successfully.`,
      deletedRecordings: deletedFiles,
    });
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("[admin] delete user error:", err);
    res
      .status(500)
      .json({ error: "Failed to delete user. All changes rolled back." });
  } finally {
    client.release();
  }
});

// GET /api/admin/sessions — all sessions
router.get("/sessions", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.id, s.job_role, s.status, s.total_questions, s.questions_asked,
              s.average_score, s.created_at, s.completed_at,
              u.name as candidate_name, u.email
       FROM interview_sessions s JOIN users u ON s.user_id = u.id
       ORDER BY s.created_at DESC LIMIT 200`,
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sessions." });
  }
});

// GET /api/admin/sessions/:id/qa — Q&A for a session
router.get("/sessions/:id/qa", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT q.*, s.job_role, u.name as candidate_name
       FROM interview_qa q
       JOIN interview_sessions s ON s.id = q.session_id
       JOIN users u ON u.id = s.user_id
       WHERE q.session_id=$1 ORDER BY q.question_number`,
      [req.params.id],
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Q&A." });
  }
});

// GET /api/admin/feedback — all interview feedback
router.get("/feedback", requireAdmin, async (req, res) => {
  try {
    // Ensure table exists first
    await pool.query(`
      CREATE TABLE IF NOT EXISTS interview_feedback (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID REFERENCES interview_sessions(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 0 AND rating <= 10),
        difficulty VARCHAR(20), relevance VARCHAR(20),
        would_recommend BOOLEAN, comments TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    const result = await pool.query(
      `SELECT f.id, f.rating, f.difficulty, f.relevance,
              f.would_recommend, f.comments, f.created_at,
              s.job_role, u.name as candidate_name, u.email
       FROM interview_feedback f
       JOIN interview_sessions s ON s.id = f.session_id
       JOIN users u ON u.id = s.user_id
       ORDER BY f.created_at DESC`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error("[admin] feedback error:", err.message);
    res.json([]); // return empty array instead of 500
  }
});

// GET /api/admin/sessions/:id/detail — full session with Q&A
router.get("/sessions/:id/detail", requireAdmin, async (req, res) => {
  try {
    const sessionRes = await pool.query(
      `SELECT s.*, u.name as candidate_name, u.email
       FROM interview_sessions s JOIN users u ON u.id=s.user_id
       WHERE s.id=$1`,
      [req.params.id],
    );
    if (!sessionRes.rows.length)
      return res.status(404).json({ error: "Not found." });

    const qaRes = await pool.query(
      `SELECT * FROM interview_qa WHERE session_id=$1 ORDER BY question_number`,
      [req.params.id],
    );

    const fbRes = await pool.query(
      `SELECT * FROM interview_feedback WHERE session_id=$1`,
      [req.params.id],
    );

    res.json({
      session: sessionRes.rows[0],
      qa: qaRes.rows,
      feedback: fbRes.rows[0] || null,
    });
  } catch (err) {
    console.error("[admin] session detail:", err.message);
    res.status(500).json({ error: "Failed to fetch session detail." });
  }
});

// POST /api/admin/sessions/:id/recording — save recording metadata
router.post("/sessions/:id/recording", requireAdmin, async (req, res) => {
  try {
    const { recording_url, recording_duration } = req.body;
    await pool.query(
      `UPDATE interview_sessions SET recording_url=$1, recording_duration=$2 WHERE id=$3`,
      [recording_url, recording_duration || null, req.params.id],
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save recording." });
  }
});

// POST /api/admin/sessions/:id/recording/upload — receive base64 audio, save as file
router.post(
  "/sessions/:id/recording/upload",
  requireAdmin,
  async (req, res) => {
    try {
      const { dataUrl, duration, mimeType } = req.body;
      if (!dataUrl)
        return res.status(400).json({ error: "No recording data." });

      // Convert base64 data URL to buffer
      const base64Data = dataUrl.replace(/^data:[^;]+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      const ext = mimeType?.includes("webm") ? "webm" : "mp4";
      const filename = `recording-${req.params.id}.${ext}`;
      const filepath = path.join(RECORDINGS_DIR, filename);

      fs.writeFileSync(filepath, buffer);
      const recordingUrl = `/api/admin/sessions/${req.params.id}/recording/play`;

      // Save URL and duration to DB
      await pool.query(
        `UPDATE interview_sessions SET recording_url=$1, recording_duration=$2 WHERE id=$3`,
        [recordingUrl, duration || null, req.params.id],
      );

      console.log(
        `[Recording] Saved ${(buffer.length / 1024 / 1024).toFixed(1)}MB → ${filename}`,
      );
      res.json({ success: true, recordingUrl, size: buffer.length });
    } catch (err) {
      console.error("[Recording] upload error:", err.message);
      res.status(500).json({ error: "Failed to save recording." });
    }
  },
);

// GET /api/admin/sessions/:id/recording/play — stream the audio file
// Accepts adminKey as query param since <audio> elements can't set headers
router.get("/sessions/:id/recording/play", async (req, res) => {
  const key = req.headers["x-admin-key"] || req.query.adminKey;
  if (!key || key !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({ error: "Unauthorized." });
  }
  try {
    const result = await pool.query(
      "SELECT recording_url FROM interview_sessions WHERE id=$1",
      [req.params.id],
    );
    if (!result.rows.length || !result.rows[0].recording_url) {
      return res.status(404).json({ error: "No recording found." });
    }

    const ext = result.rows[0].recording_url.includes("webm") ? "webm" : "mp4";
    const filepath = path.join(
      RECORDINGS_DIR,
      `recording-${req.params.id}.${ext}`,
    );

    if (!fs.existsSync(filepath))
      return res.status(404).json({ error: "Recording file not found." });

    const stat = fs.statSync(filepath);
    const range = req.headers.range;

    if (range) {
      const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : stat.size - 1;
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
        "Content-Type": "audio/webm",
      });
      fs.createReadStream(filepath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": stat.size,
        "Content-Type": "audio/webm",
      });
      fs.createReadStream(filepath).pipe(res);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to stream recording." });
  }
});

// GET /api/admin/export/csv
router.get("/export/csv", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT q.topic, s.job_role, u.name as candidate, q.question, q.answer, q.score
       FROM interview_qa q
       JOIN interview_sessions s ON q.session_id=s.id
       JOIN users u ON s.user_id=u.id
       WHERE q.answer IS NOT NULL ORDER BY q.created_at DESC`,
    );
    const header = "candidate,job_role,topic,question,answer,score\n";
    const rows = result.rows
      .map((r) =>
        [
          r.candidate,
          r.job_role,
          r.topic,
          `"${(r.question || "").replace(/"/g, '""')}"`,
          `"${(r.answer || "").replace(/"/g, '""')}"`,
          r.score,
        ].join(","),
      )
      .join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="talentlens-export.csv"',
    );
    res.send(header + rows);
  } catch (err) {
    res.status(500).json({ error: "CSV export failed." });
  }
});

// GET /api/admin/export/json
router.get("/export/json", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT q.question, q.answer, q.score, q.topic, s.job_role, u.name as candidate
       FROM interview_qa q
       JOIN interview_sessions s ON q.session_id=s.id
       JOIN users u ON s.user_id=u.id
       WHERE q.answer IS NOT NULL ORDER BY q.created_at DESC`,
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Export failed." });
  }
});

export default router;
