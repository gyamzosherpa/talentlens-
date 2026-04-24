import { useEffect, useRef, useState, useCallback } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  AlertCircle,
  Maximize2,
  Minimize2,
} from "lucide-react";

export default function CameraFeed({ isActive = true }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [camOn, setCamOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [hasPerms, setHasPerms] = useState(false);

  // Start stream
  const startStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPerms(true);
      setError("");
    } catch (err) {
      if (err.name === "NotAllowedError") {
        setError(
          "Camera permission denied. Click the camera icon in your browser address bar to allow.",
        );
      } else if (err.name === "NotFoundError") {
        setError("No camera found on this device.");
      } else {
        setError("Could not access camera.");
      }
    }
  }, []);

  // Stop stream
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => {
    if (isActive) startStream();
    return () => stopStream();
  }, [isActive, startStream, stopStream]);

  // Toggle camera track
  const toggleCam = () => {
    if (!streamRef.current) return;
    streamRef.current.getVideoTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setCamOn((prev) => !prev);
  };

  // Toggle mic track
  const toggleMic = () => {
    if (!streamRef.current) return;
    streamRef.current.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setMicOn((prev) => !prev);
  };

  const size = expanded
    ? { width: 480, height: 320, borderRadius: 16 }
    : { width: 220, height: 148, borderRadius: 12 };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 8,
        transition: "all 0.3s ease",
      }}
    >
      {/* Camera box */}
      <div
        style={{
          ...size,
          background: "#0d1117",
          border: `2px solid ${hasPerms && camOn ? "rgba(110,231,183,0.4)" : "rgba(255,255,255,0.1)"}`,
          overflow: "hidden",
          position: "relative",
          transition: "all 0.3s ease",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        {/* Live indicator */}
        {hasPerms && camOn && (
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "rgba(0,0,0,0.6)",
              borderRadius: 6,
              padding: "3px 8px",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#ef4444",
                boxShadow: "0 0 0 0 rgba(239,68,68,0.4)",
                animation: "pulse-ring 1.5s infinite",
              }}
            />
            <span
              style={{
                fontSize: 11,
                color: "#fff",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              LIVE
            </span>
          </div>
        )}

        {/* Camera off overlay */}
        {(!camOn || !hasPerms) && !error && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#0d1117",
              gap: 8,
            }}
          >
            <VideoOff size={28} color="#484f58" />
            <span style={{ fontSize: 12, color: "#484f58" }}>
              {!hasPerms ? "Starting camera…" : "Camera off"}
            </span>
          </div>
        )}

        {/* Error overlay */}
        {error && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 5,
              padding: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#0d1117",
              gap: 8,
              textAlign: "center",
            }}
          >
            <AlertCircle size={22} color="#f87171" />
            <span style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>
              {error}
            </span>
            <button
              onClick={startStream}
              style={{
                fontSize: 11,
                color: "var(--accent)",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Video element */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scaleX(-1)", // mirror effect
            display: camOn && hasPerms ? "block" : "none",
          }}
        />
      </div>

      {/* Controls bar */}
      <div
        style={{
          display: "flex",
          gap: 6,
          alignItems: "center",
          background: "rgba(13,17,23,0.9)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10,
          padding: "6px 10px",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Mic toggle */}
        <button
          onClick={toggleMic}
          title={micOn ? "Mute mic" : "Unmute mic"}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: micOn
              ? "rgba(110,231,183,0.15)"
              : "rgba(248,113,113,0.15)",
            color: micOn ? "var(--accent)" : "var(--red)",
            transition: "all 0.2s",
          }}
        >
          {micOn ? <Mic size={15} /> : <MicOff size={15} />}
        </button>

        {/* Camera toggle */}
        <button
          onClick={toggleCam}
          title={camOn ? "Turn off camera" : "Turn on camera"}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: camOn
              ? "rgba(110,231,183,0.15)"
              : "rgba(248,113,113,0.15)",
            color: camOn ? "var(--accent)" : "var(--red)",
            transition: "all 0.2s",
          }}
        >
          {camOn ? <Video size={15} /> : <VideoOff size={15} />}
        </button>

        {/* Expand/collapse */}
        <button
          onClick={() => setExpanded((p) => !p)}
          title={expanded ? "Shrink" : "Expand"}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.05)",
            color: "#8b949e",
            transition: "all 0.2s",
          }}
        >
          {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>
    </div>
  );
}
