import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

export default function ChatThread() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [chatInfo, setChatInfo] = useState(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef();
  
  const currentUser = {
    id: parseInt(localStorage.getItem("userId")),
    role: localStorage.getItem("role"),
    username: localStorage.getItem("username")
  };

  useEffect(() => {
    fetchChatData();
  }, [id]);

  const fetchChatData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Buscar informações do chat e mensagens em paralelo
      const [infoRes, messagesRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/chats/${id}/info`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://localhost:8080/api/chats/${id}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setChatInfo(infoRes.data);
      setMessages(messagesRes.data || []);
    } catch (err) {
      console.error("Erro ao buscar dados do chat", err);
    } finally {
      setLoading(false);
    }
  };

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
      
      // Adicionar a nova mensagem à lista
      setMessages(prev => [...prev, res.data]);
      setText("");
    } catch (err) {
      console.error("Erro enviando mensagem", err);
      alert("Erro ao enviar mensagem. Tente novamente.");
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

  const isCurrentUserMessage = (message) => {
    return message.senderId === currentUser.id;
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1F1F33] to-[#363645]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#6666C4] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1F1F33] to-[#363645] pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-6 h-[calc(100vh-8rem)] flex flex-col">
        {/* Chat Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#29293E] rounded-2xl p-6 mb-6 border border-[#5F5F70] shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#6666C4] to-[#5454F0] rounded-full flex items-center justify-center text-white font-bold text-lg">
              {chatInfo?.otherUserName?.[0] || "U"}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-[#EAEAFB]">
                {chatInfo?.otherUserName || "Conversa"}
              </h1>
              <p className="text-sm text-[#A5A5D6]">
                {currentUser.role === "DOCTOR" ? "Paciente" : "Doutor"}
                {chatInfo?.otherUserSpecialization && ` • ${chatInfo.otherUserSpecialization}`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#A5A5D6] mb-1">Status</div>
              <div className="flex items-center gap-2 justify-end">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-[#CFCFE8]">Online</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Messages Container */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 bg-[#29293E] rounded-2xl p-6 shadow-2xl border border-[#5F5F70] flex flex-col"
        >
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#1F1F33] rounded-xl mb-6">
            <AnimatePresence>
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12 text-[#A5A5D6]"
                >
                  <div className="text-6xl mb-4">💬</div>
                  <p>Nenhuma mensagem ainda</p>
                  <p className="text-sm mt-2">Seja o primeiro a enviar uma mensagem!</p>
                </motion.div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ 
                      duration: 0.4,
                      delay: index * 0.05 
                    }}
                    className={`flex ${isCurrentUserMessage(message) ? "justify-end" : "justify-start"}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`max-w-[70%] ${isCurrentUserMessage(message) ? "order-2" : "order-1"}`}
                    >
                      {/* Nome do remetente (apenas para mensagens de outros) */}
                      {!isCurrentUserMessage(message) && (
                        <div className="text-xs text-[#6666C4] font-medium mb-1 ml-1">
                          {message.senderName || "Usuário"}
                        </div>
                      )}
                      
                      {/* Container da mensagem */}
                      <div className="flex items-end gap-2">
                        {!isCurrentUserMessage(message) && (
                          <div className="w-8 h-8 bg-gradient-to-br from-[#6666C4] to-[#5454F0] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {message.senderName?.[0] || "U"}
                          </div>
                        )}
                        
                        <div className={`p-4 rounded-2xl shadow-lg ${
                          isCurrentUserMessage(message) 
                            ? "bg-gradient-to-r from-[#6666C4] to-[#5454F0] text-white rounded-br-none" 
                            : "bg-[#363645] text-[#EAEAFB] rounded-bl-none border border-[#5F5F70]"
                        }`}>
                          <div className="text-[#EAEAFB] whitespace-pre-wrap break-words">
                            {message.content}
                          </div>
                        </div>

                        {isCurrentUserMessage(message) && (
                          <div className="w-8 h-8 bg-gradient-to-br from-[#6666C4] to-[#5454F0] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {currentUser.username?.[0] || "V"}
                          </div>
                        )}
                      </div>

                      {/* Timestamp */}
                      <div className={`text-xs text-[#A5A5D6] mt-1 ${
                        isCurrentUserMessage(message) ? "text-right mr-1" : "ml-1"
                      }`}>
                        {formatMessageTime(message.createdAt)}
                      </div>
                    </motion.div>
                  </motion.div>
                ))
              )}
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
              className="flex-1 p-4 rounded-xl bg-[#1F1F33] text-[#EAEAFB] outline-none resize-none min-h-[60px] max-h-[120px] focus:ring-2 focus:ring-[#6666C4] border border-[#5F5F70] focus:border-[#6666C4] transition-all"
              rows="1"
            />
            <motion.button
              onClick={send}
              disabled={!text.trim() || sending}
              whileHover={{ 
                scale: text.trim() && !sending ? 1.05 : 1,
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#6666C4] to-[#5454F0] text-white p-4 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
    </div>
  );
}