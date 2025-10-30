import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { MessageBubble } from "./message-bubble";
import { Send, MessageSquare, Plus, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import type { ChatMessage } from "@shared/schema";
import arasAiImage from "@/assets/aras_logo_1755067745303.png";
import arasLogo from "@/assets/aras_logo_1755067745303.png";

const BASE_URL = "http://localhost:5000";
const USER_ID = "user_" + Math.random().toString(36).substr(2, 9);

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatSessions, setChatSessions] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);

  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const res = await fetch(BASE_URL + "/api/chat/sessions", {
        headers: { "x-user-id": USER_ID },
      });
      const data = await res.json();
      setChatSessions(data);
    } catch (err) {
      console.error("Error loading sessions:", err);
    }
  };

  const loadMessages = async () => {
    try {
      const res = await fetch(BASE_URL + "/api/chat/messages", {
        headers: { "x-user-id": USER_ID },
      });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  const switchSession = async (sessionId: number) => {
    try {
      await fetch(`${BASE_URL}/api/chat/sessions/${sessionId}/activate`, {
        method: "POST",
        headers: { "x-user-id": USER_ID },
      });
      await loadMessages();
      setShowChatHistory(false);
    } catch (err) {
      toast({ title: "Fehler", description: "Session konnte nicht geladen werden.", variant: "destructive" });
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || sending) return;

    const userMessage = message;
    setMessage("");
    setSending(true);
    setShowTypingIndicator(true);

    try {
      const res = await fetch(BASE_URL + "/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": USER_ID },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      const userMsg: ChatMessage = {
        id: Date.now(),
        message: userMessage,
        isAi: false,
        timestamp: new Date(),
        userId: USER_ID,
        sessionId: null,
      };

      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        message: data.response || "Keine Antwort",
        isAi: true,
        timestamp: new Date(),
        userId: USER_ID,
        sessionId: null,
      };

      setMessages(prev => [...prev, userMsg, aiMsg]);
    } catch (err) {
      toast({ title: "Fehler", description: "Nachricht konnte nicht gesendet werden.", variant: "destructive" });
    } finally {
      setSending(false);
      setShowTypingIndicator(false);
    }
  };

  const handleNewChat = async () => {
    if (messages.length === 0) return;
    try {
      await fetch(BASE_URL + "/api/chat/sessions/new", {
        method: "POST",
        headers: { "x-user-id": USER_ID },
      });
      setMessages([]);
      await loadSessions();
      toast({ title: "Neuer Chat gestartet", description: "Vorherige Unterhaltung gespeichert." });
    } catch (err) {
      toast({ title: "Fehler", description: "Konnte nicht erstellt werden.", variant: "destructive" });
    }
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages, showTypingIndicator]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0a0a] text-white relative">
      {/* Top Bar */}
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="sticky top-0 z-20 px-4 md:px-6 py-3 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={arasLogo} alt="ARAS AI" className="w-8 h-8 object-contain" />
            <span className="text-xl font-semibold tracking-tight">ARAS AI</span>
          </div>
          <div className="flex items-center gap-3">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleNewChat} disabled={messages.length === 0} className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-sm font-medium transition-all disabled:opacity-40">
              <Plus className="w-4 h-4 inline mr-1.5" />
              <span className="hidden md:inline">Neuer Chat</span>
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowChatHistory(!showChatHistory)} className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] transition-all">
              <MessageSquare className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
              <img src={arasLogo} alt="ARAS AI" className="w-20 h-20 object-contain mx-auto mb-8 opacity-80" />
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white/90 mb-4">Willkommen zu ARAS AI</h1>
              <p className="text-white/60">Stelle mir eine Frage...</p>
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg.message}
                  isAi={msg.isAi || false}
                  timestamp={msg.timestamp ? new Date(msg.timestamp) : new Date()}
                  confidence={msg.isAi ? 0.95 : undefined}
                  messageId={msg.id.toString()}
                  onReaction={() => {}}
                  onSpeak={() => {}}
                  isSpeaking={false}
                />
              ))}
            </AnimatePresence>
          )}

          {showTypingIndicator && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                  <img src={arasAiImage} alt="ARAS AI" className="w-5 h-5 object-contain" />
                </div>
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-white/40" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay }} />
                    ))}
                    <span className="text-sm text-white/50">ARAS denkt …</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* History Sidebar */}
      <AnimatePresence>
        {showChatHistory && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowChatHistory(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
            <motion.div initial={{ x: 320 }} animate={{ x: 0 }} exit={{ x: 320 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed right-0 top-0 bottom-0 w-80 z-50 border-l border-white/[0.08] bg-[#0a0a0a] shadow-2xl">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                  <h3 className="font-semibold">Verlauf</h3>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowChatHistory(false)} className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center text-white/60 hover:text-white">
                    ×
                  </motion.button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                  {chatSessions.length > 0 ? (
                    chatSessions.map((session: any) => (
                      <motion.button key={session.id} whileHover={{ x: -2 }} className="w-full text-left p-3 rounded-lg border transition-all bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]" onClick={() => switchSession(session.id)}>
                        <div className="font-medium text-sm truncate mb-1">{session.title}</div>
                        <div className="text-xs text-white/40">{new Date(session.updatedAt).toLocaleDateString("de-DE")}</div>
                      </motion.button>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <MessageSquare className="w-12 h-12 text-white/10 mb-3" />
                      <p className="text-sm text-white/40">Noch keine Chats</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="sticky bottom-0 z-20 px-4 py-4 md:py-6 border-t border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl relative">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-[1px] rounded-xl overflow-hidden">
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2" style={{ background: `conic-gradient(from 0deg, transparent 0%, #FE9100 10%, transparent 20%, transparent 80%, #e9d7c4 90%, transparent 100%)` }} />
            </div>
            <div className="absolute inset-[1px] rounded-[11px] bg-[#0a0a0a]" />

            <div className="relative bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 flex items-center gap-3">
              <Input value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyDown} placeholder="Nachricht an ARAS AI …" className="flex-1 h-10 bg-transparent border-0 text-white placeholder:text-white/30 focus:ring-0" disabled={sending} />
              <button onClick={handleSendMessage} disabled={!message.trim() || sending} className="flex-shrink-0 w-10 h-10 rounded-xl bg-white text-black hover:bg-white/90 disabled:opacity-50 flex items-center justify-center">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.15); }
      `}</style>
    </div>
  );
}
