import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";

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
    <div className="min-h-screen bg-[#1F1F33] py-10 px-6">
      <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.4}} className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-[#EAEAFB] mb-4">Conversas</h1>
        {loading ? <div className="text-[#A5A5D6]">Carregando...</div> :
          (chats.length === 0 ? <div className="text-[#A5A5D6]">Nenhuma conversa</div> :
            <div className="space-y-3">
              {chats.map(c => (
                <Link key={c.id} to={`/chats/${c.id}`} className="block bg-[#29293E] p-3 rounded-lg hover:shadow-lg transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-[#EAEAFB] font-semibold">{c.title || (c.patientName || c.doctorName)}</div>
                      <div className="text-xs text-[#A5A5D6] truncate">{c.lastMessage || "Sem mensagens"}</div>
                    </div>
                    <div className="text-xs text-[#CFCFE8]">{new Date(c.updatedAt).toLocaleString()}</div>
                  </div>
                </Link>
              ))}
            </div>
          )
        }
      </motion.div>
    </div>
  );
}
