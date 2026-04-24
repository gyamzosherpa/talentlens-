import {
  generateResumeQuestion,
  generateFollowUpQuestion,
  getQuizQuestion,
  getDSAChallenge,
  evaluateAnswer,
  generateGreeting,
  generateFinalReport,
  normaliseResume,
  pickQuizQuestions,
} from "./interviewerService.js";
import { DSA_CHALLENGES, pickDSAChallengesForRole } from "./dsaChallenges.js";
import pool from "../db/index.js";

const sessions = new Map();

/**
 * 3-Round Interview:
 *  Round 1: 10 resume questions (skills + experience + projects) + follow-ups if needed
 *  Round 2: 10 MCQ quiz questions
 *  Round 3: 5 DSA coding challenges
 *  End:     Collect candidate feedback on the interview experience
 */

const ROUND1_MAIN = 10;
const ROUND2_TOTAL = 10;
const ROUND3_TOTAL = 5;

export function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    // ── START ─────────────────────────────────────────────────────────────────
    socket.on("start_interview", async (data) => {
      try {
        const {
          sessionId,
          resume,
          jobRole,
          candidateName = "Candidate",
        } = data;
        if (!jobRole) {
          socket.emit("error", { message: "Job role required." });
          return;
        }

        let parsedResume = resume;
        if (typeof resume === "string") {
          try {
            parsedResume = JSON.parse(resume);
          } catch {}
        }
        if (!parsedResume) {
          socket.emit("error", { message: "Resume required." });
          return;
        }

        const r = normaliseResume(parsedResume);
        const quizQuestions = pickQuizQuestions(
          r?.skills || [],
          ROUND2_TOTAL,
          jobRole,
          candidateName,
        );
        const dsaChallenges = pickDSAChallengesForRole(jobRole, ROUND3_TOTAL);

        // Build a balanced pool of Round 1 sources (skills + experience + projects)
        const sources = buildSourcePool(r);

        sessions.set(socket.id, {
          sessionId,
          resume: parsedResume,
          jobRole,
          candidateName,

          round: 0, // 0 = greeting phase

          // Round 1
          r1MainCount: 0,
          r1FollowCount: 0,
          r1AskedTopics: [],
          r1Scores: [],
          r1QALog: [],
          r1Sources: sources,
          r1SourceIndex: 0,
          lastQuestion: null,
          lastAnswer: null,
          awaitingFollowUp: false,

          // Round 2
          quizQuestions,
          r2Index: 0,
          r2Scores: [],
          r2QALog: [],

          // Round 3
          dsaChallenges,
          r3Index: 0,
          r3Scores: [],
          r3QALog: [],

          // End feedback
          collectingFeedback: false,

          questionNumber: 0,
          isFinished: false,
        });

        socket.emit("interview_status", { status: "started" });

        // Greet the candidate warmly before anything else
        const greeting = await generateGreeting({
          candidateName,
          jobRole,
          resume: parsedResume,
        });
        socket.emit("interview_greeting", { message: greeting });
      } catch (err) {
        console.error("[Socket] start_interview:", err);
        socket.emit("error", { message: "Failed to start interview." });
      }
    });

    // Candidate clicks "Start Interview" on greeting screen
    socket.on("begin_round1", async () => {
      const session = sessions.get(socket.id);
      if (!session) return;
      session.round = 1.0;
      socket.emit("round_start", {
        round: 1,
        title: "Round 1: Resume & Experience",
        description: `10 questions covering your skills, work experience, and projects. I may ask follow-up questions if I'd like to know more.`,
        totalRounds: 3,
        waitForReady: true, // client shows 60s countdown before starting
      });
    });

    // Client signals it has shown the round intro and is ready for first question
    socket.on("begin_questions", async () => {
      const session = sessions.get(socket.id);
      if (!session) return;
      if (session.round === 1.0) {
        session.round = 1;
        await sendRound1Question(socket);
      } else if (session.round === 2.0) {
        session.round = 2;
        sendRound2Question(socket);
      } else if (session.round === 3.0) {
        session.round = 3;
        sendRound3Question(socket);
      }
    });

    // ── SUBMIT ANSWER ─────────────────────────────────────────────────────────
    socket.on("submit_answer", async (data) => {
      try {
        const session = sessions.get(socket.id);
        if (!session || session.isFinished) {
          socket.emit("error", { message: "No active session." });
          return;
        }

        const { answer, quizAnswer } = data;

        // End-of-interview structured feedback
        if (session.collectingFeedback) {
          let parsed = {};
          try {
            parsed = typeof answer === "string" ? JSON.parse(answer) : answer;
          } catch {}
          const { rating, difficulty, relevance, wouldRecommend, comments } =
            parsed;

          // Save to interview_feedback table (always insert, even if skipped)
          if (session.sessionId) {
            const feedbackRating =
              rating != null && rating !== undefined ? parseInt(rating) : null;
            const feedbackComments = (comments || "").trim() || null;
            console.log("[Feedback] Saving:", {
              rating: feedbackRating,
              difficulty,
              relevance,
              wouldRecommend,
              comments: feedbackComments,
            });

            pool
              .query(
                `INSERT INTO interview_feedback
                (session_id, rating, difficulty, relevance, would_recommend, comments)
               VALUES ($1,$2,$3,$4,$5,$6)
               ON CONFLICT DO NOTHING`,
                [
                  session.sessionId,
                  feedbackRating,
                  difficulty || null,
                  relevance || null,
                  wouldRecommend != null ? Boolean(wouldRecommend) : null,
                  feedbackComments,
                ],
              )
              .then(() => console.log("[Feedback] Saved successfully"))
              .catch((e) => console.error("[DB] feedback error:", e.message));

            if (feedbackComments) {
              pool
                .query(`UPDATE interview_sessions SET notes=$1 WHERE id=$2`, [
                  feedbackComments,
                  session.sessionId,
                ])
                .catch(() => {});
            }
          }

          socket.emit("feedback_received", { feedback: parsed });
          socket.emit("interview_done", {
            message:
              rating != null
                ? `Thank you for rating your experience ${rating}/10! Your feedback helps us improve. Best of luck! 🎉`
                : `Thank you for completing the interview! Best of luck with your preparation! 🎉`,
          });
          session.isFinished = true;
          return;
        }

        const finalAnswer =
          quizAnswer !== undefined ? String(quizAnswer) : (answer || "").trim();

        // Blank answer → treat as zero, don't block progress
        const effectiveAnswer = finalAnswer || "__BLANK__";

        if (session.round === 1)
          await handleRound1Answer(socket, session, effectiveAnswer);
        else if (session.round === 2)
          await handleRound2Answer(socket, session, effectiveAnswer);
        else if (session.round === 3)
          await handleRound3Answer(socket, session, effectiveAnswer);
      } catch (err) {
        console.error("[Socket] submit_answer:", err);
        socket.emit("error", { message: "Failed to process answer." });
      }
    });

    // Client signals it's ready to move to the next round
    socket.on("next_round", async () => {
      const session = sessions.get(socket.id);
      if (!session) return;

      if (session.round === 1.5) {
        session.round = 2.0;
        socket.emit("round_start", {
          round: 2,
          title: "Round 2: Technical Quiz",
          description: `${ROUND2_TOTAL} multiple choice questions on your technical skills. Select the best answer for each.`,
          totalRounds: 3,
          waitForReady: true,
        });
      } else if (session.round === 2.5) {
        session.round = 3.0;
        socket.emit("round_start", {
          round: 3,
          title: "Round 3: DSA Coding Challenges",
          description: `${ROUND3_TOTAL} algorithm and data structure problems. Write working code and explain your approach.`,
          totalRounds: 3,
          waitForReady: true,
        });
      }
    });

    socket.on("end_interview", async () => {
      const session = sessions.get(socket.id);
      if (session && !session.isFinished)
        await finishInterview(socket, session);
    });

    socket.on("disconnect", () => {
      sessions.delete(socket.id);
      console.log(`[Socket] Disconnected: ${socket.id}`);
    });
  });
}

