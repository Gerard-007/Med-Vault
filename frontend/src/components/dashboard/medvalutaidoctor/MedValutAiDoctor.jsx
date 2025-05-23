import React, { useState, useEffect, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import { FiSend, FiMic, FiMoon, FiSun } from "react-icons/fi";
import { FaRobot } from "react-icons/fa";

// Load API key from environment variables
const genAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

let chat = null; // Chat instance to keep context and history

const MedValutAiDoctor = () => {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hey there, I’m Dr. Victor Emaye, your AI Doctor. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        setInput(event.results[0][0].transcript);
        setListening(false);
      };

      recognitionRef.current.onerror = () => setListening(false);
      recognitionRef.current.onend = () => setListening(false);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      if (!chat) {
        chat = genAI.chats.create({
          model: "gemini-2.0-flash",
          history: [], // Start with empty history to satisfy API requirements
        });
      }

      // System prompt to guide AI tone and role
      const systemPrompt =
        "You are Dr. Victor Emaye, professional AI medical doctor. ";

      // For the first message, prepend system prompt to input to set context
      const messageToSend = chat.history.length === 0 ? systemPrompt + input : input;

      const stream = await chat.sendMessageStream({ message: messageToSend });

      let aiText = "";
      for await (const chunk of stream) {
        aiText += chunk.text || "";
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.sender === "ai") {
            const updated = [...prev];
            updated[updated.length - 1] = { sender: "ai", text: aiText };
            return updated;
          } else {
            return [...prev, { sender: "ai", text: aiText }];
          }
        });
      }
    } catch (err) {
      console.error("Gemini Error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Sorry, there was an error. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => setIsDark(!isDark);

  const startListening = () => {
    if (recognitionRef.current) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  return (
    <div className={`${isDark ? "dark" : ""}`}>
      <div className="flex flex-col w-full max-w-8xl mx-auto h-[100vh] bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="flex justify-between items-center bg-blue-700 dark:bg-blue-900 text-white py-4 px-6 text-lg font-semibold">
          <div className="flex items-center gap-2">
            <FaRobot />
            AI Doctor – MedValut
          </div>
          <button onClick={toggleDarkMode} className="text-xl" aria-label="Toggle dark mode">
            {isDark ? <FiSun /> : <FiMoon />}
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-800">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-xl text-sm shadow ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-xl text-sm animate-pulse">
                Typing...
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center border-t border-gray-300 dark:border-gray-700 p-3 bg-white dark:bg-gray-900">
          <button
            onClick={startListening}
            className={`mr-2 p-2 rounded-full ${
              listening ? "bg-red-600" : "bg-blue-600"
            } text-white hover:opacity-90 transition`}
            aria-label={listening ? "Stop listening" : "Start listening"}
          >
            <FiMic />
          </button>

          <input
            type="text"
            placeholder="Ask the AI doctor a question..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            aria-label="User input"
          />
          <button
            onClick={handleSend}
            className="ml-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            aria-label="Send message"
            disabled={loading}
          >
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedValutAiDoctor;
