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
  const [isOnline, setIsOnline] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const messagesEndRef = useRef();
  const messagesContainerRef = useRef();
  
  const currentUser = {
    id: parseInt(localStorage.getItem("userId")),
    role: localStorage.getItem("role"),
    username: localStorage.getItem("username"),
    profilePicture: localStorage.getItem("profilePicture")
  };

  useEffect(() => {
    fetchChatData();
    // Atualizar próprio status como online
    updateOwnStatus();
  }, [id]);

  // ✅ ATUALIZADO: Buscar status online do backend
  const fetchUserStatus = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:8080/api/users/${userId}/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.online;
    } catch (error) {
      console.error("Erro ao buscar status:", error);
      return false;
    }
  };

  // ✅ NOVO: Atualizar próprio status
  const updateOwnStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/api/users/update-last-seen", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const fetchChatData = async () => {
    setLoading(true);
    setStatusLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Buscar informações do chat
      const infoRes = await axios.get(`http://localhost:8080/api/chats/${id}/info`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setChatInfo(infoRes.data);
      
      // Buscar mensagens
      const messagesRes = await axios.get(`http://localhost:8080/api/chats/${id}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessages(messagesRes.data || []);
      
      // ✅ BUSCAR STATUS ONLINE do outro usuário
      if (infoRes.data.otherUserId) {
        const onlineStatus = await fetchUserStatus(infoRes.data.otherUserId);
        setIsOnline(onlineStatus);
      }
      
    } catch (err) {
      console.error("Erro ao buscar dados do chat", err);
    } finally {
      setLoading(false);
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const send = async () => {
    if (!text.trim() || sending) return;
    
    setSending(true);
    const token = localStorage.getItem("token");
    try {
      // Atualizar status como online ao enviar mensagem
      await updateOwnStatus();
      
      const res = await axios.post(`http://localhost:8080/api/chats/${id}/message`, 
        { content: text }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
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

  // ✅ MELHORADO: Renderizar foto de perfil com fallback
  const renderProfilePicture = (user, size = "w-8 h-8") => {
    const profilePicture = user?.profilePicture || user?.senderProfilePicture;
    
    if (profilePicture) {
      return (
        <img 
          src={profilePicture} 
          alt={user?.username || user?.senderName || "Usuário"}
          className={`${size} rounded-full object-cover border border-[#5F5F70] flex-shrink-0`}
          onError={(e) => {
            // Fallback para inicial se a imagem não carregar
            e.target.style.display = 'none';
          }}
        />
      );
    }
    
    // Fallback para iniciais
    const displayName = user?.username || user?.senderName || user?.fullName || "U";
    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();
    
    return (
      <div className={`${size} bg-gradient-to-br from-[#6666C4] to-[#5454F0] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
        {initials.substring(0, 2)}
      </div>
    );
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
        
        {/* Header com Status Online Real */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#29293E] rounded-2xl p-4 mb-4 border border-[#5F5F70] shadow-lg flex-shrink-0"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              {renderProfilePicture(
                { 
                  profilePicture: chatInfo?.otherUserProfilePicture,
                  fullName: chatInfo?.otherUserName 
                }, 
                "w-12 h-12"
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-[#EAEAFB]">
                {chatInfo?.otherUserName || "Conversa"}
              </h1>
              <p className="text-xs text-[#A5A5D6]">
                {currentUser.role === "DOCTOR" ? "Paciente" : "Doutor"}
                {chatInfo?.otherUserSpecialization && ` • ${chatInfo.otherUserSpecialization}`}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-xs text-[#A5A5D6] mb-1">Status</div>
              <div className="flex items-center gap-2 justify-end">
                {statusLoading ? (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                ) : (
                  <motion.div 
                    className={`w-2 h-2 rounded-full ${
                      isOnline ? "bg-green-400" : "bg-gray-400"
                    }`}
                    animate={{ 
                      scale: isOnline ? [1, 1.2, 1] : 1,
                      opacity: isOnline ? [1, 0.7, 1] : 1
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: isOnline ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  />
                )}
                <span className="text-sm text-[#CFCFE8]">
                  {statusLoading ? "Carregando..." : (isOnline ? "Online" : "Offline")}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card Principal do Chat */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 bg-[#29293E] rounded-2xl p-5 shadow-2xl border border-[#5F5F70] flex flex-col min-h-0"
        >
          {/* Área de Mensagens */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1F1F33] rounded-xl mb-4 custom-scrollbar"
          >
            <AnimatePresence>
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12 text-[#A5A5D6] h-full flex flex-col justify-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl mb-3"
                  >
                    💬
                  </motion.div>
                  <p className="text-sm">Nenhuma mensagem ainda</p>
                  <p className="text-xs mt-1">Seja o primeiro a enviar uma mensagem!</p>
                </motion.div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ 
                      duration: 0.3,
                      delay: index * 0.02
                    }}
                    className={`flex ${isCurrentUserMessage(message) ? "justify-end" : "justify-start"}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className={`max-w-[80%] ${isCurrentUserMessage(message) ? "order-2" : "order-1"}`}
                    >
                      {!isCurrentUserMessage(message) && (
                        <div className="text-xs text-[#6666C4] font-medium mb-1 ml-1">
                          {message.senderName || "Usuário"}
                        </div>
                      )}
                      
                      <div className="flex items-end gap-2">
                        {!isCurrentUserMessage(message) && (
                          <div className="flex-shrink-0">
                            {renderProfilePicture(message)}
                          </div>
                        )}
                        
                        <motion.div 
                          className={`p-3 rounded-2xl shadow-lg ${
                            isCurrentUserMessage(message) 
                              ? "bg-gradient-to-r from-[#6666C4] to-[#5454F0] text-white rounded-br-none" 
                              : "bg-[#363645] text-[#EAEAFB] rounded-bl-none border border-[#5F5F70]"
                          }`}
                          whileHover={{ 
                            y: -1,
                            transition: { duration: 0.1 }
                          }}
                        >
                          <div className="text-[#EAEAFB] whitespace-pre-wrap break-words text-sm">
                            {message.content}
                          </div>
                        </motion.div>

                        {isCurrentUserMessage(message) && (
                          <div className="flex-shrink-0">
                            {renderProfilePicture(currentUser)}
                          </div>
                        )}
                      </div>

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

          {/* Área de Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3 items-end flex-shrink-0"
          >
            <motion.textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              whileFocus={{ scale: 1.02 }}
              placeholder="Digite sua mensagem..."
              className="flex-1 p-3 rounded-xl bg-[#1F1F33] text-[#EAEAFB] outline-none resize-none min-h-[50px] max-h-[100px] focus:ring-2 focus:ring-[#6666C4] border border-[#5F5F70] focus:border-[#6666C4] transition-all text-sm"
              rows="1"
            />
            <motion.button
              onClick={send}
              disabled={!text.trim() || sending}
              whileHover={{ 
                scale: text.trim() && !sending ? 1.05 : 1,
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#6666C4] to-[#5454F0] text-white p-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex-shrink-0"
            >
              {sending ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <PaperAirplaneIcon className="h-4 w-4" />
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}