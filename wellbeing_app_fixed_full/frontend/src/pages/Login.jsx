import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon
} from "@heroicons/react/24/solid";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [role, setRole] = useState("PATIENT");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Se o usuário já estiver logado, redireciona
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/home");
  }, [navigate]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true);

    try {
      const isEmail = form.identifier.includes('@');
      
      const loginData = {
        password: form.password,
        role: role
      };

      if (isEmail) {
        loginData.email = form.identifier;
        loginData.username = null;
      } else {
        loginData.username = form.identifier;
        loginData.email = null;
      }

      const res = await axios.post("http://localhost:8080/api/auth/login", loginData);

      // Armazena os dados no localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("email", res.data.email);

      navigate("/home");

    } catch (err) {
      if (err.response?.status === 403) {
        setError("Tipo de conta incorreto. Verifique se selecionou a opção certa.");
      } else if (err.response?.status === 401) {
        setError("Credenciais inválidas. Verifique seus dados e tente novamente.");
      } else if (err.response?.data) {
        setError(err.response.data);
      } else if (err.code === "NETWORK_ERROR" || err.code === "ECONNREFUSED") {
        setError("Servidor offline. Tente novamente em alguns instantes.");
      } else {
        setError("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setIsLoggingIn(false);
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
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#EAEAFB]">Bem-vindo de volta</h2>
          <p className="text-sm text-[#A5A5D6] mt-1">
            Entre na sua conta para continuar
          </p>
        </div>

        {/* Seletor Paciente / Doutor */}
        <div className="relative flex items-center justify-center mb-6 bg-[#232333] rounded-full p-1 w-[200px] mx-auto overflow-hidden">
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

        <form onSubmit={submit} className="space-y-4">
          {/* Campo de email/usuário */}
          <div>
            <label className="block text-[#CFCFE8] text-sm mb-2">Email ou nome de usuário</label>
            <div className="relative">
              <UserIcon className="h-5 w-5 absolute left-3 top-3 text-[#A5A5D6]" />
              <input
                name="identifier"
                value={form.identifier}
                onChange={change}
                type="text"
                required
                placeholder="seu usuário ou email"
                className="w-full pl-10 pr-4 py-3 bg-[#232333] rounded-lg text-[#EAEAFB] focus:ring-2 focus:ring-[#6666C4] outline-none border border-transparent focus:border-[#6666C4] transition-colors"
                disabled={isLoggingIn}
              />
            </div>
          </div>

          {/* Campo de senha */}
          <div>
            <label className="block text-[#CFCFE8] text-sm mb-2">Senha</label>
            <div className="relative">
              <LockClosedIcon className="h-5 w-5 absolute left-3 top-3 text-[#A5A5D6]" />
              <input
                name="password"
                value={form.password}
                onChange={change}
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 bg-[#232333] rounded-lg text-[#EAEAFB] focus:ring-2 focus:ring-[#6666C4] outline-none border border-transparent focus:border-[#6666C4] transition-colors"
                disabled={isLoggingIn}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#A5A5D6] hover:text-[#EAEAFB] transition-colors"
                disabled={isLoggingIn}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm p-3 bg-red-400/10 rounded-lg border border-red-400/20"
            >
              {error}
            </motion.div>
          )}

          {/* Botão de login */}
          <motion.button
            type="submit"
            whileHover={{ scale: isLoggingIn ? 1 : 1.02 }}
            whileTap={{ scale: isLoggingIn ? 1 : 0.98 }}
            disabled={isLoggingIn}
            className="w-full bg-gradient-to-r from-[#6666C4] to-[#5454F0] hover:from-[#5454F0] hover:to-[#6666C4] text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center shadow-lg"
          >
            {isLoggingIn ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Entrando...
              </>
            ) : (
              'Entrar na conta'
            )}
          </motion.button>
        </form>

        {/* Link para registro */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6 pt-4 border-t border-[#34344A]"
        >
          <p className="text-sm text-[#A5A5D6]">
            Não tem uma conta?{" "}
            <Link
              to="/register"
              className="text-[#EAEAFB] font-semibold hover:text-[#6666C4] transition-colors"
            >
              Criar conta
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}