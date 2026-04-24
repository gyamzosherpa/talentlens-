import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Counts down from `seconds` to 0, resetting every time `resetKey` changes.
 * resetKey should be incremented each time a new question is delivered.
 */
export default function useQuestionTimer(
  seconds,
  resetKey = 0,
  onExpire,
  active = true,
) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  // Reset whenever a new question arrives (resetKey changes) OR time limit changes
  useEffect(() => {
    setTimeLeft(seconds);
    setPaused(false);
    clearInterval(intervalRef.current);
  }, [seconds, resetKey]);

  useEffect(() => {
    if (!active || paused) {
      clearInterval(intervalRef.current);
      return;
    }
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onExpireRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [active, paused, seconds, resetKey]);

  const reset = useCallback(() => setTimeLeft(seconds), [seconds]);
  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => setPaused(false), []);

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  return {
    timeLeft,
    formattedTime: `${mm}:${ss}`,
    isWarning: timeLeft <= 120 && timeLeft > 30,
    isDanger: timeLeft <= 30,
    reset,
    pause,
    resume,
  };
}
