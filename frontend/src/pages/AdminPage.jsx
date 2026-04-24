import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import SessionDetailModal from "../components/SessionDetailModal";
import {
  Shield,
  Users,
  BarChart3,
  FileText,
  Download,
  Star,
  Loader,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  CheckCircle,
  Briefcase,
  Code2,
  GraduationCap,
  FolderOpen,
  User,
  Mail,
  Calendar,
} from "lucide-react";

// ── Auth gate ─────────────────────────────────────────────────────────────────
function AdminLogin({ onAuth }) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    setError("");
    try {
      await api.get("/admin/stats", { headers: { "x-admin-key": key } });
      onAuth(key);
    } catch {
      setError("Invalid admin key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        className="card"
        style={{ width: "100%", maxWidth: 400, textAlign: "center" }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "var(--accent-dim)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <Shield size={26} color="var(--accent)" />
        </div>
        <h2 style={{ marginBottom: 6 }}>Admin Access</h2>
        <p
          style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}
        >
          Enter your admin secret key
        </p>
        {error && (
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.2)",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 16,
              color: "var(--red)",
              fontSize: 13,
            }}
          >
            <AlertCircle size={14} /> {error}
          </div>
        )}
        <input
          className="input"
          type="password"
          placeholder="Admin secret key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
          style={{ marginBottom: 12 }}
        />
        <button
          className="btn btn-primary"
          onClick={login}
          disabled={!key || loading}
          style={{ width: "100%", justifyContent: "center" }}
        >
          {loading ? (
            <>
              <Loader size={15} className="spin" /> Verifying…
            </>
          ) : (
            "Access Dashboard"
          )}
        </button>
      </div>
    </div>
  );
}

