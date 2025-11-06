import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HomeIcon, PencilSquareIcon, ClockIcon, ArrowRightOnRectangleIcon, ChatBubbleLeftEllipsisIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import axios from "axios";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showChatDropdown, setShowChatDropdown] = useState(false);
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") || "PATIENT";

  // Efeito para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 5);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function onClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowChatDropdown(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (showChatDropdown) {
      fetchChats();
    }
  }, [showChatDropdown]);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setShowLogoutModal(false);
    navigate("/");
  };

  const isActive = (p) => location.pathname === p ? "text-[#EAEAFB] font-semibold bg-[#2D2D45]" : "text-[#CFCFE8] hover:text-[#EAEAFB] hover:bg-[#2D2D45]";

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
          <img src="/logo.png" alt="logo" className="w-8 h-8 rounded-full" />
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

          {/* Botão Doutores - apenas para pacientes */}
          {role === "PATIENT" && (
            <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
              <Link 
                to="/doctors" 
                className={`flex items-center gap-1 px-3 py-2 rounded-md transition-all duration-200 ${isActive("/doctors")}`}
              >
                <UserGroupIcon className="h-5 w-5" />
                <span>Doutores</span>
              </Link>
            </motion.div>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {/* Chat icon */}
          <div className="relative" ref={dropdownRef}>
            <motion.button 
              whileHover={{ scale: 1.08 }} 
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowChatDropdown(!showChatDropdown)} 
              className="p-2 rounded-md text-[#EAEAFB] hover:bg-[#2D2D45] transition-all duration-200"
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
                  className="absolute right-0 mt-2 w-80 bg-[#29293E] rounded-lg shadow-lg z-50 p-3 border border-[#363645]"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-[#EAEAFB] font-semibold">Conversas</div>
                    <Link 
                      to="/chats" 
                      onClick={() => setShowChatDropdown(false)} 
                      className="text-xs text-[#A5A5D6] hover:text-[#EAEAFB] transition-colors duration-200"
                    >
                      Abrir todos
                    </Link>
                  </div>

                  {loadingChats ? (
                    <div className="text-sm text-[#A5A5D6]">Carregando...</div>
                  ) : (
                    chats.length === 0 ? (
                      <div className="text-sm text-[#A5A5D6]">Nenhuma conversa</div>
                    ) : (
                      chats.map((c) => (
                        <motion.div 
                          key={c.id} 
                          className="flex items-center gap-3 p-2 rounded hover:bg-[#2D2D45] cursor-pointer transition-colors duration-200"
                          onClick={() => { navigate(`/chats/${c.id}`); setShowChatDropdown(false); }}
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="w-10 h-10 rounded-full bg-[#363645] flex items-center justify-center text-sm text-[#EAEAFB]">
                            {role === "DOCTOR" ? (c.patientName ? c.patientName[0] : "P") : (c.doctorName ? c.doctorName[0] : "D")}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-[#EAEAFB] font-semibold">
                              {role === "DOCTOR" ? (c.patientName || `Paciente ${c.patientId}`) : (c.doctorName || `Doutor ${c.doctorId}`)}
                            </div>
                            <div className="text-xs text-[#A5A5D6] truncate">{c.lastMessage || "Sem mensagens"}</div>
                          </div>
                        </motion.div>
                      ))
                    )
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logout */}
          <motion.button 
            whileHover={{ scale: 1.07 }} 
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLogoutModal(true)} 
            className="flex items-center gap-2 p-2 rounded-md text-[#EAEAFB] hover:text-[#FF6B6B] hover:bg-[#2D2D45] transition-all duration-200"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6" />
            <span className="hidden sm:inline">Sair</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Spacer com altura exata da header */}
      <div className="h-16" />

      {/* logout modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center" 
            onClick={() => setShowLogoutModal(false)}
          >
            <div className="absolute inset-0 bg-black/50" />
            <motion.div 
              onClick={(e) => e.stopPropagation()} 
              initial={{ opacity: 0, y: 12, scale: 0.96 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-[#29293E] p-6 rounded-2xl shadow-2xl w-[90%] max-w-sm text-center"
            >
              <h3 className="text-lg font-semibold mb-2 text-[#EAEAFB]">Confirmar saída</h3>
              <p className="text-sm text-[#CFCFE8] mb-6">Tem certeza que deseja sair da sua conta? Você será redirecionado para a tela inicial.</p>
              <div className="flex justify-center gap-3">
                <motion.button 
                  whileHover={{ scale: 1.03 }} 
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowLogoutModal(false)} 
                  className="px-4 py-2 bg-[#44446C] rounded-lg hover:bg-[#555583] text-[#EAEAFB] transition-colors duration-200"
                >
                  Cancelar
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.03 }} 
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogout} 
                  className="px-4 py-2 bg-[#FF6B6B] rounded-lg text-white hover:bg-[#FF4F4F] transition-colors duration-200"
                >
                  Sair
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}