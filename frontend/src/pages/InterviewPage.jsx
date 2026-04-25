import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CodeEditor from "../components/CodeEditor";
import CameraFeed from "../components/CameraFeed";
import api from "../services/api";
import { createSocket, disconnectSocket } from "../services/socket";
import useSpeech from "../hooks/useSpeech";
import useRecording from "../hooks/useRecording";
import {
  Send,
  StopCircle,
  CheckCircle,
  Loader,
  AlertCircle,
  CornerDownRight,
  Code2,
  Brain,
  BookOpen,
  Trophy,
  ChevronRight,
  Star,
  MessageSquare,
  Database,
} from "lucide-react";
import SpeechInput from "../components/SpeechInput";
import QuestionTimer from "../components/QuestionTimer";
import SqlEditor from "../components/SqlEditor";
import useQuestionTimer from "../hooks/useQuestionTimer";

const ROUND_META = {
  1: {
    label: "Round 1",
    title: "Resume & Experience",
    icon: BookOpen,
    color: "var(--accent)",
    bg: "rgba(110,231,183,0.1)",
  },
  2: {
    label: "Round 2",
    title: "Technical Quiz",
    icon: Brain,
    color: "#c084fc",
    bg: "rgba(192,132,252,0.1)",
  },
  3: {
    label: "Round 3",
    title: "DSA Challenges",
    icon: Code2,
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.1)",
  },
};

