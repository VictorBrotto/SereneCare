import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { CalendarDaysIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function History() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/api/entries", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEntries(res.data.reverse());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1F1F33] via-[#2A2A44] to-[#363645] py-10 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-4xl px-6"
      >
        {/* Header com animação */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="bg-[#6666C4]/20 p-3 rounded-xl">
            <CalendarDaysIcon className="h-6 w-6 text-[#6666C4]" />
          </div>
          <h1 className="text-3xl font-bold text-[#EAEAFB]">Histórico</h1>
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
            >
              <ArrowPathIcon className="h-8 w-8" />
            </motion.div>
            <p>Carregando registros...</p>
          </motion.div>
        ) : entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-[#A5A5D6] mt-10 bg-[#29293E] p-8 rounded-2xl"
          >
            <CalendarDaysIcon className="h-12 w-12 mx-auto mb-4 text-[#6666C4]/50" />
            <p className="text-lg">Nenhum registro encontrado.</p>
            <p className="text-sm mt-2">Comece preenchendo seu primeiro registro diário!</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid gap-4"
          >
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id || index}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.08,
                  duration: 0.5,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.02,
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                className="bg-[#29293E] p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#34344A]"
              >
                <div className="flex justify-between items-center mb-3">
                  <motion.h2 
                    className="text-[#EAEAFB] font-semibold text-lg"
                    whileHover={{ color: "#6666C4" }}
                  >
                    {new Date(entry.date).toLocaleDateString("pt-BR")}
                  </motion.h2>
                  <span className="text-xs text-[#A5A5D6] bg-[#34344A] px-2 py-1 rounded-full">
                    Humor: {entry.mood || "-"}/10
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <motion.p 
                    className="text-[#CFCFE8]"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 + 0.2 }}
                  >
                    <strong className="text-[#A5A5D6]">Dor:</strong> {entry.painLevel}/10
                  </motion.p>
                  
                  <motion.p 
                    className="text-[#CFCFE8]"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 + 0.3 }}
                  >
                    <strong className="text-[#A5A5D6]">Sono:</strong> {entry.sleepQuality}/10
                  </motion.p>
                </div>

                {entry.notes && (
                  <motion.p 
                    className="text-sm text-[#A5A5D6] italic mt-3 p-3 bg-[#1F1F33] rounded-lg border-l-4 border-[#6666C4]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.08 + 0.4 }}
                  >
                    "{entry.notes}"
                  </motion.p>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Botão de atualizar */}
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={() => window.location.reload()}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "#5454F0"
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#6666C4] text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Atualizar histórico
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}