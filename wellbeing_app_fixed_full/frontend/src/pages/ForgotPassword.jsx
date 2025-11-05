import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";
import { EnvelopeIcon } from "@heroicons/react/24/solid";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/auth/forgot", { email });
      setStatus("Se um email existir, enviaremos instruções de recuperação.");
    } catch {
      setStatus("Se um email existir, enviaremos instruções de recuperação.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1F1F33]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#29293E] p-8 rounded-2xl shadow-2xl w-[420px]"
      >
        <motion.h2
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-[#EAEAFB] font-bold mb-2"
        >
          Recuperar senha
        </motion.h2>
        <p className="text-[#A5A5D6] mb-4">
          Informe o email associado à sua conta
        </p>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <div className="relative">
            <EnvelopeIcon className="h-5 w-5 absolute left-3 top-3 text-[#A5A5D6]" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 py-2 bg-[#232333] rounded-lg text-[#EAEAFB] focus:ring-2 focus:ring-[#6666C4] outline-none"
              placeholder="Seu email"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-[#6666C4] hover:bg-[#5454F0] text-white py-2 rounded-lg font-semibold transition-all"
          >
            Enviar
          </motion.button>
        </motion.form>

        {status && <div className="mt-4 text-sm text-[#CFCFE8]">{status}</div>}

        <p className="text-sm mt-4">
          <Link to="/login" className="text-[#EAEAFB] hover:underline">
            Voltar ao login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
