import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Copy, Check } from "lucide-react";

const BOILERPLATES = {
  javascript: `// JavaScript
function solution() {
  // your code here
}

console.log(solution());`,

  typescript: `// TypeScript
function solution(): void {
  // your code here
}

solution();`,

  python: `# Python
def solution():
    # your code here
    pass

print(solution())`,

  java: `// Java
public class Solution {
    public static void main(String[] args) {
        // your code here
    }
}`,

  csharp: `// C#
using System;

class Solution {
    static void Main(string[] args) {
        // your code here
    }
}`,

  cpp: `// C++
#include <iostream>
#include <vector>
using namespace std;

int main() {
    // your code here
    return 0;
}`,

  go: `// Go
package main

import "fmt"

func main() {
    // your code here
    fmt.Println()
}`,

  rust: `// Rust
fn main() {
    // your code here
    println!("");
}`,

  php: `<?php
// PHP
function solution() {
    // your code here
}

echo solution();
?>`,

  swift: `// Swift
func solution() {
    // your code here
}

solution()`,

  kotlin: `// Kotlin
fun main() {
    // your code here
}`,

  ruby: `# Ruby
def solution
  # your code here
end

puts solution`,

  sql: `-- SQL
SELECT *
FROM table_name
WHERE condition;`,

  r: `# R
solution <- function() {
  # your code here
}

print(solution())`,
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
  sql: "SQL",
  r: "R",
};

export default function CodeEditor({
  language = "javascript",
  onCodeChange,
  questionContext,
  initialCode = null,
  startBlank = false,
}) {
  const [code, setCode] = useState(
    startBlank
      ? ""
      : initialCode || BOILERPLATES[language] || BOILERPLATES.javascript,
  );
  const [userHasTyped, setUserHasTyped] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState(language);
  const textareaRef = useRef(null);

  // Reset when language changes or initialCode provided (e.g. DSA challenge)
  useEffect(() => {
    setCode(
      startBlank
        ? ""
        : initialCode ||
            BOILERPLATES[activeLanguage] ||
            BOILERPLATES.javascript,
    );
    setUserHasTyped(false);
  }, [activeLanguage, initialCode, startBlank]);

  // onCodeChange is handled via the effect above

  // Handle Tab key for indentation
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = start + 2;
        e.target.selectionEnd = start + 2;
      }, 0);
    }
    // Ctrl+A selects all
    if (e.key === "a" && (e.ctrlKey || e.metaKey)) {
      e.target.select();
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCode(BOILERPLATES[activeLanguage] || BOILERPLATES.javascript);
  };

  const availableLangs = Object.keys(BOILERPLATES);

  return (
    <div
      style={{
        border: "1px solid rgba(110,231,183,0.25)",
        borderRadius: 12,
        overflow: "hidden",
        background: "#0d1117",
        marginTop: 16,
      }}
    >
      {/* Editor toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          background: "#161b22",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {/* Language selector */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 4,
              overflowX: "auto",
              scrollbarWidth: "none",
              background: "#0d1117",
              borderRadius: 8,
              padding: "3px",
              border: "1px solid rgba(255,255,255,0.06)",
              flex: 1,
            }}
          >
            {availableLangs.map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLanguage(lang)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  background:
                    activeLanguage === lang ? "var(--accent)" : "transparent",
                  color: activeLanguage === lang ? "#0a0e1a" : "#8b949e",
                  transition: "all 0.15s",
                }}
              >
                {LANG_LABELS[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleReset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 12px",
              borderRadius: 6,
              fontSize: 12,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#8b949e",
              cursor: "pointer",
            }}
          >
            <RotateCcw size={12} /> Reset
          </button>
          <button
            onClick={handleCopy}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 12px",
              borderRadius: 6,
              fontSize: 12,
              background: copied ? "rgba(110,231,183,0.15)" : "transparent",
              border: `1px solid ${copied ? "rgba(110,231,183,0.3)" : "rgba(255,255,255,0.1)"}`,
              color: copied ? "var(--accent)" : "#8b949e",
              cursor: "pointer",
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Line numbers + code area */}
      <div style={{ position: "relative", display: "flex" }}>
        {/* Line numbers */}
        <div
          style={{
            padding: "16px 12px",
            background: "#0d1117",
            borderRight: "1px solid rgba(255,255,255,0.04)",
            color: "#484f58",
            fontSize: 13,
            fontFamily:
              "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
            lineHeight: "21px",
            userSelect: "none",
            minWidth: 44,
            textAlign: "right",
          }}
        >
          {code.split("\n").map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Code textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setUserHasTyped(true);
          }}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          style={{
            flex: 1,
            padding: "16px",
            background: "#0d1117",
            color: "#e6edf3",
            border: "none",
            outline: "none",
            fontFamily:
              "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
            fontSize: 13,
            lineHeight: "21px",
            resize: "vertical",
            minHeight: 280,
            tabSize: 2,
            whiteSpace: "pre",
            overflowWrap: "normal",
            overflowX: "auto",
          }}
        />
      </div>

      {/* Footer hint */}
      <div
        style={{
          padding: "8px 16px",
          background: "#161b22",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 11, color: "#484f58" }}>
          Tab = indent · Your code will be submitted with your answer
        </span>
        <span style={{ fontSize: 11, color: "#484f58" }}>
          {LANG_LABELS[activeLanguage]}
        </span>
      </div>
    </div>
  );
}
