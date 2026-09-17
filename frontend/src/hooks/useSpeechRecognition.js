import { useEffect, useRef, useState } from "react";

const useSpeechRecognition = () => {
  const recognitionRef = useRef(null);

  const [transcript, setTranscript] = useState("");

  const [listening, setListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event) => {
      let text = "";

      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }

      setTranscript(text);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    recognitionRef.current?.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  const resetTranscript = () => {
    setTranscript("");
  };

  return {
    transcript,
    listening,
    startListening,
    stopListening,
    resetTranscript,
  };
};

export default useSpeechRecognition;
