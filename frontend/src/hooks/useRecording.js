import { useRef, useState, useCallback } from "react";
import api from "../services/api";

/**
 * Records the candidate's microphone audio during the interview.
 * When stopped, automatically uploads the recording to the backend.
 * Admin can then stream/download it from the dashboard.
 */
export default function useRecording(sessionId, adminKey) {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const startTimeRef = useRef(null);

  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState(null);
  const [supported] = useState(
    () => typeof MediaRecorder !== "undefined" && !!navigator.mediaDevices,
  );

  const uploadRecording = useCallback(
    async (blob, duration) => {
      if (!sessionId || blob.size < 1000) return; // skip if too small
      setUploading(true);
      try {
        const reader = new FileReader();
        const dataUrl = await new Promise((res, rej) => {
          reader.onload = () => res(reader.result);
          reader.onerror = rej;
          reader.readAsDataURL(blob);
        });

        const playUrl = `/api/admin/sessions/${sessionId}/recording/play`;

        await api.post(
          `/admin/sessions/${sessionId}/recording/upload`,
          { dataUrl, duration, mimeType: blob.type || "audio/webm" },
          {
            headers: {
              "x-admin-key": adminKey || localStorage.getItem("adminKey") || "",
            },
          },
        );

        setRecordingUrl(playUrl);
        setUploaded(true);
        console.log(
          `[Recording] Uploaded ${(blob.size / 1024 / 1024).toFixed(1)}MB, ${duration}s`,
        );
      } catch (e) {
        console.warn("[Recording] Upload failed:", e.message);
        // Fallback — keep in sessionStorage so admin can still see it locally
        const reader = new FileReader();
        reader.onload = () => {
          try {
            sessionStorage.setItem(
              `recording_${sessionId}`,
              JSON.stringify({
                dataUrl: reader.result,
                duration,
                mimeType: blob.type,
                size: blob.size,
              }),
            );
          } catch {}
        };
        reader.readAsDataURL(blob);
      } finally {
        setUploading(false);
      }
    },
    [sessionId, adminKey],
  );

  const start = useCallback(async () => {
    if (!supported || recording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      streamRef.current = stream;
      chunksRef.current = [];
      startTimeRef.current = Date.now();

      const options = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? { mimeType: "audio/webm;codecs=opus" }
        : {};

      const mr = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data?.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mr.mimeType || "audio/webm",
        });
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
        setRecording(false);
        uploadRecording(blob, duration);
      };

      mr.start(5000);
      setRecording(true);
    } catch (e) {
      console.warn("[Recording] Could not start:", e.message);
    }
  }, [supported, recording, uploadRecording]);

  const stop = useCallback(() => {
    if (!recording || !mediaRecorderRef.current) return;
    try {
      mediaRecorderRef.current.stop();
    } catch {}
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, [recording]);

  return {
    start,
    stop,
    recording,
    uploading,
    uploaded,
    recordingUrl,
    supported,
  };
}
