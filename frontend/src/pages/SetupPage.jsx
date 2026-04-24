import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import {
  Upload,
  Briefcase,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  FileText,
  Loader,
  User,
  Code2,
} from "lucide-react";

const ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Product Manager",
  "UI/UX Designer",
  "Data Analyst",
  "Cloud Engineer",
  "Cybersecurity Analyst",
];

export default function SetupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [resumeData, setResumeData] = useState(null); // { resumeId, parsedResume }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const uploadResume = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("resume", file);
      const r = await api.post("/resumes/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Store BOTH the resumeId AND the full parsed resume
      setResumeData({
        resumeId: r.data.resumeId,
        parsedResume: r.data.parsedResume,
      });
      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Upload failed. Please try a .txt version of your resume.",
      );
    } finally {
      setLoading(false);
    }
  };

  const startInterview = async () => {
    const role = customRole.trim() || jobRole;
    if (!role) {
      setError("Please select or enter a job role.");
      return;
    }
    if (!resumeData?.resumeId) {
      setError("Resume not ready — please wait or re-upload.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const r = await api.post("/interviews", {
        resumeId: resumeData.resumeId,
        jobRole: role,
        totalQuestions,
      });

      const sessionId = r.data.id || r.data.session_id;
      if (!sessionId) throw new Error("Server did not return a session ID.");

      // Store parsed resume in sessionStorage — InterviewPage reads this directly
      sessionStorage.setItem(
        `resume_${sessionId}`,
        JSON.stringify(resumeData.parsedResume),
      );
      navigate(`/interview/${sessionId}`);
    } catch (err) {
      console.error("[SetupPage] startInterview error:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to start interview. Check console for details.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Parsed resume preview
  const p = resumeData?.parsedResume;
  const hasGoodData =
    p &&
    (p.experience?.some((e) => e.company) ||
      p.projects?.length > 0 ||
      p.skills?.length > 0);

  return (
    <div>
      <Navbar />
      <div className="page">
        <div className="container" style={{ maxWidth: 640 }}>
          {/* Progress steps */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 40,
            }}
          >
            {[1, 2].map((n) => (
              <div
                key={n}
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: step >= n ? "var(--accent)" : "var(--navy-3)",
                    color: step >= n ? "var(--navy)" : "var(--text-muted)",
                    fontFamily: "Syne",
                    fontWeight: 700,
                    fontSize: 14,
                    transition: "all 0.3s",
                  }}
                >
                  {step > n ? <CheckCircle size={16} /> : n}
                </div>
                <span
                  style={{
                    fontSize: 14,
                    color: step >= n ? "var(--text)" : "var(--text-muted)",
                  }}
                >
                  {n === 1 ? "Upload Resume" : "Configure Interview"}
                </span>
                {n < 2 && (
                  <div
                    style={{
                      width: 40,
                      height: 2,
                      background: step > 1 ? "var(--accent)" : "var(--navy-4)",
                      borderRadius: 1,
                    }}
                  />
                )}
              </div>
            ))}
          </div>

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

          {/* ── Step 1: Upload ── */}
          {step === 1 && (
            <div className="card fade-up">
              <h2 style={{ marginBottom: 8 }}>Upload Your Resume</h2>
              <p
                style={{
                  color: "var(--text-muted)",
                  marginBottom: 8,
                  fontSize: 15,
                }}
              >
                We'll extract your skills, experience, and projects to craft
                personalised questions.
              </p>
              <p
                style={{ color: "var(--gold)", fontSize: 13, marginBottom: 24 }}
              >
                💡 Tip: For best results, upload as <strong>.txt</strong> — PDF
                parsing may miss some details.
              </p>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `2px dashed ${file ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: 12,
                  padding: "2.5rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: file ? "var(--accent-dim)" : "var(--navy-3)",
                }}
              >
                <input
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                    setError("");
                  }}
                />
                {file ? (
                  <>
                    <FileText
                      size={36}
                      color="var(--accent)"
                      style={{ marginBottom: 12 }}
                    />
                    <span style={{ fontWeight: 600, marginBottom: 4 }}>
                      {file.name}
                    </span>
                    <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
                      {(file.size / 1024).toFixed(0)} KB · click to change
                    </span>
                  </>
                ) : (
                  <>
                    <Upload
                      size={36}
                      color="var(--text-muted)"
                      style={{ marginBottom: 12 }}
                    />
                    <span style={{ fontWeight: 600, marginBottom: 4 }}>
                      Drop your resume here
                    </span>
                    <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
                      PDF, TXT, DOC, DOCX · Max 10 MB
                    </span>
                  </>
                )}
              </label>

              <button
                className="btn btn-primary"
                onClick={uploadResume}
                disabled={!file || loading}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  marginTop: 20,
                  fontSize: 15,
                }}
              >
                {loading ? (
                  <>
                    <Loader size={16} className="spin" /> Parsing resume…
                  </>
                ) : (
                  <>
                    Continue <ChevronRight size={16} />
                  </>
                )}
              </button>
            </div>
          )}

          {/* ── Step 2: Configure + Resume preview ── */}
          {step === 2 && (
            <div
              className="fade-up"
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
            >
              {/* Resume extraction preview */}
              {p && (
                <div className="card" style={{ padding: "1.25rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <h3 style={{ fontSize: 15, fontWeight: 700 }}>
                      📄 What we extracted from your resume
                    </h3>
                    {!hasGoodData && (
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--gold)",
                          background: "rgba(251,191,36,0.1)",
                          padding: "3px 10px",
                          borderRadius: 6,
                        }}
                      >
                        ⚠ Limited data
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  {p.name && p.name !== "Candidate" && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 10,
                      }}
                    >
                      <User size={14} color="var(--accent)" />
                      <span style={{ fontSize: 14, fontWeight: 600 }}>
                        {p.name}
                      </span>
                      {p.email && (
                        <span
                          style={{ fontSize: 13, color: "var(--text-muted)" }}
                        >
                          · {p.email}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Skills */}
                  {p.skills?.length > 0 ? (
                    <div style={{ marginBottom: 12 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: 6,
                        }}
                      >
                        <Code2
                          size={11}
                          style={{ verticalAlign: "middle", marginRight: 4 }}
                        />
                        Skills detected
                      </div>
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 5 }}
                      >
                        {p.skills.map((s) => (
                          <span
                            key={s}
                            style={{
                              background: "var(--accent-dim)",
                              border: "1px solid rgba(110,231,183,0.2)",
                              borderRadius: 5,
                              padding: "2px 9px",
                              fontSize: 12,
                              color: "var(--accent)",
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--red)",
                        marginBottom: 8,
                      }}
                    >
                      ⚠ No skills detected
                    </p>
                  )}

                  {/* Experience */}
                  {p.experience?.length > 0 ? (
                    <div style={{ marginBottom: 12 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: 6,
                        }}
                      >
                        Work Experience
                      </div>
                      {p.experience.map((e, i) => (
                        <div
                          key={i}
                          style={{
                            fontSize: 13,
                            marginBottom: 4,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: e.company
                                ? "var(--accent)"
                                : "var(--red)",
                              flexShrink: 0,
                            }}
                          />
                          <span style={{ fontWeight: 500 }}>{e.title}</span>
                          {e.company ? (
                            <span style={{ color: "var(--accent)" }}>
                              at {e.company}
                            </span>
                          ) : (
                            <span style={{ color: "var(--red)", fontSize: 12 }}>
                              (company name not found)
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--red)",
                        marginBottom: 8,
                      }}
                    >
                      ⚠ No work experience detected
                    </p>
                  )}

                  {/* Projects */}
                  {p.projects?.length > 0 && (
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: 6,
                        }}
                      >
                        Projects
                      </div>
                      {p.projects.map((proj, i) => (
                        <div
                          key={i}
                          style={{
                            fontSize: 13,
                            marginBottom: 3,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "var(--accent)",
                              flexShrink: 0,
                            }}
                          />
                          {proj.name}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Warning if data is poor */}
                  {!hasGoodData && (
                    <div
                      style={{
                        marginTop: 12,
                        padding: "10px 12px",
                        background: "rgba(251,191,36,0.08)",
                        border: "1px solid rgba(251,191,36,0.2)",
                        borderRadius: 8,
                        fontSize: 13,
                        color: "var(--gold)",
                      }}
                    >
                      The AI couldn't extract much from this file. For best
                      interview quality, go back and upload your resume as a{" "}
                      <strong>.txt</strong> file — copy your resume text into
                      Notepad and save it.
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setStep(1);
                      setFile(null);
                      setResumeData(null);
                    }}
                    style={{
                      marginTop: 12,
                      fontSize: 12,
                      color: "var(--text-muted)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    ← Re-upload resume
                  </button>
                </div>
              )}

              {/* Interview config */}
              <div className="card">
                <h2 style={{ marginBottom: 8 }}>Configure Interview</h2>
                <p
                  style={{
                    color: "var(--text-muted)",
                    marginBottom: 24,
                    fontSize: 15,
                  }}
                >
                  Select the role and number of questions.
                </p>

                <div style={{ marginBottom: 20 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      color: "var(--text-muted)",
                      marginBottom: 8,
                      fontWeight: 500,
                    }}
                  >
                    <Briefcase
                      size={13}
                      style={{ verticalAlign: "middle", marginRight: 4 }}
                    />{" "}
                    Job Role
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(170px, 1fr))",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    {ROLES.map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          setJobRole(r);
                          setCustomRole("");
                        }}
                        style={{
                          padding: "8px 12px",
                          borderRadius: 8,
                          fontSize: 13,
                          textAlign: "left",
                          background:
                            jobRole === r
                              ? "var(--accent-dim)"
                              : "var(--navy-3)",
                          border: `1px solid ${jobRole === r ? "rgba(110,231,183,0.4)" : "var(--border)"}`,
                          color:
                            jobRole === r ? "var(--accent)" : "var(--text)",
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                  <input
                    className="input"
                    placeholder="Or type a custom role…"
                    value={customRole}
                    onChange={(e) => {
                      setCustomRole(e.target.value);
                      setJobRole("");
                    }}
                  />
                </div>

                <div style={{ marginBottom: 28 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      color: "var(--text-muted)",
                      marginBottom: 8,
                      fontWeight: 500,
                    }}
                  >
                    Questions:{" "}
                    <span style={{ color: "var(--accent)", fontWeight: 700 }}>
                      {totalQuestions}
                    </span>
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={15}
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(+e.target.value)}
                    style={{ width: "100%", accentColor: "var(--accent)" }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      color: "var(--text-muted)",
                      marginTop: 4,
                    }}
                  >
                    <span>5 (quick)</span>
                    <span>10 (standard)</span>
                    <span>15 (thorough)</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    className="btn btn-ghost"
                    onClick={() => setStep(1)}
                    style={{ flex: 1, justifyContent: "center" }}
                  >
                    Back
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={startInterview}
                    disabled={
                      (!jobRole && !customRole.trim()) ||
                      !resumeData?.resumeId ||
                      loading
                    }
                    style={{ flex: 2, justifyContent: "center", fontSize: 15 }}
                  >
                    {loading ? (
                      <>
                        <Loader size={16} className="spin" /> Starting…
                      </>
                    ) : (
                      <>
                        Start Interview <ChevronRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
