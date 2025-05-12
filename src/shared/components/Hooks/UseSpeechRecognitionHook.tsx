import { useState, useEffect, useRef } from "react";
import { useUserData } from "./useUserData";
import { TRACK_VERSE_CATCH_URL } from "@/shared/constants/urlConstants";

const useSpeechRecognitionHook = (
  selectedVersion: string,
  userEmail: string
) => {
  const { isLoggedIn } = useUserData();
  const [isListening, setIsListening] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [receivedData, setReceivedData] = useState(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL!;
    const ws = new WebSocket(
      `${WS_BASE_URL}/ws/detect-quotes?api_key=${API_KEY}&version=${selectedVersion}&user_email=${userEmail}`
    );

    ws.onopen = () => {
      console.log("WebSocket connected");
      socketRef.current = ws;
    };

    ws.onmessage = async (event) => {
      setReceivedData(event.data);
      console.log("Received data:", event.data);
      try {
        const parsedData = JSON.parse(event.data);
        console.log("Parsed data:", parsedData);
        console.log("this is not beeing called");
        if (parsedData && parsedData[0]?.book) {
          console.log("Book name:", parsedData[0].book);
        } else {
          console.log("Book data is not available in the received data.");
        }
        if (isLoggedIn && parsedData[0]?.book) {
          try {
            const response = await fetch(TRACK_VERSE_CATCH_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                book_name: parsedData[0].book,
                email: userEmail,
              }),
            });

            if (!response.ok) {
              console.error(
                "Failed to track verse catch:",
                response.statusText
              );
            } else {
              console.log("Successfully tracked verse catch");
            }
          } catch (error) {
            console.error("Error while tracking verse catch:", error);
          }
        }
      } catch (error) {
        console.error("Error parsing JSON data:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [isLoggedIn, selectedVersion, userEmail]);

  const startListening = async () => {
    try {
      const audioContext = new (window.AudioContext || window.AudioContext)({
        sampleRate: 48000, // Set sample rate to 48 kHz
      });
      audioContextRef.current = audioContext;

      // Get microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 48000, // Match sample rate
          channelCount: 1, // Mono
          echoCancellation: false,
          noiseSuppression: false,
        },
      });

      // Create a MediaStreamAudioSourceNode
      const source = audioContext.createMediaStreamSource(stream);

      // Create a ScriptProcessorNode to process raw audio data
      const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
      scriptProcessorRef.current = scriptProcessor;

      // Buffer to accumulate audio data
      let audioBuffer = new Float32Array(0);

      scriptProcessor.onaudioprocess = (event) => {
        const inputData = event.inputBuffer.getChannelData(0); // Get mono audio data
        const newBuffer = new Float32Array(
          audioBuffer.length + inputData.length
        );

        // Append new audio data to the buffer
        newBuffer.set(audioBuffer);
        newBuffer.set(inputData, audioBuffer.length);
        audioBuffer = newBuffer;

        // If we have 3 seconds of audio (48 kHz * 3 = 144,000 samples), send it
        if (audioBuffer.length >= 144000) {
          // Convert Float32 to Int16 (PCM format)
          const pcmData = new Int16Array(audioBuffer.length);
          for (let i = 0; i < audioBuffer.length; i++) {
            pcmData[i] = Math.max(
              -32768,
              Math.min(32767, audioBuffer[i] * 32768)
            ); // Scale to 16-bit
          }

          // Send the raw PCM data to the WebSocket server
          if (
            socketRef.current &&
            socketRef.current.readyState === WebSocket.OPEN
          ) {
            socketRef.current.send(pcmData);
            console.log("Sent 3 seconds of raw PCM audio data");
          }

          // Reset the buffer
          audioBuffer = new Float32Array(0);
        }
      };

      // Connect the source to the script processor and start processing
      source.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);

      setIsListening(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopListening = () => {
    if (audioContextRef.current && scriptProcessorRef.current) {
      // Disconnect and clean up
      scriptProcessorRef.current.disconnect();
      audioContextRef.current.close();
      setIsListening(false);
    }
  };

  return {
    isListening,
    receivedData,
    startListening,
    stopListening,
    hasRecognitionSupport: "AudioContext" in window,
  };
};

export default useSpeechRecognitionHook;
