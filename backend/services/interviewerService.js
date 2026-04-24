import { getAIModels } from "../config/aiModels.js";
import { pickDSAChallenge, DSA_CHALLENGES } from "./dsaChallenges.js";
import { pickQuizQuestions } from "./quizBank.js";

const HF_CHAT_URL = "https://router.huggingface.co/v1/chat/completions";

async function hfChat({
  model,
  messages,
  max_tokens = 400,
  temperature = 0.7,
}) {
  const res = await fetch(HF_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: `${model}:cerebras`,
      messages,
      max_tokens,
      temperature,
    }),
  });
  if (!res.ok) throw new Error(`HF API error: ${await res.text()}`);
  return res.json();
}

function field(obj, ...keys) {
  for (const k of keys) {
    if (obj[k] && typeof obj[k] === "string" && obj[k].trim())
      return obj[k].trim();
  }
  return null;
}

function normaliseResume(resume) {
  if (!resume) return null;
  if (typeof resume === "string") {
    try {
      resume = JSON.parse(resume);
    } catch {
      return null;
    }
  }
  const experience = (resume.experience || resume.workExperience || [])
    .map((e) => ({
      title: field(e, "title", "role", "position") || "Role",
      company: field(e, "company", "organization", "employer", "organisation"),
      duration: field(e, "duration", "period", "dates") || "",
      description: field(e, "description", "summary", "responsibilities") || "",
    }))
    .filter((e) => e.company || e.description);

  const projects = (resume.projects || [])
    .map((p) => ({
      name: field(p, "name", "title") || "Project",
      description: field(p, "description", "summary") || "",
      technologies: p.technologies || p.tech || [],
    }))
    .filter((p) => p.name !== "Project" || p.description);

  return {
    name: field(resume, "name", "fullName") || "Candidate",
    summary: field(resume, "summary", "objective", "profile") || "",
    skills: resume.skills || resume.technicalSkills || [],
    experience,
    projects,
    education: resume.education || [],
  };
}

function buildResumeContext(r) {
  if (!r) return "No resume data.";
  const lines = [`Candidate: ${r.name}`];
  if (r.summary) lines.push(`Summary: ${r.summary}`);
  if (r.skills?.length) lines.push(`\nSkills: ${r.skills.join(", ")}`);
  if (r.experience?.length) {
    lines.push("\nWork Experience:");
    r.experience.forEach((e, i) => {
      lines.push(
        `  ${i + 1}. ${e.title}${e.company ? ` at ${e.company}` : ""}${e.duration ? ` (${e.duration})` : ""}`,
      );
      if (e.description) lines.push(`     ${e.description}`);
    });
  }
  if (r.projects?.length) {
    lines.push("\nProjects:");
    r.projects.forEach((p, i) => {
      const tech = p.technologies?.length
        ? ` [${p.technologies.join(", ")}]`
        : "";
      lines.push(`  ${i + 1}. "${p.name}"${tech}`);
      if (p.description) lines.push(`     ${p.description}`);
    });
  }
  return lines.join("\n");
}

function pickSource(r, questionNumber, askedTopics) {
  const cycle = (questionNumber - 1) % 3;
  if (cycle === 0 && r.experience?.length) {
    const unused =
      r.experience.find(
        (e) => !askedTopics.some((t) => e.company && t.includes(e.company)),
      ) || r.experience[0];
    return {
      type: "experience",
      label: unused.company
        ? `${unused.title} at ${unused.company}`
        : unused.title,
      company: unused.company,
      detail: unused.description,
    };
  }
  if (cycle === 1 && r.projects?.length) {
    const unused =
      r.projects.find((p) => !askedTopics.some((t) => t.includes(p.name))) ||
      r.projects[0];
    return {
      type: "project",
      label: unused.name,
      detail: `${unused.description} Tech: ${unused.technologies?.join(", ")}`,
    };
  }
  if (r.skills?.length) {
    const unused =
      r.skills.find(
        (s) =>
          !askedTopics.some((t) => t.toLowerCase().includes(s.toLowerCase())),
      ) || r.skills[0];
    return { type: "skill", label: unused };
  }
  return null;
}

