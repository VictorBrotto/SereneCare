import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

export default function ChatThread() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`http://localhost:8080/api/chats/${id}/messages`, { 
      headers: { Authorization: `Bearer ${token}` } 
    })
      .then(res => setMessages(res.data || []))
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!text.trim() || sending) return;
    
    setSending(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(`http://localhost:8080/api/chats/${id}/message`, 
        { content: text }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(prev => [...prev, res.data]);
      setText("");
    } catch (err) {
      console.error("Erro enviando mensagem", err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#1F1F33] via-[#2A2A44] to-[#363645] py-10 px-6 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-3xl bg-[#29293E] rounded-2xl p-6 shadow-2xl border border-[#34344A]"
      >
        {/* Chat Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 mb-6 pb-4 border-b border-[#34344A]"
        >
          <div className="bg-[#6666C4]/20 p-2 rounded-lg">
            <div className="w-6 h-6 bg-gradient-to-r from-[#6666C4] to-[#5454F0] rounded-full"></div>
          </div>
          <h1 className="text-xl font-semibold text-[#EAEAFB]">Conversa</h1>
        </motion.div>

        {/* Messages Container */}
        <div className="h-[50vh] overflow-y-auto p-4 space-y-4 bg-[#232333] rounded-xl mb-6">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 0.4,
                  delay: index * 0.05 
                }}
                className={`flex ${message.senderRole === "DOCTOR" ? "justify-start" : "justify-end"}`}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.senderRole === "DOCTOR" 
                      ? "bg-[#44446C] text-white rounded-bl-none" 
                      : "bg-[#6666C4] text-white rounded-br-none"
                  } shadow-lg`}
                >
                  <div className="text-xs text-[#A5A5D6] mb-2 font-medium">
                    {message.senderRole} • {new Date(message.createdAt).toLocaleString()}
                  </div>
                  <div className="text-[#EAEAFB] whitespace-pre-wrap">{message.content}</div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3 items-end"
        >
          <motion.textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            whileFocus={{ scale: 1.02 }}
            placeholder="Digite sua mensagem..."
            className="flex-1 p-4 rounded-xl bg-[#232333] text-[#EAEAFB] outline-none resize-none min-h-[60px] max-h-[120px] focus:ring-2 focus:ring-[#6666C4]"
            rows="1"
          />
          <motion.button
            onClick={send}
            disabled={!text.trim() || sending}
            whileHover={{ 
              scale: text.trim() && !sending ? 1.05 : 1,
              backgroundColor: text.trim() && !sending ? "#5454F0" : "#6666C4"
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#6666C4] text-white p-4 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <PaperAirplaneIcon className="h-5 w-5" />
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
} 