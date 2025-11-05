// src/pages/Welcome.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HeartIcon } from "@heroicons/react/24/solid";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1F1F33] text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        {/* Ícone com animação */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          className="bg-[#29293E] p-10 rounded-full shadow-2xl mb-6"
        >
          <HeartIcon className="h-16 w-16 text-[#6666C4]" />
        </motion.div>

        {/* Título animado */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-3xl font-bold text-[#EAEAFB] mb-2"
        >
          SereneCare
        </motion.h1>

        {/* Subtítulo com fade suave */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-[#A5A5D6] text-sm max-w-md mb-8"
        >
          Seu companheiro de bem-estar. Monitore sua saúde e encontre tranquilidade.
        </motion.p>

        {/* Botão com animações suaves */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/login")}
          className="bg-[#6666C4] hover:bg-[#5454F0] text-white px-10 py-3 rounded-full font-semibold shadow-lg transition-all duration-300"
        >
          Começar
        </motion.button>
      </motion.div>
    </div>
  );
}
