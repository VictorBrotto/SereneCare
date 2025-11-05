import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import axios from "axios";

export default function Home() {
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8080/api/daily/latest", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setLatest(res.data))
      .catch((err) => console.error("Erro ao buscar log:", err));
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#1F1F33] via-[#2A2A44] to-[#363645]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-5xl w-full mx-6 md:mx-auto grid gap-8 md:grid-cols-2 items-center"
      >
        {/* Left: welcome text */}
        <div className="text-left">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="bg-[#6666C4]/20 p-3 rounded-xl">
              <img
                src="/logo.png"
                alt="SereneCare logo"
                className="w-8 h-8 rounded-full shadow-md"
              />
            </div>
            <span className="text-sm text-[#A5A5D6]">SereneCare</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-extrabold text-[#EAEAFB] leading-tight mb-4"
          >
            Acompanhe seu bem-estar. Sinta-se melhor, dia após dia.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-[#CFCFE8] max-w-xl mb-6"
          >
            Registro diário fácil para monitorar dor, sono, humor e hábitos. Visualize o progresso e mantenha seus cuidados em um só lugar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/form"
                className="inline-flex items-center gap-3 bg-[#6666C4] hover:bg-[#5454F0] transition text-white px-5 py-3 rounded-lg font-semibold"
              >
                Iniciar registro diário
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/history"
                className="inline-flex items-center gap-2 border border-[#44435A] text-[#EAEAFB] px-4 py-3 rounded-lg hover:bg-[#2D2D45]"
              >
                Ver histórico
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Right: illustration/card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#252535] p-6 rounded-2xl shadow-lg"
        >
          <div className="bg-gradient-to-tr from-[#6666C4]/10 to-[#5454F0]/10 p-5 rounded-xl">
            <img
              src="/illustration-wellbeing.png"
              alt="illustration"
              className="w-full h-44 object-contain mb-4 transition-transform duration-500 hover:scale-105"
            />
            <div className="text-[#EAEAFB] font-semibold text-lg">
              Daily snapshot
            </div>
            <div className="text-[#A5A5D6] text-sm mb-4">
              Quick glance at your today's metrics
            </div>

            <motion.div className="grid gap-3">
              <div className="flex items-center justify-between bg-[#1F1F33] p-3 rounded-lg">
                <div>
                  <div className="text-xs text-[#A5A5D6]">Pain</div>
                  <div className="text-sm font-semibold text-[#EAEAFB]">
                    {latest ? `${latest.pain_level} / 10` : "—"}
                  </div>
                </div>
                <div className="text-sm text-[#CFCFE8]">
                  Sleep: {latest ? `${latest.sleep_quality}/10` : "—"}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 bg-[#1F1F33] p-3 rounded-lg">
                  <div className="text-xs text-[#A5A5D6]">Mood</div>
                  <div className="text-sm font-semibold text-[#EAEAFB]">
                    {latest ? `${latest.mood} / 10` : "—"}
                  </div>
                </div>
                <div className="w-20 bg-[#1F1F33] p-3 rounded-lg text-center">
                  <div className="text-xs text-[#A5A5D6]">Date</div>
                  <div className="text-sm font-semibold text-[#EAEAFB]">
                    {latest
                      ? new Date(latest.created_at).toLocaleDateString()
                      : "—"}
                  </div>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/form"
                  className="block text-center bg-[#6666C4] hover:bg-[#5454F0] text-white py-2 rounded-lg font-semibold"
                >
                  Fill today
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
