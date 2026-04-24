import { useState, useRef, useEffect, useCallback } from "react";

const SQL_KEYWORDS = [
  "SELECT",
  "FROM",
  "WHERE",
  "JOIN",
  "LEFT",
  "RIGHT",
  "INNER",
  "OUTER",
  "FULL",
  "CROSS",
  "ON",
  "AND",
  "OR",
  "NOT",
  "IN",
  "EXISTS",
  "BETWEEN",
  "LIKE",
  "IS",
  "NULL",
  "AS",
  "GROUP BY",
  "ORDER BY",
  "HAVING",
  "LIMIT",
  "OFFSET",
  "DISTINCT",
  "ALL",
  "INSERT INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE FROM",
  "CREATE TABLE",
  "ALTER TABLE",
  "DROP TABLE",
  "TRUNCATE",
  "COUNT",
  "SUM",
  "AVG",
  "MAX",
  "MIN",
  "COALESCE",
  "NULLIF",
  "CASE",
  "WHEN",
  "THEN",
  "ELSE",
  "END",
  "UNION",
  "UNION ALL",
  "INTERSECT",
  "EXCEPT",
  "WITH",
  "RECURSIVE",
  "OVER",
  "PARTITION BY",
  "ROW_NUMBER",
  "RANK",
  "DENSE_RANK",
  "LAG",
  "LEAD",
  "INTEGER",
  "VARCHAR",
  "TEXT",
  "DATE",
  "TIMESTAMP",
  "BOOLEAN",
  "NUMERIC",
  "FLOAT",
  "PRIMARY KEY",
  "FOREIGN KEY",
  "REFERENCES",
  "UNIQUE",
  "NOT NULL",
  "DEFAULT",
  "INDEX",
  "VIEW",
  "PROCEDURE",
  "FUNCTION",
  "TRIGGER",
];

const KEYWORD_SET = new Set(SQL_KEYWORDS.map((k) => k.toUpperCase()));

/**
 * SqlEditor — a clean SQL-specific editor with:
 * - Syntax-highlighted keywords in the backdrop layer
 * - Line numbers
 * - Tab → 2 spaces
 * - Auto-uppercase SQL keywords
 * - Dark theme matching the app
 */
export default function SqlEditor({ value = "", onChange }) {
  const textareaRef = useRef(null);
  const backdropRef = useRef(null);
  const lineNumRef = useRef(null);

  // Sync scroll between textarea and backdrop
  const syncScroll = useCallback(() => {
    if (!textareaRef.current || !backdropRef.current) return;
    backdropRef.current.scrollTop = textareaRef.current.scrollTop;
    backdropRef.current.scrollLeft = textareaRef.current.scrollLeft;
    if (lineNumRef.current)
      lineNumRef.current.scrollTop = textareaRef.current.scrollTop;
  }, []);

  // Highlight SQL keywords in display layer
  const highlight = (text) => {
    if (!text) return "<br/>";
    // Escape HTML
    const safe = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Highlight tokens
    return (
      safe
        .replace(/\b([A-Za-z_][A-Za-z0-9_]*)\b/g, (match) => {
          const upper = match.toUpperCase();
          if (KEYWORD_SET.has(upper)) {
            return `<span class="sql-kw">${match}</span>`;
          }
          return match;
        })
        // Highlight strings
        .replace(/'([^']*)'/g, `<span class="sql-str">'$1'</span>`)
        // Highlight numbers
        .replace(/\b(\d+)\b/g, `<span class="sql-num">$1</span>`)
        // Highlight comments
        .replace(/(--[^\n]*)/g, `<span class="sql-comment">$1</span>`)
        // Preserve newlines
        .replace(/\n/g, "<br/>")
    );
  };

  const lineCount = (value || "").split("\n").length;

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = textareaRef.current;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newVal = value.substring(0, start) + "  " + value.substring(end);
      onChange(newVal);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
  };

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const MONO =
    "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace";
  const FONT_SIZE = "13.5px";
  const LINE_H = "1.75";
  const PAD_V = "14px";
  const PAD_H = "14px";
  const LINE_NUM_W = "36px";

  const sharedStyle = {
    fontFamily: MONO,
    fontSize: FONT_SIZE,
    lineHeight: LINE_H,
    padding: `${PAD_V} ${PAD_H}`,
    margin: 0,
    border: "none",
    outline: "none",
    overflowY: "auto",
    overflowX: "auto",
    whiteSpace: "pre",
    wordBreak: "normal",
    boxSizing: "border-box",
    width: "100%",
    minHeight: "240px",
    maxHeight: "440px",
  };

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 10,
        overflow: "hidden",
        border: "1px solid rgba(96,165,250,0.25)",
        background: "#0d1117",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      {/* ── Header bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(96,165,250,0.06)",
          borderBottom: "1px solid rgba(96,165,250,0.15)",
          padding: "7px 14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 11,
              color: "#60a5fa",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            SQL
          </span>
          <span style={{ fontSize: 11, color: "#4b5563" }}>query editor</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5f56", "#ffbd2e", "#27c93f"].map((c, i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: c,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Editor body ── */}
      <style>{`
        .sql-kw      { color: #60a5fa; font-weight: 700; }
        .sql-str     { color: #a3e635; }
        .sql-num     { color: #fb923c; }
        .sql-comment { color: #6b7280; font-style: italic; }
      `}</style>

      <div style={{ display: "flex", position: "relative" }}>
        {/* Line numbers */}
        <div
          ref={lineNumRef}
          style={{
            ...sharedStyle,
            width: LINE_NUM_W,
            minWidth: LINE_NUM_W,
            maxWidth: LINE_NUM_W,
            padding: `${PAD_V} 0`,
            background: "#0d1117",
            color: "#374151",
            textAlign: "right",
            userSelect: "none",
            overflow: "hidden",
            flexShrink: 0,
            borderRight: "1px solid rgba(96,165,250,0.08)",
            paddingRight: "8px",
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
          dangerouslySetInnerHTML={{ __html: highlight(value) || "<br/>" }}
          style={{
            ...sharedStyle,
            position: "absolute",
            left: LINE_NUM_W,
            top: 0,
            right: 0,
            bottom: 0,
            color: "#e5e7eb",
            background: "transparent",
            pointerEvents: "none",
            zIndex: 1,
            overflowY: "hidden",
          }}
        />

        {/* Actual textarea (transparent text, caret visible) */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onScroll={syncScroll}
          placeholder={"-- Write your SQL query here\nSELECT ..."}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          style={{
            ...sharedStyle,
            position: "relative",
            zIndex: 2,
            background: "transparent",
            color: "transparent",
            caretColor: "#60a5fa",
            resize: "vertical",
            flex: 1,
            paddingLeft: PAD_H,
          }}
        />
      </div>

      {/* ── Footer: quick reference ── */}
      <div
        style={{
          borderTop: "1px solid rgba(96,165,250,0.08)",
          padding: "6px 14px",
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        {[
          ["SELECT … FROM … WHERE …", "#60a5fa"],
          ["GROUP BY … HAVING …", "#60a5fa"],
          ["JOIN … ON …", "#60a5fa"],
          ["-- comment", "#6b7280"],
        ].map(([kw, col]) => (
          <span
            key={kw}
            style={{
              fontSize: 11,
              color: col,
              fontFamily: MONO,
              opacity: 0.75,
            }}
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}
