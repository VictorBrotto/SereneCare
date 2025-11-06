import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import DailyForm from "./components/DailyForm";
import History from "./components/History";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatsPage from './pages/Chats';
import ChatThread from './pages/ChatThread';

// Importe os novos componentes
import DoctorsList from "./pages/DoctorsList";
import DoctorProfile from "./pages/DoctorProfile";


export default function App() {
  const location = useLocation();

  // Oculta Header e Footer em páginas públicas
  const hideLayout =
    location.pathname === "/" ||
    location.pathname === "/welcome" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div className="min-h-screen flex flex-col bg-[#1F1F33]">
      {!hideLayout && <Header />}

      <main className="flex-grow">
        <Routes>
          {/* Páginas públicas */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chats" element={<ChatsPage />} />
          <Route path="/chats/:id" element={<ChatThread />} />
          
          {/* Novas rotas de doutores */}
          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} />

          {/* Páginas protegidas */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/form"
            element={
              <ProtectedRoute>
                <DailyForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}