function validateQuestion(question, r) {
  if (!r || !question) return false;
  const lower = question.toLowerCase();
  const names = [
    ...(r.skills || []),
    ...(r.experience || []).flatMap((e) =>
      [e.company, e.title].filter(Boolean),
    ),
    ...(r.projects || []).map((p) => p.name).filter(Boolean),
  ].map((n) => n.toLowerCase());
  return names.some((n) => n.length > 2 && lower.includes(n));
}

function detectCodingLanguage(resume) {
  const r = normaliseResume(resume);
  const skills = (r?.skills || []).map((s) => s.toLowerCase());
  if (skills.includes("python") && !skills.includes("javascript"))
    return "python";
  if (skills.includes("java") && !skills.includes("javascript")) return "java";
  if (skills.includes("typescript")) return "typescript";
  return "javascript";
}

// ── ROUND 1: Resume-based question ───────────────────────────────────────────

export async function generateResumeQuestion({
  resume,
  jobRole,
  askedTopics,
  questionNumber,
  source,
}) {
  const { general } = getAIModels();
  const r = normaliseResume(resume);

  // Use provided source, or auto-pick
  const src = source || pickSource(r, questionNumber, askedTopics);
  const resumeContext = buildResumeContext(r);
  const coveredBlock =
    askedTopics.length > 0
      ? `\nAlready covered — do NOT repeat: ${askedTopics.join(", ")}`
      : "";

  let sourceInstruction = "";
  if (src?.type === "experience") {
    sourceInstruction = src.company
      ? `\nAsk about their role as "${src.label?.split(" at ")[0] || src.title}" at "${src.company}". Focus on their responsibilities, achievements, or a specific challenge: ${src.detail?.slice(0, 150) || ""}.`
      : `\nAsk about their experience as "${src.label || src.title}". Ask about a specific responsibility or challenge.`;
  } else if (src?.type === "project") {
    sourceInstruction = `\nAsk about their project "${src.name || src.label}". Ask about a technical decision, challenge they faced, or their specific contribution. Details: ${src.detail?.slice(0, 150) || ""}.`;
  } else if (src?.type === "skills") {
    const skillList = src.skills?.join(", ") || src.label;
    sourceInstruction = `\nAsk how the candidate has applied one of these skills in a real project: ${skillList}. Ask for a specific example.`;
  } else if (src?.type === "skill") {
    sourceInstruction = `\nAsk how they have used "${src.label}" in a real project from their resume. Ask for a specific example.`;
  }

  const system = `You are a professional technical interviewer conducting a live interview for the role: "${jobRole}".
You are speaking DIRECTLY to the candidate sitting in front of you.

CANDIDATE RESUME (their background — use this to inform your question):
${resumeContext}
${coveredBlock}
${sourceInstruction}

RULES — breaking any rule is a failure:
1. Address the candidate as "you" or "your" — NEVER use their name in the question. This is a real conversation.
2. Use the EXACT company, project, or skill name from the resume (e.g. "at InsightData Corp", "in your SQL Query Optimisation Toolkit project").
3. Ask EXACTLY ONE focused question — no sub-questions, no "and also".
4. Only ask about things in the resume. Never invent technologies.
5. Sound natural — like a real interviewer would ask it in person.
6. Output ONLY the question text. No preamble, no "Sure!", no explanation.

GOOD examples (notice: "you/your" not the candidate's name):
- "At InsightData Corp, what approach did you take to optimise the slow-running SQL queries, and what was the impact?"
- "Can you walk me through a specific challenge you faced while building the Real-Time Sales Dashboard?"
- "How have you used Python in your data pipeline work, and can you give me a concrete example?"

BAD examples (never do this):
- "How has Aisha Khan applied SQL..." ← uses candidate name
- "How did the candidate use Python..." ← third person
- "Tell me about your company's approach..." ← vague, no company name`;

  try {
    const res = await hfChat({
      model: general,
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: `Generate interview question ${questionNumber} of 10.`,
        },
      ],
      max_tokens: 160,
      temperature: 0.55,
    });
    let question = keepFirstQuestion(
      res?.choices?.[0]?.message?.content?.trim() || "",
    );

    // Strip candidate name if model still uses it (e.g. "How has Aisha Khan...")
    question = sanitiseQuestion(question, r);

    if (!validateQuestion(question, r))
      question = buildFallbackFromSource(src, r, jobRole);
    console.log(
      `[R1-Q${questionNumber}] source=${src?.type}/${src?.company || src?.name || src?.label} → "${question.slice(0, 80)}"`,
    );
    return { question, topic: detectTopic(question, r), type: "resume" };
  } catch (err) {
    console.error("[Round1]", err.message);
    return {
      question: buildFallbackFromSource(src, r, jobRole),
      topic: src?.label || "general",
      type: "resume",
    };
  }
}