// ── Build balanced source pool for Round 1 ────────────────────────────────────

function buildSourcePool(r) {
  const pool = [];

  // Add all experience entries
  (r?.experience || []).forEach((e) => {
    pool.push({
      type: "experience",
      company: e.company,
      title: e.title,
      detail: e.description,
      label: e.company ? `${e.title} at ${e.company}` : e.title,
    });
  });

  // Add all projects
  (r?.projects || []).forEach((p) => {
    pool.push({
      type: "project",
      label: p.name,
      name: p.name,
      detail: `${p.description} Tech: ${p.technologies?.join(", ")}`,
    });
  });

  // Add skills (group into batches of 3)
  const skills = r?.skills || [];
  for (let i = 0; i < skills.length; i += 3) {
    pool.push({
      type: "skills",
      label: skills.slice(i, i + 3).join(", "),
      skills: skills.slice(i, i + 3),
    });
  }

  // Shuffle so it's not always experience first
  return pool.sort(() => Math.random() - 0.5);
}

// ── Round 1 ───────────────────────────────────────────────────────────────────

async function sendRound1Question(socket) {
  const session = sessions.get(socket.id);
  if (!session) return;

  session.r1MainCount += 1;
  session.r1FollowCount = 0;
  session.awaitingFollowUp = false;

  // Pick next source, cycling through pool
  const src =
    session.r1Sources[session.r1SourceIndex % session.r1Sources.length];
  session.r1SourceIndex += 1;

  const result = await generateResumeQuestion({
    resume: session.resume,
    jobRole: session.jobRole,
    askedTopics: session.r1AskedTopics,
    questionNumber: session.r1MainCount,
    source: src,
  });

  session.lastQuestion = result.question;
  if (result.topic) session.r1AskedTopics.push(result.topic);
  session.questionNumber += 1;
  const r1QNum = session.questionNumber;
  session.r1QALog.push({
    question: result.question,
    topic: result.topic,
    type: "resume",
    source: src?.type,
    answer: null,
    score: null,
    qNum: r1QNum,
  });
  persistQ(session, result.topic, result.question);

  socket.emit("interview_question", {
    question: result.question,
    topic: result.topic,
    type: "resume",
    round: 1,
    questionNumber: session.r1MainCount,
    totalQuestions: ROUND1_MAIN,
    isFollowUp: false,
    isCoding: false,
    isDSA: false,
    sourceType: src?.type,
    timeLimitSeconds: 600, // 10 minutes
  });
}

