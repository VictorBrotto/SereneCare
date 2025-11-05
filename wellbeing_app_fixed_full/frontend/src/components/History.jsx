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
    <div className="min-h-screen bg-[#1F1F33] py-10 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-4xl px-6"
      >
        <div className="flex items-center gap-3 mb-8">
          <CalendarDaysIcon className="h-8 w-8 text-[#6666C4]" />
          <h1 className="text-3xl font-bold text-[#EAEAFB]">Histórico</h1>
        </div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center text-[#A5A5D6] flex flex-col items-center gap-2"
          >
            <ArrowPathIcon className="h-6 w-6 animate-spin" />
            <p>Carregando registros...</p>
          </motion.div>
        ) : entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-[#A5A5D6] mt-10"
          >
            Nenhum registro encontrado.
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid gap-4"
          >
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#29293E] p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-[#EAEAFB] font-semibold">
                    {new Date(entry.date).toLocaleDateString("pt-BR")}
                  </h2>
                  <span className="text-xs text-[#A5A5D6]">
                    Humor: {entry.mood || "-"}
                  </span>
                </div>

                <p className="text-sm text-[#CFCFE8] mb-2">
                  <strong>Dor:</strong> {entry.painLevel}/10
                </p>

                <p className="text-sm text-[#CFCFE8] mb-2">
                  <strong>Sono:</strong> {entry.sleepQuality}/10
                </p>

                {entry.notes && (
                  <p className="text-sm text-[#A5A5D6] italic">
                    “{entry.notes}”
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Botão de atualizar */}
        <motion.div
          className="mt-8 flex justify-center"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <button
            onClick={() => window.location.reload()}
            className="bg-[#6666C4] hover:bg-[#5454F0] text-white px-6 py-2 rounded-lg font-semibold transition-all"
          >
            Atualizar histórico
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