// ── Resume detail modal ───────────────────────────────────────────────────────
function ResumeModal({ resume, onClose }) {
  if (!resume) return null;
  const p = resume.parsed_data || {};

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--navy-2)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          width: "100%",
          maxWidth: 680,
          maxHeight: "85vh",
          overflow: "auto",
          padding: "2rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
          }}
        >
          <div>
            <h2 style={{ fontSize: "1.4rem", marginBottom: 4 }}>
              {p.name || "Resume"}
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
              {resume.filename} · Uploaded{" "}
              {new Date(resume.created_at).toLocaleDateString()}
            </p>
            {p.email && (
              <p style={{ color: "var(--accent)", fontSize: 13 }}>{p.email}</p>
            )}
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

        {/* Summary */}
        {p.summary && (
          <section style={{ marginBottom: 20 }}>
            <h3
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--accent)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 8,
              }}
            >
              Summary
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-muted)",
                lineHeight: 1.7,
              }}
            >
              {p.summary}
            </p>
          </section>
        )}

        {/* Skills */}
        {p.skills?.length > 0 && (
          <section style={{ marginBottom: 20 }}>
            <h3
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--accent)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Code2 size={13} /> Skills
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {p.skills.map((s) => (
                <span
                  key={s}
                  style={{
                    background: "var(--navy-3)",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    padding: "3px 10px",
                    fontSize: 12,
                    color: "var(--text)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {p.experience?.length > 0 && (
          <section style={{ marginBottom: 20 }}>
            <h3
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--accent)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Briefcase size={13} /> Work Experience
            </h3>
            {p.experience.map((e, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 14,
                  paddingLeft: 12,
                  borderLeft: "2px solid var(--navy-4)",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {e.title || "Role"}
                </div>
                <div
                  style={{
                    color: "var(--accent)",
                    fontSize: 13,
                    marginBottom: 4,
                  }}
                >
                  {e.company || (
                    <span style={{ color: "var(--red)", fontStyle: "italic" }}>
                      Company not extracted
                    </span>
                  )}
                  {e.duration && (
                    <span style={{ color: "var(--text-muted)", marginLeft: 8 }}>
                      · {e.duration}
                    </span>
                  )}
                </div>
                {e.description && (
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--text-muted)",
                      lineHeight: 1.6,
                    }}
                  >
                    {e.description}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {p.projects?.length > 0 && (
          <section style={{ marginBottom: 20 }}>
            <h3
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--accent)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <FolderOpen size={13} /> Projects
            </h3>
            {p.projects.map((proj, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 14,
                  paddingLeft: 12,
                  borderLeft: "2px solid var(--navy-4)",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 14 }}>{proj.name}</div>
                {proj.description && (
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--text-muted)",
                      lineHeight: 1.6,
                      marginBottom: 4,
                    }}
                  >
                    {proj.description}
                  </p>
                )}
                {proj.technologies?.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {proj.technologies.map((t) => (
                      <span
                        key={t}
                        style={{
                          background: "rgba(110,231,183,0.08)",
                          border: "1px solid rgba(110,231,183,0.15)",
                          borderRadius: 4,
                          padding: "2px 8px",
                          fontSize: 11,
                          color: "var(--accent)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {p.education?.length > 0 && (
          <section>
            <h3
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--accent)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <GraduationCap size={13} /> Education
            </h3>
            {p.education.map((e, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 8,
                  paddingLeft: 12,
                  borderLeft: "2px solid var(--navy-4)",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 14 }}>{e.degree}</div>
                <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
                  {e.institution || e.school} {e.year && `· ${e.year}`}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Warn if extraction seems poor */}
        {(!p.experience?.length || p.experience.every((e) => !e.company)) && (
          <div
            style={{
              marginTop: 16,
              background: "rgba(251,191,36,0.08)",
              border: "1px solid rgba(251,191,36,0.2)",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 13,
              color: "var(--gold)",
            }}
          >
            ⚠️ Company names could not be extracted from this resume. The
            candidate should re-upload as a .txt file for better parsing.
          </div>
        )}
      </div>
    </div>
  );
}

// ── User detail panel ─────────────────────────────────────────────────────────
function UserDetail({ userId, adminKey, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState(null);

  useEffect(() => {
    api
      .get(`/admin/users/${userId}`, { headers: { "x-admin-key": adminKey } })
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId, adminKey]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 900,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          height: "100vh",
          background: "var(--navy-2)",
          borderLeft: "1px solid var(--border)",
          overflow: "auto",
          padding: "2rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: "1.2rem" }}>User Details</h2>
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

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <Loader size={28} className="spin" color="var(--accent)" />
          </div>
        ) : data ? (
          <>
            {/* User info */}
            <div
              className="card"
              style={{ marginBottom: 20, padding: "1.25rem" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "var(--accent-dim)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <User size={20} color="var(--accent)" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>
                    {data.user.name}
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
                    {data.user.email}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, fontSize: 13 }}>
                <span style={{ color: "var(--text-muted)" }}>
                  Joined {new Date(data.user.created_at).toLocaleDateString()}
                </span>
                <span className="badge badge-green">
                  {data.sessions.length} interviews
                </span>
                <span className="badge badge-muted">
                  {data.resumes.length} resumes
                </span>
              </div>
            </div>

            {/* Resumes */}
            {data.resumes.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <FileText size={14} color="var(--accent)" /> Uploaded Resumes
                </h3>
                {data.resumes.map((r) => {
                  const p = r.parsed_data || {};
                  const hasCompanies = p.experience?.some((e) => e.company);
                  return (
                    <div
                      key={r.id}
                      style={{
                        background: "var(--navy-3)",
                        border: "1px solid var(--border)",
                        borderRadius: 10,
                        padding: "12px 14px",
                        marginBottom: 8,
                        cursor: "pointer",
                      }}
                      onClick={() => setSelectedResume(r)}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>
                            {r.filename}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "var(--text-muted)",
                              marginTop: 2,
                            }}
                          >
                            {p.name && `${p.name} · `}
                            {p.skills?.length > 0 &&
                              p.skills.slice(0, 4).join(", ")}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          {!hasCompanies && (
                            <span
                              style={{ fontSize: 11, color: "var(--gold)" }}
                            >
                              ⚠ No companies
                            </span>
                          )}
                          <ChevronRight size={14} color="var(--text-muted)" />
                        </div>
                      </div>
                      {p.experience?.length > 0 && (
                        <div
                          style={{
                            marginTop: 8,
                            display: "flex",
                            gap: 6,
                            flexWrap: "wrap",
                          }}
                        >
                          {p.experience.map((e, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: 11,
                                background: "var(--navy-4)",
                                borderRadius: 4,
                                padding: "2px 8px",
                                color: e.company ? "var(--text)" : "var(--red)",
                              }}
                            >
                              {e.company || "⚠ No company name"}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Sessions */}
            {data.sessions.length > 0 && (
              <div>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <BarChart3 size={14} color="var(--accent)" /> Interview
                  Sessions
                </h3>
                {data.sessions.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      background: "var(--navy-3)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      padding: "12px 14px",
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: 14 }}>
                        {s.job_role}
                      </div>
                      <span
                        className={`badge ${s.status === "completed" ? "badge-green" : "badge-gold"}`}
                      >
                        {s.status}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                        marginTop: 4,
                      }}
                    >
                      {new Date(s.created_at).toLocaleDateString()} ·
                      {s.questions_asked}/{s.total_questions} questions
                      {s.average_score && (
                        <span
                          style={{
                            color: "var(--accent)",
                            marginLeft: 8,
                            fontWeight: 600,
                          }}
                        >
                          {" "}
                          Score: {s.average_score}/10
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <p style={{ color: "var(--text-muted)", textAlign: "center" }}>
            Failed to load user data.
          </p>
        )}
      </div>
      {selectedResume && (
        <ResumeModal
          resume={selectedResume}
          onClose={() => setSelectedResume(null)}
        />
      )}
    </div>
  );
}

// ── Main Admin Dashboard ──────────────────────────────────────────────────────
export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [tab, setTab] = useState("users");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  const loadAll = async (key) => {
    setLoading(true);
    try {
      const [statsRes, usersRes, sessionsRes] = await Promise.all([
        api.get("/admin/stats", { headers: { "x-admin-key": key } }),
        api.get("/admin/users", { headers: { "x-admin-key": key } }),
        api.get("/admin/sessions", { headers: { "x-admin-key": key } }),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setSessions(sessionsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadFeedback = async (key = adminKey) => {
    setFeedbackLoading(true);
    setFeedbackError("");
    try {
      const res = await api.get("/admin/feedback", {
        headers: { "x-admin-key": key },
      });
      setFeedbacks(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("[Admin] feedback error:", e);
      setFeedbackError(
        e?.response?.data?.error || e.message || "Failed to load feedback.",
      );
      setFeedbacks([]);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleAuth = (key) => {
    setAdminKey(key);
    setAuthenticated(true);
    localStorage.setItem("tl_admin_key", key);
    loadAll(key);
  };

  const handleTabChange = (id) => {
    setTab(id);
    if (id === "feedback") loadFeedback();
  };

  const exportCSV = () =>
    window.open(`/api/admin/export/csv?adminKey=${adminKey}`, "_blank");
  const exportJSON = () =>
    window.open(`/api/admin/export/json?adminKey=${adminKey}`, "_blank");

  if (!authenticated)
    return (
      <div>
        <Navbar />
        <AdminLogin onAuth={handleAuth} />
      </div>
    );

  return (
    <div>
      <Navbar />
      <div className="page">
        <div className="container">
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 32,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>
                Admin Dashboard
              </h1>
              <p style={{ color: "var(--text-muted)" }}>
                Users, resumes, and interview data
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={exportCSV}
                className="btn btn-ghost"
                style={{ fontSize: 13 }}
              >
                <Download size={14} /> CSV
              </button>
              <button
                onClick={exportJSON}
                className="btn btn-ghost"
                style={{ fontSize: 13 }}
              >
                <Download size={14} /> JSON
              </button>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 16,
                marginBottom: 32,
              }}
            >
              {[
                {
                  label: "Total Users",
                  value: stats.totalUsers,
                  icon: Users,
                  color: "var(--accent)",
                },
                {
                  label: "Resumes Uploaded",
                  value: stats.totalResumes,
                  icon: FileText,
                  color: "var(--accent)",
                },
                {
                  label: "Interviews Done",
                  value: stats.completedInterviews,
                  icon: CheckCircle,
                  color: "var(--accent)",
                },
                {
                  label: "Avg Score",
                  value: `${stats.averageScore}/10`,
                  icon: Star,
                  color: "var(--gold)",
                },
                {
                  label: "Total Answers",
                  value: stats.totalAnswers,
                  icon: BarChart3,
                  color: "var(--accent)",
                },
              ].map(({ label, value, icon: Icon, color }) => (
                <div
                  key={label}
                  className="card"
                  style={{ padding: "1.25rem" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                        fontWeight: 500,
                      }}
                    >
                      {label}
                    </span>
                    <Icon size={15} color={color} />
                  </div>
                  <div
                    style={{
                      fontFamily: "Syne",
                      fontSize: "1.8rem",
                      fontWeight: 700,
                      color,
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {[
              { id: "users", label: "Users & Resumes", icon: Users },
              { id: "sessions", label: "Interviews", icon: BarChart3 },
              { id: "feedback", label: "Feedback", icon: Star },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 20px",
                  borderRadius: 8,
                  fontSize: 14,
                  cursor: "pointer",
                  background:
                    tab === t.id ? "var(--accent-dim)" : "var(--navy-3)",
                  border: `1px solid ${tab === t.id ? "rgba(110,231,183,0.3)" : "var(--border)"}`,
                  color: tab === t.id ? "var(--accent)" : "var(--text-muted)",
                }}
              >
                <t.icon size={14} /> {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem" }}>
              <Loader size={32} className="spin" color="var(--accent)" />
            </div>
          ) : (
            <>
              {/* Users tab */}
              {tab === "users" && (
                <div
                  className="card"
                  style={{ padding: 0, overflow: "hidden" }}
                >
                  <div
                    style={{
                      padding: "16px 20px",
                      borderBottom: "1px solid var(--border)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h2 style={{ fontSize: "1rem" }}>
                      All Users ({users.length})
                    </h2>
                    <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                      Click a user to view resumes & sessions
                    </span>
                  </div>
                  {users.length === 0 ? (
                    <p
                      style={{
                        textAlign: "center",
                        padding: "3rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      No users yet.
                    </p>
                  ) : (
                    <div>
                      {users.map((u) => (
                        <div
                          key={u.id}
                          onClick={() => setSelectedUser(u.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            padding: "14px 20px",
                            borderBottom: "1px solid var(--border)",
                            cursor: "pointer",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "var(--navy-3)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: "50%",
                              background: "var(--accent-dim)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <User size={16} color="var(--accent)" />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: 15 }}>
                              {u.name}
                            </div>
                            <div
                              style={{
                                fontSize: 13,
                                color: "var(--text-muted)",
                              }}
                            >
                              {u.email}
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              alignItems: "center",
                              flexShrink: 0,
                            }}
                          >
                            <span className="badge badge-muted">
                              {u.resume_count} resumes
                            </span>
                            <span className="badge badge-muted">
                              {u.session_count} interviews
                            </span>
                            {u.avg_score && (
                              <span className="badge badge-green">
                                {u.avg_score}/10
                              </span>
                            )}
                            <ChevronRight size={14} color="var(--text-muted)" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Feedback tab */}
              {tab === "feedback" && (
                <div
                  className="card"
                  style={{ padding: 0, overflow: "hidden" }}
                >
                  <div
                    style={{
                      padding: "16px 20px",
                      borderBottom: "1px solid var(--border)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h2 style={{ fontSize: "1rem", marginBottom: 4 }}>
                        Interview Feedback ({feedbacks.length})
                      </h2>
                      {feedbacks.length > 0 && (
                        <span
                          style={{ fontSize: 13, color: "var(--text-muted)" }}
                        >
                          Avg rating:{" "}
                          <span
                            style={{ color: "var(--gold)", fontWeight: 700 }}
                          >
                            {(
                              feedbacks
                                .filter((f) => f.rating != null)
                                .reduce(
                                  (a, f) => a + (Number(f.rating) || 0),
                                  0,
                                ) /
                              Math.max(
                                feedbacks.filter((f) => f.rating != null)
                                  .length,
                                1,
                              )
                            ).toFixed(1)}
                            /10
                          </span>
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => loadFeedback()}
                      style={{
                        fontSize: 12,
                        padding: "6px 14px",
                        borderRadius: 7,
                        border: "1px solid var(--border)",
                        background: "var(--navy-3)",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                      }}
                    >
                      🔄 Refresh
                    </button>
                  </div>

                  {feedbackLoading ? (
                    <div style={{ textAlign: "center", padding: "3rem" }}>
                      <Loader
                        size={28}
                        className="spin"
                        color="var(--accent)"
                      />
                      <p
                        style={{
                          color: "var(--text-muted)",
                          marginTop: 12,
                          fontSize: 13,
                        }}
                      >
                        Loading feedback…
                      </p>
                    </div>
                  ) : feedbackError ? (
                    <div style={{ padding: "2rem", textAlign: "center" }}>
                      <p
                        style={{
                          color: "var(--red)",
                          fontSize: 14,
                          marginBottom: 12,
                        }}
                      >
                        {feedbackError}
                      </p>
                      <button
                        onClick={() => loadFeedback()}
                        className="btn btn-ghost"
                        style={{ fontSize: 13 }}
                      >
                        Try Again
                      </button>
                    </div>
                  ) : feedbacks.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "3rem" }}>
                      <Star
                        size={32}
                        color="var(--text-muted)"
                        style={{ margin: "0 auto 12px" }}
                      />
                      <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
                        No feedback submitted yet.
                      </p>
                      <p
                        style={{
                          color: "var(--text-muted)",
                          fontSize: 12,
                          marginTop: 4,
                        }}
                      >
                        Feedback is collected at the end of each interview.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {feedbacks.map((f) => (
                        <div
                          key={f.id}
                          style={{
                            padding: "16px 20px",
                            borderBottom: "1px solid var(--border)",
                          }}
                        >
                          {/* Header row */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              marginBottom: 10,
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 15 }}>
                                {f.candidate_name}
                              </div>
                              <div
                                style={{
                                  fontSize: 13,
                                  color: "var(--text-muted)",
                                }}
                              >
                                {f.job_role} ·{" "}
                                {new Date(f.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            {f.rating != null && (
                              <div style={{ textAlign: "center" }}>
                                <div
                                  style={{
                                    fontFamily: "Syne,sans-serif",
                                    fontWeight: 800,
                                    fontSize: 24,
                                    lineHeight: 1,
                                    color:
                                      f.rating >= 8
                                        ? "var(--accent)"
                                        : f.rating >= 5
                                          ? "var(--gold)"
                                          : "var(--red)",
                                  }}
                                >
                                  {f.rating}/10
                                </div>
                                <div
                                  style={{
                                    fontSize: 11,
                                    color: "var(--text-muted)",
                                    marginTop: 2,
                                  }}
                                >
                                  rating
                                </div>
                              </div>
                            )}
                          </div>
                          {/* Badges */}
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              flexWrap: "wrap",
                              marginBottom: f.comments ? 10 : 0,
                            }}
                          >
                            {f.difficulty && (
                              <span
                                className="badge badge-muted"
                                style={{ fontSize: 11 }}
                              >
                                📊 Difficulty: {f.difficulty}
                              </span>
                            )}
                            {f.relevance && (
                              <span
                                className="badge badge-muted"
                                style={{ fontSize: 11 }}
                              >
                                🎯 Relevance: {f.relevance}
                              </span>
                            )}
                            {f.would_recommend === true && (
                              <span
                                className="badge badge-green"
                                style={{ fontSize: 11 }}
                              >
                                👍 Would recommend
                              </span>
                            )}
                            {f.would_recommend === false && (
                              <span
                                className="badge badge-red"
                                style={{ fontSize: 11 }}
                              >
                                👎 Would not recommend
                              </span>
                            )}
                          </div>
                          {/* Comments */}
                          {f.comments && (
                            <div
                              style={{
                                background: "var(--navy-3)",
                                borderRadius: 8,
                                padding: "10px 14px",
                                fontSize: 13,
                                color: "var(--text-muted)",
                                fontStyle: "italic",
                                borderLeft: "3px solid var(--gold)",
                              }}
                            >
                              "{f.comments}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Sessions tab */}
              {tab === "sessions" && (
                <div
                  className="card"
                  style={{ padding: 0, overflow: "hidden" }}
                >
                  <div
                    style={{
                      padding: "16px 20px",
                      borderBottom: "1px solid var(--border)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h2 style={{ fontSize: "1rem" }}>
                      All Interviews ({sessions.length})
                    </h2>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      Click any row to view Q&A, feedback & recording
                    </span>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: 13,
                      }}
                    >
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--border)" }}>
                          {[
                            "Candidate",
                            "Role",
                            "Status",
                            "Score",
                            "Questions",
                            "Date",
                          ].map((h) => (
                            <th
                              key={h}
                              style={{
                                textAlign: "left",
                                padding: "10px 16px",
                                color: "var(--text-muted)",
                                fontWeight: 500,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sessions.map((s) => (
                          <tr
                            key={s.id}
                            onClick={() => setSelectedSession(s.id)}
                            style={{
                              borderBottom: "1px solid var(--border)",
                              cursor: "pointer",
                              transition: "background .15s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background =
                                "rgba(110,231,183,0.04)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "transparent")
                            }
                          >
                            <td style={{ padding: "12px 16px" }}>
                              <div style={{ fontWeight: 500 }}>
                                {s.candidate_name}
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  color: "var(--text-muted)",
                                }}
                              >
                                {s.email}
                              </div>
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              {s.job_role}
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <span
                                className={`badge ${s.status === "completed" ? "badge-green" : "badge-gold"}`}
                              >
                                {s.status}
                              </span>
                            </td>
                            <td
                              style={{
                                padding: "12px 16px",
                                color: "var(--accent)",
                                fontWeight: 600,
                              }}
                            >
                              {s.average_score ? `${s.average_score}/10` : "—"}
                            </td>
                            <td
                              style={{
                                padding: "12px 16px",
                                color: "var(--text-muted)",
                              }}
                            >
                              {s.questions_asked}/{s.total_questions}
                            </td>
                            <td
                              style={{
                                padding: "12px 16px",
                                color: "var(--text-muted)",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {new Date(s.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* User detail side panel */}
      {selectedUser && (
        <UserDetail
          userId={selectedUser}
          adminKey={adminKey}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {/* Session detail modal */}
      {selectedSession && (
        <SessionDetailModal
          sessionId={selectedSession}
          adminKey={adminKey}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
}
