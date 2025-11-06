import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import MotionButton from "../components/MotionButton";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [role, setRole] = useState("PATIENT");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Se o usuário já estiver logado, redireciona
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/home");
  }, [navigate]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(""); // Limpa a mensagem de erro

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        username: form.identifier,  // ✅ CORRETO
        password: form.password,
        role: role,  // ✅ AGORA ENVIAMOS A ROLE PARA VALIDAÇÃO
      });

      // Armazena o token no localStorage e a role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role || role);

      // Redireciona para a página de home
      navigate("/home");
    } catch (err) {
      // ✅ MELHOR TRATAMENTO DE ERRO
      if (err.response?.status === 403) {
        setError("❌ Tipo de conta incorreto. Selecione a opção correta.");
      } else if (err.response?.status === 401) {
        setError("❌ Credenciais inválidas. Tente novamente.");
      } else {
        setError("❌ Erro de conexão. Tente novamente.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1F1F33]">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#29293E] p-8 rounded-2xl shadow-2xl w-[420px]"
      >
        <div className="text-center mb-5">
          <h2 className="text-2xl font-bold text-[#EAEAFB]">Bem-vindo</h2>
          <p className="text-sm text-[#A5A5D6] mt-1">
            Inicie sessão para continuar a sua jornada de bem-estar.
          </p>
        </div>

        {/* Seletor Paciente / Doutor */}
        <div className="relative flex items-center justify-center mb-6 bg-[#232333] rounded-full p-1 w-[200px] mx-auto overflow-hidden">
          {/* Pílula animada */}
          <motion.div
            className="absolute h-7 w-[96px] rounded-full bg-[#6666C4]"
            initial={false}
            animate={{
              x: role === "PATIENT" ? -48 : 48,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 22,
            }}
          />

          <motion.button
            type="button"
            onClick={() => setRole("PATIENT")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative z-10 w-[96px] py-1 text-sm font-semibold transition-colors duration-300 ${
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
            className={`relative z-10 w-[96px] py-1 text-sm font-semibold transition-colors duration-300 ${
              role === "DOCTOR" ? "text-white" : "text-[#A5A5D6]"
            }`}
          >
            Doutor
          </motion.button>
        </div>

        <form onSubmit={submit} className="space-y-3 text-sm">
          {/* Campo de email/usuário */}
          <label className="block text-[#CFCFE8]">Email ou nome de usuário</label>
          <div className="relative">
            <EnvelopeIcon className="h-5 w-5 absolute left-3 top-2 text-[#A5A5D6]" />
            <input
              name="identifier"
              value={form.identifier}
              onChange={change}
              type="text"
              required
              placeholder="seu usuário ou email"
              className="w-full pl-10 py-2 bg-[#232333] rounded-lg text-[#EAEAFB] focus:ring-2 focus:ring-[#6666C4] outline-none"
            />
          </div>

          {/* Campo de senha */}
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
              className="w-full pl-10 pr-10 py-2 bg-[#232333] rounded-lg text-[#EAEAFB] focus:ring-2 focus:ring-[#6666C4] outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-[#A5A5D6]"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Botão de login */}
          <MotionButton className="w-full bg-[#6666C4] hover:bg-[#5454F0] text-white py-2 rounded-lg font-semibold mt-2">
            Entrar
          </MotionButton>
        </form>

        {/* Links extras */}
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-[#A5A5D6] mt-4 text-center"
        >
          Não tem uma conta?{" "}
          <Link
            to="/register"
            className="text-[#EAEAFB] font-semibold hover:underline"
          >
            Crie uma
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}