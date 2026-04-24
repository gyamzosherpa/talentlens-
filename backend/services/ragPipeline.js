import { getAIModels } from "../config/aiModels.js";
import pool from "../db/index.js";

const HF_CHAT_URL = "https://router.huggingface.co/v1/chat/completions";
const HF_EMBED_URL =
  "https://router.huggingface.co/hf-inference/models/BAAI/bge-base-en-v1.5";

async function hfChat({
  model,
  messages,
  max_tokens = 1200,
  temperature = 0.1,
}) {
  const res = await fetch(HF_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: `${model}:auto`,
      messages,
      max_tokens,
      temperature,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function hfEmbed(text) {
  const res = await fetch(HF_EMBED_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: text }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function sanitizeText(text) {
  if (!text) return "";
  return text
    .replace(/\0/g, "")
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ")
    .trim();
}

// ── Resume Parser ─────────────────────────────────────────────────────────────

export async function parseResume(rawText) {
  const clean = sanitizeText(rawText);
  if (!clean) throw new Error("Resume text is empty.");

  const { general } = getAIModels();

  const systemPrompt = `You are an expert resume parser. Extract structured information from the resume text.
Respond ONLY with valid JSON — no markdown, no backticks, no explanation text before or after.

The resume text may have various formats. Common patterns:
- Job title on one line, then "Company Name — Location | Date" on the next line
- Or "Job Title at Company Name (dates)"
- Or sections labelled WORK EXPERIENCE, PROFESSIONAL EXPERIENCE, EMPLOYMENT

EXTRACTION RULES:
1. name: The candidate's full name — usually the very first line of the resume.
2. skills: Every technology, programming language, framework, and tool mentioned anywhere.
3. experience[].company: The EXACT employer name as written. Look for patterns like "at CompanyName", "CompanyName —", "CompanyName,". Never leave blank.
4. experience[].title: The exact job title.
5. experience[].duration: The date range (e.g. "May 2022 – Present").
6. experience[].description: 1-2 sentences summarising their responsibilities there.
7. projects[].name: Exact project name, often bolded or on its own line under PROJECTS.
8. projects[].technologies: All technologies listed for that project.

Return ONLY this JSON (no other text):
{
  "name": "Full Name",
  "email": "email or null",
  "summary": "professional summary or null",
  "skills": ["React", "TypeScript", "Node.js"],
  "experience": [
    {
      "title": "Frontend Developer",
      "company": "BrightUI Studio",
      "duration": "May 2022 – Present",
      "description": "Built React component library and migrated legacy jQuery app to React."
    }
  ],
  "projects": [
    {
      "name": "Personal Finance Tracker",
      "description": "Full-featured finance tracker with budgeting and charts.",
      "technologies": ["React", "TypeScript", "Chart.js"]
    }
  ],
  "education": [
    {
      "degree": "B.Sc. Computer Science",
      "institution": "University of Ghana",
      "year": "2020"
    }
  ],
  "certifications": []
}`;

  try {
    const response = await hfChat({
      model: general,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Parse this resume:\n\n${clean.slice(0, 4000)}`,
        },
      ],
    });

    const raw = response?.choices?.[0]?.message?.content?.trim() || "{}";
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());

    return {
      name: parsed.name || "Candidate",
      email: parsed.email || null,
      summary: parsed.summary || null,
      skills: parsed.skills || extractSkillsFallback(clean),
      experience: parsed.experience || [],
      education: parsed.education || [],
      projects: parsed.projects || [],
      certifications: parsed.certifications || [],
    };
  } catch (err) {
    console.error("[ragPipeline] parseResume error:", err.message);
    return {
      name: "Candidate",
      email: null,
      summary: clean.slice(0, 300),
      skills: extractSkillsFallback(clean),
      experience: [],
      education: [],
      projects: [],
      certifications: [],
    };
  }
}

// ── Embeddings ────────────────────────────────────────────────────────────────

export async function generateEmbedding(text) {
  const clean = sanitizeText(text).slice(0, 512);
  try {
    const response = await hfEmbed(clean);
    if (Array.isArray(response) && Array.isArray(response[0]))
      return response[0];
    return response;
  } catch (err) {
    console.error("[ragPipeline] generateEmbedding error:", err.message);
    return null;
  }
}

// ── Store Resume ──────────────────────────────────────────────────────────────

export async function storeResume({ userId, rawText, parsedResume, filename }) {
  const cleanText = sanitizeText(rawText);
  const embedding = await generateEmbedding(cleanText);
  const embeddingStr = embedding ? `[${embedding.join(",")}]` : null;

  const result = await pool.query(
    `INSERT INTO resumes (user_id, raw_text, parsed_data, embedding, filename)
     VALUES ($1, $2, $3, $4::vector, $5)
     RETURNING id, created_at`,
    [
      userId,
      cleanText,
      JSON.stringify(parsedResume),
      embeddingStr,
      filename || null,
    ],
  );

  return result.rows[0];
}

export const ingestResumeToVectorStore = storeResume;

// ── Retrieve Similar Resumes ──────────────────────────────────────────────────

export async function retrieveSimilarContexts({ queryText, limit = 5 }) {
  const embedding = await generateEmbedding(queryText);
  if (!embedding) return [];
  const embeddingStr = `[${embedding.join(",")}]`;
  try {
    const result = await pool.query(
      `SELECT raw_text, parsed_data, 1 - (embedding <=> $1::vector) AS similarity
       FROM resumes WHERE embedding IS NOT NULL
       ORDER BY embedding <=> $1::vector LIMIT $2`,
      [embeddingStr, limit],
    );
    return result.rows;
  } catch (err) {
    console.error("[ragPipeline] retrieveSimilarContexts error:", err.message);
    return [];
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractSkillsFallback(text) {
  const known = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "Go",
    "Rust",
    "Ruby",
    "PHP",
    "React",
    "Angular",
    "Vue",
    "Next.js",
    "Node.js",
    "Express",
    "Django",
    "Flask",
    "Spring",
    "SQL",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "GCP",
    "Git",
    "Linux",
    "REST",
    "GraphQL",
    "HTML",
    "CSS",
    "Bootstrap",
    "Machine Learning",
    "TensorFlow",
    "PyTorch",
    "Pandas",
    "NumPy",
    "Scikit-learn",
  ];
  return known.filter((s) => text.toLowerCase().includes(s.toLowerCase()));
}
