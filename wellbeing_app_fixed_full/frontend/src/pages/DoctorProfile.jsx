import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { StarIcon, MapPinIcon, AcademicCapIcon, ChatBubbleLeftRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import axios from "axios";

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8080/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctor(res.data);
    } catch (err) {
      console.error("Erro ao buscar doutor", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ MELHORADO: Renderizar foto de perfil com fallback
  const renderProfilePicture = (user, size = "w-24 h-24") => {
    if (user?.profilePicture) {
      return (
        <img 
          src={user.profilePicture} 
          alt={user.fullName}
          className={`${size} rounded-full object-cover border-2 border-[#5F5F70] shadow-lg`}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      );
    }
    
    // Fallback para iniciais
    const initials = user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : "DR";
    
    return (
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className={`${size} bg-gradient-to-br from-[#6666C4] to-[#5454F0] rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg`}
      >
        {initials.substring(0, 2)}
      </motion.div>
    );
  };

  const startChat = async () => {
    if (startingChat) return;
    
    setStartingChat(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:8080/api/chats/start", 
        { doctorId: parseInt(id) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      navigate(`/chats/${res.data.id}`);
    } catch (err) {
      console.error("Erro ao iniciar chat", err);
      alert("Erro ao iniciar conversa. Tente novamente.");
    } finally {
      setStartingChat(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1F1F33] to-[#2A2A44]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#6666C4] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1F1F33] to-[#2A2A44]">
        <div className="text-center">
          <p className="text-lg text-[#A5A5D6] mb-4">Doutor não encontrado</p>
          <button
            onClick={() => navigate("/doctors")}
            className="bg-gradient-to-r from-[#6666C4] to-[#5454F0] text-white px-6 py-2 rounded-xl font-semibold"
          >
            Voltar para Lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1F1F33] to-[#2A2A44] pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Botão Voltar */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/doctors")}
          className="flex items-center gap-2 text-[#A5A5D6] hover:text-[#EAEAFB] mb-8 transition-colors group"
        >
          <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Voltar para lista
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#29293E] rounded-2xl border border-[#34344A] overflow-hidden"
        >
          {/* Header do Perfil */}
          <div className="p-8 bg-gradient-to-r from-[#2D2D45] to-[#34344A]">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* ✅ FOTO DE PERFIL */}
              {renderProfilePicture(doctor)}

              {/* Informações Principais */}
              <div className="flex-1">
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-[#EAEAFB] mb-2"
                >
                  {doctor.fullName}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-[#6666C4] font-semibold mb-4"
                >
                  {doctor.especializacao}
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-4 mb-4"
                >
                  <div className="flex items-center gap-2">
                    <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-[#EAEAFB] font-semibold">{doctor.rating || 4.5}</span>
                    <span className="text-[#A5A5D6]">({doctor.reviewCount || 0} avaliações)</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#A5A5D6]">
                    <AcademicCapIcon className="w-5 h-5" />
                    <span>{doctor.experienceYears || 5} anos de experiência</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#A5A5D6]">
                    <MapPinIcon className="w-5 h-5" />
                    <span>{doctor.location || "Localização não informada"}</span>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-[#A5A5D6]"
                >
                  <strong>CRM:</strong> {doctor.crm}
                </motion.div>
              </div>

              {/* Botões de Ação */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startChat}
                  disabled={startingChat}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#6666C4] to-[#5454F0] text-white px-6 py-3 rounded-xl font-semibold transition-all hover:from-[#5454F0] hover:to-[#6666C4] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {startingChat ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  )}
                  {startingChat ? "Iniciando..." : "Iniciar Conversa"}
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Conteúdo do Perfil */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Coluna Principal */}
              <div className="lg:col-span-2 space-y-8">
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <h2 className="text-xl font-semibold text-[#EAEAFB] mb-4">Sobre</h2>
                  <p className="text-[#CFCFE8] leading-relaxed">
                    {doctor.bio || `Dr. ${doctor.fullName} é um profissional especializado em ${doctor.especializacao} com vasta experiência no cuidado da saúde dos pacientes.`}
                  </p>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <h2 className="text-xl font-semibold text-[#EAEAFB] mb-4">Contato</h2>
                  <div className="bg-[#232333] rounded-xl p-4 border border-[#34344A]">
                    <p className="text-[#CFCFE8]">
                      <strong>Email:</strong> {doctor.email}
                    </p>
                  </div>
                </motion.section>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <motion.section 
                  className="bg-[#232333] rounded-xl p-6 border border-[#34344A]"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <h3 className="text-lg font-semibold text-[#EAEAFB] mb-3">Informações Profissionais</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-[#A5A5D6]">Especialidade</p>
                      <p className="text-[#EAEAFB] font-medium">{doctor.especializacao}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#A5A5D6]">Registro Profissional</p>
                      <p className="text-[#EAEAFB] font-medium">{doctor.crm}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#A5A5D6]">Experiência</p>
                      <p className="text-[#EAEAFB] font-medium">{doctor.experienceYears || 5} anos</p>
                    </div>
                  </div>
                </motion.section>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startChat}
                  disabled={startingChat}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6666C4] to-[#5454F0] text-white py-4 rounded-xl font-semibold transition-all hover:from-[#5454F0] hover:to-[#6666C4] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {startingChat ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  )}
                  {startingChat ? "Iniciando..." : "Iniciar Conversa"}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}