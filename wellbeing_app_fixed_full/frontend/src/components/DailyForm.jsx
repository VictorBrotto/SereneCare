import React, { useState, useRef, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Componente Slider separado com React.memo
const Slider = React.memo(({ name, value, config, onChange }) => {
  const percentage = (value / 10) * 100;
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(value);

  // Valor atual para display (usa dragValue durante drag, senão value)
  const displayValue = isDragging ? dragValue : value;
  const displayPercentage = (displayValue / 10) * 100;

  const updateValue = useCallback((clientX) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const newPercentage = (clickX / rect.width) * 100;
    const newValue = Math.round((newPercentage / 100) * 10);
    
    return newValue;
  }, []);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    setDragValue(value);
  }, [value]);

  const handleDrag = useCallback((event, info) => {
    const newValue = updateValue(info.point.x);
    if (newValue !== undefined) {
      setDragValue(newValue);
    }
  }, [updateValue]);

  const handleDragEnd = useCallback((event, info) => {
    const newValue = updateValue(info.point.x);
    if (newValue !== undefined && newValue !== value) {
      onChange(name, newValue);
    }
    setIsDragging(false);
    setDragValue(value);
  }, [updateValue, name, value, onChange]);

  const handleClick = useCallback((e) => {
    const newValue = updateValue(e.clientX);
    if (newValue !== undefined && newValue !== value) {
      onChange(name, newValue);
    }
  }, [updateValue, name, value, onChange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#29293E] p-6 rounded-2xl border border-[#5F5F70] hover:border-[#6A6A9C] transition-all duration-300"
    >
      {/* Header do Slider */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${config.colors.bg}`}>
            <span className="text-xl">{config.emoji}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#EAEAFB]">{config.label}</h3>
            <p className="text-sm text-[#A5A5D6]">0 - 10</p>
          </div>
        </div>
        <motion.div
          animate={{ 
            scale: isDragging ? 1.1 : 1,
            color: isDragging ? '#fff' : '#EAEAFB'
          }}
          transition={{ duration: 0.2 }}
          className="text-2xl font-bold text-[#EAEAFB] bg-[#1F1F33] px-4 py-2 rounded-xl min-w-[60px] text-center"
        >
          {displayValue}
        </motion.div>
      </div>

      {/* Ícones de referência */}
      <div className="flex justify-between mb-4 px-2">
        {config.icons.map((icon, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-lg">{icon}</span>
            <div className="w-1 h-1 bg-[#5F5F70] rounded-full"></div>
          </div>
        ))}
      </div>

      {/* Slider Container */}
      <div 
        ref={sliderRef}
        className="relative mb-2 cursor-pointer"
        onClick={handleClick}
      >
        {/* Track de fundo */}
        <div className="h-3 bg-[#1F1F33] rounded-full overflow-hidden">
          {/* Track preenchida */}
          <motion.div
            animate={{ width: `${displayPercentage}%` }}
            transition={{ duration: 0.1 }}
            className={`h-full rounded-full bg-gradient-to-r ${config.colors.track} shadow-lg`}
          />
        </div>
        
        {/* Thumb arrastável - SEM drag do Framer Motion */}
        <motion.div
          className={`absolute top-1/2 w-6 h-6 rounded-full ${config.colors.thumb} shadow-lg border-2 border-white cursor-grab active:cursor-grabbing z-10`}
          style={{ 
            left: `${displayPercentage}%`,
            x: "-50%",
            y: "-50%"
          }}
          // Drag manual usando eventos de mouse
          onMouseDown={(e) => {
            e.preventDefault();
            handleDragStart();
            
            const handleMouseMove = (moveEvent) => {
              const newValue = updateValue(moveEvent.clientX);
              if (newValue !== undefined) {
                setDragValue(newValue);
              }
            };
            
            const handleMouseUp = (upEvent) => {
              const newValue = updateValue(upEvent.clientX);
              if (newValue !== undefined && newValue !== value) {
                onChange(name, newValue);
              }
              setIsDragging(false);
              setDragValue(value);
              
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
          whileTap={{ scale: 1.2 }}
        />
      </div>

      {/* Marcadores */}
      <div className="flex justify-between text-xs text-[#A5A5D6] px-1">
        <span>0</span>
        <span>2</span>
        <span>4</span>
        <span>6</span>
        <span>8</span>
        <span>10</span>
      </div>
    </motion.div>
  );
});

export default function DailyForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    painLevel: 0,
    sleepQuality: 5,
    mood: 5,
    symptoms: "",
    triggers: "",
    dietMeals: "",
    physicalActivity: "",
    medications: "",
    additionalNotes: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSliderChange = useCallback((name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      // ✅ CORREÇÃO: Enviar dados no formato correto que o backend espera
      const dailyLogData = {
        userId: parseInt(userId),
        painLevel: form.painLevel,
        sleepQuality: form.sleepQuality,
        mood: form.mood,
        symptoms: form.symptoms,
        triggers: form.triggers,
        dietMeals: form.dietMeals,
        physicalActivity: form.physicalActivity,
        medications: form.medications,
        additionalNotes: form.additionalNotes,
      };

      console.log("Enviando dados:", dailyLogData);

      const response = await axios.post("http://localhost:8080/api/daily", dailyLogData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      console.log("Resposta do servidor:", response.data);
      
      setSaving(false);
      navigate("/history");
    } catch (err) {
      setSaving(false);
      console.error("Erro completo:", err);
      console.error("Resposta do erro:", err.response?.data);
      
      if (err.response?.status === 401) {
        setError("Sessão expirada. Faça login novamente.");
        setTimeout(() => navigate("/login"), 2000);
      } else if (err.response?.data) {
        setError(`Erro ao salvar: ${err.response.data}`);
      } else {
        setError("Erro de conexão. Verifique se o servidor está rodando.");
      }
    }
  };

  // Configurações dos sliders
  const sliderConfigs = {
    painLevel: {
      label: "Nível de Dor",
      emoji: "😣",
      colors: {
        track: "from-red-500 to-red-300",
        thumb: "bg-red-500",
        bg: "bg-red-500/20"
      },
      icons: ["😊", "😐", "😖", "😫", "🤕"]
    },
    sleepQuality: {
      label: "Qualidade do Sono",
      emoji: "😴",
      colors: {
        track: "from-blue-500 to-blue-300",
        thumb: "bg-blue-500",
        bg: "bg-blue-500/20"
      },
      icons: ["😴", "🛌", "😪", "😌", "✨"]
    },
    mood: {
      label: "Humor",
      emoji: "😊",
      colors: {
        track: "from-yellow-500 to-yellow-300",
        thumb: "bg-yellow-500",
        bg: "bg-yellow-500/20"
      },
      icons: ["😢", "😕", "😐", "😊", "😄"]
    }
  };

  // Campos de texto com animações
  const textFields = [
    { name: "symptoms", label: "Sintomas", rows: 3, placeholder: "Descreva quaisquer sintomas que sentiu hoje..." },
    { name: "triggers", label: "Gatilhos", rows: 1, placeholder: "Fatores que pioraram sua condição..." },
    { name: "dietMeals", label: "Dieta / Refeições", rows: 1, placeholder: "O que você comeu hoje..." },
    { name: "physicalActivity", label: "Atividade Física", rows: 1, placeholder: "Exercícios ou atividades físicas realizadas..." },
    { name: "medications", label: "Medicações", rows: 1, placeholder: "Medicamentos tomados hoje..." },
    { name: "additionalNotes", label: "Notas Adicionais", rows: 3, placeholder: "Alguma observação adicional..." }
  ];

  return (
    <div className="min-h-screen flex items-start justify-center pt-16 bg-gradient-to-br from-[#1F1F33] to-[#363645] pb-12">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-[#29293E] p-8 rounded-2xl shadow-2xl w-full max-w-4xl border border-[#5F5F70]"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-[#6666C4]/20 p-2 rounded-lg">
              <div className="w-6 h-6 bg-gradient-to-r from-[#6666C4] to-[#5454F0] rounded"></div>
            </div>
            <h2 className="text-2xl font-bold text-[#EAEAFB]">Registro Diário</h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-[#A5A5D6]"
          >
            Arraste os sliders para ajustar suas métricas
          </motion.p>
        </motion.div>

        <form onSubmit={submit} className="space-y-8">
          {/* Sliders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Slider 
              name="painLevel" 
              value={form.painLevel} 
              config={sliderConfigs.painLevel} 
              onChange={handleSliderChange}
            />
            <Slider 
              name="sleepQuality" 
              value={form.sleepQuality} 
              config={sliderConfigs.sleepQuality} 
              onChange={handleSliderChange}
            />
            <Slider 
              name="mood" 
              value={form.mood} 
              config={sliderConfigs.mood} 
              onChange={handleSliderChange}
            />
          </div>

          {/* Campos de Texto com Animações */}
          {textFields.map((field, index) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <motion.label 
                className="text-sm text-[#CFCFE8] font-medium mb-2 block"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                {field.label}
              </motion.label>
              
              <motion.div
                className="relative"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {field.rows > 1 ? (
                  <motion.textarea
                    name={field.name}
                    value={form[field.name]}
                    onChange={change}
                    placeholder={field.placeholder}
                    onFocus={() => setFocusedField(field.name)}
                    onBlur={() => setFocusedField(null)}
                    whileFocus={{ 
                      scale: 1.02,
                    }}
                    className="w-full p-4 rounded-xl bg-[#1F1F33] text-[#EAEAFB] focus:ring-2 focus:ring-[#6666C4] outline-none resize-none border border-[#5F5F70] transition-all duration-300 relative z-10"
                    rows={field.rows}
                  />
                ) : (
                  <motion.input
                    name={field.name}
                    value={form[field.name]}
                    onChange={change}
                    placeholder={field.placeholder}
                    onFocus={() => setFocusedField(field.name)}
                    onBlur={() => setFocusedField(null)}
                    whileFocus={{ 
                      scale: 1.02,
                    }}
                    className="w-full p-4 rounded-xl bg-[#1F1F33] text-[#EAEAFB] focus:ring-2 focus:ring-[#6666C4] outline-none border border-[#5F5F70] transition-all duration-300 relative z-10"
                  />
                )}

                {/* Efeito de brilho no focus */}
                <AnimatePresence>
                  {focusedField === field.name && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#6666C4]/10 to-[#5454F0]/10 -z-10"
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}

          {/* Mensagem de erro */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botões */}
          <motion.div
            className="flex gap-3 pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: saving ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#6666C4] to-[#5454F0] hover:from-[#5454F0] hover:to-[#6666C4] text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-3 shadow-lg disabled:opacity-50"
            >
              {saving ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Salvando...
                </>
              ) : (
                <>
                  <span>💾</span>
                  Salvar Registro
                </>
              )}
            </motion.button>

            <motion.button
              type="button"
              onClick={() => navigate("/history")}
              whileHover={{ scale: 1.05, backgroundColor: "#363645" }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border border-[#5F5F70] text-[#EAEAFB] px-6 py-4 rounded-xl hover:bg-[#363645] transition-all flex items-center gap-2"
            >
              <span>📊</span>
              Ver Histórico
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}