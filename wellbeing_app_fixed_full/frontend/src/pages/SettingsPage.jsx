import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Cog6ToothIcon, 
  LockClosedIcon, 
  EnvelopeIcon,
  ShieldCheckIcon,
  BellIcon 
} from "@heroicons/react/24/outline";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("security");

  const tabs = [
    { id: "security", name: "Segurança", icon: LockClosedIcon },
    { id: "notifications", name: "Notificações", icon: BellIcon },
    { id: "privacy", name: "Privacidade", icon: ShieldCheckIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1F1F33] to-[#363645] pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="bg-[#6666C4]/20 p-3 rounded-xl">
            <Cog6ToothIcon className="h-6 w-6 text-[#6666C4]" />
          </div>
          <h1 className="text-3xl font-bold text-[#EAEAFB]">Configurações</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de Navegação */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-[#29293E] rounded-2xl p-6 border border-[#5F5F70]">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      whileHover={{ x: 4, backgroundColor: "#363645" }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-[#363645] text-[#EAEAFB] border border-[#6666C4]"
                          : "text-[#A5A5D6] hover:text-[#EAEAFB]"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.name}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Conteúdo Principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            {activeTab === "security" && (
              <div className="bg-[#29293E] rounded-2xl p-6 border border-[#5F5F70]">
                <h2 className="text-xl font-semibold text-[#EAEAFB] mb-6">Segurança</h2>
                
                <div className="space-y-6">
                  {/* Alterar Senha */}
                  <div className="bg-[#1F1F33] rounded-xl p-6 border border-[#5F5F70]">
                    <h3 className="text-lg font-semibold text-[#EAEAFB] mb-4 flex items-center gap-2">
                      <LockClosedIcon className="h-5 w-5 text-[#6666C4]" />
                      Alterar Senha
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-[#A5A5D6] mb-2">Senha Atual</label>
                        <input
                          type="password"
                          className="w-full p-3 bg-[#29293E] border border-[#5F5F70] rounded-lg text-[#EAEAFB] focus:ring-2 focus:ring-[#6666C4] outline-none"
                          placeholder="Digite sua senha atual"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#A5A5D6] mb-2">Nova Senha</label>
                        <input
                          type="password"
                          className="w-full p-3 bg-[#29293E] border border-[#5F5F70] rounded-lg text-[#EAEAFB] focus:ring-2 focus:ring-[#6666C4] outline-none"
                          placeholder="Digite a nova senha"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#A5A5D6] mb-2">Confirmar Nova Senha</label>
                        <input
                          type="password"
                          className="w-full p-3 bg-[#29293E] border border-[#5F5F70] rounded-lg text-[#EAEAFB] focus:ring-2 focus:ring-[#6666C4] outline-none"
                          placeholder="Confirme a nova senha"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gradient-to-r from-[#6666C4] to-[#5454F0] text-white px-6 py-3 rounded-lg font-semibold transition-all hover:from-[#5454F0] hover:to-[#6666C4]"
                      >
                        Alterar Senha
                      </motion.button>
                    </div>
                  </div>

                  {/* Alterar Email */}
                  <div className="bg-[#1F1F33] rounded-xl p-6 border border-[#5F5F70]">
                    <h3 className="text-lg font-semibold text-[#EAEAFB] mb-4 flex items-center gap-2">
                      <EnvelopeIcon className="h-5 w-5 text-[#6666C4]" />
                      Alterar Email
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-[#A5A5D6] mb-2">Novo Email</label>
                        <input
                          type="email"
                          className="w-full p-3 bg-[#29293E] border border-[#5F5F70] rounded-lg text-[#EAEAFB] focus:ring-2 focus:ring-[#6666C4] outline-none"
                          placeholder="Digite o novo email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#A5A5D6] mb-2">Confirmar Senha</label>
                        <input
                          type="password"
                          className="w-full p-3 bg-[#29293E] border border-[#5F5F70] rounded-lg text-[#EAEAFB] focus:ring-2 focus:ring-[#6666C4] outline-none"
                          placeholder="Digite sua senha para confirmar"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gradient-to-r from-[#6666C4] to-[#5454F0] text-white px-6 py-3 rounded-lg font-semibold transition-all hover:from-[#5454F0] hover:to-[#6666C4]"
                      >
                        Alterar Email
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-[#29293E] rounded-2xl p-6 border border-[#5F5F70]">
                <h2 className="text-xl font-semibold text-[#EAEAFB] mb-6">Notificações</h2>
                <div className="text-[#A5A5D6] text-center py-12">
                  <BellIcon className="h-16 w-16 mx-auto mb-4 text-[#6666C4]/50" />
                  <p>Configurações de notificações em desenvolvimento</p>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="bg-[#29293E] rounded-2xl p-6 border border-[#5F5F70]">
                <h2 className="text-xl font-semibold text-[#EAEAFB] mb-6">Privacidade</h2>
                
                <div className="space-y-6">
                  {/* Visibilidade do Perfil */}
                  <div className="bg-[#1F1F33] rounded-xl p-6 border border-[#5F5F70]">
                    <h3 className="text-lg font-semibold text-[#EAEAFB] mb-4 flex items-center gap-2">
                      <ShieldCheckIcon className="h-5 w-5 text-[#6666C4]" />
                      Visibilidade do Perfil
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-[#A5A5D6] mb-3">Quem pode ver seu perfil?</label>
                        <div className="space-y-3">
                          {[
                            { value: "public", label: "Público", description: "Todos os usuários podem ver seu perfil" },
                            { value: "contacts", label: "Apenas Contatos", description: "Somente seus contatos podem ver seu perfil" },
                            { value: "private", label: "Privado", description: "Apenas você pode ver seu perfil" }
                          ].map((option) => (
                            <label key={option.value} className="flex items-start gap-3 p-3 rounded-lg border border-[#5F5F70] hover:border-[#6666C4] transition-all cursor-pointer">
                              <input
                                type="radio"
                                name="profileVisibility"
                                value={option.value}
                                className="mt-1 text-[#6666C4] focus:ring-[#6666C4]"
                              />
                              <div>
                                <div className="text-[#EAEAFB] font-medium">{option.label}</div>
                                <div className="text-sm text-[#A5A5D6]">{option.description}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Configurações de Privacidade */}
                  <div className="bg-[#1F1F33] rounded-xl p-6 border border-[#5F5F70]">
                    <h3 className="text-lg font-semibold text-[#EAEAFB] mb-4">Configurações de Privacidade</h3>
                    <div className="space-y-4">
                      {[
                        {
                          id: "showOnlineStatus",
                          label: "Mostrar Status Online",
                          description: "Outros usuários podem ver quando você está online"
                        },
                        {
                          id: "allowMessages",
                          label: "Permitir Mensagens",
                          description: "Receber mensagens de outros usuários"
                        },
                        {
                          id: "showActivity",
                          label: "Mostrar Atividade Recente",
                          description: "Compartilhar sua atividade recente no perfil"
                        },
                        {
                          id: "dataCollection",
                          label: "Coleta de Dados para Análise",
                          description: "Permitir uso anônimo de dados para melhorar o sistema"
                        }
                      ].map((setting) => (
                        <div key={setting.id} className="flex items-center justify-between p-3 rounded-lg border border-[#5F5F70]">
                          <div className="flex-1">
                            <div className="text-[#EAEAFB] font-medium">{setting.label}</div>
                            <div className="text-sm text-[#A5A5D6]">{setting.description}</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-[#5F5F70] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6666C4]"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Excluir Dados */}
                  <div className="bg-[#1F1F33] rounded-xl p-6 border border-red-500/50">
                    <h3 className="text-lg font-semibold text-red-400 mb-4">Gerenciar Dados</h3>
                    <div className="space-y-4">
                      <p className="text-red-300/80 text-sm">
                        Estas ações são permanentes e não podem ser desfeitas.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
                        >
                          Excluir Minha Conta
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-6 py-3 bg-[#6666C4] hover:bg-[#5454F0] text-white rounded-lg font-semibold transition-all"
                        >
                          Exportar Meus Dados
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}