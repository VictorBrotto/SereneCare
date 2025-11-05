// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // Se não houver token, redireciona para login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se houver token, renderiza o conteúdo normalmente
  return children;
}