async function sendFollowUp(socket, session) {
  session.r1FollowCount += 1;
  session.awaitingFollowUp = true;

  const result = await generateFollowUpQuestion({
    previousQuestion: session.lastQuestion,
    previousAnswer: session.lastAnswer,
    jobRole: session.jobRole,
    resume: session.resume,
  });

  session.lastQuestion = result.question;
  session.questionNumber += 1;
  session.r1QALog.push({
    question: result.question,
    topic: "Follow-up",
    type: "followup",
    answer: null,
    score: null,
    qNum: session.questionNumber,
  });
  persistQ(session, "Follow-up", result.question);

  socket.emit("interview_question", {
    question: result.question,
    topic: "Follow-up",
    type: "followup",
    round: 1,
    questionNumber: session.r1MainCount,
    totalQuestions: ROUND1_MAIN,
    isFollowUp: true,
    isCoding: false,
    isDSA: false,
    timeLimitSeconds: 600, // 10 minutes
  });
}

async function handleRound1Answer(socket, session, answer) {
  const currentQA = session.r1QALog[session.r1QALog.length - 1];
  const ev = isBlankOrOffTopic(answer)
    ? zeroScore(answer)
    : await evaluateAnswer({
        question: currentQA.question,
        answer,
        jobRole: session.jobRole,
        type: currentQA.type,
      });

  currentQA.answer = answer;
  currentQA.score = ev.score;
  session.r1Scores.push(ev.score);
  session.lastAnswer = answer;
  persistAnswer(session, answer, ev, currentQA.qNum);

  socket.emit("answer_evaluation", {
    round: 1,
    evaluation: ev,
    isFollowUp: session.awaitingFollowUp,
  });

  // Follow-up: only on main questions, max 1 per question, answer must be substantive
  const canFollowUp =
    ev.needsFollowUp &&
    !session.awaitingFollowUp &&
    session.r1FollowCount < 1 &&
    answer.trim().length > 30;

  if (canFollowUp) {
    await sleep(800);
    await sendFollowUp(socket, session);
  } else if (session.r1MainCount < ROUND1_MAIN) {
    await sleep(800);
    await sendRound1Question(socket);
  } else {
    // Round 1 complete — pad scores with zeros for any unanswered questions
    const r1Scores = padScores(session.r1Scores, session.r1QALog.length);
    const r1Score = avg(r1Scores);
    session.r1Scores = r1Scores; // update for final report
    await sleep(500);
    session.round = 1.5; // waiting for next_round signal
    socket.emit("round_complete", {
      round: 1,
      score: r1Score,
      totalQA: session.r1QALog.length,
      message: `Round 1 complete! You answered ${session.r1QALog.length} questions (including follow-ups) with an average score of ${r1Score}/10.`,
      nextRound: 2,
    });
  }
}

// ── Round 2 ───────────────────────────────────────────────────────────────────

