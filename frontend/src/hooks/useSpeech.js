import { useCallback, useRef, useState } from "react";

export default function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [supported] = useState(() => "speechSynthesis" in window);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const getVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();
    const preferred = [
      "Google UK English Female",
      "Google US English",
      "Microsoft Zira Desktop",
      "Microsoft David Desktop",
      "Alex",
      "Samantha",
      "Karen",
      "Daniel",
    ];
    for (const name of preferred) {
      const v = voices.find((v) => v.name === name);
      if (v) return v;
    }
    return voices.find((v) => v.lang?.startsWith("en")) || voices[0] || null;
  }, []);

  const speak = useCallback(
    (text) => {
      if (!supported || !text || !audioEnabled) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const doSpeak = () => {
        const voice = getVoice();
        if (voice) utterance.voice = voice;
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);
        window.speechSynthesis.speak(utterance);
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        doSpeak();
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.onvoiceschanged = null;
          doSpeak();
        };
      }
    },
    [supported, audioEnabled, getVoice],
  );

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const toggle = useCallback(() => {
    setAudioEnabled((prev) => {
      if (prev) window.speechSynthesis.cancel();
      return !prev;
    });
  }, []);

  return { speak, stop, speaking, supported, audioEnabled, toggle };
}
