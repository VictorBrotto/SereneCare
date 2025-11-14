import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon, StarIcon, MapPinIcon, AcademicCapIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import axios from "axios";

export default function DoctorsList() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSelectFocused, setIsSelectFocused] = useState(false);

  useEffect(() => {
    fetchDoctors();
    fetchSpecialties();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/users/doctors", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(res.data);
    } catch (err) {
      console.error("Erro ao buscar doutores", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/users/doctors/specializations", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSpecialties(res.data);
    } catch (err) {
      console.error("Erro ao buscar especialidades", err);
      // Fallback para especialidades padrão
      setSpecialties(["Cardiologia", "Dermatologia", "Psiquiatria", "Pediatria", "Ortopedia"]);
    }
  };

  // ✅ CORREÇÃO: Renderizar foto de perfil com fallback
  const renderProfilePicture = (doctor, size = "w-16 h-16") => {
    if (doctor.profilePicture) {
      return (
        <img 
          src={doctor.profilePicture} 
          alt={doctor.fullName}
          className={`${size} rounded-full object-cover border border-[#34344A] flex-shrink-0`}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      );
    }
    
    // Fallback para iniciais
    const initials = doctor.fullName ? doctor.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : "DR";
    
    return (
      <motion.div 
        className={`${size} bg-gradient-to-br from-[#6666C4] to-[#5454F0] rounded-full flex items-center justify-center text-white font-bold text-lg`}
        whileHover={{ rotate: 5, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        {initials.substring(0, 2)}
      </motion.div>
    );
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedSpecialty === "" || doctor.especializacao === selectedSpecialty)
  );

  const handleDoctorClick = (doctorId) => {
    navigate(`/doctors/${doctorId}`);
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
            {/* Search Input */}
            <motion.div 
              className="flex-1 relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <MagnifyingGlassIcon 
                className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                  isSearchFocused ? "text-[#6666C4]" : "text-[#A5A5D6]"
                }`} 
              />
              <motion.input
                type="text"
                placeholder="Buscar doutor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                whileFocus={{ scale: 1.02 }}
                className="w-full pl-10 pr-4 py-3 bg-[#1F1F33] text-[#EAEAFB] rounded-xl border border-[#34344A] focus:border-[#6666C4] focus:ring-2 focus:ring-[#6666C4] outline-none transition-all duration-300"
              />
            </motion.div>
            
            {/* Select de Especialidades */}
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <motion.select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                onFocus={() => setIsSelectFocused(true)}
                onBlur={() => setIsSelectFocused(false)}
                whileFocus={{ scale: 1.02 }}
                className="w-full md:w-64 pl-4 pr-10 py-3 bg-[#1F1F33] text-[#EAEAFB] rounded-xl border border-[#34344A] focus:border-[#6666C4] focus:ring-2 focus:ring-[#6666C4] outline-none appearance-none cursor-pointer transition-all duration-300"
              >
                <option value="">Todas as especialidades</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </motion.select>
              
              <ChevronDownIcon 
                className={`w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none transition-transform duration-300 ${
                  isSelectFocused ? "rotate-180 text-[#6666C4]" : "rotate-0 text-[#A5A5D6]"
                }`} 
              />
            </motion.div>
          </div>
        </motion.div>

        {/* ✅ CORREÇÃO: Lista de Doutores com AnimatePresence mode="popLayout" */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredDoctors.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ 
                  duration: 0.4,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 24
                }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 400, damping: 25 }
                }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#29293E] rounded-2xl p-6 border border-[#34344A] hover:border-[#6666C4] transition-all duration-300 cursor-pointer group relative overflow-hidden"
                onClick={() => handleDoctorClick(doctor.id)}
              >
                {/* Header do Card */}
                <div className="flex items-start gap-4 mb-4 relative z-10">
                  {/* ✅ FOTO DE PERFIL */}
                  <div className="relative">
                    {renderProfilePicture(doctor)}
                  </div>
                  
                  <div className="flex-1">
                    <motion.h3 
                      className="text-lg font-semibold text-[#EAEAFB] group-hover:text-white transition-colors"
                      whileHover={{ x: 2 }}
                    >
                      {doctor.fullName}
                    </motion.h3>
                    <motion.p 
                      className="text-[#6666C4] font-medium"
                      whileHover={{ x: 2 }}
                    >
                      {doctor.especializacao}
                    </motion.p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3 relative z-10">
                  <motion.div 
                    className="flex items-center gap-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-[#EAEAFB] font-semibold">{doctor.rating || 4.5}</span>
                  </motion.div>
                  <span className="text-[#A5A5D6] text-sm">({doctor.reviewCount || 0} avaliações)</span>
                </div>

                {/* Informações */}
                <div className="space-y-2 mb-4 relative z-10">
                  <motion.div 
                    className="flex items-center gap-2 text-sm text-[#A5A5D6]"
                    whileHover={{ x: 2 }}
                  >
                    <AcademicCapIcon className="w-4 h-4" />
                    <span>{doctor.experienceYears || 5} anos de experiência</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-2 text-sm text-[#A5A5D6]"
                    whileHover={{ x: 2 }}
                  >
                    <MapPinIcon className="w-4 h-4" />
                    <span>{doctor.location || "Localização não informada"}</span>
                  </motion.div>
                </div>

                {/* Descrição */}
                <motion.p 
                  className="text-sm text-[#CFCFE8] line-clamp-2 mb-4 relative z-10"
                  whileHover={{ x: 2 }}
                >
                  {doctor.bio || "Profissional de saúde dedicado ao cuidado dos pacientes."}
                </motion.p>

                {/* CRM */}
                <motion.div 
                  className="text-xs text-[#A5A5D6] mb-4 relative z-10"
                  whileHover={{ x: 2 }}
                >
                  CRM: {doctor.crm}
                </motion.div>

                {/* Botão */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-[#6666C4] to-[#5454F0] text-white py-2 rounded-xl font-semibold transition-all duration-300 relative z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDoctorClick(doctor.id);
                  }}
                >
                  Ver Perfil
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredDoctors.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <UserGroupIcon className="h-16 w-16 text-[#A5A5D6] mx-auto mb-4" />
            </motion.div>
            <p className="text-lg text-[#A5A5D6] mb-2">Nenhum doutor encontrado</p>
            <p className="text-sm text-[#A5A5D6]">Tente ajustar os filtros de busca</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

const UserGroupIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);