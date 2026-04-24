import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, AlertCircle } from "lucide-react";

/**
 * Speech-to-text component using Web Speech API.
 * Streams interim text into the answer box in real-time.
 * Appends final transcripts to the existing text.
 */
export default function SpeechInput({
  onTranscript,
  disabled = false,
  language = "en-US",
}) {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [supported, setSupported] = useState(true);
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);
  const restartRef = useRef(false);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = language;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      setListening(true);
      setError("");
    };
    rec.onend = () => {
      setListening(false);
      setInterim("");
      // Auto-restart if user didn't stop manually (handles Chrome's 60s limit)
      if (restartRef.current) {
        try {
          rec.start();
        } catch {}
      }
    };
    rec.onerror = (e) => {
      if (e.error === "no-speech") return; // ignore silence
      if (e.error === "not-allowed")
        setError("Microphone access denied. Please allow mic in your browser.");
      else if (e.error === "network")
        setError("Network error — check your connection.");
      setListening(false);
    };
    rec.onresult = (e) => {
      let interimText = "";
      let finalText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t + " ";
        else interimText += t;
      }
      setInterim(interimText);
      if (finalText) {
        onTranscript(finalText);
        setInterim("");
      }
    };

    recognitionRef.current = rec;
    return () => {
      restartRef.current = false;
      try {
        rec.stop();
      } catch {}
    };
  }, [language, onTranscript]);

  const toggle = useCallback(() => {
    if (!recognitionRef.current) return;
    if (listening) {
      restartRef.current = false;
      recognitionRef.current.stop();
    } else {
      restartRef.current = true;
      setError("");
      try {
        recognitionRef.current.start();
      } catch {}
    }
  }, [listening]);

  if (!supported) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Mic button */}
        <button
          onClick={toggle}
          disabled={disabled}
          title={listening ? "Stop speaking" : "Speak your answer"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 8,
            cursor: "pointer",
            fontFamily: "DM Sans,sans-serif",
            fontWeight: 600,
            fontSize: 13,
            transition: "all .2s",
            background: listening
              ? "rgba(248,113,113,0.15)"
              : "rgba(110,231,183,0.1)",
            color: listening ? "var(--red)" : "var(--accent)",
            border: `1px solid ${listening ? "rgba(248,113,113,0.3)" : "rgba(110,231,183,0.2)"}`,
            opacity: disabled ? 0.5 : 1,
          }}
        >
          {listening ? (
            <>
              <MicOff size={15} /> Stop speaking
            </>
          ) : (
            <>
              <Mic size={15} /> Speak answer
            </>
          )}
          {listening && (
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--red)",
                animation: "pulse-ring 1.2s infinite",
                marginLeft: 2,
              }}
            />
          )}
        </button>

        {listening && (
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            🎙 Listening… speak clearly
          </span>
        )}
      </div>

      {/* Interim transcript preview */}
      {interim && (
        <div
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            fontSize: 13,
            background: "rgba(110,231,183,0.06)",
            border: "1px dashed rgba(110,231,183,0.2)",
            color: "var(--text-muted)",
            fontStyle: "italic",
          }}
        >
          <span
            style={{
              color: "var(--accent)",
              fontSize: 11,
              fontWeight: 600,
              display: "block",
              marginBottom: 2,
            }}
          >
            Transcribing…
          </span>
          {interim}
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "var(--red)",
          }}
        >
          <AlertCircle size={12} /> {error}
        </div>
      )}
    </div>
  );
}