// ── ROUND 1: Follow-up from previous answer ───────────────────────────────────

export async function generateFollowUpQuestion({
  previousQuestion,
  previousAnswer,
  jobRole,
  resume,
}) {
  const { general } = getAIModels();
  const r = normaliseResume(resume);

  const system = `You are a sharp technical interviewer conducting a live interview for the role: "${jobRole}".
You are speaking directly to the candidate. Their previous answer was not detailed enough — dig deeper.

Ask ONE follow-up question that:
- Addresses the candidate as "you" or "your" — never use their name
- Probes something SPECIFIC they mentioned in their answer
- Challenges a vague or general statement they made
- Asks for a concrete example, a metric, or a lesson learned
- Sounds natural — like a real interviewer pressing for more detail

DO NOT ask about anything the candidate did NOT mention.
Output ONLY the follow-up question. No preamble.`;

  const userMsg = `Role: ${jobRole}
Candidate skills: ${r?.skills?.slice(0, 6).join(", ") || "not specified"}

Previous Question: ${previousQuestion}

Candidate's Answer: ${previousAnswer}

Generate one targeted follow-up question strictly based on what the candidate said above.`;

  try {
    const res = await hfChat({
      model: general,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userMsg },
      ],
      max_tokens: 150,
      temperature: 0.6,
    });
    let question = keepFirstQuestion(
      res?.choices?.[0]?.message?.content?.trim() || "",
    );
    if (!question || question.length < 10)
      question = buildFallbackFollowUp(previousAnswer);
    console.log(`[FollowUp] "${question.slice(0, 100)}"`);
    return { question, topic: "Follow-up", type: "followup" };
  } catch (err) {
    console.error("[FollowUp]", err.message);
    return {
      question: buildFallbackFollowUp(previousAnswer),
      topic: "Follow-up",
      type: "followup",
    };
  }
}

// ── ROUND 2: Quiz MCQ ─────────────────────────────────────────────────────────

export function getQuizQuestion(quizQuestions, index) {
  const q = quizQuestions[index];
  if (!q) return null;
  return {
    question: q.q,
    topic: `Quiz: ${q.topic}`,
    type: "quiz",
    quiz: {
      options: q.options,
      answer: q.answer,
      explanation: q.explanation,
      topic: q.topic,
      index,
    },
  };
}

// ── ROUND 3: DSA challenge ────────────────────────────────────────────────────

export function getDSAChallenge(dsaChallenges, index) {
  const c = dsaChallenges[index];
  if (!c) return null;
  return {
    question: c.question,
    topic: `DSA: ${c.title}`,
    type: "dsa",
    isCoding: true,
    isDSA: true,
    dsaChallenge: {
      id: c.id,
      title: c.title,
      difficulty: c.difficulty,
      topic: c.topic,
      boilerplate: c.boilerplates.javascript,
      boilerplates: c.boilerplates,
      hints: c.hints,
      optimalComplexity: c.optimalComplexity,
    },
  };
}

// ── Evaluate answer (all types) ───────────────────────────────────────────────

