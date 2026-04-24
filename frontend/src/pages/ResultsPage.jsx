import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import {
  BarChart3,
  CheckCircle,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Download,
  Plus,
  Loader,
} from "lucide-react";

function ScoreBar({ score }) {
  const color =
    score >= 7 ? "var(--accent)" : score >= 5 ? "var(--gold)" : "var(--red)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          flex: 1,
          height: 6,
          background: "var(--navy-3)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${score * 10}%`,
            height: "100%",
            background: color,
            borderRadius: 3,
            transition: "width 0.8s ease",
          }}
        />
      </div>
      <span style={{ color, fontWeight: 700, fontSize: 14, minWidth: 30 }}>
        {score}/10
      </span>
    </div>
  );
}

function VerdictBadge({ verdict }) {
  const map = {
    "Strong Hire": "badge-green",
    Hire: "badge-green",
    Maybe: "badge-gold",
    "No Hire": "badge-red",
  };
  return (
    <span
      className={`badge ${map[verdict] || "badge-muted"}`}
      style={{ fontSize: 13, padding: "6px 16px" }}
    >
      {verdict}
    </span>
  );
}

export default function ResultsPage() {
  const { sessionId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api
      .get(`/interviews/${sessionId}/report`)
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading)
    return (
      <div>
        <Navbar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <Loader size={32} className="spin" color="var(--accent)" />
        </div>
      </div>
    );

  if (!data)
    return (
      <div>
        <Navbar />
        <div
          style={{
            textAlign: "center",
            padding: "4rem",
            color: "var(--text-muted)",
          }}
        >
          Report not found.
        </div>
      </div>
    );

  const { session, qa } = data;

  // Compute scores from actual qa rows (more reliable than stored average_score)
  const answeredQA = qa.filter((q) => q.answer && q.score != null);
  const avg =
    answeredQA.length > 0
      ? (
          answeredQA.reduce((a, q) => a + parseFloat(q.score || 0), 0) /
          answeredQA.length
        ).toFixed(1)
      : session.average_score || 0;

  // Report is stored as JSONB in session.report
  const report = session.report || {};

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `talentlens-report-${sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Navbar />
      <div className="page">
        <div className="container" style={{ maxWidth: 760 }}>
          {/* Header */}
          <div
            style={{ textAlign: "center", marginBottom: 40 }}
            className="fade-up"
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "var(--accent-dim)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <BarChart3 size={32} color="var(--accent)" />
            </div>
            <h1 style={{ fontSize: "2.2rem", marginBottom: 8 }}>
              Interview Report
            </h1>
            <p style={{ color: "var(--text-muted)" }}>
              {session.job_role} ·{" "}
              {new Date(
                session.completed_at || session.created_at,
              ).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Score overview */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 20,
              marginBottom: 32,
            }}
          >
            <div
              className="card"
              style={{ padding: "1.5rem", textAlign: "center" }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  marginBottom: 8,
                }}
              >
                Overall Score
              </div>
              <div
                style={{
                  fontFamily: "Syne",
                  fontSize: "3rem",
                  fontWeight: 800,
                  color:
                    avg >= 7
                      ? "var(--accent)"
                      : avg >= 5
                        ? "var(--gold)"
                        : "var(--red)",
                }}
              >
                {avg}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
                out of 10
              </div>
            </div>
            <div
              className="card"
              style={{ padding: "1.5rem", textAlign: "center" }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  marginBottom: 8,
                }}
              >
                Questions
              </div>
              <div
                style={{
                  fontFamily: "Syne",
                  fontSize: "3rem",
                  fontWeight: 800,
                  color: "var(--accent)",
                }}
              >
                {qa.length}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
                answered
              </div>
            </div>
            {report.overallVerdict && (
              <div
                className="card"
                style={{ padding: "1.5rem", textAlign: "center" }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text-muted)",
                    marginBottom: 12,
                  }}
                >
                  AI Verdict
                </div>
                <VerdictBadge verdict={report.overallVerdict} />
              </div>
            )}
          </div>

          {/* AI Summary */}
          {report.summary && (
            <div className="card" style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: "1.1rem", marginBottom: 12 }}>
                AI Assessment
              </h2>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>
                {report.summary}
              </p>
              {report.recommendation && (
                <div
                  style={{
                    marginTop: 16,
                    padding: "10px 14px",
                    background: "var(--accent-dim)",
                    borderRadius: 8,
                    fontSize: 14,
                    color: "var(--accent)",
                  }}
                >
                  💡 {report.recommendation}
                </div>
              )}
            </div>
          )}

          {/* Strengths & Improvements */}
          {(report.topStrengths?.length || report.areasToImprove?.length) && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
                marginBottom: 24,
              }}
            >
              {report.topStrengths?.length > 0 && (
                <div className="card">
                  <h3
                    style={{
                      fontSize: 15,
                      marginBottom: 12,
                      color: "var(--accent)",
                    }}
                  >
                    ✓ Top Strengths
                  </h3>
                  {report.topStrengths.map((s, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 8,
                        marginBottom: 8,
                        fontSize: 14,
                        color: "var(--text-muted)",
                      }}
                    >
                      <CheckCircle
                        size={14}
                        color="var(--accent)"
                        style={{ flexShrink: 0, marginTop: 2 }}
                      />{" "}
                      {s}
                    </div>
                  ))}
                </div>
              )}
              {report.areasToImprove?.length > 0 && (
                <div className="card">
                  <h3
                    style={{
                      fontSize: 15,
                      marginBottom: 12,
                      color: "var(--gold)",
                    }}
                  >
                    ↗ Areas to Improve
                  </h3>
                  {report.areasToImprove.map((a, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 8,
                        marginBottom: 8,
                        fontSize: 14,
                        color: "var(--text-muted)",
                      }}
                    >
                      <ArrowUpRight
                        size={14}
                        color="var(--gold)"
                        style={{ flexShrink: 0, marginTop: 2 }}
                      />{" "}
                      {a}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Q&A breakdown */}
          <div className="card" style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: "1.1rem", marginBottom: 20 }}>
              Question-by-Question Breakdown
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {qa.map((q, i) => (
                <div
                  key={q.id || i}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <button
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    style={{
                      width: "100%",
                      background: "var(--navy-3)",
                      border: "none",
                      padding: "14px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      cursor: "pointer",
                      color: "var(--text)",
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "var(--navy-4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "Syne",
                        fontWeight: 700,
                        fontSize: 12,
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, textAlign: "left" }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          marginBottom: 4,
                        }}
                      >
                        {q.question}
                      </div>
                      {q.topic && (
                        <span
                          className="badge badge-muted"
                          style={{ fontSize: 11 }}
                        >
                          {q.topic}
                        </span>
                      )}
                    </div>
                    <div style={{ flexShrink: 0, width: 120 }}>
                      <ScoreBar score={q.score || 0} />
                    </div>
                    {expanded === i ? (
                      <ChevronUp size={16} color="var(--text-muted)" />
                    ) : (
                      <ChevronDown size={16} color="var(--text-muted)" />
                    )}
                  </button>
                  {expanded === i && (
                    <div
                      style={{
                        padding: "16px",
                        background: "var(--navy-2)",
                        borderTop: "1px solid var(--border)",
                      }}
                    >
                      <div style={{ marginBottom: 12 }}>
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--text-muted)",
                            fontWeight: 600,
                            marginBottom: 6,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Your Answer
                        </div>
                        <p
                          style={{
                            fontSize: 14,
                            lineHeight: 1.6,
                            color: "var(--text)",
                          }}
                        >
                          {q.answer || "—"}
                        </p>
                      </div>
                      {q.feedback && (
                        <div style={{ marginBottom: 12 }}>
                          <div
                            style={{
                              fontSize: 12,
                              color: "var(--text-muted)",
                              fontWeight: 600,
                              marginBottom: 6,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            Feedback
                          </div>
                          <p
                            style={{ fontSize: 14, color: "var(--text-muted)" }}
                          >
                            {q.feedback}
                          </p>
                        </div>
                      )}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 10,
                        }}
                      >
                        {q.strengths && (
                          <div
                            style={{
                              background: "rgba(110,231,183,0.06)",
                              borderRadius: 8,
                              padding: "10px 12px",
                              fontSize: 13,
                            }}
                          >
                            <span
                              style={{
                                color: "var(--accent)",
                                fontWeight: 600,
                              }}
                            >
                              ✓{" "}
                            </span>
                            {q.strengths}
                          </div>
                        )}
                        {q.improvements && (
                          <div
                            style={{
                              background: "rgba(251,191,36,0.06)",
                              borderRadius: 8,
                              padding: "10px 12px",
                              fontSize: 13,
                            }}
                          >
                            <span
                              style={{ color: "var(--gold)", fontWeight: 600 }}
                            >
                              ↗{" "}
                            </span>
                            {q.improvements}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              to="/setup"
              className="btn btn-primary"
              style={{ flex: 1, justifyContent: "center", minWidth: 180 }}
            >
              <Plus size={16} /> New Interview
            </Link>
            <button
              onClick={downloadJSON}
              className="btn btn-ghost"
              style={{ flex: 1, justifyContent: "center", minWidth: 180 }}
            >
              <Download size={16} /> Download Report
            </button>
            <Link
              to="/dashboard"
              className="btn btn-ghost"
              style={{ flex: 1, justifyContent: "center", minWidth: 180 }}
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
