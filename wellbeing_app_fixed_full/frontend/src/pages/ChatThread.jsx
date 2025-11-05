import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

export default function ChatThread() {
  const { id } = useParams(); // Recebe o parâmetro de ID da URL
  const [messages, setMessages] = useState([]); // Armazena as mensagens do chat
  const [text, setText] = useState(""); // Armazena o conteúdo da nova mensagem
  const messagesRef = useRef(); // Usado para rolar até a última mensagem

  useEffect(() => {
    // Faz a requisição para obter as mensagens do chat quando o componente monta
    const token = localStorage.getItem("token");
    axios.get(`http://localhost:8080/api/chats/${id}/messages`, { 
      headers: { Authorization: `Bearer ${token}` } 
    })
      .then(res => setMessages(res.data || []))
      .catch(console.error); // Erro no console caso a requisição falhe
  }, [id]);

  const send = async () => {
    if (!text.trim()) return; // Se o texto estiver vazio, não envia a mensagem
    const token = localStorage.getItem("token");
    try {
      // Envia a mensagem para o backend
      const res = await axios.post(`http://localhost:8080/api/chats/${id}/message`, 
        { content: text }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(prev => [...prev, res.data]); // Adiciona a nova mensagem na lista de mensagens
      setText(""); // Limpa o campo de texto após o envio
      // Rola para a última mensagem
      setTimeout(() => messagesRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 50);
    } catch (err) {
      console.error("Erro enviando mensagem", err); // Log de erro se a requisição falhar
    }
  };

  return (
    <div className="min-h-screen bg-[#1F1F33] py-10 px-6 flex justify-center">
      <div className="w-full max-w-3xl bg-[#232333] rounded-2xl p-4">
        <div className="h-[60vh] overflow-auto p-3 space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`p-3 rounded-lg ${m.senderRole === "DOCTOR" ? "bg-[#44446C] text-white" : "bg-[#1F1F33] text-[#EAEAFB]"}`}>
              <div className="text-xs text-[#A5A5D6] mb-1">
                {m.senderRole} • {new Date(m.createdAt).toLocaleString()}
              </div>
              <div>{m.content}</div>
            </div>
          ))}
          <div ref={messagesRef} /> {/* Fazendo referência à última mensagem */}
        </div>

        <div className="mt-4 flex gap-2">
          <input 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            className="flex-1 p-3 rounded-lg bg-[#2A2A3A] text-[#EAEAFB] outline-none" 
            placeholder="Escreva uma mensagem..." 
          />
          <motion.button 
            whileHover={{ scale: 1.03 }} 
            whileTap={{ scale: 0.97 }} 
            onClick={send} 
            className="bg-[#6666C4] px-4 py-2 rounded-lg text-white">
            Enviar
          </motion.button>
        </div>
      </div>
    </div>
  );
}
