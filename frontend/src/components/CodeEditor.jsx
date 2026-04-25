import { useEffect, useRef, useState } from "react";
import { RotateCcw, Copy, Check } from "lucide-react";

const BOILERPLATES = {
  javascript: "// JavaScript\nfunction solution() {\n  // your code here\n}\n",
  typescript:
    "// TypeScript\nfunction solution(): void {\n  // your code here\n}\n",
  python: "# Python\ndef solution():\n    # your code here\n    pass\n",
  java: "// Java\nclass Solution {\n    public void solve() {\n        // your code here\n    }\n}\n",
  csharp:
    "// C#\nclass Solution {\n    public void Solve() {\n        // your code here\n    }\n}\n",
  cpp: "// C++\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}\n",
  go: "// Go\nfunc solution() {\n    // your code here\n}\n",
  rust: "// Rust\nfn solution() {\n    // your code here\n}\n",
  php: "<?php\nfunction solution() {\n    // your code here\n}\n",
  swift: "// Swift\nfunc solution() {\n    // your code here\n}\n",
  kotlin: "// Kotlin\nfun solution() {\n    // your code here\n}\n",
  ruby: "# Ruby\ndef solution\n  # your code here\nend\n",
  r: "# R\nsolution <- function() {\n  # your code here\n}\n",
  sql: "-- SQL\nSELECT *\nFROM table_name\nWHERE condition;\n",
};

const LANG_LABELS = {
  javascript: "JS",
  typescript: "TS",
  python: "Python",
  java: "Java",
  csharp: "C#",
  cpp: "C++",
  go: "Go",
  rust: "Rust",
  php: "PHP",
  swift: "Swift",
  kotlin: "Kotlin",
  ruby: "Ruby",
  r: "R",
  sql: "SQL",
};

// ── Syntax highlight via simple token replacement ─────────────────────────────
// Uses a token-based approach: replace code section by section, not regex on full code
// This avoids any Babel/JSX parsing issues with regex literals

function escHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const KW = {
  javascript: [
    "const",
    "let",
    "var",
    "function",
    "return",
    "if",
    "else",
    "for",
    "while",
    "do",
    "switch",
    "case",
    "break",
    "continue",
    "class",
    "new",
    "this",
    "typeof",
    "instanceof",
    "import",
    "export",
    "default",
    "from",
    "async",
    "await",
    "try",
    "catch",
    "finally",
    "throw",
    "of",
    "in",
    "true",
    "false",
    "null",
    "undefined",
    "void",
    "delete",
    "yield",
    "extends",
    "super",
    "static",
    "get",
    "set",
  ],
  typescript: [
    "const",
    "let",
    "var",
    "function",
    "return",
    "if",
    "else",
    "for",
    "while",
    "do",
    "switch",
    "case",
    "break",
    "continue",
    "class",
    "new",
    "this",
    "typeof",
    "instanceof",
    "import",
    "export",
    "default",
    "from",
    "async",
    "await",
    "try",
    "catch",
    "finally",
    "throw",
    "of",
    "in",
    "true",
    "false",
    "null",
    "undefined",
    "void",
    "delete",
    "yield",
    "extends",
    "super",
    "static",
    "get",
    "set",
    "interface",
    "type",
    "enum",
    "implements",
    "namespace",
    "declare",
    "abstract",
    "readonly",
    "private",
    "public",
    "protected",
  ],
  python: [
    "def",
    "class",
    "return",
    "if",
    "elif",
    "else",
    "for",
    "while",
    "import",
    "from",
    "as",
    "with",
    "try",
    "except",
    "finally",
    "raise",
    "pass",
    "break",
    "continue",
    "lambda",
    "yield",
    "global",
    "nonlocal",
    "async",
    "await",
    "and",
    "or",
    "not",
    "in",
    "is",
    "True",
    "False",
    "None",
    "self",
    "print",
    "len",
    "range",
  ],
  java: [
    "public",
    "private",
    "protected",
    "class",
    "interface",
    "extends",
    "implements",
    "return",
    "if",
    "else",
    "for",
    "while",
    "do",
    "switch",
    "case",
    "break",
    "continue",
    "new",
    "this",
    "super",
    "static",
    "final",
    "void",
    "import",
    "package",
    "try",
    "catch",
    "finally",
    "throw",
    "throws",
    "abstract",
    "enum",
    "instanceof",
    "null",
    "true",
    "false",
    "int",
    "long",
    "double",
    "float",
    "boolean",
    "char",
    "String",
  ],
  csharp: [
    "public",
    "private",
    "protected",
    "class",
    "interface",
    "abstract",
    "sealed",
    "override",
    "virtual",
    "return",
    "if",
    "else",
    "for",
    "foreach",
    "while",
    "do",
    "switch",
    "case",
    "break",
    "continue",
    "new",
    "this",
    "base",
    "static",
    "readonly",
    "const",
    "using",
    "namespace",
    "try",
    "catch",
    "finally",
    "throw",
    "async",
    "await",
    "var",
    "null",
    "true",
    "false",
    "int",
    "long",
    "double",
    "float",
    "bool",
    "string",
    "void",
    "byte",
  ],
  cpp: [
    "int",
    "long",
    "double",
    "float",
    "char",
    "bool",
    "void",
    "auto",
    "return",
    "if",
    "else",
    "for",
    "while",
    "do",
    "switch",
    "case",
    "break",
    "continue",
    "class",
    "struct",
    "public",
    "private",
    "protected",
    "new",
    "delete",
    "this",
    "virtual",
    "override",
    "namespace",
    "using",
    "include",
    "true",
    "false",
    "nullptr",
    "const",
    "static",
    "template",
    "typename",
  ],
  go: [
    "func",
    "return",
    "if",
    "else",
    "for",
    "range",
    "switch",
    "case",
    "break",
    "continue",
    "var",
    "const",
    "type",
    "struct",
    "interface",
    "package",
    "import",
    "go",
    "defer",
    "select",
    "chan",
    "map",
    "make",
    "new",
    "nil",
    "true",
    "false",
    "len",
    "cap",
    "append",
    "delete",
    "error",
    "string",
    "int",
    "float64",
    "bool",
  ],
  rust: [
    "fn",
    "return",
    "if",
    "else",
    "for",
    "while",
    "loop",
    "match",
    "break",
    "continue",
    "let",
    "mut",
    "const",
    "use",
    "mod",
    "struct",
    "enum",
    "impl",
    "trait",
    "pub",
    "self",
    "super",
    "move",
    "ref",
    "in",
    "where",
    "type",
    "async",
    "await",
    "true",
    "false",
    "None",
    "Some",
    "Ok",
    "Err",
  ],
  sql: [
    "SELECT",
    "FROM",
    "WHERE",
    "JOIN",
    "LEFT",
    "RIGHT",
    "INNER",
    "OUTER",
    "ON",
    "AND",
    "OR",
    "NOT",
    "IN",
    "IS",
    "NULL",
    "AS",
    "GROUP",
    "BY",
    "ORDER",
    "HAVING",
    "LIMIT",
    "OFFSET",
    "DISTINCT",
    "INSERT",
    "INTO",
    "VALUES",
    "UPDATE",
    "SET",
    "DELETE",
    "CREATE",
    "ALTER",
    "DROP",
    "TABLE",
    "WITH",
    "UNION",
    "ALL",
    "CASE",
    "WHEN",
    "THEN",
    "ELSE",
    "END",
    "COUNT",
    "SUM",
    "AVG",
    "MAX",
    "MIN",
    "OVER",
    "PARTITION",
    "RANK",
    "ROW_NUMBER",
  ],
  php: [
    "function",
    "return",
    "if",
    "else",
    "for",
    "foreach",
    "while",
    "do",
    "switch",
    "case",
    "break",
    "continue",
    "class",
    "new",
    "this",
    "public",
    "private",
    "protected",
    "static",
    "echo",
    "print",
    "true",
    "false",
    "null",
    "array",
    "string",
    "int",
    "bool",
    "use",
    "namespace",
    "extends",
    "implements",
  ],
  kotlin: [
    "fun",
    "return",
    "if",
    "else",
    "for",
    "while",
    "do",
    "when",
    "break",
    "continue",
    "class",
    "object",
    "interface",
    "new",
    "this",
    "super",
    "val",
    "var",
    "import",
    "package",
    "try",
    "catch",
    "finally",
    "throw",
    "null",
    "true",
    "false",
    "override",
    "open",
    "data",
    "sealed",
    "companion",
    "by",
    "is",
    "as",
    "in",
  ],
  swift: [
    "func",
    "return",
    "if",
    "else",
    "for",
    "while",
    "do",
    "switch",
    "case",
    "break",
    "continue",
    "class",
    "struct",
    "enum",
    "new",
    "self",
    "super",
    "let",
    "var",
    "import",
    "try",
    "catch",
    "throw",
    "nil",
    "true",
    "false",
    "override",
    "final",
    "static",
    "mutating",
    "protocol",
    "extension",
    "guard",
    "in",
    "as",
    "is",
  ],
  ruby: [
    "def",
    "class",
    "return",
    "if",
    "elsif",
    "else",
    "for",
    "while",
    "do",
    "case",
    "when",
    "break",
    "next",
    "new",
    "self",
    "super",
    "require",
    "include",
    "end",
    "nil",
    "true",
    "false",
    "puts",
    "print",
    "attr_accessor",
    "attr_reader",
    "module",
    "yield",
    "and",
    "or",
    "not",
    "in",
    "begin",
    "rescue",
    "ensure",
  ],
  r: [
    "function",
    "return",
    "if",
    "else",
    "for",
    "while",
    "repeat",
    "break",
    "next",
    "TRUE",
    "FALSE",
    "NULL",
    "NA",
    "Inf",
    "NaN",
    "library",
    "require",
    "source",
    "print",
    "cat",
  ],
};

