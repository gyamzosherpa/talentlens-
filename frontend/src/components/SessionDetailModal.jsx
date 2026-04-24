import { useState, useEffect } from "react";
import {
  X,
  ChevronDown,
  ChevronUp,
  Star,
  Mic,
  CheckCircle,
  AlertCircle,
  Code2,
  Brain,
  BookOpen,
} from "lucide-react";
import api from "../services/api";

function ScoreBar({ score }) {
  const color =
    score >= 7 ? "var(--accent)" : score >= 5 ? "var(--gold)" : "var(--red)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          flex: 1,
          height: 6,
          background: "var(--navy-4)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${(score || 0) * 10}%`,
            height: "100%",
            background: color,
            borderRadius: 3,
          }}
        />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, width: 32 }}>
        {score ?? "—"}/10
      </span>
    </div>
  );
}

function QACard({ qa, index }) {
  const [open, setOpen] = useState(index === 0);
  const isFollowUp =
    qa.topic?.includes("follow-up") || qa.topic?.includes("Follow-up");
  const isDSA = qa.topic?.startsWith("DSA:");
  const isQuiz = qa.topic?.startsWith("Quiz:") || qa.topic?.startsWith("quiz");

  const typeColor = isDSA
    ? "#60a5fa"
    : isQuiz
      ? "#c084fc"
      : isFollowUp
        ? "var(--gold)"
        : "var(--accent)";
  const TypeIcon = isDSA ? Code2 : isQuiz ? Brain : BookOpen;

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 8,
      }}
    >
      {/* Header */}
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px",
          cursor: "pointer",
          background: "var(--navy-3)",
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: `${typeColor}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <TypeIcon size={13} color={typeColor} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--text)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Q{qa.question_number}. {qa.question}
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              alignItems: "center",
              marginTop: 3,
            }}
          >
            {qa.topic && (
              <span style={{ fontSize: 11, color: typeColor }}>{qa.topic}</span>
            )}
            {!qa.answer && (
              <span
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  fontStyle: "italic",
                }}
              >
                Not answered
              </span>
            )}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          {qa.score != null && (
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                fontFamily: "Syne,sans-serif",
                color:
                  qa.score >= 7
                    ? "var(--accent)"
                    : qa.score >= 5
                      ? "var(--gold)"
                      : "var(--red)",
              }}
            >
              {qa.score}/10
            </span>
          )}
          {open ? (
            <ChevronUp size={14} color="var(--text-muted)" />
          ) : (
            <ChevronDown size={14} color="var(--text-muted)" />
          )}
        </div>
      </div>

      {/* Body */}
      {open && (
        <div style={{ padding: "14px 16px", background: "var(--navy-2)" }}>
          {/* Question */}
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: ".05em",
                marginBottom: 6,
              }}
            >
              Question
            </div>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: "var(--text)",
                whiteSpace: "pre-wrap",
              }}
            >
              {qa.question}
            </p>
          </div>

          {/* Answer */}
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: ".05em",
                marginBottom: 6,
              }}
            >
              Candidate Answer
            </div>
            {qa.answer ? (
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: "var(--text)",
                  background: "var(--navy-3)",
                  padding: "10px 12px",
                  borderRadius: 8,
                  whiteSpace: "pre-wrap",
                  borderLeft: "3px solid var(--accent)",
                }}
              >
                {qa.answer}
              </p>
            ) : (
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  fontStyle: "italic",
                }}
              >
                No answer provided (skipped or blank)
              </p>
            )}
          </div>

          {/* Evaluation */}
          {qa.score != null && (
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: ".05em",
                  marginBottom: 8,
                }}
              >
                Evaluation
              </div>
              <ScoreBar score={qa.score} />
              {qa.feedback && (
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-muted)",
                    marginTop: 8,
                  }}
                >
                  {qa.feedback}
                </p>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                {qa.strengths && (
                  <div
                    style={{
                      background: "rgba(110,231,183,0.06)",
                      borderRadius: 8,
                      padding: "8px 12px",
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: "var(--accent)", fontWeight: 700 }}>
                      ✓{" "}
                    </span>
                    {qa.strengths}
                  </div>
                )}
                {qa.improvements && (
                  <div
                    style={{
                      background: "rgba(251,191,36,0.06)",
                      borderRadius: 8,
                      padding: "8px 12px",
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: "var(--gold)", fontWeight: 700 }}>
                      ↗{" "}
                    </span>
                    {qa.improvements}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SessionDetailModal({ sessionId, adminKey, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recordingData, setRecordingData] = useState(null);
  const [activeTab, setActiveTab] = useState("qa"); // qa | feedback | recording

  useEffect(() => {
    api
      .get(`/admin/sessions/${sessionId}/detail`, {
        headers: { "x-admin-key": adminKey },
      })
      .then((r) => {
        setData(r.data);
        // Check sessionStorage for recording
        const rec = sessionStorage.getItem(`recording_${sessionId}`);
        if (rec) {
          try {
            setRecordingData(JSON.parse(rec));
          } catch {}
        }
      })
      .catch((e) => setError(e?.response?.data?.error || "Failed to load."))
      .finally(() => setLoading(false));
  }, [sessionId, adminKey]);

  const s = data?.session;
  const qa = data?.qa || [];
  const fb = data?.feedback;

  // Round breakdown
  const r1 = qa.filter(
    (q) =>
      !q.topic?.startsWith("DSA") &&
      !q.topic?.startsWith("Quiz") &&
      !q.topic?.startsWith("quiz"),
  );
  const r2 = qa.filter(
    (q) => q.topic?.startsWith("Quiz") || q.topic?.startsWith("quiz"),
  );
  const r3 = qa.filter((q) => q.topic?.startsWith("DSA"));

  const avg = (arr) =>
    arr.length
      ? (arr.reduce((a, q) => a + (q.score || 0), 0) / arr.length).toFixed(1)
      : "—";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        zIndex: 1000,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "min(700px, 95vw)",
          height: "100vh",
          background: "var(--navy-2)",
          borderLeft: "1px solid var(--border)",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border)",
            position: "sticky",
            top: 0,
            background: "var(--navy-2)",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <h2 style={{ fontSize: "1.2rem", marginBottom: 4 }}>
                {s?.candidate_name || "Candidate"}
              </h2>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                {s?.job_role} ·{" "}
                {s &&
                  new Date(s.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "var(--navy-3)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "6px",
                cursor: "pointer",
                color: "var(--text-muted)",
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Score summary */}
          {s && (
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 14,
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "Round 1", val: avg(r1), color: "var(--accent)" },
                {
                  label: "Round 2",
                  val: `${r2.filter((q) => q.score === 10).length}/${r2.length}`,
                  color: "#c084fc",
                },
                { label: "Round 3", val: avg(r3), color: "#60a5fa" },
                {
                  label: "Overall",
                  val: s.average_score ? `${s.average_score}/10` : "—",
                  color: "var(--gold)",
                },
              ].map(({ label, val, color }) => (
                <div
                  key={label}
                  style={{
                    background: "var(--navy-3)",
                    borderRadius: 8,
                    padding: "8px 14px",
                    textAlign: "center",
                    minWidth: 80,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontFamily: "Syne,sans-serif",
                      fontWeight: 800,
                      fontSize: 16,
                      color,
                      marginTop: 2,
                    }}
                  >
                    {val}
                  </div>
                </div>
              ))}
              <span
                className={`badge ${s.status === "completed" ? "badge-green" : "badge-gold"}`}
                style={{ alignSelf: "center" }}
              >
                {s.status}
              </span>
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
            {[
              { id: "qa", label: `Q&A (${qa.length})` },
              { id: "feedback", label: "Feedback", dot: !!fb },
              { id: "recording", label: "Recording", dot: !!recordingData },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 7,
                  fontSize: 13,
                  cursor: "pointer",
                  background:
                    activeTab === t.id ? "var(--accent-dim)" : "var(--navy-3)",
                  border: `1px solid ${activeTab === t.id ? "rgba(110,231,183,0.3)" : "var(--border)"}`,
                  color:
                    activeTab === t.id ? "var(--accent)" : "var(--text-muted)",
                  position: "relative",
                }}
              >
                {t.label}
                {t.dot && (
                  <span
                    style={{
                      position: "absolute",
                      top: 3,
                      right: 3,
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--accent)",
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", flex: 1 }}>
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "var(--text-muted)",
              }}
            >
              Loading…
            </div>
          ) : error ? (
            <div
              style={{
                color: "var(--red)",
                textAlign: "center",
                padding: "2rem",
              }}
            >
              {error}
            </div>
          ) : (
            <>
              {/* Q&A Tab */}
              {activeTab === "qa" && (
                <div>
                  {/* Round sections */}
                  {[
                    {
                      label: "Round 1 — Resume & Experience",
                      qs: r1,
                      color: "var(--accent)",
                    },
                    {
                      label: "Round 2 — Technical Quiz",
                      qs: r2,
                      color: "#c084fc",
                    },
                    {
                      label: "Round 3 — DSA Challenges",
                      qs: r3,
                      color: "#60a5fa",
                    },
                  ].map(
                    ({ label, qs, color }) =>
                      qs.length > 0 && (
                        <div key={label} style={{ marginBottom: 24 }}>
                          <h3
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color,
                              textTransform: "uppercase",
                              letterSpacing: ".05em",
                              marginBottom: 12,
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <span
                              style={{
                                width: 3,
                                height: 16,
                                background: color,
                                borderRadius: 2,
                                display: "inline-block",
                              }}
                            />
                            {label}
                          </h3>
                          {qs.map((q, i) => (
                            <QACard key={q.id || i} qa={q} index={i} />
                          ))}
                        </div>
                      ),
                  )}
                  {qa.length === 0 && (
                    <p
                      style={{
                        color: "var(--text-muted)",
                        textAlign: "center",
                        padding: "2rem",
                      }}
                    >
                      No Q&A recorded for this session.
                    </p>
                  )}
                </div>
              )}

              {/* Feedback Tab */}
              {activeTab === "feedback" && (
                <div>
                  {fb ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                      }}
                    >
                      {fb.rating != null && (
                        <div
                          style={{
                            textAlign: "center",
                            padding: "24px",
                            background: "var(--navy-3)",
                            borderRadius: 12,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 11,
                              color: "var(--text-muted)",
                              textTransform: "uppercase",
                              letterSpacing: ".06em",
                              marginBottom: 8,
                            }}
                          >
                            Overall Rating
                          </div>
                          <div
                            style={{
                              fontFamily: "Syne,sans-serif",
                              fontWeight: 800,
                              fontSize: "3.5rem",
                              lineHeight: 1,
                              color:
                                fb.rating >= 8
                                  ? "var(--accent)"
                                  : fb.rating >= 5
                                    ? "var(--gold)"
                                    : "var(--red)",
                            }}
                          >
                            {fb.rating}
                            <span
                              style={{
                                fontSize: "1.5rem",
                                color: "var(--text-muted)",
                              }}
                            >
                              /10
                            </span>
                          </div>
                        </div>
                      )}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 12,
                        }}
                      >
                        {fb.difficulty && (
                          <div
                            style={{
                              background: "var(--navy-3)",
                              borderRadius: 10,
                              padding: "14px 16px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: 11,
                                color: "var(--text-muted)",
                                marginBottom: 4,
                              }}
                            >
                              Difficulty
                            </div>
                            <div style={{ fontWeight: 600 }}>
                              {fb.difficulty}
                            </div>
                          </div>
                        )}
                        {fb.relevance && (
                          <div
                            style={{
                              background: "var(--navy-3)",
                              borderRadius: 10,
                              padding: "14px 16px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: 11,
                                color: "var(--text-muted)",
                                marginBottom: 4,
                              }}
                            >
                              Relevance
                            </div>
                            <div style={{ fontWeight: 600 }}>
                              {fb.relevance}
                            </div>
                          </div>
                        )}
                        {fb.would_recommend != null && (
                          <div
                            style={{
                              background: "var(--navy-3)",
                              borderRadius: 10,
                              padding: "14px 16px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: 11,
                                color: "var(--text-muted)",
                                marginBottom: 4,
                              }}
                            >
                              Would Recommend
                            </div>
                            <div
                              style={{
                                fontWeight: 600,
                                color: fb.would_recommend
                                  ? "var(--accent)"
                                  : "var(--red)",
                              }}
                            >
                              {fb.would_recommend ? "👍 Yes" : "👎 No"}
                            </div>
                          </div>
                        )}
                      </div>
                      {fb.comments && (
                        <div
                          style={{
                            background: "var(--navy-3)",
                            borderRadius: 10,
                            padding: "14px 16px",
                            borderLeft: "3px solid var(--gold)",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 11,
                              color: "var(--text-muted)",
                              marginBottom: 6,
                            }}
                          >
                            Comments
                          </div>
                          <p
                            style={{
                              fontSize: 14,
                              lineHeight: 1.7,
                              color: "var(--text)",
                              fontStyle: "italic",
                            }}
                          >
                            "{fb.comments}"
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "3rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      <Star
                        size={32}
                        style={{ margin: "0 auto 12px", display: "block" }}
                      />
                      No feedback submitted for this session.
                    </div>
                  )}
                </div>
              )}

              {/* Recording Tab */}
              {activeTab === "recording" && (
                <div>
                  {/* Server-stored recording (preferred) */}
                  {s?.recording_url ? (
                    <div>
                      <div
                        style={{
                          background: "var(--navy-3)",
                          borderRadius: 12,
                          padding: "20px",
                          marginBottom: 16,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            marginBottom: 16,
                          }}
                        >
                          <Mic size={20} color="var(--accent)" />
                          <div>
                            <div style={{ fontWeight: 600 }}>
                              Audio Recording
                            </div>
                            <div
                              style={{
                                fontSize: 13,
                                color: "var(--text-muted)",
                              }}
                            >
                              {s.recording_duration
                                ? `Duration: ${Math.floor(s.recording_duration / 60)}m ${s.recording_duration % 60}s · `
                                : ""}
                              Stored on server ✓
                            </div>
                          </div>
                        </div>
                        <audio
                          controls
                          src={`${s.recording_url}?adminKey=${encodeURIComponent(adminKey)}`}
                          style={{ width: "100%", borderRadius: 8 }}
                        />
                        <a
                          href={`${s.recording_url}?adminKey=${encodeURIComponent(adminKey)}`}
                          download={`interview-${sessionId}.webm`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            marginTop: 12,
                            fontSize: 13,
                            color: "var(--accent)",
                            textDecoration: "none",
                          }}
                        >
                          ⬇ Download Recording
                        </a>
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--accent)",
                          background: "rgba(110,231,183,0.06)",
                          borderRadius: 8,
                          padding: "10px 14px",
                        }}
                      >
                        ✓ This recording is permanently stored on the server at{" "}
                        <code>backend/uploads/recordings/</code>
                      </div>
                    </div>
                  ) : recordingData ? (
                    /* Fallback: browser sessionStorage (same browser session only) */
                    <div>
                      <div
                        style={{
                          background: "var(--navy-3)",
                          borderRadius: 12,
                          padding: "20px",
                          marginBottom: 16,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            marginBottom: 16,
                          }}
                        >
                          <Mic size={20} color="var(--gold)" />
                          <div>
                            <div style={{ fontWeight: 600 }}>
                              Audio Recording (Local)
                            </div>
                            <div
                              style={{
                                fontSize: 13,
                                color: "var(--text-muted)",
                              }}
                            >
                              Duration:{" "}
                              {Math.floor(recordingData.duration / 60)}m{" "}
                              {recordingData.duration % 60}s ·
                              {(recordingData.size / 1024 / 1024).toFixed(1)} MB
                            </div>
                          </div>
                        </div>
                        <audio
                          controls
                          src={recordingData.dataUrl}
                          style={{ width: "100%", borderRadius: 8 }}
                        />
                        <a
                          href={recordingData.dataUrl}
                          download={`interview-${sessionId}.webm`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            marginTop: 12,
                            fontSize: 13,
                            color: "var(--accent)",
                            textDecoration: "none",
                          }}
                        >
                          ⬇ Download Recording
                        </a>
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--gold)",
                          background: "rgba(251,191,36,0.06)",
                          borderRadius: 8,
                          padding: "10px 14px",
                        }}
                      >
                        ⚠ Recording is stored locally in this browser session
                        only. It was not uploaded to the server. Download it now
                        to keep it.
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "3rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      <Mic
                        size={32}
                        style={{
                          margin: "0 auto 12px",
                          display: "block",
                          opacity: 0.3,
                        }}
                      />
                      <p style={{ marginBottom: 6 }}>
                        No recording found for this session.
                      </p>
                      <p style={{ fontSize: 12 }}>
                        Recording starts automatically when the interview
                        begins. Make sure the candidate allows microphone
                        access.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
