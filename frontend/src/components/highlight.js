// highlight.js — syntax highlighting for CodeEditor
// Plain JS file (no JSX) so regex patterns parse without Babel conflicts

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function wrapKw(code, words) {
  const pat = new RegExp("\\b(" + words.join("|") + ")\\b", "g");
  return code.replace(pat, '<span class="hl-kw">$1</span>');
}

function wrapNum(code) {
  return code.replace(/\b(\d+\.?\d*)\b/g, '<span class="hl-num">$1</span>');
}

function wrapLineComment(code, marker) {
  // marker = '//' or '#' or '--'
  if (marker === "//") {
    return code.replace(/(\/\/[^\n]*)/g, '<span class="hl-comment">$1</span>');
  } else if (marker === "#") {
    return code.replace(/(#[^\n]*)/g, '<span class="hl-comment">$1</span>');
  } else if (marker === "--") {
    return code.replace(/(--[^\n]*)/g, '<span class="hl-comment">$1</span>');
  }
  return code;
}

function wrapBlockComment(code) {
  return code.replace(
    /(\/\*[\s\S]*?\*\/)/g,
    '<span class="hl-comment">$1</span>',
  );
}

// String literals — matches single-quoted strings only (safe, no backtick needed)
function wrapStringSingle(code) {
  return code.replace(
    /('[^'\\]*(?:\\.[^'\\]*)*')/g,
    '<span class="hl-str">$1</span>',
  );
}

function wrapStringDouble(code) {
  return code.replace(
    /("[^"\\]*(?:\\.[^"\\]*)*")/g,
    '<span class="hl-str">$1</span>',
  );
}

// Highlight JS/TS — handles //, /* */, double-quoted strings, single-quoted strings
// Backtick template literals are left uncolored (safe to skip for readability)
function highlightJS(code) {
  let s = esc(code);
  s = wrapBlockComment(s);
  s = wrapLineComment(s, "//");
  s = wrapStringDouble(s);
  s = wrapStringSingle(s);
  s = wrapKw(s, [
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
    "Promise",
    "Array",
    "Object",
    "Map",
    "Set",
    "Error",
  ]);
  s = wrapNum(s);
  return s;
}

function highlightPython(code) {
  let s = esc(code);
  s = wrapLineComment(s, "#");
  s = wrapStringDouble(s);
  s = wrapStringSingle(s);
  s = wrapKw(s, [
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
    "print",
    "len",
    "range",
    "enumerate",
    "zip",
    "map",
    "filter",
    "sorted",
    "list",
    "dict",
    "set",
    "tuple",
    "int",
    "str",
    "float",
  ]);
  s = s.replace(/\b(self|cls)\b/g, '<span class="hl-self">$1</span>');
  s = wrapNum(s);
  return s;
}

function highlightJava(code) {
  let s = esc(code);
  s = wrapBlockComment(s);
  s = wrapLineComment(s, "//");
  s = wrapStringDouble(s);
  s = wrapKw(s, [
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
    "byte",
    "short",
    "ArrayList",
    "HashMap",
    "List",
    "Map",
    "Set",
    "Optional",
  ]);
  s = wrapNum(s);
  return s;
}

function highlightCSharp(code) {
  let s = esc(code);
  s = wrapBlockComment(s);
  s = wrapLineComment(s, "//");
  s = wrapStringDouble(s);
  s = wrapKw(s, [
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
    "object",
    "List",
    "Dictionary",
    "Task",
    "IEnumerable",
    "IQueryable",
    "where",
    "select",
    "from",
    "orderby",
    "group",
    "join",
  ]);
  s = wrapNum(s);
  return s;
}

function highlightGo(code) {
  let s = esc(code);
  s = wrapLineComment(s, "//");
  s = wrapBlockComment(s);
  s = wrapStringDouble(s);
  s = wrapKw(s, [
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
    "int64",
    "float64",
    "bool",
    "byte",
    "rune",
    "uint",
    "goroutine",
    "panic",
    "recover",
  ]);
  s = wrapNum(s);
  return s;
}

function highlightRust(code) {
  let s = esc(code);
  s = wrapLineComment(s, "//");
  s = wrapBlockComment(s);
  s = wrapStringDouble(s);
  s = wrapKw(s, [
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
    "Box",
    "Vec",
    "Option",
    "Result",
    "Some",
    "None",
    "Ok",
    "Err",
    "true",
    "false",
    "i32",
    "i64",
    "u32",
    "u64",
    "f32",
    "f64",
    "usize",
    "bool",
    "str",
    "String",
  ]);
  s = wrapNum(s);
  return s;
}

function highlightSQL(code) {
  let s = esc(code);
  s = wrapLineComment(s, "--");
  s = wrapStringSingle(s);
  const kwds = [
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
    "INDEX",
    "VIEW",
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
    "COALESCE",
    "OVER",
    "PARTITION",
    "ROW_NUMBER",
    "RANK",
    "DENSE_RANK",
    "LAG",
    "LEAD",
    "NULLIF",
    "CAST",
    "CONVERT",
    "EXTRACT",
    "DATE",
    "TIMESTAMP",
  ];
  const sqlPat = new RegExp("\\b(" + kwds.join("|") + ")\\b", "gi");
  s = s.replace(sqlPat, '<span class="hl-kw">$1</span>');
  s = wrapNum(s);
  return s;
}

function highlightGeneric(code) {
  return esc(code);
}

export function getHighlighter(lang) {
  const map = {
    javascript: highlightJS,
    typescript: highlightJS,
    python: highlightPython,
    java: highlightJava,
    csharp: highlightCSharp,
    go: highlightGo,
    rust: highlightRust,
    sql: highlightSQL,
    php: highlightJS,
    kotlin: highlightJava,
    swift: highlightGo,
    ruby: highlightPython,
    r: highlightPython,
    cpp: highlightJava,
  };
  return map[lang] || highlightGeneric;
}

export const HL_STYLES = `
  .hl-kw      { color: #ff7b72; font-weight: 600; }
  .hl-str     { color: #a5d6ff; }
  .hl-comment { color: #8b949e; font-style: italic; }
  .hl-num     { color: #f8c555; }
  .hl-self    { color: #ffa657; }
`;