export async function evaluateAnswer({
  question,
  answer,
  jobRole,
  type = "resume",
  quizMeta = null,
}) {
  const { general } = getAIModels();

  // Quiz: evaluate against correct answer
  if (type === "quiz" && quizMeta) {
    const selected = parseInt(answer);
    const correct = selected === quizMeta.answer;
    return {
      score: correct ? 10 : 0,
      correct,
      correctAnswer: quizMeta.options[quizMeta.answer],
      feedback: quizMeta.explanation,
      strengths: correct ? "Correct answer!" : "",
      improvements: correct
        ? ""
        : `The correct answer is: ${quizMeta.options[quizMeta.answer]}`,
      needsFollowUp: false,
      followUpReason: "",
    };
  }

  const codingNote =
    type === "dsa"
      ? "This was a DSA coding challenge. Evaluate: correctness, time/space complexity, code quality, edge cases."
      : type === "followup"
        ? "This was a follow-up question. Evaluate depth and specificity of the answer."
        : "";

  const system = `You are an expert ${jobRole} interviewer. ${codingNote}
Respond ONLY with valid JSON:
{
  "score": <1-10>,
  "feedback": "<one clear sentence>",
  "strengths": "<what was good>",
  "improvements": "<specific improvement>",
  "needsFollowUp": <true ONLY for resume/experience questions where answer was vague — false for all DSA and quiz>,
  "followUpReason": "<if needsFollowUp: what specific aspect to probe deeper>"
}`;

  try {
    const res = await hfChat({
      model: general,
      messages: [
        { role: "system", content: system },
        { role: "user", content: `Question: ${question}\n\nAnswer: ${answer}` },
      ],
      max_tokens: 300,
      temperature: 0.3,
    });
    const raw = res?.choices?.[0]?.message?.content?.trim() || "{}";
    const p = JSON.parse(raw.replace(/```json|```/g, "").trim());
    return {
      score: p.score ?? 5,
      feedback: p.feedback ?? "Answer received.",
      strengths: p.strengths ?? "",
      improvements: p.improvements ?? "",
      needsFollowUp:
        type === "resume" || type === "followup"
          ? (p.needsFollowUp ?? false)
          : false,
      followUpReason: p.followUpReason ?? "",
    };
  } catch (err) {
    console.error("[evaluateAnswer]", err.message);
    return {
      score: 5,
      feedback: "Answer received.",
      strengths: "",
      improvements: "",
      needsFollowUp: false,
      followUpReason: "",
    };
  }
}

// ── Greeting ──────────────────────────────────────────────────────────────────

export async function generateGreeting({ candidateName, jobRole, resume }) {
  const { general } = getAIModels();
  const r = normaliseResume(resume);
  const company = r?.experience?.[0]?.company || "";
  try {
    const res = await hfChat({
      model: general,
      messages: [
        {
          role: "system",
          content:
            "Write a warm, professional 2-sentence interview welcome. Use the candidate's name and role. Do NOT ask any question.",
        },
        {
          role: "user",
          content: `Name: ${candidateName}, Role: ${jobRole}${company ? `, Recent employer: ${company}` : ""}`,
        },
      ],
      max_tokens: 90,
      temperature: 0.7,
    });
    return (
      res?.choices?.[0]?.message?.content?.trim() ||
      `Welcome ${candidateName}! Let's begin your ${jobRole} interview.`
    );
  } catch {
    return `Welcome ${candidateName}! Let's begin your ${jobRole} interview.`;
  }
}

// ── Final report ──────────────────────────────────────────────────────────────

export async function generateFinalReport({
  candidateName,
  jobRole,
  qaLog,
  r1Score,
  r2Score,
  r3Score,
}) {
  const { general } = getAIModels();
  const overall = ((r1Score + r2Score + r3Score) / 3).toFixed(1);

  const system = `You are a hiring manager writing a post-interview evaluation.
Respond ONLY with valid JSON:
{
  "overallVerdict": "Strong Hire | Hire | Maybe | No Hire",
  "summary": "<2-3 sentence assessment covering all 3 rounds>",
  "topStrengths": ["s1","s2","s3"],
  "areasToImprove": ["a1","a2"],
  "recommendation": "<one actionable sentence>"
}`;
  try {
    const res = await hfChat({
      model: general,
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: `Candidate: ${candidateName}\nRole: ${jobRole}\nRound 1 (Resume): ${r1Score}/10\nRound 2 (Quiz): ${r2Score}/10\nRound 3 (DSA): ${r3Score}/10\nOverall: ${overall}/10`,
        },
      ],
      max_tokens: 400,
      temperature: 0.4,
    });
    const raw = res?.choices?.[0]?.message?.content?.trim() || "{}";
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    return {
      overallVerdict: "Maybe",
      summary: `${candidateName} completed all 3 rounds with scores: Resume ${r1Score}/10, Quiz ${r2Score}/10, DSA ${r3Score}/10.`,
      topStrengths: ["Completed full interview"],
      areasToImprove: ["Report generation failed"],
      recommendation: "Review individual answers for a detailed assessment.",
    };
  }
}

