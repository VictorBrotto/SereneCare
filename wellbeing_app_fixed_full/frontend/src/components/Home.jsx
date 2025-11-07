import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import axios from "axios";

export default function Home() {
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = parseInt(localStorage.getItem("userId"));
        
        console.log("🔍 Buscando registros para usuário:", userId);
        
        const res = await axios.get(`http://localhost:8080/api/daily`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("📋 Registros recebidos:", res.data);
        
        const allEntries = res.data;
        
        if (allEntries.length > 0) {
          const latestEntry = allEntries.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          )[0];
          console.log("✅ Último registro:", latestEntry);
          setLatest(latestEntry);
        } else {
          console.log("ℹ️ Nenhum registro encontrado");
        }
      } catch (err) {
        console.error("❌ Erro ao buscar registros:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, []);

  // Função para determinar emoji baseado no valor
  const getEmojiForValue = (value, type = 'mood') => {
    if (type === 'mood') {
      if (value >= 8) return '😄';
      if (value >= 5) return '😊';
      if (value >= 3) return '😐';
      return '😔';
    }
    if (type === 'sleep') {
      if (value >= 8) return '💤';
      if (value >= 5) return '🛌';
      return '😴';
    }
    if (type === 'pain') {
      if (value <= 3) return '👍';
      if (value <= 6) return '👌';
      return '💀';
    }
    return '📊';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1F1F33] via-[#2A2A44] to-[#363645] px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
      >
        {/* Left: Texto de Boas-Vindas */}
        <div className="text-left space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="bg-[#6666C4]/20 p-3 rounded-xl">
              <img
                src="/logo.png"
                alt="SereneCare logo"
                className="w-8 h-8 rounded-full"
              />
            </div>
            <span className="text-sm font-semibold text-[#A5A5D6] tracking-wide">SERENECARE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl lg:text-5xl font-bold text-[#EAEAFB] leading-tight"
          >
            Cuide do seu<br />
            <span className="bg-gradient-to-r from-[#6666C4] to-[#5454F0] bg-clip-text text-transparent">
              bem-estar
            </span>
            <br />
            todos os dias
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-[#CFCFE8] max-w-xl leading-relaxed"
          >
            Acompanhe sua saúde de forma simples e organizada. 
            Registre seu progresso diário e visualize sua evolução com métricas claras.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/form"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#6666C4] to-[#5454F0] hover:from-[#5454F0] hover:to-[#6666C4] text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg"
              >
                <ChartBarIcon className="h-5 w-5" />
                Novo Registro Diário
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/history"
                className="inline-flex items-center gap-2 border-2 border-[#5F5F70] text-[#EAEAFB] px-6 py-4 rounded-xl font-semibold hover:bg-[#363645] hover:border-[#6666C4] transition-all duration-300"
              >
                <span>📊</span>
                Ver Histórico Completo
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Right: Card de Resumo */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#29293E] rounded-2xl shadow-2xl border border-[#5F5F70] overflow-hidden"
        >
          {/* Header do Card */}
          <div className="bg-gradient-to-r from-[#6666C4]/10 to-[#5454F0]/10 p-6 border-b border-[#5F5F70]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#EAEAFB]">Resumo Diário</h2>
                <p className="text-sm text-[#A5A5D6] mt-1">
                  {latest ? "Seu registro mais recente" : "Comece seu acompanhamento"}
                </p>
              </div>
              <div className="bg-[#6666C4]/20 p-2 rounded-lg">
                <span className="text-lg">📈</span>
              </div>
            </div>
          </div>

          {/* Conteúdo do Card */}
          <div className="p-6">
            {/* Ilustração */}
            <div className="flex justify-center mb-6">
              <img
                src="/illustration-wellbeing.svg"
                alt="Ilustração de bem-estar"
                className="w-48 h-32 object-contain opacity-90"
              />
            </div>

            {/* Métricas Principais */}
            {latest ? (
              <div className="space-y-4">
                {/* Linha 1: Dor e Sono */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#1F1F33] rounded-xl p-4 border border-[#5F5F70]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#A5A5D6]">Nível de Dor</span>
                      <span className="text-lg">{getEmojiForValue(latest.painLevel, 'pain')}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-[#EAEAFB]">
                        {latest.painLevel}
                      </span>
                      <span className="text-sm text-[#A5A5D6]">/10</span>
                    </div>
                  </div>

                  <div className="bg-[#1F1F33] rounded-xl p-4 border border-[#5F5F70]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#A5A5D6]">Qualidade do Sono</span>
                      <span className="text-lg">{getEmojiForValue(latest.sleepQuality, 'sleep')}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-[#EAEAFB]">
                        {latest.sleepQuality}
                      </span>
                      <span className="text-sm text-[#A5A5D6]">/10</span>
                    </div>
                  </div>
                </div>

                {/* Linha 2: Humor e Data */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#1F1F33] rounded-xl p-4 border border-[#5F5F70]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#A5A5D6]">Humor</span>
                      <span className="text-lg">{getEmojiForValue(latest.mood, 'mood')}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-[#EAEAFB]">
                        {latest.mood}
                      </span>
                      <span className="text-sm text-[#A5A5D6]">/10</span>
                    </div>
                  </div>

                  <div className="bg-[#1F1F33] rounded-xl p-4 border border-[#5F5F70]">
                    <div className="text-sm font-medium text-[#A5A5D6] mb-2">Data do Registro</div>
                    <div className="text-lg font-semibold text-[#EAEAFB]">
                      {new Date(latest.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                {/* Notas (se existir) */}
                {latest.additionalNotes && (
                  <div className="bg-[#1F1F33] rounded-xl p-4 border border-[#5F5F70]">
                    <div className="text-sm font-medium text-[#A5A5D6] mb-2">Observações</div>
                    <p className="text-sm text-[#EAEAFB] italic line-clamp-2">
                      "{latest.additionalNotes}"
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Estado Vazio */
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-semibold text-[#EAEAFB] mb-2">
                  Nenhum registro ainda
                </h3>
                <p className="text-sm text-[#A5A5D6] mb-6">
                  Comece preenchendo seu primeiro registro diário para acompanhar sua evolução.
                </p>
              </div>
            )}

            {/* Botão de Ação */}
            <motion.div 
              className="mt-6"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/form"
                className="block w-full bg-gradient-to-r from-[#6666C4] to-[#5454F0] hover:from-[#5454F0] hover:to-[#6666C4] text-white text-center py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg"
              >
                {latest ? "Atualizar Registro" : "Criar Primeiro Registro"}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}