"use client";
import React, { useState } from "react";
import { MessageSquare, X, Send, Bot, Loader2, Mic } from "lucide-react";
import { api } from "@/lib/api-client";
import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";

export function CopilotOverlay() {
  const { state } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<{role: "user"|"ai", content: string, source?: string}[]>([
    { role: "ai", content: "Hi! I'm your YUKTI AI Assistant. Ask me anything about your business plan or financial numbers.", source: "template" }
  ]);
  const [loading, setLoading] = useState(false);

  const startListening = () => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice input.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; // Can be mapped to store preference later
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSend = async () => {
    if (!query.trim() || !state.sessionId) return;
    
    const userMsg = query;
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setQuery("");
    setLoading(true);

    try {
      const res = await api.explain({ session_id: state.sessionId, question: userMsg });
      setMessages(prev => [...prev, { role: "ai", content: res.explanation, source: res.data_source }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", content: "I'm sorry, I encountered an error while analyzing that.", source: "error" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:bg-indigo-700 transition-colors z-50 flex items-center justify-center"
          >
            <MessageSquare size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-black/90 backdrop-blur-xl border border-zinc-800 shadow-2xl flex flex-col z-50 overflow-hidden font-mono"
          >
            <div className="bg-zinc-900 p-4 text-terminal-text flex justify-between items-center border-b border-terminal-cyan">
              <div className="flex items-center space-x-2">
                <Bot size={20} />
                <span className="font-semibold">YUKTI Copilot</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] p-3 shadow-sm ${msg.role === "user" ? "bg-zinc-800 text-terminal-cyan border border-terminal-cyan" : "bg-black border border-zinc-800 text-terminal-text"}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    {msg.source && msg.role === "ai" && msg.source !== "template" && (
                      <div className="mt-2 text-[10px] uppercase font-semibold text-indigo-400 bg-indigo-50/50 inline-block px-2 py-1 rounded-full">
                        Source: {msg.source}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-black border border-zinc-800 p-3 flex items-center space-x-2">
                    <Loader2 size={16} className="animate-spin text-terminal-amber" />
                    <span className="text-xs text-zinc-500 uppercase tracking-widest">Processing...</span>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="bg-black border-t border-zinc-800 flex flex-col">
              <div className="flex space-x-2 overflow-x-auto px-3 py-2 scrollbar-hide border-b border-zinc-800">
                <button 
                  onClick={() => setQuery("Please explain my score in Hindi.")}
                  className="whitespace-nowrap text-[10px] uppercase tracking-widest font-bold px-3 py-1 bg-zinc-900 text-terminal-amber hover:bg-zinc-800 transition-colors border border-zinc-700"
                >
                  Translate to Hindi
                </button>
                <button 
                  onClick={() => setQuery("How can I improve my DSCR?")}
                  className="whitespace-nowrap text-[10px] uppercase tracking-widest font-bold px-3 py-1 bg-zinc-900 text-terminal-cyan hover:bg-zinc-800 transition-colors border border-zinc-700"
                >
                  Improve DSCR
                </button>
              </div>
              <div className="p-3 flex items-center space-x-2">
                <button
                  onClick={startListening}
                  className={`p-2 transition-colors flex items-center justify-center border ${isListening ? 'bg-terminal-red/20 text-terminal-red border-terminal-red animate-pulse' : 'bg-zinc-900 text-zinc-500 border-zinc-700 hover:text-terminal-cyan'}`}
                  title="Voice Input"
                >
                  <Mic size={18} />
                </button>
                <input
                  type="text"
                  placeholder="Query system..."
                  className="flex-1 px-4 py-2 border border-zinc-700 text-sm focus:outline-none focus:border-terminal-cyan bg-black text-terminal-text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                  onClick={handleSend}
                  disabled={!query.trim() || loading}
                  className="bg-terminal-cyan text-black font-bold p-2 hover:bg-terminal-cyan/80 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