function sendRound2Question(socket) {
  const session = sessions.get(socket.id);
  if (!session) return;
  const q = getQuizQuestion(session.quizQuestions, session.r2Index);
  if (!q) return;
  session.questionNumber += 1;
  session.r2QALog.push({
    question: q.question,
    topic: q.topic,
    type: "quiz",
    quizMeta: q.quiz,
    answer: null,
    score: null,
    qNum: session.questionNumber,
  });
  persistQ(session, q.topic, q.question);
  socket.emit("interview_question", {
    question: q.question,
    topic: q.topic,
    type: "quiz",
    round: 2,
    questionNumber: session.r2Index + 1,
    totalQuestions: ROUND2_TOTAL,
    isFollowUp: false,
    isCoding: false,
    isDSA: false,
    quiz: q.quiz,
    timeLimitSeconds: 180, // 3 minutes
  });
}

async function handleRound2Answer(socket, session, answer) {
  const currentQA = session.r2QALog[session.r2QALog.length - 1];
  const ev = await evaluateAnswer({
    question: currentQA.question,
    answer,
    jobRole: session.jobRole,
    type: "quiz",
    quizMeta: currentQA.quizMeta,
  });
  currentQA.answer = answer;
  currentQA.score = ev.score;
  session.r2Scores.push(ev.score);
  persistAnswer(session, answer, ev, currentQA.qNum);
  socket.emit("answer_evaluation", {
    round: 2,
    evaluation: ev,
    correct: ev.correct,
    correctAnswer: ev.correctAnswer,
  });
  session.r2Index += 1;

  if (session.r2Index < ROUND2_TOTAL) {
    await sleep(700);
    sendRound2Question(socket);
  } else {
    const r2Scores = padScores(session.r2Scores, ROUND2_TOTAL);
    const r2Score = avg(r2Scores);
    session.r2Scores = r2Scores;
    const correctCount = r2Scores.filter((s) => s === 10).length;
    await sleep(500);
    session.round = 2.5; // waiting for next_round signal
    socket.emit("round_complete", {
      round: 2,
      score: r2Score,
      correctCount,
      totalQuestions: ROUND2_TOTAL,
      message: `Round 2 complete! You got ${correctCount} out of ${ROUND2_TOTAL} correct.`,
      nextRound: 3,
    });
  }
}

// ── Round 3 ───────────────────────────────────────────────────────────────────

function sendRound3Question(socket) {
  const session = sessions.get(socket.id);
  if (!session) return;
  const q = getDSAChallenge(session.dsaChallenges, session.r3Index);
  if (!q) return;

  // Detect SQL questions — they get the SQL editor, not the code editor
  const isSqlQuestion = (q.dsaChallenge?.topic || q.topic || "")
    .toLowerCase()
    .includes("sql");

  // Pick preferred language from candidate's resume skills (only relevant for non-SQL)
  const preferredLang = isSqlQuestion
    ? "sql"
    : [
        "javascript",
        "python",
        "java",
        "csharp",
        "go",
        "rust",
        "kotlin",
        "swift",
        "typescript",
        "cpp",
      ].find((l) =>
        (normaliseResume(session.resume)?.skills || []).some((s) =>
          s.toLowerCase().includes(l),
        ),
      ) || "javascript";

  session.questionNumber += 1;
  session.r3QALog.push({
    question: q.question,
    topic: q.topic,
    type: "dsa",
    dsaMeta: q.dsaChallenge,
    answer: null,
    score: null,
    qNum: session.questionNumber,
  });
  persistQ(session, q.topic, q.question);

  // Send challenge WITHOUT boilerplate — candidate writes from scratch
  // isSql tells the frontend to show the SQL editor instead of code editor
  socket.emit("interview_question", {
    question: q.question,
    topic: q.topic,
    type: "dsa",
    round: 3,
    questionNumber: session.r3Index + 1,
    totalQuestions: ROUND3_TOTAL,
    isFollowUp: false,
    isCoding: true,
    isDSA: true,
    isSql: isSqlQuestion,
    language: preferredLang,
    dsaChallenge: { ...q.dsaChallenge, boilerplate: null }, // no starter code — candidate writes their own
    timeLimitSeconds: 600, // 10 minutes
  });
}

async function handleRound3Answer(socket, session, answer) {
  const currentQA = session.r3QALog[session.r3QALog.length - 1];
  const ev = isBlankOrOffTopic(answer)
    ? zeroScore(answer)
    : await evaluateAnswer({
        question: currentQA.question,
        answer,
        jobRole: session.jobRole,
        type: "dsa",
      });
  currentQA.answer = answer;
  currentQA.score = ev.score;
  session.r3Scores.push(ev.score);
  persistAnswer(session, answer, ev, currentQA.qNum);
  socket.emit("answer_evaluation", { round: 3, evaluation: ev });
  session.r3Index += 1;

  if (session.r3Index < ROUND3_TOTAL) {
    await sleep(800);
    sendRound3Question(socket);
  } else {
    await finishInterview(socket, session);
  }
}