export { normaliseResume, pickQuizQuestions };

// ── Helpers ───────────────────────────────────────────────────────────────────

function keepFirstQuestion(text) {
  if (!text) return "";
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const q = lines.find((l) => l.includes("?"));
  if (q) return q;
  return (text.split(/(?<=[?])\s+/)[0] || text).trim();
}

function detectTopic(question, r) {
  if (!question) return "General";
  const lower = question.toLowerCase();
  for (const e of r?.experience || []) {
    if (e.company && lower.includes(e.company.toLowerCase())) return e.company;
  }
  for (const p of r?.projects || []) {
    if (p.name && lower.includes(p.name.toLowerCase())) return p.name;
  }
  for (const s of r?.skills || []) {
    if (lower.includes(s.toLowerCase())) return s;
  }
  return question.split(" ").slice(0, 5).join(" ");
}

function buildFallbackFollowUp(previousAnswer) {
  const lower = (previousAnswer || "").toLowerCase();
  if (lower.length < 60)
    return "Can you elaborate on that in more detail and give a specific example from your experience?";
  if (
    !lower.includes("because") &&
    !lower.includes("reason") &&
    !lower.includes("because")
  )
    return "What was the reasoning behind that approach? Did you consider any alternatives?";
  if (
    !lower.includes("result") &&
    !lower.includes("outcome") &&
    !lower.includes("impact")
  )
    return "What was the outcome or measurable impact of that work?";
  return "Can you walk me through the specific technical steps you took and any challenges you ran into?";
}

function buildFallbackFromSource(source, r, jobRole) {
  if (source?.type === "experience" && source.company)
    return `Can you describe a specific challenge you faced at ${source.company} and how you resolved it?`;
  if (source?.type === "experience")
    return `What was your most impactful contribution in your role as ${source.label}?`;
  if (source?.type === "project")
    return `Can you walk me through a key technical decision you made in your "${source.label}" project?`;
  if (source?.type === "skill")
    return `Can you describe a specific project where you used ${source.label} and what problem it helped solve?`;
  if (r?.experience?.[0]?.company)
    return `Can you tell me about a challenge you faced at ${r.experience[0].company} and how you handled it?`;
  if (r?.projects?.[0]?.name)
    return `Can you walk me through your "${r.projects[0].name}" project and your specific contributions?`;
  if (r?.skills?.[0])
    return `How have you applied ${r.skills[0]} in a real project, and what was the outcome?`;
  return `What has been the most technically challenging aspect of your work as a ${jobRole}?`;
}

/**
 * Strip candidate name from generated question if the model addresses them by name.
 * Replaces "How has [Name] ..." → "How have you ..."
 * Replaces "What did [Name] ..." → "What did you ..."
 */
function sanitiseQuestion(question, r) {
  if (!question || !r?.name || r.name === "Candidate") return question;

  const name = r.name.trim();
  // Escape special regex chars in name
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Common patterns where name appears as subject
  const replacements = [
    [new RegExp(`How has ${escaped}`, "gi"), "How have you"],
    [new RegExp(`How did ${escaped}`, "gi"), "How did you"],
    [new RegExp(`What has ${escaped}`, "gi"), "What have you"],
    [new RegExp(`What did ${escaped}`, "gi"), "What did you"],
    [new RegExp(`Can ${escaped}`, "gi"), "Can you"],
    [new RegExp(`Describe ${escaped}'s`, "gi"), "Describe your"],
    [new RegExp(`Tell me about ${escaped}'s`, "gi"), "Tell me about your"],
    [new RegExp(`${escaped}'s`, "gi"), "your"],
    [new RegExp(`\\b${escaped}\\b`, "gi"), "you"],
  ];

  let q = question;
  for (const [pattern, replacement] of replacements) {
    q = q.replace(pattern, replacement);
  }
  return q;
}