export default function InterviewPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const {
    speak,
    stop,
    speaking,
    supported: speechSupported,
    audioEnabled,
    toggle: toggleAudio,
  } = useSpeech();
  const adminKey = localStorage.getItem("tl_admin_key") || "";
  const {
    start: startRecording,
    stop: stopRecording,
    recording: isRecording,
    uploading: isUploading,
    uploaded: isUploaded,
  } = useRecording(sessionId, adminKey);

  const [phase, setPhase] = useState("connecting");
  const [round, setRound] = useState(1);
  const [roundInfo, setRoundInfo] = useState(null);
  const [roundCompleteData, setRoundCompleteData] = useState(null);
  const [countdown, setCountdown] = useState(60);
  const [introCountdown, setIntroCountdown] = useState(60);
  const [greeting, setGreeting] = useState("");
  const [feedbackPrompt, setFeedbackPrompt] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [fbRating, setFbRating] = useState(null);
  const [fbDifficulty, setFbDifficulty] = useState("");
  const [fbRelevance, setFbRelevance] = useState("");
  const [fbRecommend, setFbRecommend] = useState(null);
  const [interviewDoneMsg, setInterviewDoneMsg] = useState("");

  const [question, setQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [topic, setTopic] = useState("");
  const [questionType, setQuestionType] = useState("resume");
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [isDSA, setIsDSA] = useState(false);
  const [isSql, setIsSql] = useState(false);
  const [dsaChallenge, setDsaChallenge] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [quizData, setQuizData] = useState(null);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(600);
  const [timerKey, setTimerKey] = useState(0); // increments each question to force timer reset
  const [selectedOption, setSelectedOption] = useState(null);

  const [answer, setAnswer] = useState("");
  const [codeAnswer, setCodeAnswer] = useState("");
  const [answerMode, setAnswerMode] = useState("text");
  const [evaluation, setEvaluation] = useState(null);
  const [lastCorrect, setLastCorrect] = useState(null);

  const [error, setError] = useState("");
  const [resumeInfo, setResumeInfo] = useState(null);
  const [scores, setScores] = useState({ r1: [], r2: [], r3: [] });

  const textRef = useRef(null);
  const socketRef = useRef(null);
  const countdownRef = useRef(null);
  const introCountdownRef = useRef(null);

  // Question timer — auto-submit when expired
  const {
    formattedTime,
    timeLeft,
    isWarning,
    isDanger,
    reset: resetTimer,
  } = useQuestionTimer(
    timeLimitSeconds,
    timerKey,
    () => {
      // Time expired — submit whatever is there (or blank)
      if (phase === "question" || phase === "starting") submitAnswer();
    },
    phase === "question",
  );

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const sessionRes = await api.get(`/interviews/${sessionId}`);
        const { session } = sessionRes.data;

        let parsedResume = null;
        const cached = sessionStorage.getItem(`resume_${sessionId}`);
        if (cached) {
          try {
            parsedResume = JSON.parse(cached);
          } catch {}
        }
        if (!parsedResume && session.resume_id) {
          const rr = await api.get(`/resumes/${session.resume_id}`);
          const raw = rr.data.parsed_data;
          try {
            parsedResume = typeof raw === "string" ? JSON.parse(raw) : raw;
          } catch {
            parsedResume = raw;
          }
        }
        if (!parsedResume) {
          if (mounted)
            setError("No resume found. Please go back and upload one.");
          return;
        }
        if (mounted)
          setResumeInfo({
            name: parsedResume?.name,
            skills: parsedResume?.skills?.slice(0, 4) || [],
          });

        const sock = createSocket();
        socketRef.current = sock;

        sock.on("connect", () => {
          if (!mounted) return;
          sock.emit("start_interview", {
            sessionId,
            resume: parsedResume,
            jobRole: session.job_role,
            candidateName: parsedResume?.name || "Candidate",
          });
        });

        sock.on("interview_greeting", ({ message }) => {
          if (!mounted) return;
          setGreeting(message);
          setPhase("greeting");
          speak(message);
          startRecording(); // begin audio recording
        });

        sock.on("round_start", (data) => {
          if (!mounted) return;
          clearInterval(introCountdownRef.current); // clear any previous countdown
          setRound(Math.floor(data.round));
          setRoundInfo(data);
          setPhase("round_intro");
          setRoundCompleteData(null);
          speak(`${data.title}. ${data.description}`);

          if (data.waitForReady) {
            let secs = 60;
            setIntroCountdown(secs);
            introCountdownRef.current = setInterval(() => {
              secs -= 1;
              setIntroCountdown(secs);
              if (secs <= 0) {
                clearInterval(introCountdownRef.current);
                sock.emit("begin_questions");
              }
            }, 1000);
          }
        });

        sock.on("interview_question", (data) => {
          if (!mounted) return;

          console.log(
            "[UI] interview_question received:",
            data.questionNumber,
            data.type,
            data.question?.slice(0, 60),
          );

          // Stop intro countdown immediately
          clearInterval(introCountdownRef.current);

          const questionText = String(data.question || "");

          // Clear evaluation first so previous score doesn't flash on new question
          setEvaluation(null);
          setLastCorrect(null);

          // Batch all state updates before setting phase to 'question'
          // so everything is ready when the question card renders
          setQuestion(questionText);
          setQuestionNumber(data.questionNumber || 1);
          setTotalQuestions(data.totalQuestions || 10);
          setTopic(data.topic || "");
          setQuestionType(data.type || "resume");
          setIsFollowUp(!!data.isFollowUp);
          setIsDSA(!!data.isDSA);
          setIsSql(!!data.isSql);
          setDsaChallenge(data.dsaChallenge || null);
          setLanguage(data.language || "javascript");
          setQuizData(data.quiz || null);
          setSelectedOption(null);
          setAnswer("");
          setCodeAnswer("");
          setAnswerMode(data.isDSA ? "both" : "text");
          setTimeLimitSeconds(
            data.timeLimitSeconds || (data.type === "quiz" ? 180 : 600),
          );
          setTimerKey((k) => k + 1);
          setEvaluation(null);
          setLastCorrect(null);
          setShowHint(false);
          setPhase("question");

          if (data.type !== "quiz") {
            speak(
              (data.isFollowUp
                ? "Follow-up. "
                : `Question ${data.questionNumber}. `) + questionText,
            );
          }
          setTimeout(() => textRef.current?.focus(), 150);
        });

        sock.on("answer_evaluation", (data) => {
          if (!mounted) return;
          setEvaluation(data.evaluation);
          setLastCorrect(data.correct ?? null);
          setScores((prev) => {
            const k = `r${data.round}`;
            return {
              ...prev,
              [k]: [...(prev[k] || []), data.evaluation.score],
            };
          });
          setPhase("evaluating");
        });

        sock.on("round_complete", (data) => {
          if (!mounted) return;
          setRoundCompleteData(data);
          setCountdown(60);
          setPhase("round_complete");
          speak(data.message);

          // Start 60-second countdown then auto-advance
          let secs = 60;
          countdownRef.current = setInterval(() => {
            secs -= 1;
            setCountdown(secs);
            if (secs <= 0) {
              clearInterval(countdownRef.current);
              sock.emit("next_round");
            }
          }, 1000);
        });

        sock.on("interview_complete", (data) => {
          if (!mounted) return;
          stopRecording(); // end recording
          setPhase("interview_complete");
          speak("All rounds complete! Excellent work.");
          // Navigate to results after feedback
        });

        sock.on("collect_feedback", ({ message }) => {
          if (!mounted) return;
          setFeedbackPrompt(message);
          setPhase("feedback");
          speak(message);
        });

        sock.on("feedback_received", () => {});

        sock.on("interview_done", ({ message }) => {
          if (!mounted) return;
          setInterviewDoneMsg(message);
          setPhase("done");
          speak(message);
          sessionStorage.removeItem(`resume_${sessionId}`);
          setTimeout(() => navigate(`/results/${sessionId}`), 4000);
        });

        sock.on("error", ({ message }) => {
          if (mounted) setError(message);
        });
        sock.connect();
      } catch (err) {
        if (mounted)
          setError("Failed to load session. Please go back and try again.");
      }
    }

    init();
    return () => {
      disconnectSocket();
      clearInterval(countdownRef.current);
      clearInterval(introCountdownRef.current);
    };
  }, [sessionId, navigate]);

  const beginRound1 = () => {
    setPhase("starting");
    socketRef.current?.emit("begin_round1");
  };

  // Called by SpeechInput when a final transcript arrives — appends to current answer
  const handleTranscript = useCallback((text) => {
    setAnswer((prev) => {
      const trimmed = prev.trim();
      return trimmed ? trimmed + " " + text.trim() : text.trim();
    });
  }, []);

  const proceedNow = () => {
    clearInterval(countdownRef.current);
    setCountdown(0);
    socketRef.current?.emit("next_round");
  };

  const startQuestionsNow = () => {
    clearInterval(introCountdownRef.current);
    setIntroCountdown(0);
    // Don't change phase here — wait for interview_question to set it to 'question'
    socketRef.current?.emit("begin_questions");
  };

  const submitAnswer = useCallback(() => {
    if (phase === "feedback") {
      stop();
      const payload = JSON.stringify({
        rating: fbRating,
        difficulty: fbDifficulty,
        relevance: fbRelevance,
        wouldRecommend: fbRecommend,
        comments: feedbackText,
      });
      socketRef.current?.emit("submit_answer", { answer: payload });
      return;
    }
    if (phase !== "question" && phase !== "starting" && phase !== "evaluating")
      return;
    stop();

    if (questionType === "quiz") {
      if (selectedOption === null) return;
      setPhase("evaluating");
      socketRef.current?.emit("submit_answer", { quizAnswer: selectedOption });
      return;
    }

    let finalAnswer = answer.trim();
    const code = codeAnswer.trim();

    // Combine text + code if both present
    if (code) {
      finalAnswer = finalAnswer
        ? `${finalAnswer}\n\n--- Code ---\n${code}`
        : code;
    }

    // Allow empty submissions in all rounds — sends __SKIP__ for zero score
    if (!finalAnswer) {
      finalAnswer = "__SKIP__";
    }

    setPhase("evaluating");
    socketRef.current?.emit("submit_answer", {
      answer: finalAnswer,
      isCoding: !!code,
      language: isDSA ? language : undefined,
      isSql: isDSA ? isSql : undefined,
    });
  }, [
    phase,
    questionType,
    selectedOption,
    answer,
    codeAnswer,
    isDSA,
    feedbackText,
    stop,
  ]);

  const handleKey = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submitAnswer();
  };

  const progress = totalQuestions ? (questionNumber / totalQuestions) * 100 : 0;
  const avgScore = (arr) =>
    arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : "—";

  const activePhases = [
    "greeting",
    "round_intro",
    "starting",
    "question",
    "evaluating",
    "round_complete",
    "interview_complete",
    "feedback",
    "done",
  ];
  // True when the question is ready to interact with — handles race between
  // question arriving and phase state updating
  const isActiveQuestion = phase === "question";

  return (
    <div>
      <Navbar />
      <div className="page">
        <div className="container" style={{ maxWidth: 780 }}>
          {/* Resume info + audio toggle */}
          {resumeInfo && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
                background: "var(--accent-dim)",
                border: "1px solid rgba(110,231,183,0.2)",
                borderRadius: 8,
                padding: "8px 14px",
                marginBottom: 20,
                fontSize: 13,
              }}
            >
              <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                📄
              </span>
              <span style={{ fontWeight: 500 }}>{resumeInfo.name}</span>
              {isRecording && (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 12,
                    color: "var(--red)",
                    marginLeft: 4,
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "var(--red)",
                      animation: "pulse-ring 1.2s infinite",
                      display: "inline-block",
                    }}
                  />
                  REC
                </span>
              )}
              {isUploading && (
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    marginLeft: 4,
                  }}
                >
                  ⬆ Saving recording…
                </span>
              )}
              {isUploaded && !isUploading && (
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--accent)",
                    marginLeft: 4,
                  }}
                >
                  ✓ Recording saved
                </span>
              )}
              {resumeInfo.skills.length > 0 && (
                <span style={{ color: "var(--text-muted)" }}>
                  · {resumeInfo.skills.join(", ")}
                </span>
              )}
              {speechSupported && (
                <button
                  onClick={toggleAudio}
                  style={{
                    marginLeft: "auto",
                    fontSize: 12,
                    padding: "3px 10px",
                    borderRadius: 5,
                    border: "none",
                    cursor: "pointer",
                    background: audioEnabled
                      ? "rgba(110,231,183,0.15)"
                      : "var(--navy-3)",
                    color: audioEnabled ? "var(--accent)" : "var(--text-muted)",
                  }}
                >
                  {audioEnabled
                    ? speaking
                      ? "🔊 Speaking…"
                      : "🔉 AI Voice"
                    : "🔇 Muted"}
                </button>
              )}
            </div>
          )}

          {/* Round progress strip */}
          {activePhases.includes(phase) && phase !== "greeting" && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                {[1, 2, 3].map((r) => (
                  <div
                    key={r}
                    style={{
                      flex: 1,
                      height: 5,
                      borderRadius: 3,
                      overflow: "hidden",
                      background: "var(--navy-3)",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: 3,
                        transition: "width 0.6s",
                        background: ROUND_META[r].color,
                        opacity: round > r ? 1 : round === r ? 0.9 : 0.15,
                        width:
                          round > r
                            ? "100%"
                            : round === r
                              ? `${progress}%`
                              : "0%",
                      }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {[1, 2, 3].map((r) => {
                  const m = ROUND_META[r];
                  const active = round === r;
                  const done = round > r;
                  return (
                    <div
                      key={r}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 10px",
                        borderRadius: 8,
                        background: active ? m.bg : "transparent",
                        border: `1px solid ${active ? m.color + "40" : "transparent"}`,
                        opacity: done ? 0.6 : 1,
                        transition: "all 0.3s",
                      }}
                    >
                      {done ? (
                        <CheckCircle size={14} color={m.color} />
                      ) : (
                        <m.icon
                          size={14}
                          color={active ? m.color : "var(--text-muted)"}
                        />
                      )}
                      <div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "var(--text-muted)",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {m.label}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: active ? m.color : "var(--text-muted)",
                          }}
                        >
                          {m.title}
                        </div>
                      </div>
                      {(done || active) && scores[`r${r}`]?.length > 0 && (
                        <span
                          style={{
                            marginLeft: "auto",
                            fontSize: 12,
                            color: m.color,
                            fontWeight: 700,
                          }}
                        >
                          {avgScore(scores[`r${r}`])}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                background: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.2)",
                borderRadius: 8,
                padding: "12px 16px",
                marginBottom: 24,
                color: "var(--red)",
                fontSize: 14,
              }}
            >
              <AlertCircle size={15} /> {error}
            </div>
          )}

          {/* ── CONNECTING ── */}
          {phase === "connecting" && !error && (
            <div
              className="card"
              style={{ textAlign: "center", padding: "4rem" }}
            >
              <Loader
                size={40}
                className="spin"
                color="var(--accent)"
                style={{ margin: "0 auto 20px" }}
              />
              <h2 style={{ marginBottom: 8 }}>Preparing your interview…</h2>
              <p style={{ color: "var(--text-muted)" }}>
                Loading resume and setting up 3 rounds
              </p>
            </div>
          )}

          {/* ── GREETING ── */}
          {phase === "greeting" && (
            <div className="card fade-up" style={{ padding: "2.5rem" }}>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "var(--accent-dim)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <span style={{ fontSize: 34 }}>👋</span>
                </div>
                <p
                  style={{
                    fontSize: 17,
                    lineHeight: 1.8,
                    color: "var(--text)",
                  }}
                >
                  {greeting}
                </p>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 12,
                  }}
                >
                  Today's Interview Structure
                </h3>
                {[
                  {
                    r: 1,
                    desc: "10 questions on your work experience, projects & skills. Follow-up questions if needed.",
                    count: "10 Q&A",
                  },
                  {
                    r: 2,
                    desc: "10 multiple choice questions testing your technical knowledge.",
                    count: "10 MCQ",
                  },
                  {
                    r: 3,
                    desc: "5 algorithm and data structure coding challenges.",
                    count: "5 DSA",
                  },
                ].map(({ r, desc, count }) => {
                  const m = ROUND_META[r];
                  return (
                    <div
                      key={r}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: "12px 14px",
                        borderRadius: 10,
                        background: "var(--navy-3)",
                        border: `1px solid ${m.color}25`,
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: m.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <m.icon size={16} color={m.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 3,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: m.color,
                            }}
                          >
                            {m.label}: {m.title}
                          </span>
                          <span
                            className="badge badge-muted"
                            style={{ fontSize: 11 }}
                          >
                            {count}
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: 13,
                            color: "var(--text-muted)",
                            margin: 0,
                          }}
                        >
                          {desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                className="btn btn-primary"
                onClick={beginRound1}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  fontSize: 16,
                  padding: "14px",
                }}
              >
                Start Interview <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* ── ROUND INTRO ── */}
          {(phase === "starting" || phase === "round_intro") && roundInfo && (
            <div
              className="card fade-up"
              style={{ textAlign: "center", padding: "3rem" }}
            >
              {(() => {
                const m = ROUND_META[Math.floor(roundInfo.round || round)];
                return (
                  <>
                    {/* Icon with countdown ring */}
                    <div
                      style={{
                        position: "relative",
                        width: 80,
                        height: 80,
                        margin: "0 auto 20px",
                      }}
                    >
                      <div
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          background: m.bg,
                          border: `3px solid ${m.color}30`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <m.icon size={34} color={m.color} />
                      </div>
                      {roundInfo.waitForReady && introCountdown > 0 && (
                        <svg
                          style={{ position: "absolute", inset: -3 }}
                          width={86}
                          height={86}
                          viewBox="0 0 86 86"
                        >
                          <circle
                            cx={43}
                            cy={43}
                            r={40}
                            fill="none"
                            stroke={m.color}
                            strokeWidth={3}
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - introCountdown / 60)}`}
                            strokeLinecap="round"
                            transform="rotate(-90 43 43)"
                            style={{
                              transition: "stroke-dashoffset 1s linear",
                            }}
                          />
                        </svg>
                      )}
                    </div>

                    <span
                      className="badge"
                      style={{
                        background: m.bg,
                        color: m.color,
                        marginBottom: 12,
                        fontSize: 13,
                      }}
                    >
                      {m.label} of 3
                    </span>
                    <h2 style={{ fontSize: "1.7rem", marginBottom: 10 }}>
                      {roundInfo.title}
                    </h2>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        marginBottom: 28,
                        maxWidth: 500,
                        margin: "0 auto 28px",
                        lineHeight: 1.7,
                      }}
                    >
                      {roundInfo.description}
                    </p>

                    {roundInfo.waitForReady ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{ fontSize: 14, color: "var(--text-muted)" }}
                        >
                          Starting in{" "}
                          <span
                            style={{
                              color: m.color,
                              fontWeight: 700,
                              fontFamily: "Syne",
                              fontSize: 18,
                            }}
                          >
                            {introCountdown}s
                          </span>
                        </div>
                        <button
                          onClick={startQuestionsNow}
                          className="btn btn-primary"
                          style={{ padding: "10px 28px", fontSize: 14 }}
                        >
                          Start Now <ChevronRight size={16} />
                        </button>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          justifyContent: "center",
                          color: "var(--text-muted)",
                          fontSize: 14,
                        }}
                      >
                        <Loader size={15} className="spin" /> Preparing first
                        question…
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* ── ROUND COMPLETE ── */}
          {phase === "round_complete" && roundCompleteData && (
            <div
              className="card fade-up"
              style={{ textAlign: "center", padding: "3rem" }}
            >
              {(() => {
                const m = ROUND_META[roundCompleteData.round];
                return (
                  <>
                    {/* Icon */}
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: m.bg,
                        border: `3px solid ${m.color}40`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px",
                        position: "relative",
                      }}
                    >
                      <CheckCircle size={40} color={m.color} />
                      {/* Countdown ring */}
                      <svg
                        style={{ position: "absolute", inset: -3 }}
                        width={86}
                        height={86}
                        viewBox="0 0 86 86"
                      >
                        <circle
                          cx={43}
                          cy={43}
                          r={40}
                          fill="none"
                          stroke={m.color}
                          strokeWidth={3}
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - countdown / 60)}`}
                          strokeLinecap="round"
                          transform="rotate(-90 43 43)"
                          style={{ transition: "stroke-dashoffset 1s linear" }}
                        />
                      </svg>
                    </div>

                    <h2
                      style={{
                        fontSize: "1.8rem",
                        marginBottom: 6,
                        color: m.color,
                      }}
                    >
                      Round {roundCompleteData.round} Complete! 🎉
                    </h2>
                    <p
                      style={{
                        fontSize: 15,
                        color: "var(--text-muted)",
                        marginBottom: 24,
                      }}
                    >
                      {roundCompleteData.message}
                    </p>

                    {/* Score cards */}
                    <div
                      style={{
                        display: "flex",
                        gap: 16,
                        justifyContent: "center",
                        flexWrap: "wrap",
                        marginBottom: 28,
                      }}
                    >
                      <div
                        style={{
                          background: "var(--navy-3)",
                          border: `1px solid ${m.color}30`,
                          borderRadius: 12,
                          padding: "20px 32px",
                          textAlign: "center",
                          minWidth: 130,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--text-muted)",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 6,
                          }}
                        >
                          Avg Score
                        </div>
                        <div
                          style={{
                            fontFamily: "Syne",
                            fontSize: "2.4rem",
                            fontWeight: 800,
                            color: m.color,
                          }}
                        >
                          {roundCompleteData.score}
                          <span
                            style={{
                              fontSize: "1.2rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            /10
                          </span>
                        </div>
                      </div>
                      {roundCompleteData.correctCount !== undefined && (
                        <div
                          style={{
                            background: "var(--navy-3)",
                            border: `1px solid ${m.color}30`,
                            borderRadius: 12,
                            padding: "20px 32px",
                            textAlign: "center",
                            minWidth: 130,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 11,
                              color: "var(--text-muted)",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              marginBottom: 6,
                            }}
                          >
                            Correct
                          </div>
                          <div
                            style={{
                              fontFamily: "Syne",
                              fontSize: "2.4rem",
                              fontWeight: 800,
                              color: m.color,
                            }}
                          >
                            {roundCompleteData.correctCount}
                            <span
                              style={{
                                fontSize: "1.2rem",
                                color: "var(--text-muted)",
                              }}
                            >
                              /{roundCompleteData.totalQuestions}
                            </span>
                          </div>
                        </div>
                      )}
                      {roundCompleteData.totalQA > 0 && (
                        <div
                          style={{
                            background: "var(--navy-3)",
                            border: `1px solid ${m.color}30`,
                            borderRadius: 12,
                            padding: "20px 32px",
                            textAlign: "center",
                            minWidth: 130,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 11,
                              color: "var(--text-muted)",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              marginBottom: 6,
                            }}
                          >
                            Questions
                          </div>
                          <div
                            style={{
                              fontFamily: "Syne",
                              fontSize: "2.4rem",
                              fontWeight: 800,
                              color: m.color,
                            }}
                          >
                            {roundCompleteData.totalQA}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Countdown + Continue button */}
                    {roundCompleteData.nextRound && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{ fontSize: 13, color: "var(--text-muted)" }}
                        >
                          Next round starts in{" "}
                          <span
                            style={{
                              color: m.color,
                              fontWeight: 700,
                              fontFamily: "Syne",
                              fontSize: 16,
                            }}
                          >
                            {countdown}s
                          </span>
                        </div>
                        <button
                          onClick={proceedNow}
                          className="btn btn-primary"
                          style={{ padding: "10px 28px", fontSize: 14 }}
                        >
                          Continue to Round {roundCompleteData.nextRound}{" "}
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* ── ACTIVE QUESTION ── */}
          {(phase === "question" || phase === "evaluating") && (
            <div className="card fade-up">
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                }}
              >
                {/* Left: question type badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  {isFollowUp ? (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "rgba(251,191,36,0.12)",
                        border: "1px solid rgba(251,191,36,0.3)",
                        borderRadius: 8,
                        padding: "4px 12px",
                        fontSize: 13,
                        color: "var(--gold)",
                      }}
                    >
                      <CornerDownRight size={13} /> Follow-up Question
                    </span>
                  ) : questionType === "quiz" ? (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "rgba(192,132,252,0.12)",
                        border: "1px solid rgba(192,132,252,0.3)",
                        borderRadius: 8,
                        padding: "4px 12px",
                        fontSize: 13,
                        color: "#c084fc",
                      }}
                    >
                      <Brain size={13} /> Quiz · Q{questionNumber}/
                      {totalQuestions}
                    </span>
                  ) : isDSA ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          background: "rgba(96,165,250,0.12)",
                          border: "1px solid rgba(96,165,250,0.3)",
                          borderRadius: 8,
                          padding: "4px 12px",
                          fontSize: 13,
                          color: "#60a5fa",
                        }}
                      >
                        <Code2 size={13} /> DSA · {questionNumber}/
                        {totalQuestions}
                      </span>
                      {dsaChallenge && (
                        <>
                          <span
                            style={{
                              fontSize: 12,
                              padding: "3px 10px",
                              borderRadius: 6,
                              fontWeight: 600,
                              background:
                                dsaChallenge.difficulty === "Easy"
                                  ? "rgba(110,231,183,0.12)"
                                  : "rgba(251,191,36,0.12)",
                              color:
                                dsaChallenge.difficulty === "Easy"
                                  ? "var(--accent)"
                                  : "var(--gold)",
                              border: `1px solid ${dsaChallenge.difficulty === "Easy" ? "rgba(110,231,183,0.2)" : "rgba(251,191,36,0.2)"}`,
                            }}
                          >
                            {dsaChallenge.difficulty}
                          </span>
                          <span
                            style={{ fontSize: 12, color: "var(--text-muted)" }}
                          >
                            {dsaChallenge.topic}
                          </span>
                        </>
                      )}
                    </div>
                  ) : (
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "var(--accent)",
                          color: "var(--navy)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "Syne",
                          fontWeight: 700,
                          fontSize: 13,
                        }}
                      >
                        {questionNumber}
                      </div>
                      <span
                        style={{ fontSize: 13, color: "var(--text-muted)" }}
                      >
                        of {totalQuestions}
                      </span>
                      {topic && (
                        <span
                          className="badge badge-muted"
                          style={{ fontSize: 11 }}
                        >
                          {topic}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {/* Right: timer */}
                {isActiveQuestion && timeLimitSeconds > 0 && (
                  <QuestionTimer
                    formattedTime={formattedTime}
                    timeLeft={timeLeft}
                    timeLimitSeconds={timeLimitSeconds}
                    isWarning={isWarning}
                    isDanger={isDanger}
                  />
                )}
              </div>

              {question ? (
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.85,
                    fontWeight: 500,
                    marginBottom: 16,
                    whiteSpace: "pre-line",
                  }}
                >
                  {question}
                </p>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 16,
                    color: "var(--text-muted)",
                  }}
                >
                  <Loader size={16} className="spin" />{" "}
                  <span>Loading question…</span>
                </div>
              )}

              {/* No hints shown — candidate solves independently */}

              {/* Evaluation */}
              {evaluation && (
                <div
                  style={{
                    marginBottom: 14,
                    background: "var(--navy-3)",
                    borderRadius: 12,
                    padding: "1.25rem",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>
                      {questionType === "quiz"
                        ? lastCorrect
                          ? "✅ Correct!"
                          : "❌ Incorrect"
                        : "Your Score"}
                    </span>
                    {questionType !== "quiz" && (
                      <span
                        style={{
                          fontFamily: "Syne",
                          fontWeight: 800,
                          fontSize: 22,
                          color:
                            evaluation.score >= 7
                              ? "var(--accent)"
                              : evaluation.score >= 5
                                ? "var(--gold)"
                                : "var(--red)",
                        }}
                      >
                        {evaluation.score}/10
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--text-muted)",
                      marginBottom:
                        evaluation.strengths || evaluation.improvements
                          ? 10
                          : 0,
                    }}
                  >
                    {evaluation.feedback}
                  </p>
                  {(evaluation.strengths || evaluation.improvements) && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 8,
                      }}
                    >
                      {evaluation.strengths && (
                        <div
                          style={{
                            background: "rgba(110,231,183,0.06)",
                            borderRadius: 8,
                            padding: "8px 12px",
                            fontSize: 13,
                          }}
                        >
                          <span
                            style={{ color: "var(--accent)", fontWeight: 600 }}
                          >
                            ✓{" "}
                          </span>
                          {evaluation.strengths}
                        </div>
                      )}
                      {evaluation.improvements && (
                        <div
                          style={{
                            background: "rgba(251,191,36,0.06)",
                            borderRadius: 8,
                            padding: "8px 12px",
                            fontSize: 13,
                          }}
                        >
                          <span
                            style={{ color: "var(--gold)", fontWeight: 600 }}
                          >
                            ↗{" "}
                          </span>
                          {evaluation.improvements}
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 13,
                      color: "var(--text-muted)",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Loader size={13} className="spin" />
                    {evaluation.needsFollowUp
                      ? "Preparing follow-up…"
                      : "Loading next question…"}
                  </div>
                </div>
              )}

              {/* Answer area */}
              {isActiveQuestion && (
                <>
                  {/* Quiz MCQ */}
                  {questionType === "quiz" && quizData && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        marginBottom: 14,
                      }}
                    >
                      {quizData.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedOption(i)}
                          style={{
                            padding: "12px 16px",
                            borderRadius: 10,
                            textAlign: "left",
                            cursor: "pointer",
                            fontSize: 14,
                            transition: "all 0.15s",
                            border: `2px solid ${selectedOption === i ? "#c084fc" : "var(--border)"}`,
                            background:
                              selectedOption === i
                                ? "rgba(192,132,252,0.1)"
                                : "var(--navy-3)",
                            color:
                              selectedOption === i ? "#c084fc" : "var(--text)",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 700,
                              marginRight: 10,
                              color: "var(--text-muted)",
                            }}
                          >
                            {String.fromCharCode(65 + i)}.
                          </span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Round 3 DSA — SQL editor for SQL questions, code editor for others */}
                  {isDSA && isSql && (
                    <div style={{ marginBottom: 12 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 8,
                          padding: "6px 10px",
                          background: "rgba(96,165,250,0.06)",
                          border: "1px solid rgba(96,165,250,0.15)",
                          borderRadius: 7,
                        }}
                      >
                        <Database size={13} color="#60a5fa" />
                        <span
                          style={{
                            fontSize: 12,
                            color: "#60a5fa",
                            fontWeight: 600,
                          }}
                        >
                          SQL Editor
                        </span>
                        <span
                          style={{ fontSize: 12, color: "var(--text-muted)" }}
                        >
                          — write your query here, leave blank to skip
                        </span>
                      </div>
                      <SqlEditor value={codeAnswer} onChange={setCodeAnswer} />
                    </div>
                  )}
                  {isDSA && !isSql && (
                    <div style={{ marginBottom: 12 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 8,
                          padding: "6px 10px",
                          background: "rgba(110,231,183,0.06)",
                          border: "1px solid rgba(110,231,183,0.15)",
                          borderRadius: 7,
                        }}
                      >
                        <Code2 size={13} color="var(--accent)" />
                        <span
                          style={{
                            fontSize: 12,
                            color: "var(--accent)",
                            fontWeight: 600,
                          }}
                        >
                          Code Editor
                        </span>
                        <span
                          style={{ fontSize: 12, color: "var(--text-muted)" }}
                        >
                          — write your solution here, leave blank to skip
                        </span>
                      </div>
                      <CodeEditor
                        language={language}
                        onCodeChange={setCodeAnswer}
                        onLanguageChange={setLanguage}
                        initialCode={null}
                        startBlank={true}
                        questionContext={question}
                      />
                    </div>
                  )}

                  {/* Round 1 — speech + text + always-visible code editor */}
                  {!isDSA && questionType !== "quiz" && (
                    <>
                      <div style={{ marginBottom: 8 }}>
                        <SpeechInput
                          onTranscript={handleTranscript}
                          disabled={!isActiveQuestion}
                        />
                      </div>
                      <textarea
                        ref={textRef}
                        className="input"
                        rows={4}
                        placeholder="Type your answer here… You can also write code in the editor below if needed."
                        value={answer}
                        onChange={(e) => {
                          stop();
                          setAnswer(e.target.value);
                        }}
                        onKeyDown={handleKey}
                        style={{
                          resize: "vertical",
                          lineHeight: 1.6,
                          marginBottom: 12,
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 8,
                          padding: "6px 10px",
                          background: "rgba(110,231,183,0.06)",
                          border: "1px solid rgba(110,231,183,0.15)",
                          borderRadius: 7,
                        }}
                      >
                        <Code2 size={13} color="var(--accent)" />
                        <span
                          style={{
                            fontSize: 12,
                            color: "var(--accent)",
                            fontWeight: 600,
                          }}
                        >
                          Code Editor
                        </span>
                        <span
                          style={{ fontSize: 12, color: "var(--text-muted)" }}
                        >
                          — write code here if the question asks you to
                          implement something
                        </span>
                      </div>
                      <CodeEditor
                        language={language}
                        onCodeChange={setCodeAnswer}
                        onLanguageChange={setLanguage}
                        initialCode={null}
                        startBlank={true}
                        questionContext={question}
                      />
                    </>
                  )}

                  <div
                    ref={(el) => {
                      if (el)
                        setTimeout(
                          () =>
                            el.scrollIntoView({
                              behavior: "smooth",
                              block: "nearest",
                            }),
                          120,
                        );
                    }}
                    style={{
                      display: "flex",
                      gap: 10,
                      marginTop: 4,
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Submit / Next */}
                    <button
                      className="btn btn-primary"
                      onClick={submitAnswer}
                      disabled={
                        questionType === "quiz"
                          ? selectedOption === null
                          : false
                      }
                      style={{
                        flex: 1,
                        minWidth: 140,
                        justifyContent: "center",
                        fontSize: 15,
                      }}
                    >
                      <Send size={16} />
                      {questionType === "quiz"
                        ? "Submit Answer"
                        : isDSA
                          ? "Submit Solution"
                          : "Submit & Next"}
                    </button>

                    {/* Skip button — only for non-quiz rounds */}
                    {questionType !== "quiz" && (
                      <button
                        className="btn"
                        onClick={() => {
                          setAnswer("");
                          setCodeAnswer("");
                          setPhase("evaluating");
                          socketRef.current?.emit("submit_answer", {
                            answer: "__SKIP__",
                            language: isDSA ? language : undefined,
                            isSql: isDSA ? isSql : undefined,
                          });
                        }}
                        style={{
                          padding: "12px 18px",
                          background: "rgba(251,191,36,0.08)",
                          border: "1px solid rgba(251,191,36,0.25)",
                          color: "var(--gold)",
                          borderRadius: 10,
                          fontSize: 14,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontWeight: 600,
                        }}
                        title="Skip this question (score 0)"
                      >
                        <ChevronRight size={16} /> Skip
                      </button>
                    )}

                    {/* End interview */}
                    <button
                      className="btn btn-danger"
                      onClick={() => socketRef.current?.emit("end_interview")}
                      style={{ padding: "12px 16px" }}
                      title="End interview"
                    >
                      <StopCircle size={16} />
                    </button>
                  </div>

                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      marginTop: 8,
                      textAlign: "center",
                    }}
                  >
                    {questionType === "quiz"
                      ? "Select an option then click Submit"
                      : "Ctrl+Enter to submit · Skip sends a blank answer (score 0)"}
                  </p>
                </>
              )}
            </div>
          )}

          {/* ── INTERVIEW COMPLETE (before feedback) ── */}
          {phase === "interview_complete" && (
            <div
              className="card"
              style={{ textAlign: "center", padding: "3.5rem" }}
            >
              <Trophy
                size={52}
                color="var(--gold)"
                style={{ margin: "0 auto 16px" }}
              />
              <h2 style={{ marginBottom: 8 }}>All 3 Rounds Complete! 🎉</h2>
              <p style={{ color: "var(--text-muted)", marginBottom: 0 }}>
                Generating your full report…
              </p>
            </div>
          )}

          {/* ── FEEDBACK ── */}
          {phase === "feedback" && (
            <div className="card fade-up" style={{ padding: "2.5rem" }}>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "rgba(251,191,36,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <Star size={28} color="var(--gold)" />
                </div>
                <h2 style={{ marginBottom: 6 }}>Interview Complete! 🎉</h2>
                <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
                  How was your experience? Your feedback helps us improve.
                </p>
              </div>

              {/* Overall rating 0-10 */}
              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    display: "block",
                    marginBottom: 10,
                  }}
                >
                  Overall Rating{" "}
                  <span
                    style={{
                      color: "var(--gold)",
                      fontFamily: "Syne",
                      fontSize: 18,
                      fontWeight: 800,
                    }}
                  >
                    {fbRating !== null ? `${fbRating}/10` : "—"}
                  </span>
                </label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[...Array(11)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setFbRating(i)}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: "pointer",
                        border: "2px solid",
                        fontFamily: "Syne,sans-serif",
                        transition: "all .15s",
                        borderColor:
                          fbRating === i
                            ? i >= 8
                              ? "var(--accent)"
                              : i >= 5
                                ? "var(--gold)"
                                : "var(--red)"
                            : "var(--border)",
                        background:
                          fbRating === i
                            ? i >= 8
                              ? "rgba(110,231,183,0.15)"
                              : i >= 5
                                ? "rgba(251,191,36,0.15)"
                                : "rgba(248,113,113,0.15)"
                            : "var(--navy-3)",
                        color:
                          fbRating === i
                            ? i >= 8
                              ? "var(--accent)"
                              : i >= 5
                                ? "var(--gold)"
                                : "var(--red)"
                            : "var(--text-muted)",
                      }}
                    >
                      {i}
                    </button>
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginTop: 4,
                  }}
                >
                  <span>😞 Poor</span>
                  <span>😐 Average</span>
                  <span>😊 Excellent</span>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                {/* Difficulty */}
                <div>
                  <label
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    Question Difficulty
                  </label>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                  >
                    {["Too Easy", "Just Right", "Challenging", "Too Hard"].map(
                      (d) => (
                        <button
                          key={d}
                          onClick={() => setFbDifficulty(d)}
                          style={{
                            padding: "8px 12px",
                            borderRadius: 8,
                            fontSize: 13,
                            textAlign: "left",
                            cursor: "pointer",
                            border: `1px solid ${fbDifficulty === d ? "rgba(110,231,183,0.4)" : "var(--border)"}`,
                            background:
                              fbDifficulty === d
                                ? "var(--accent-dim)"
                                : "var(--navy-3)",
                            color:
                              fbDifficulty === d
                                ? "var(--accent)"
                                : "var(--text)",
                          }}
                        >
                          {d}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* Relevance */}
                <div>
                  <label
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    Question Relevance
                  </label>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                  >
                    {[
                      "Very Relevant",
                      "Mostly Relevant",
                      "Somewhat Relevant",
                      "Not Relevant",
                    ].map((r) => (
                      <button
                        key={r}
                        onClick={() => setFbRelevance(r)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: 8,
                          fontSize: 13,
                          textAlign: "left",
                          cursor: "pointer",
                          border: `1px solid ${fbRelevance === r ? "rgba(110,231,183,0.4)" : "var(--border)"}`,
                          background:
                            fbRelevance === r
                              ? "var(--accent-dim)"
                              : "var(--navy-3)",
                          color:
                            fbRelevance === r ? "var(--accent)" : "var(--text)",
                        }}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Would recommend */}
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Would you recommend TalentLens to others?
                </label>
                <div style={{ display: "flex", gap: 10 }}>
                  {[
                    ["Yes 👍", true],
                    ["No 👎", false],
                  ].map(([label, val]) => (
                    <button
                      key={label}
                      onClick={() => setFbRecommend(val)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        border: `1px solid ${fbRecommend === val ? "rgba(110,231,183,0.4)" : "var(--border)"}`,
                        background:
                          fbRecommend === val
                            ? "var(--accent-dim)"
                            : "var(--navy-3)",
                        color:
                          fbRecommend === val ? "var(--accent)" : "var(--text)",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Additional Comments{" "}
                  <span style={{ fontWeight: 400 }}>(optional)</span>
                </label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Any suggestions, issues, or things you liked…"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  style={{ resize: "vertical", lineHeight: 1.6 }}
                />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="btn btn-primary"
                  onClick={submitAnswer}
                  style={{ flex: 2, justifyContent: "center", fontSize: 15 }}
                >
                  <MessageSquare size={16} /> Submit Feedback & View Report
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    socketRef.current?.emit("submit_answer", {
                      answer: JSON.stringify({}),
                    });
                  }}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Skip
                </button>
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                Rating is optional — you can submit with just comments or skip
                entirely
              </p>
            </div>
          )}

          {/* ── DONE ── */}
          {phase === "done" && (
            <div
              className="card"
              style={{ textAlign: "center", padding: "3.5rem" }}
            >
              <CheckCircle
                size={52}
                color="var(--accent)"
                style={{ margin: "0 auto 16px" }}
              />
              <h2 style={{ marginBottom: 10 }}>Thank you! 🙏</h2>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: 15,
                  lineHeight: 1.7,
                  marginBottom: 0,
                }}
              >
                {interviewDoneMsg}
              </p>
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  fontSize: 14,
                }}
              >
                <Loader size={14} className="spin" /> Redirecting to your
                report…
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Camera */}
      {[
        "greeting",
        "round_intro",
        "starting",
        "question",
        "evaluating",
        "round_complete",
      ].includes(phase) && <CameraFeed isActive={true} />}
    </div>
  );
}
