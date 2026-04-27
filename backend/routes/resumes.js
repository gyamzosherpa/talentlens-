import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { parseResume, storeResume } from "../services/ragPipeline.js";
import { requireAuth } from "../middleware/auth.js";
import pool from "../db/index.js";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXTRACTOR_SCRIPT = path.join(__dirname, "..", "extract_pdf.py");

// ── Multer ────────────────────────────────────────────────────────────────────
const uploadDir = path.join(process.cwd(), "uploads", "resumes");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx", ".txt"];
    if (allowed.includes(path.extname(file.originalname).toLowerCase()))
      cb(null, true);
    else cb(new Error("Only PDF, DOC, DOCX, TXT files allowed."));
  },
});

// ── PDF text extraction ───────────────────────────────────────────────────────
function extractText(filePath, originalName) {
  const ext = path.extname(originalName).toLowerCase();

  if (ext === ".txt") {
    return fs.readFileSync(filePath, "utf-8");
  }

  if (ext === ".pdf") {
    // Try python3 then python (Windows uses "python")
    for (const pyCmd of ["python3", "python"]) {
      try {
        const result = execSync(
          `${pyCmd} "${EXTRACTOR_SCRIPT}" "${filePath}"`,
          { timeout: 30000, encoding: "utf-8", maxBuffer: 5 * 1024 * 1024 },
        );
        const text = result.trim();
        if (text.length > 100) {
          console.log(`[PDF] Extracted ${text.length} chars using ${pyCmd}`);
          return text;
        }
      } catch (e) {
        console.warn(
          `[PDF] ${pyCmd} extraction failed:`,
          e.message?.slice(0, 100),
        );
      }
    }

    // Last resort: raw binary extraction
    console.warn("[PDF] Python extraction failed — using binary fallback");
    const buffer = fs.readFileSync(filePath);
    const raw = buffer.toString("latin1");
    return raw
      .replace(/\0/g, "")
      .replace(/[^\x20-\x7E\n\r\t]/g, " ")
      .replace(/\s{4,}/g, "\n")
      .trim();
  }

  // .doc / .docx
  try {
    return fs.readFileSync(filePath, "utf-8").replace(/\0/g, "");
  } catch {
    return `Resume: ${originalName}`;
  }
}

// ── POST /api/resumes/upload ──────────────────────────────────────────────────
router.post(
  "/upload",
  requireAuth,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ error: "No file uploaded." });

      // Extract text from the file
      let rawText = "";
      try {
        rawText = extractText(req.file.path, req.file.originalname);
      } catch (extractErr) {
        console.error("[Resume] Text extraction error:", extractErr.message);
      }

      if (!rawText?.trim() || rawText.trim().length < 30) {
        return res.status(400).json({
          error:
            "Could not read text from this PDF. Please try: File → Save As → Plain Text (.txt) and upload that instead.",
        });
      }

      console.log(
        `[Resume] Extracted ${rawText.length} chars from "${req.file.originalname}"`,
      );

      // Parse resume with LLM — has internal fallback, never throws
      let parsedResume;
      try {
        parsedResume = await parseResume(rawText);
      } catch (parseErr) {
        console.error("[Resume] parseResume error:", parseErr.message);
        // Build minimal fallback so upload still succeeds
        parsedResume = {
          name: req.user?.name || "Candidate",
          email: null,
          summary: rawText.slice(0, 300),
          skills: [],
          experience: [],
          education: [],
          projects: [],
          certifications: [],
        };
      }

      // Store in DB — never throws (handles embedding failures gracefully)
      let stored;
      try {
        stored = await storeResume({
          userId: req.user.id,
          rawText,
          parsedResume,
          filename: req.file.originalname,
        });
      } catch (storeErr) {
        console.error("[Resume] storeResume error:", storeErr.message);
        return res.status(500).json({
          error: "Failed to save resume to database. Please try again.",
          detail: storeErr.message,
        });
      }

      console.log(
        `[Resume] Stored resumeId=${stored.id} for user=${req.user.id}`,
      );

      res.status(201).json({
        message: "Resume uploaded and processed.",
        resumeId: stored.id,
        parsedResume,
      });
    } catch (err) {
      console.error("[resumes] upload error:", err);
      res.status(500).json({
        error: "Unexpected error processing resume. Please try again.",
      });
    }
  },
);

// ── GET /api/resumes ──────────────────────────────────────────────────────────
router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, filename, created_at FROM resumes WHERE user_id=$1 ORDER BY created_at DESC",
      [req.user.id],
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch resumes." });
  }
});

// ── GET /api/resumes/:id ──────────────────────────────────────────────────────
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, parsed_data, raw_text, filename, created_at FROM resumes WHERE id=$1 AND user_id=$2",
      [req.params.id, req.user.id],
    );
    if (!result.rows.length)
      return res.status(404).json({ error: "Resume not found." });
    const row = result.rows[0];
    if (typeof row.parsed_data === "string") {
      try {
        row.parsed_data = JSON.parse(row.parsed_data);
      } catch {}
    }
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch resume." });
  }
});

export default router;
