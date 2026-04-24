import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import pool from '../db/index.js';

const router = express.Router();

// POST /api/interviews — create session
router.post('/', requireAuth, async (req, res) => {
  try {
    const { resumeId, jobRole, totalQuestions = 10 } = req.body;
    if (!jobRole) return res.status(400).json({ error: 'jobRole is required.' });

    const result = await pool.query(
      `INSERT INTO interview_sessions (user_id, resume_id, job_role, total_questions)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user.id, resumeId || null, jobRole, totalQuestions]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('[interviews] create error:', err);
    res.status(500).json({ error: 'Failed to create interview session.' });
  }
});

// GET /api/interviews — list user's sessions
router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, job_role, status, total_questions, questions_asked, average_score, created_at, completed_at
       FROM interview_sessions WHERE user_id=$1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions.' });
  }
});

// GET /api/interviews/:id — session detail with Q&A
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const sessionResult = await pool.query(
      'SELECT * FROM interview_sessions WHERE id=$1 AND user_id=$2',
      [req.params.id, req.user.id]
    );
    if (!sessionResult.rows.length) return res.status(404).json({ error: 'Session not found.' });

    const qaResult = await pool.query(
      'SELECT * FROM interview_qa WHERE session_id=$1 ORDER BY question_number',
      [req.params.id]
    );

    res.json({ session: sessionResult.rows[0], qa: qaResult.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch session.' });
  }
});

// GET /api/interviews/:id/report — export Q&A as JSON
router.get('/:id/report', requireAuth, async (req, res) => {
  try {
    const sessionResult = await pool.query(
      'SELECT * FROM interview_sessions WHERE id=$1 AND user_id=$2',
      [req.params.id, req.user.id]
    );
    if (!sessionResult.rows.length) return res.status(404).json({ error: 'Session not found.' });

    const qaResult = await pool.query(
      'SELECT question_number, topic, question, answer, score, feedback FROM interview_qa WHERE session_id=$1 ORDER BY question_number',
      [req.params.id]
    );

    res.json({
      session: sessionResult.rows[0],
      qa: qaResult.rows,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate report.' });
  }
});

export default router;