// ── Finish & Feedback ─────────────────────────────────────────────────────────

async function finishInterview(socket, session) {
  const r1Score = avg(session.r1Scores);
  const r2Score = avg(session.r2Scores);
  const r3Score = avg(session.r3Scores);
  const overall = avg([r1Score, r2Score, r3Score]);

  const report = await generateFinalReport({
    candidateName: session.candidateName,
    jobRole: session.jobRole,
    qaLog: [...session.r1QALog, ...session.r2QALog, ...session.r3QALog],
    r1Score,
    r2Score,
    r3Score,
  });

  if (session.sessionId) {
    pool
      .query(
        `UPDATE interview_sessions SET status='completed',average_score=$1,questions_asked=$2,completed_at=NOW(),report=$3 WHERE id=$4`,
        [
          overall,
          session.questionNumber,
          JSON.stringify(report),
          session.sessionId,
        ],
      )
      .catch(() => {});
  }

  socket.emit("interview_complete", {
    summary: {
      candidateName: session.candidateName,
      jobRole: session.jobRole,
      rounds: {
        r1: { score: r1Score, questions: session.r1QALog.length },
        r2: {
          score: r2Score,
          correct: session.r2Scores.filter((s) => s === 10).length,
          total: ROUND2_TOTAL,
        },
        r3: { score: r3Score, questions: session.r3QALog.length },
      },
      overallScore: overall,
      report,
    },
  });

  // After a short pause, ask for feedback
  await sleep(1500);
  session.collectingFeedback = true;
  socket.emit("collect_feedback", {
    message: `Congratulations ${session.candidateName} on completing all 3 rounds! 🎉\n\nBefore we show your report, we'd love to know — how was your experience with this interview? Was it helpful? Any suggestions for improvement?`,
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Pad scores array with zeros for unanswered questions
function padScores(scores, total) {
  const padded = [...scores];
  while (padded.length < total) padded.push(0);
  return padded;
}

// Detect blank or clearly off-topic / boilerplate answers → score 0
function isBlankOrOffTopic(answer) {
  const a = (answer || "").trim();

  // Completely empty or internal blank/skip marker
  if (!a || a === "__BLANK__" || a === "__SKIP__" || a.length < 3) return true;

  // Pure boilerplate code that was never modified
  const boilerplateSignals = [
    "function solution() {",
    "// your code here",
    "# your code here",
    "your code here",
    "def solution():",
    "public class Solution {",
    "SELECT *",
    "FROM table_name",
    "// Write your",
    "# Write your",
    "console.log(solution())",
    "print(solution())",
  ];
  const lower = a.toLowerCase();
  if (boilerplateSignals.some((sig) => a.includes(sig) && a.length < 200))
    return true;

  // Common dodge phrases
  const dodges = [
    "i don't know",
    "idk",
    "no idea",
    "not sure",
    "skip",
    "pass",
    "n/a",
    "na",
    "none",
    "nothing",
    "no answer",
    "i have no",
    "don't know",
    "do not know",
    "unsure",
    "cant answer",
    "can't answer",
    "i am not sure",
    "i'm not sure",
    "no comment",
    "...",
    ".",
  ];
  if (dodges.some((p) => lower === p || lower === p + ".")) return true;

  // Suspiciously short with no substance (less than 3 words)
  if (a.split(/\s+/).filter((w) => w.length > 1).length < 3) return true;

  return false;
}

function zeroScore(answer) {
  const skipped = (answer || "").trim() === "__SKIP__";
  return {
    score: 0,
    feedback: skipped
      ? "This question was skipped."
      : "No answer was provided for this question.",
    strengths: "",
    improvements: skipped
      ? ""
      : "Please provide a relevant, detailed answer to the question.",
    needsFollowUp: false,
    followUpReason: "",
  };
}

function avg(arr) {
  if (!arr.length) return 0;
  return parseFloat((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1));
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function persistQ(session, topic, question) {
  if (!session.sessionId) return;
  pool
    .query(
      `INSERT INTO interview_qa (session_id, question_number, topic, question) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING`,
      [session.sessionId, session.questionNumber, topic, question],
    )
    .catch(() => {});
}

function persistAnswer(session, answer, ev, qNum) {
  if (!session.sessionId) return;
  pool
    .query(
      `UPDATE interview_qa SET answer=$1,score=$2,feedback=$3,strengths=$4,improvements=$5 WHERE session_id=$6 AND question_number=$7`,
      [
        answer,
        ev.score,
        ev.feedback,
        ev.strengths,
        ev.improvements,
        session.sessionId,
        qNum,
      ],
    )
    .catch(() => {});
}
