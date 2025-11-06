import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { StarIcon, MapPinIcon, AcademicCapIcon, CalendarIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import axios from "axios";

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8080/api/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctor(res.data);
    } catch (err) {
      console.error("Erro ao buscar doutor", err);
      // Mock data
      setDoctor({
        id: parseInt(id),
        name: "Dr. João Silva",
        specialty: "Cardiologia",
        experience: 12,
        rating: 4.8,
        reviews: 127,
        location: "São Paulo, SP",
        image: "/doctor1.jpg",
        description: "Especialista em cardiologia preventiva e tratamento de doenças cardíacas. Atuo com foco na saúde cardiovascular integral do paciente, desde prevenção até tratamentos complexos.",
        education: "USP - Faculdade de Medicina",
        languages: ["Português", "Inglês", "Espanhol"],
        about: "Com mais de 12 anos de experiência em cardiologia, dedico-me ao cuidado integral da saúde do coração. Acredito na medicina preventiva e na construção de uma relação de confiança com meus pacientes.",
        services: [
          "Consulta cardiológica",
          "Ecocardiograma",
          "Teste ergométrico",
          "Holter 24h",
          "Acompanhamento pós-operatório"
        ],
        availability: "Segunda a Sexta, 8h às 18h"
      });
    } finally {
      setLoading(false);
    }
  };

  const startChat = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:8080/api/chats/start", 
        { doctorId: parseInt(id) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Navega para o chat criado
      navigate(`/chats/${res.data.id}`);
    } catch (err) {
      console.error("Erro ao iniciar chat", err);
      // Se der erro, cria um chat mock
      navigate(`/chats/new-${id}`);
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
        <p className="text-lg text-[#A5A5D6]">Doutor não encontrado</p>
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
          className="flex items-center gap-2 text-[#A5A5D6] hover:text-[#EAEAFB] mb-8 transition-colors"
        >
          ← Voltar para lista
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#29293E] rounded-2xl border border-[#34344A] overflow-hidden"
        >
          {/* Header do Perfil */}
          <div className="p-8 bg-gradient-to-r from-[#2D2D45] to-[#34344A]">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Foto */}
              <div className="w-24 h-24 bg-gradient-to-br from-[#6666C4] to-[#5454F0] rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {doctor.image ? (
                  <img src={doctor.image} alt={doctor.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  doctor.name.split(' ').map(n => n[0]).join('')
                )}
              </div>

              {/* Informações Principais */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-[#EAEAFB] mb-2">{doctor.name}</h1>
                <p className="text-xl text-[#6666C4] font-semibold mb-4">{doctor.specialty}</p>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-[#EAEAFB] font-semibold">{doctor.rating}</span>
                    <span className="text-[#A5A5D6]">({doctor.reviews} avaliações)</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#A5A5D6]">
                    <AcademicCapIcon className="w-5 h-5" />
                    <span>{doctor.experience} anos de experiência</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#A5A5D6]">
                    <MapPinIcon className="w-5 h-5" />
                    <span>{doctor.location}</span>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startChat}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#6666C4] to-[#5454F0] text-white px-6 py-3 rounded-xl font-semibold transition-all hover:from-[#5454F0] hover:to-[#6666C4]"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  Iniciar Conversa
                </motion.button>
              </div>
            </div>
          </div>

          {/* Conteúdo do Perfil */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Coluna Principal */}
              <div className="lg:col-span-2 space-y-8">
                {/* Sobre */}
                <section>
                  <h2 className="text-xl font-semibold text-[#EAEAFB] mb-4">Sobre</h2>
                  <p className="text-[#CFCFE8] leading-relaxed">{doctor.about || doctor.description}</p>
                </section>

                {/* Formação */}
                <section>
                  <h2 className="text-xl font-semibold text-[#EAEAFB] mb-4">Formação</h2>
                  <div className="bg-[#232333] rounded-xl p-4 border border-[#34344A]">
                    <p className="text-[#CFCFE8]">{doctor.education}</p>
                  </div>
                </section>

                {/* Serviços */}
                <section>
                  <h2 className="text-xl font-semibold text-[#EAEAFB] mb-4">Serviços</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {doctor.services?.map((service, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 bg-[#232333] rounded-xl p-4 border border-[#34344A] hover:border-[#6666C4] transition-colors"
                      >
                        <div className="w-2 h-2 bg-[#6666C4] rounded-full"></div>
                        <span className="text-[#CFCFE8]">{service}</span>
                      </motion.div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Idiomas */}
                <section className="bg-[#232333] rounded-xl p-6 border border-[#34344A]">
                  <h3 className="text-lg font-semibold text-[#EAEAFB] mb-3">Idiomas</h3>
                  <div className="space-y-2">
                    {doctor.languages?.map((language, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#6666C4] rounded-full"></div>
                        <span className="text-[#CFCFE8]">{language}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Disponibilidade */}
                <section className="bg-[#232333] rounded-xl p-6 border border-[#34344A]">
                  <h3 className="text-lg font-semibold text-[#EAEAFB] mb-3">Disponibilidade</h3>
                  <div className="flex items-center gap-2 text-[#CFCFE8]">
                    <CalendarIcon className="w-5 h-5" />
                    <span>{doctor.availability}</span>
                  </div>
                </section>

                {/* Botão de Chat Fixo */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startChat}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#6666C4] to-[#5454F0] text-white py-4 rounded-xl font-semibold transition-all hover:from-[#5454F0] hover:to-[#6666C4] shadow-lg"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  Iniciar Conversa
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}