import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export default function ChatsPage() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:8080/api/chats", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setChats(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#1F1F33] via-[#2A2A44] to-[#363645] py-10 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="bg-[#6666C4]/20 p-3 rounded-xl">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-[#6666C4]" />
          </div>
          <h1 className="text-3xl font-bold text-[#EAEAFB]">Conversas</h1>
        </motion.div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center text-[#A5A5D6] flex flex-col items-center gap-3"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-[#6666C4] border-t-transparent rounded-full"
            />
            <p>Carregando conversas...</p>
          </motion.div>
        ) : chats.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-[#A5A5D6] bg-[#29293E] p-8 rounded-2xl border border-[#34344A]"
          >
            <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-4 text-[#6666C4]/50" />
            <p className="text-lg">Nenhuma conversa encontrada</p>
            <p className="text-sm mt-2">Inicie uma nova conversa para começar</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {chats.map((chat, index) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.02,
                  y: -2,
                  transition: { duration: 0.2 }
                }}
              >
                <Link 
                  to={`/chats/${chat.id}`} 
                  className="block bg-[#29293E] p-5 rounded-2xl hover:shadow-xl transition-all duration-300 border border-[#34344A]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <motion.div 
                        className="text-lg font-semibold text-[#EAEAFB] mb-1"
                        whileHover={{ color: "#6666C4" }}
                      >
                        {chat.title || (chat.patientName || chat.doctorName)}
                      </motion.div>
                      <motion.div 
                        className="text-sm text-[#A5A5D6] truncate"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        {chat.lastMessage || "Sem mensagens"}
                      </motion.div>
                    </div>
                    <motion.div 
                      className="text-xs text-[#CFCFE8] bg-[#34344A] px-3 py-1 rounded-full"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                    >
                      {new Date(chat.updatedAt).toLocaleDateString()}
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}