function highlight(code, lang) {
  if (!code) return "";
  let lines = code.split("\n");
  const keywords = KW[lang] || KW.javascript;
  const isSql = lang === "sql";
  const isPython = lang === "python" || lang === "ruby" || lang === "r";
  const isHash = isPython;

  return lines
    .map((line) => {
      let out = escHtml(line);

      // Comments (must do first so keywords inside comments aren't colored)
      if (isSql) {
        out = out.replace(
          /^(\s*)(--.*)/g,
          (_, sp, cm) => sp + '<span class="hl-c">' + cm + "</span>",
        );
      } else if (isHash) {
        out = out.replace(
          /^(\s*)(#.*)/g,
          (_, sp, cm) => sp + '<span class="hl-c">' + cm + "</span>",
        );
      } else {
        out = out.replace(
          /^(\s*)(\/\/.*)/g,
          (_, sp, cm) => sp + '<span class="hl-c">' + cm + "</span>",
        );
      }

      // String literals — safe single approach (no backtick regex)
      out = out.replace(
        /(&quot;[^&]*(?:&amp;[^&]*)*&quot;)/g,
        '<span class="hl-s">$1</span>',
      );
      out = out.replace(/(&#39;[^&#]*&#39;)/g, '<span class="hl-s">$1</span>');
      // Note: we use HTML-escaped versions (&quot; for ", &#39; for ')

      // Numbers
      out = out.replace(/\b(\d+\.?\d*)\b/g, '<span class="hl-n">$1</span>');

      // Keywords
      keywords.forEach((kw) => {
        const safe = escHtml(kw);
        // Word boundary replacement using split/join to avoid regex with variable content
        const parts = out.split(
          new RegExp("(?<![\\w-])" + safe + "(?![\\w-])"),
        );
        if (parts.length > 1) {
          out = parts.join('<span class="hl-kw">' + safe + "</span>");
        }
      });

      return out;
    })
    .join("\n");
}

const HL_CSS = `
  .hl-kw { color: #ff7b72; font-weight: 600; }
  .hl-s  { color: #a5d6ff; }
  .hl-c  { color: #8b949e; font-style: italic; }
  .hl-n  { color: #f8c555; }
`;

export default function CodeEditor({
  language = "javascript",
  onCodeChange,
  onLanguageChange,
  questionContext,
  initialCode = null,
  startBlank = false,
}) {
  const [code, setCode] = useState(
    startBlank ? "" : initialCode || BOILERPLATES[language] || "",
  );
  const [userHasTyped, setUserHasTyped] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeLang, setActiveLang] = useState(language);
  const textareaRef = useRef(null);
  const backdropRef = useRef(null);
  const lineNumRef = useRef(null);
  const prevInitial = useRef(initialCode);

  // Reset when question changes (initialCode or startBlank changes)
  useEffect(() => {
    if (initialCode !== prevInitial.current || startBlank) {
      prevInitial.current = initialCode;
      const fresh = startBlank
        ? ""
        : initialCode || BOILERPLATES[activeLang] || "";
      setCode(fresh);
      setUserHasTyped(false);
      onCodeChange?.(fresh);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode, startBlank]);

  const syncScroll = () => {
    const ta = textareaRef.current;
    const bd = backdropRef.current;
    const ln = lineNumRef.current;
    if (ta && bd) {
      bd.scrollTop = ta.scrollTop;
      bd.scrollLeft = ta.scrollLeft;
    }
    if (ta && ln) {
      ln.scrollTop = ta.scrollTop;
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setCode(val);
    setUserHasTyped(true);
    onCodeChange?.(val);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.target;
      const s = ta.selectionStart,
        en = ta.selectionEnd;
      const next = code.substring(0, s) + "  " + code.substring(en);
      setCode(next);
      onCodeChange?.(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = s + 2;
      });
    }
  };

  const handleLangChange = (lang) => {
    setActiveLang(lang);
    onLanguageChange?.(lang);
    if (!userHasTyped) {
      const fresh = startBlank ? "" : BOILERPLATES[lang] || "";
      setCode(fresh);
      onCodeChange?.(fresh);
    }
  };

  const handleReset = () => {
    const fresh = startBlank ? "" : BOILERPLATES[activeLang] || "";
    setCode(fresh);
    setUserHasTyped(false);
    onCodeChange?.(fresh);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const langs = Object.keys(BOILERPLATES);
  const lineCount = (code || "").split("\n").length;
  const highlighted = highlight(code, activeLang);

  const MONO =
    "'JetBrains Mono','Fira Code','Cascadia Code',Consolas,monospace";
  const FS = "13px";
  const LH = "21px";
  const PAD = "14px";

  return (
    <div
      style={{
        border: "1px solid rgba(110,231,183,0.2)",
        borderRadius: 12,
        overflow: "hidden",
        background: "#0d1117",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      <style>{HL_CSS}</style>

      {/* ── Language bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#161b22",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "6px 10px",
          gap: 4,
          overflowX: "auto",
        }}
      >
        <div style={{ display: "flex", gap: 3, flex: 1, flexWrap: "nowrap" }}>
          {langs.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLangChange(lang)}
              style={{
                padding: "3px 10px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: "nowrap",
                background:
                  activeLang === lang ? "var(--accent,#6ee7b7)" : "transparent",
                color: activeLang === lang ? "#0a0e1a" : "#8b949e",
              }}
            >
              {LANG_LABELS[lang]}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button
            onClick={handleReset}
            title="Reset"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#8b949e",
              padding: "3px 8px",
              borderRadius: 6,
              fontSize: 12,
            }}
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={handleCopy}
            title="Copy"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: copied ? "var(--accent,#6ee7b7)" : "#8b949e",
              padding: "3px 8px",
              borderRadius: 6,
              fontSize: 12,
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* ── Editor body ── */}
      <div
        style={{
          position: "relative",
          display: "flex",
          minHeight: 260,
          maxHeight: 440,
          overflow: "hidden",
        }}
      >
        {/* Line numbers */}
        <div
          ref={lineNumRef}
          style={{
            padding: `${PAD} 10px`,
            background: "#0d1117",
            borderRight: "1px solid rgba(255,255,255,0.04)",
            color: "#484f58",
            fontSize: FS,
            fontFamily: MONO,
            lineHeight: LH,
            userSelect: "none",
            minWidth: 40,
            textAlign: "right",
            flexShrink: 0,
            overflowY: "hidden",
          }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Highlighted backdrop */}
        <div
          ref={backdropRef}
          aria-hidden="true"
          dangerouslySetInnerHTML={{
            __html: highlighted.replace(/\n/g, "<br/>") + "<br/>",
          }}
          style={{
            position: "absolute",
            left: 40,
            top: 0,
            right: 0,
            bottom: 0,
            padding: PAD,
            fontFamily: MONO,
            fontSize: FS,
            lineHeight: LH,
            whiteSpace: "pre",
            overflowWrap: "normal",
            pointerEvents: "none",
            zIndex: 1,
            overflowY: "hidden",
            overflowX: "hidden",
            color: "#e6edf3",
            background: "transparent",
            wordBreak: "normal",
          }}
        />

        {/* Transparent textarea on top */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onScroll={syncScroll}
          placeholder="Write your code here…"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          style={{
            flex: 1,
            padding: PAD,
            background: "transparent",
            color: "transparent",
            caretColor: "#e6edf3",
            border: "none",
            outline: "none",
            fontFamily: MONO,
            fontSize: FS,
            lineHeight: LH,
            resize: "none",
            whiteSpace: "pre",
            overflowWrap: "normal",
            overflowX: "auto",
            overflowY: "auto",
            position: "relative",
            zIndex: 2,
            minHeight: 260,
          }}
        />
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          padding: "6px 14px",
          background: "#161b22",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: "#484f58",
        }}
      >
        <span>Tab = 2 spaces · Submit to evaluate your solution</span>
        <span>{LANG_LABELS[activeLang]}</span>
      </div>
    </div>
  );
}
