import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon, StarIcon, MapPinIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import axios from "axios";

export default function DoctorsList() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/doctors", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(res.data || []);
    } catch (err) {
      console.error("Erro ao buscar doutores", err);
      // Mock data para demonstração
      setDoctors([
        {
          id: 1,
          name: "Dr. João Silva",
          specialty: "Cardiologia",
          experience: 12,
          rating: 4.8,
          reviews: 127,
          location: "São Paulo, SP",
          image: "/doctor1.jpg",
          description: "Especialista em cardiologia preventiva e tratamento de doenças cardíacas.",
          education: "USP - Faculdade de Medicina",
          languages: ["Português", "Inglês", "Espanhol"]
        },
        {
          id: 2,
          name: "Dra. Maria Santos",
          specialty: "Dermatologia",
          experience: 8,
          rating: 4.9,
          reviews: 89,
          location: "Rio de Janeiro, RJ",
          image: "/doctor2.jpg",
          description: "Dermatologista com foco em estética e tratamento de pele.",
          education: "UFRJ - Faculdade de Medicina",
          languages: ["Português", "Inglês"]
        },
        {
          id: 3,
          name: "Dr. Pedro Costa",
          specialty: "Ortopedia",
          experience: 15,
          rating: 4.7,
          reviews: 203,
          location: "Belo Horizonte, MG",
          image: "/doctor3.jpg",
          description: "Ortopedista especializado em cirurgia de coluna e articulações.",
          education: "UFMG - Faculdade de Medicina",
          languages: ["Português", "Francês"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const specialties = [...new Set(doctors.map(doctor => doctor.specialty))];

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedSpecialty === "" || doctor.specialty === selectedSpecialty)
  );

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1F1F33] to-[#2A2A44] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[#EAEAFB] mb-4">
            Nossos Doutores
          </h1>
          <p className="text-lg text-[#A5A5D6] max-w-2xl mx-auto">
            Encontre o profissional ideal para cuidar da sua saúde
          </p>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#29293E] rounded-2xl p-6 mb-8 border border-[#34344A]"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-[#A5A5D6] absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar doutor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#1F1F33] text-[#EAEAFB] rounded-xl border border-[#34344A] focus:border-[#6666C4] focus:ring-2 focus:ring-[#6666C4] outline-none"
              />
            </div>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-4 py-3 bg-[#1F1F33] text-[#EAEAFB] rounded-xl border border-[#34344A] focus:border-[#6666C4] focus:ring-2 focus:ring-[#6666C4] outline-none"
            >
              <option value="">Todas as especialidades</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Lista de Doutores */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredDoctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-[#29293E] rounded-2xl p-6 border border-[#34344A] hover:border-[#6666C4] transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(`/doctors/${doctor.id}`)}
            >
              {/* Header do Card */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#6666C4] to-[#5454F0] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {doctor.image ? (
                    <img src={doctor.image} alt={doctor.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    doctor.name.split(' ').map(n => n[0]).join('')
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#EAEAFB] group-hover:text-white transition-colors">
                    {doctor.name}
                  </h3>
                  <p className="text-[#6666C4] font-medium">{doctor.specialty}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-[#EAEAFB] font-semibold">{doctor.rating}</span>
                </div>
                <span className="text-[#A5A5D6] text-sm">({doctor.reviews} avaliações)</span>
              </div>

              {/* Informações */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-[#A5A5D6]">
                  <AcademicCapIcon className="w-4 h-4" />
                  <span>{doctor.experience} anos de experiência</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#A5A5D6]">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{doctor.location}</span>
                </div>
              </div>

              {/* Descrição */}
              <p className="text-sm text-[#CFCFE8] line-clamp-2 mb-4">
                {doctor.description}
              </p>

              {/* Botão */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-[#6666C4] to-[#5454F0] text-white py-2 rounded-xl font-semibold transition-all hover:from-[#5454F0] hover:to-[#6666C4]"
              >
                Ver Perfil
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {filteredDoctors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-lg text-[#A5A5D6]">Nenhum doutor encontrado</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}