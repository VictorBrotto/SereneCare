import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HomeIcon, 
  PencilSquareIcon, 
  ClockIcon, 
  ArrowRightOnRectangleIcon, 
  ChatBubbleLeftEllipsisIcon,
  UserGroupIcon,
  ChevronDownIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  HeartIcon
} from "@heroicons/react/24/outline";
import axios from "axios";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showChatDropdown, setShowChatDropdown] = useState(false);
  const [showDoctorsDropdown, setShowDoctorsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [chats, setChats] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef();
  const doctorsDropdownRef = useRef();
  const profileDropdownRef = useRef();
  const logoutModalRef = useRef();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") || "PATIENT";
  const userId = localStorage.getItem("userId");

  // Efeito para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 5);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Efeito para buscar informações do usuário
  useEffect(() => {
    if (userId) {
      fetchUserInfo();
    }
  }, [userId]);

  // Efeito para fechar dropdowns ao clicar fora
  useEffect(() => {
    function onClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowChatDropdown(false);
      }
      if (doctorsDropdownRef.current && !doctorsDropdownRef.current.contains(e.target)) {
        setShowDoctorsDropdown(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
      if (logoutModalRef.current && !logoutModalRef.current.contains(e.target) && showLogoutModal) {
        setShowLogoutModal(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [showLogoutModal]);

  useEffect(() => {
    if (showChatDropdown) {
      fetchChats();
    }
  }, [showChatDropdown]);

  useEffect(() => {
    if (showDoctorsDropdown && role === "PATIENT") {
      fetchDoctors();
    }
  }, [showDoctorsDropdown, role]);

  const fetchUserInfo = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserInfo(res.data);
    } catch (err) {
      console.error("Erro ao buscar informações do usuário", err);
    }
  };

  const fetchChats = async () => {
    setLoadingChats(true);
    try {
      const res = await axios.get("http://localhost:8080/api/chats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(res.data || []);
    } catch (err) {
      console.error("Erro ao buscar chats", err);
    } finally {
      setLoadingChats(false);
    }
  };

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const res = await axios.get("http://localhost:8080/api/users/doctors", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(res.data.slice(0, 5) || []);
    } catch (err) {
      console.error("Erro ao buscar doutores", err);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    setShowLogoutModal(false);
    navigate("/");
  };

  const isActive = (p) => location.pathname === p ? "text-[#EAEAFB] font-semibold bg-[#363645]" : "text-[#CFCFE8] hover:text-[#EAEAFB] hover:bg-[#363645]";

  return (
    <>
      <motion.header 
        className={`fixed top-0 left-0 right-0 bg-[#29293E] shadow-md py-4 px-6 flex justify-between items-center z-40 transition-all duration-300 ${
          isScrolled 
            ? "backdrop-blur-md bg-opacity-95 shadow-lg" 
            : "bg-opacity-100"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30 
        }}
      >
        <motion.div 
          onClick={() => navigate("/home")} 
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-[#6666C4] to-[#5454F0] rounded-full flex items-center justify-center">
            <HeartIcon className="w-5 h-5 text-white" />
          </div>
          <div className="text-lg font-semibold text-[#EAEAFB]">SereneCare</div>
        </motion.div>

        <nav className="flex items-center gap-2 text-sm font-medium">
          <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
            <Link 
              to="/home" 
              className={`flex items-center gap-1 px-3 py-2 rounded-md transition-all duration-200 ${isActive("/home")}`}
            >
              <HomeIcon className="h-5 w-5" />
              <span>Início</span>
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
            <Link 
              to="/form" 
              className={`flex items-center gap-1 px-3 py-2 rounded-md transition-all duration-200 ${isActive("/form")}`}
            >
              <PencilSquareIcon className="h-5 w-5" />
              <span>Diário</span>
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
            <Link 
              to="/history" 
              className={`flex items-center gap-1 px-3 py-2 rounded-md transition-all duration-200 ${isActive("/history")}`}
            >
              <ClockIcon className="h-5 w-5" />
              <span>Histórico</span>
            </Link>
          </motion.div>

          {/* Dropdown Doutores - apenas para pacientes */}
          {role === "PATIENT" && (
            <div className="relative" ref={doctorsDropdownRef}>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDoctorsDropdown(!showDoctorsDropdown)}
                className={`flex items-center gap-1 px-3 py-2 rounded-md transition-all duration-200 ${
                  location.pathname.startsWith("/doctors") 
                    ? "text-[#EAEAFB] font-semibold bg-[#363645]" 
                    : "text-[#CFCFE8] hover:text-[#EAEAFB] hover:bg-[#363645]"
                }`}
              >
                <UserGroupIcon className="h-5 w-5" />
                <span>Doutores</span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${showDoctorsDropdown ? "rotate-180" : ""}`} />
              </motion.button>

              <AnimatePresence>
                {showDoctorsDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 6, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: 6, scale: 0.95 }} 
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute left-0 mt-2 w-72 bg-[#29293E] rounded-xl shadow-2xl z-50 border border-[#5F5F70] backdrop-blur-md"
                  >
                    {/* Header do Dropdown */}
                    <div className="p-4 border-b border-[#5F5F70]">
                      <div className="flex items-center gap-2">
                        <UserGroupIcon className="h-5 w-5 text-[#6666C4]" />
                        <h3 className="text-sm font-semibold text-[#EAEAFB]">Nossos Doutores</h3>
                      </div>
                      <p className="text-xs text-[#A5A5D6] mt-1">Encontre profissionais especializados</p>
                    </div>

                    {/* Lista de Doutores */}
                    <div className="max-h-80 overflow-y-auto">
                      {loadingDoctors ? (
                        <div className="flex justify-center items-center py-8">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 border-2 border-[#6666C4] border-t-transparent rounded-full"
                          />
                        </div>
                      ) : doctors.length === 0 ? (
                        <div className="text-center py-6">
                          <UserGroupIcon className="h-8 w-8 text-[#A5A5D6] mx-auto mb-2" />
                          <p className="text-sm text-[#A5A5D6]">Nenhum doutor disponível</p>
                        </div>
                      ) : (
                        <div className="p-2">
                          {doctors.map((doctor) => (
                            <motion.div
                              key={doctor.id}
                              whileHover={{ x: 2, backgroundColor: "#363645" }}
                              whileTap={{ scale: 0.98 }}
                              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group"
                              onClick={() => { 
                                navigate(`/doctors/${doctor.id}`); 
                                setShowDoctorsDropdown(false); 
                              }}
                            >
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6666C4] to-[#5454F0] flex items-center justify-center text-white font-semibold text-sm">
                                {doctor.fullName.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-[#EAEAFB] truncate group-hover:text-white">
                                  {doctor.fullName}
                                </div>
                                <div className="text-xs text-[#6666C4] truncate">
                                  {doctor.especializacao}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <StarIcon className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-[#A5A5D6]">{doctor.rating || 4.5}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer do Dropdown */}
                    <div className="p-3 border-t border-[#5F5F70] bg-[#1F1F33] rounded-b-xl">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { 
                          navigate("/doctors"); 
                          setShowDoctorsDropdown(false); 
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-[#6666C4] to-[#5454F0] text-white text-sm font-semibold rounded-lg transition-all hover:from-[#5454F0] hover:to-[#6666C4]"
                      >
                        <UserGroupIcon className="h-4 w-4" />
                        Ver Todos os Doutores
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {/* Chat icon */}
          <div className="relative" ref={dropdownRef}>
            <motion.button 
              whileHover={{ scale: 1.08 }} 
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowChatDropdown(!showChatDropdown)} 
              className="p-2 rounded-md text-[#EAEAFB] hover:bg-[#363645] transition-all duration-200"
            >
              <ChatBubbleLeftEllipsisIcon className="h-6 w-6" />
            </motion.button>

            <AnimatePresence>
              {showChatDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 6, scale: 0.95 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, y: 6, scale: 0.95 }} 
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-80 bg-[#29293E] rounded-xl shadow-2xl z-50 border border-[#5F5F70] backdrop-blur-md"
                >
                  <div className="p-4 border-b border-[#5F5F70]">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-[#6666C4]" />
                        <div className="text-sm font-semibold text-[#EAEAFB]">Conversas</div>
                      </div>
                      <Link 
                        to="/chats" 
                        onClick={() => setShowChatDropdown(false)} 
                        className="text-xs text-[#A5A5D6] hover:text-[#EAEAFB] transition-colors duration-200"
                      >
                        Ver todos
                      </Link>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {loadingChats ? (
                      <div className="flex justify-center items-center py-8">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6 border-2 border-[#6666C4] border-t-transparent rounded-full"
                        />
                      </div>
                    ) : (
                      chats.length === 0 ? (
                        <div className="text-center py-6">
                          <ChatBubbleLeftEllipsisIcon className="h-8 w-8 text-[#A5A5D6] mx-auto mb-2" />
                          <p className="text-sm text-[#A5A5D6]">Nenhuma conversa</p>
                        </div>
                      ) : (
                        <div className="p-2">
                          {chats.map((c) => (
                            <motion.div 
                              key={c.id} 
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#363645] cursor-pointer transition-all duration-200 group"
                              onClick={() => { navigate(`/chats/${c.id}`); setShowChatDropdown(false); }}
                              whileHover={{ x: 2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="w-10 h-10 rounded-full bg-[#5F5F70] flex items-center justify-center text-sm text-[#EAEAFB] font-semibold">
                                {role === "DOCTOR" ? (c.patientName ? c.patientName[0] : "P") : (c.doctorName ? c.doctorName[0] : "D")}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-[#EAEAFB] truncate group-hover:text-white">
                                  {role === "DOCTOR" ? (c.patientName || `Paciente ${c.patientId}`) : (c.doctorName || `Doutor ${c.doctorId}`)}
                                </div>
                                <div className="text-xs text-[#A5A5D6] truncate">{c.lastMessage || "Sem mensagens"}</div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Botão de Perfil */}
          <div className="relative" ref={profileDropdownRef}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 p-2 rounded-md text-[#EAEAFB] hover:bg-[#363645] transition-all duration-200"
            >
              <UserCircleIcon className="h-6 w-6" />
              <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${showProfileDropdown ? "rotate-180" : ""}`} />
            </motion.button>

            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 6, scale: 0.95 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, y: 6, scale: 0.95 }} 
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-64 bg-[#29293E] rounded-xl shadow-2xl z-50 border border-[#5F5F70] backdrop-blur-md"
                >
                  {/* Header do Perfil */}
                  <div className="p-4 border-b border-[#5F5F70]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6666C4] to-[#5454F0] flex items-center justify-center text-white font-semibold">
                        {userInfo?.fullName?.split(' ').map(n => n[0]).join('') || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-[#EAEAFB] truncate">
                          {userInfo?.fullName || "Usuário"}
                        </div>
                        <div className="text-xs text-[#6666C4] capitalize">
                          {role.toLowerCase()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Opções do Menu */}
                  <div className="p-2">
                    <motion.button
                      whileHover={{ x: 2, backgroundColor: "#363645" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { 
                        navigate("/profile"); 
                        setShowProfileDropdown(false); 
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg text-[#EAEAFB] hover:text-white transition-all duration-200 text-left"
                    >
                      <UserCircleIcon className="h-5 w-5 text-[#6666C4]" />
                      <div>
                        <div className="text-sm font-medium">Meu Perfil</div>
                        <div className="text-xs text-[#A5A5D6]">Ver e editar perfil</div>
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ x: 2, backgroundColor: "#363645" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { 
                        navigate("/settings"); 
                        setShowProfileDropdown(false); 
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg text-[#EAEAFB] hover:text-white transition-all duration-200 text-left"
                    >
                      <Cog6ToothIcon className="h-5 w-5 text-[#6666C4]" />
                      <div>
                        <div className="text-sm font-medium">Configurações</div>
                        <div className="text-xs text-[#A5A5D6]">Senha, e-mail, etc.</div>
                      </div>
                    </motion.button>
                  </div>

                  {/* Logout */}
                  <div className="p-3 border-t border-[#5F5F70] bg-[#1F1F33] rounded-b-xl">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { 
                        setShowProfileDropdown(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-[#5F5F70] hover:bg-[#6A6A9C] text-white text-sm font-semibold rounded-lg transition-all duration-200"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      Sair da Conta
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      {/* Spacer com altura exata da header */}
      <div className="h-16" />

      {/* Modal de Logout */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowLogoutModal(false)}
            />
            
            <motion.div 
              ref={logoutModalRef}
              initial={{ opacity: 0, y: 12, scale: 0.96 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-[#29293E] p-6 rounded-2xl shadow-2xl w-[90%] max-w-sm text-center border border-[#5F5F70] relative z-50"
            >
              <h3 className="text-lg font-semibold mb-2 text-[#EAEAFB]">Confirmar saída</h3>
              <p className="text-sm text-[#CFCFE8] mb-6">Tem certeza que deseja sair da sua conta?</p>
              <div className="flex justify-center gap-3">
                <motion.button 
                  whileHover={{ scale: 1.03 }} 
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowLogoutModal(false)} 
                  className="px-4 py-2 bg-[#5F5F70] rounded-lg hover:bg-[#6A6A9C] text-[#EAEAFB] transition-colors duration-200"
                >
                  Cancelar
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.03 }} 
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogout} 
                  className="px-4 py-2 bg-gradient-to-r from-[#6666C4] to-[#5454F0] rounded-lg text-white hover:from-[#5454F0] hover:to-[#6666C4] transition-all duration-200"
                >
                  Sair
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// Componente StarIcon para as avaliações
const StarIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);