import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    especializacao: "",
    crm: "",
  });
  const [role, setRole] = useState("PATIENT");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Se já estiver logado, vai para home
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/home");
  }, [navigate]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("❌ As senhas não coincidem.");
      return;
    }

    try {
      const payload = {
        username: form.username,
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        role: role,
        especializacao: role === "DOCTOR" ? form.especializacao : null,
        crm: role === "DOCTOR" ? form.crm : null,
      };
      await axios.post("http://localhost:8080/api/auth/register", payload);
      navigate("/login");
    } catch (err) {
      setError("❌ Não foi possível criar a conta. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1F1F33]">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#29293E] p-8 rounded-2xl shadow-2xl w-[440px]"
      >
        <div className="text-center mb-5">
          <h2 className="text-2xl font-bold text-[#EAEAFB]">Criar Conta</h2>
          <p className="text-sm text-[#A5A5D6] mt-1">
            Cadastre-se para começar sua jornada de bem-estar.
          </p>
        </div>

        {/* Switch Role Animado */}
        <div className="relative flex items-center justify-center mb-6 bg-[#232333] rounded-full p-1 w-[200px] mx-auto">
          <motion.div
            className="absolute h-7 rounded-full bg-[#6666C4]"
            initial={false}
            animate={{
              x: role === "PATIENT" ? -50 : 50, // Transição do pílulo
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            style={{
              width: "90px", // Largura fixa do pílulo para os dois botões
            }}
          />
          <motion.button
            type="button"
            onClick={() => setRole("PATIENT")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative z-10 px-6 py-1 text-sm font-semibold transition-colors duration-300 ${
              role === "PATIENT" ? "text-white" : "text-[#A5A5D6]"
            }`}
          >
            Paciente
          </motion.button>
          <motion.button
            type="button"
            onClick={() => setRole("DOCTOR")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative z-10 px-7 py-1 text-sm font-semibold transition-colors duration-300 ${
              role === "DOCTOR" ? "text-white" : "text-[#A5A5D6]"
            }`}
          >
            Doutor
          </motion.button>
        </div>

        <form onSubmit={submit} className="space-y-3 text-sm">
          {/* Nome completo */}
          <label className="block text-[#CFCFE8]">Nome completo</label>
          <div className="relative">
            <UserIcon className="h-5 w-5 absolute left-3 top-2 text-[#A5A5D6]" />
            <input
              name="fullName"
              value={form.fullName}
              onChange={change}
              required
              className="w-full pl-10 py-2 bg-[#232333] rounded-lg text-[#EAEAFB]"
            />
          </div>

          {/* Nome de usuário */}
          <label className="block text-[#CFCFE8]">Nome de usuário</label>
          <div className="relative">
            <UserIcon className="h-5 w-5 absolute left-3 top-2 text-[#A5A5D6]" />
            <input
              name="username"
              value={form.username}
              onChange={change}
              required
              className="w-full pl-10 py-2 bg-[#232333] rounded-lg text-[#EAEAFB]"
            />
          </div>

          {/* Email */}
          <label className="block text-[#CFCFE8]">Email</label>
          <div className="relative">
            <EnvelopeIcon className="h-5 w-5 absolute left-3 top-2 text-[#A5A5D6]" />
            <input
              name="email"
              value={form.email}
              onChange={change}
              required
              type="email"
              className="w-full pl-10 py-2 bg-[#232333] rounded-lg text-[#EAEAFB]"
            />
          </div>

          {role === "DOCTOR" && (
            <>
              <label className="block text-[#CFCFE8]">Especialização</label>
              <input
                name="especializacao"
                value={form.especializacao}
                onChange={change}
                className="w-full px-3 py-2 bg-[#232333] rounded-lg text-[#EAEAFB]"
              />
              <label className="block text-[#CFCFE8]">CRM</label>
              <input
                name="crm"
                value={form.crm}
                onChange={change}
                className="w-full px-3 py-2 bg-[#232333] rounded-lg text-[#EAEAFB]"
              />
            </>
          )}

          {/* Senha */}
          <label className="block text-[#CFCFE8]">Senha</label>
          <div className="relative">
            <LockClosedIcon className="h-5 w-5 absolute left-3 top-2 text-[#A5A5D6]" />
            <input
              name="password"
              value={form.password}
              onChange={change}
              type={showPassword ? "text" : "password"}
              required
              placeholder="********"
              className="w-full pl-10 pr-10 py-2 bg-[#232333] rounded-lg text-[#EAEAFB]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-[#A5A5D6]"
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>

          {/* Confirmar senha */}
          <label className="block text-[#CFCFE8]">Confirmar senha</label>
          <div className="relative">
            <LockClosedIcon className="h-5 w-5 absolute left-3 top-2 text-[#A5A5D6]" />
            <input
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={change}
              type={showConfirmPassword ? "text" : "password"}
              required
              placeholder="********"
              className="w-full pl-10 pr-10 py-2 bg-[#232333] rounded-lg text-[#EAEAFB]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-[#A5A5D6]"
            >
              {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>

          {/* Erro */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {/* Botão de cadastro */}
          <button
            type="submit"
            className="w-full bg-[#6666C4] text-white py-2 rounded-lg mt-4"
          >
            Criar conta
          </button>

          {/* Links */}
          <div className="text-center mt-3">
            <p className="text-sm text-[#A5A5D6]">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-[#6666C4] hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
