import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  UserCircleIcon, 
  CameraIcon, 
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import axios from "axios";

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const res = await axios.get(`http://localhost:8080/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setForm({
        fullName: res.data.fullName,
        bio: res.data.bio || "",
        location: res.data.location || ""
      });
    } catch (err) {
      console.error("Erro ao buscar perfil", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      await axios.put(`http://localhost:8080/api/users/${userId}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(prev => ({ ...prev, ...form }));
      setEditing(false);
      setMessage("Perfil atualizado com sucesso!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Erro ao atualizar perfil", err);
      setMessage("Erro ao atualizar perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      fullName: user.fullName,
      bio: user.bio || "",
      location: user.location || ""
    });
    setEditing(false);
  };

  // ✅ NOVA FUNÇÃO: Upload de imagem
  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `http://localhost:8080/api/users/${userId}/profile-image-upload`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setUser(res.data);
      setMessage("Foto de perfil atualizada com sucesso!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Erro ao fazer upload da imagem", err);
      setMessage("Erro ao fazer upload da imagem");
    } finally {
      setUploading(false);
    }
  };

  // ✅ NOVA FUNÇÃO: Remover imagem
  const handleRemoveImage = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      await axios.delete(`http://localhost:8080/api/users/${userId}/profile-image`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(prev => ({ ...prev, profileImage: null, profileImageUrl: null }));
      setMessage("Foto de perfil removida com sucesso!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Erro ao remover imagem", err);
      setMessage("Erro ao remover foto de perfil");
    }
  };

  // ✅ NOVA FUNÇÃO: Clique no botão de câmera
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  // ✅ NOVA FUNÇÃO: Processar arquivo selecionado
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setMessage("Por favor, selecione apenas arquivos de imagem");
        setTimeout(() => setMessage(""), 3000);
        return;
      }

      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage("A imagem deve ter no máximo 5MB");
        setTimeout(() => setMessage(""), 3000);
        return;
      }

      handleImageUpload(file);
    }
    // Limpar input
    event.target.value = '';
  };

  // ✅ FUNÇÃO: Renderizar imagem do perfil
  const renderProfileImage = () => {
    if (user?.profileImage) {
      // Se tem Base64 image
      return (
        <img 
          src={user.profileImage} 
          alt="Foto de perfil"
          className="w-32 h-32 rounded-full object-cover border-4 border-[#6666C4]"
        />
      );
    } else if (user?.profileImageUrl) {
      // Se tem URL externa
      return (
        <img 
          src={user.profileImageUrl} 
          alt="Foto de perfil"
          className="w-32 h-32 rounded-full object-cover border-4 border-[#6666C4]"
        />
      );
    } else {
      // Avatar com iniciais
      const initials = user?.fullName 
        ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
        : 'U';
      
      return (
        <div className="w-32 h-32 bg-gradient-to-br from-[#6666C4] to-[#5454F0] rounded-full flex items-center justify-center text-white font-bold text-2xl">
          {initials}
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1F1F33] to-[#363645]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#6666C4] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1F1F33] to-[#363645] pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="bg-[#6666C4]/20 p-3 rounded-xl">
              <UserCircleIcon className="h-6 w-6 text-[#6666C4]" />
            </div>
            <h1 className="text-3xl font-bold text-[#EAEAFB]">Meu Perfil</h1>
          </div>
          
          {!editing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#6666C4] to-[#5454F0] text-white px-4 py-2 rounded-xl font-semibold transition-all hover:from-[#5454F0] hover:to-[#6666C4]"
            >
              <PencilIcon className="h-4 w-4" />
              Editar Perfil
            </motion.button>
          ) : (
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="flex items-center gap-2 bg-[#5F5F70] text-white px-4 py-2 rounded-xl font-semibold transition-all hover:bg-[#6A6A9C]"
              >
                <XMarkIcon className="h-4 w-4" />
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-gradient-to-r from-[#6666C4] to-[#5454F0] text-white px-4 py-2 rounded-xl font-semibold transition-all hover:from-[#5454F0] hover:to-[#6666C4] disabled:opacity-50"
              >
                {saving ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <CheckIcon className="h-4 w-4" />
                )}
                {saving ? "Salvando..." : "Salvar"}
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Mensagem de sucesso/erro */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl border ${
              message.includes("Erro") 
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-green-500/10 border-green-500/20 text-green-400"
            }`}
          >
            {message}
          </motion.div>
        )}

        {/* Input de arquivo oculto */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Coluna da Foto */}
          <div className="lg:col-span-1">
            <div className="bg-[#29293E] rounded-2xl p-6 border border-[#5F5F70] text-center">
              <div className="relative inline-block">
                {renderProfileImage()}
                
                {/* Botão de Upload */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCameraClick}
                  disabled={uploading}
                  className="absolute bottom-2 right-2 bg-[#363645] p-2 rounded-full border border-[#5F5F70] hover:bg-[#5F5F70] transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-[#EAEAFB] border-t-transparent rounded-full"
                    />
                  ) : (
                    <CameraIcon className="h-4 w-4 text-[#EAEAFB]" />
                  )}
                </motion.button>

                {/* Botão de Remover (apenas se tiver imagem) */}
                {(user?.profileImage || user?.profileImageUrl) && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500/80 p-2 rounded-full border border-red-400 hover:bg-red-500 transition-colors"
                    title="Remover foto"
                  >
                    <TrashIcon className="h-3 w-3 text-white" />
                  </motion.button>
                )}
              </div>
              
              <h2 className="text-xl font-semibold text-[#EAEAFB] mb-2">
                {user.fullName}
              </h2>
              <div className="text-sm text-[#6666C4] font-medium capitalize mb-4">
                {user.role.toLowerCase()}
              </div>
              
              {user.especializacao && (
                <div className="text-sm text-[#A5A5D6] bg-[#363645] rounded-lg py-2 px-3">
                  {user.especializacao}
                </div>
              )}
        
            </div>
          </div>

          {/* Coluna de Informações */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Pessoais */}
            <div className="bg-[#29293E] rounded-2xl p-6 border border-[#5F5F70]">
              <h3 className="text-lg font-semibold text-[#EAEAFB] mb-4">Informações Pessoais</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#A5A5D6] mb-2">Nome Completo</label>
                  {editing ? (
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full p-3 bg-[#1F1F33] border border-[#5F5F70] rounded-lg text-[#EAEAFB] focus:ring-2 focus:ring-[#6666C4] outline-none"
                    />
                  ) : (
                    <div className="p-3 bg-[#1F1F33] rounded-lg text-[#EAEAFB] border border-transparent">
                      {user.fullName}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-[#A5A5D6] mb-2">Email</label>
                  <div className="p-3 bg-[#1F1F33] rounded-lg text-[#EAEAFB] border border-transparent">
                    {user.email}
                  </div>
                  <p className="text-xs text-[#A5A5D6] mt-1">Para alterar o email, acesse as configurações</p>
                </div>

                <div>
                  <label className="block text-sm text-[#A5A5D6] mb-2">Localização</label>
                  {editing ? (
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Sua localização"
                      className="w-full p-3 bg-[#1F1F33] border border-[#5F5F70] rounded-lg text-[#EAEAFB] focus:ring-2 focus:ring-[#6666C4] outline-none"
                    />
                  ) : (
                    <div className="p-3 bg-[#1F1F33] rounded-lg text-[#EAEAFB] border border-transparent">
                      {user.location || "Não informada"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-[#29293E] rounded-2xl p-6 border border-[#5F5F70]">
              <h3 className="text-lg font-semibold text-[#EAEAFB] mb-4">Sobre Mim</h3>
              {editing ? (
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Conte um pouco sobre você..."
                  rows="4"
                  className="w-full p-3 bg-[#1F1F33] border border-[#5F5F70] rounded-lg text-[#EAEAFB] focus:ring-2 focus:ring-[#6666C4] outline-none resize-none"
                />
              ) : (
                <div className="p-3 bg-[#1F1F33] rounded-lg text-[#EAEAFB] border border-transparent min-h-[120px]">
                  {user.bio || "Nenhuma biografia adicionada."}
                </div>
              )}
            </div>

            {/* Informações Profissionais (apenas para doutores) */}
            {user.role === "DOCTOR" && (
              <div className="bg-[#29293E] rounded-2xl p-6 border border-[#5F5F70]">
                <h3 className="text-lg font-semibold text-[#EAEAFB] mb-4">Informações Profissionais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#A5A5D6] mb-2">CRM</label>
                    <div className="p-3 bg-[#1F1F33] rounded-lg text-[#EAEAFB] border border-transparent">
                      {user.crm}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[#A5A5D6] mb-2">Anos de Experiência</label>
                    <div className="p-3 bg-[#1F1F33] rounded-lg text-[#EAEAFB] border border-transparent">
                      {user.experienceYears || "Não informado"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}