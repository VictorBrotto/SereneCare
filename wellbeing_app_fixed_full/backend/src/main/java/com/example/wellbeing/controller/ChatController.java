package com.example.wellbeing.controller;

import com.example.wellbeing.dto.MessageRequest;
import com.example.wellbeing.model.Chat;
import com.example.wellbeing.model.Message;
import com.example.wellbeing.model.User;
import com.example.wellbeing.repository.ChatRepository;
import com.example.wellbeing.repository.MessageRepository;
import com.example.wellbeing.repository.UserRepository;
import com.example.wellbeing.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chats")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private String extractUsernameFromAuth(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractUsername(token);
    }

    // ✅ ENDPOINT: Iniciar chat com médico
    @PostMapping("/start")
    public ResponseEntity<?> startChat(@RequestBody StartChatRequest request, @RequestHeader("Authorization") String authHeader) {
        try {
            String username = extractUsernameFromAuth(authHeader);
            User patient = userRepository.findByUsername(username).orElseThrow();
            
            if (!"PATIENT".equals(patient.getRole())) {
                return ResponseEntity.badRequest().body("Apenas pacientes podem iniciar chats");
            }
            
            User doctor = userRepository.findById(request.getDoctorId())
                    .orElseThrow(() -> new RuntimeException("Médico não encontrado"));
            
            if (!"DOCTOR".equals(doctor.getRole())) {
                return ResponseEntity.badRequest().body("ID informado não pertence a um médico");
            }
            
            Optional<Chat> existingChat = chatRepository.findByPatientIdAndDoctorId(patient.getId(), doctor.getId());
            if (existingChat.isPresent()) {
                return ResponseEntity.ok(existingChat.get());
            }
            
            Chat chat = new Chat();
            chat.setPatientId(patient.getId());
            chat.setDoctorId(doctor.getId());
            chat.setTitle("Chat com Dr. " + doctor.getFullName());
            chat.setUpdatedAt(Instant.now());
            
            Chat savedChat = chatRepository.save(chat);
            return ResponseEntity.ok(savedChat);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao iniciar chat: " + e.getMessage());
        }
    }

    // ✅ ENDPOINT MELHORADO: Buscar informações do chat com foto de perfil
    @GetMapping("/{chatId}/info")
    public ResponseEntity<?> getChatInfo(@PathVariable Long chatId, @RequestHeader("Authorization") String authHeader) {
        try {
            String username = extractUsernameFromAuth(authHeader);
            User currentUser = userRepository.findByUsername(username).orElseThrow();

            Chat chat = chatRepository.findById(chatId).orElseThrow();
            
            if (!chat.getPatientId().equals(currentUser.getId()) && !chat.getDoctorId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).body("Acesso negado");
            }

            // Buscar informações do outro usuário
            Long otherUserId = currentUser.getRole().equals("DOCTOR") ? chat.getPatientId() : chat.getDoctorId();
            User otherUser = userRepository.findById(otherUserId).orElseThrow();

            ChatInfoResponse response = new ChatInfoResponse();
            response.setOtherUserId(otherUser.getId());
            response.setOtherUserName(otherUser.getFullName());
            response.setOtherUserSpecialization(otherUser.getEspecializacao());
            response.setOtherUserRole(otherUser.getRole());
            response.setOtherUserProfilePicture(otherUser.getProfilePicture()); // ✅ FOTO DE PERFIL
            response.setChatId(chatId);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao buscar informações do chat: " + e.getMessage());
        }
    }

    @GetMapping("")
    public ResponseEntity<?> listChats(@RequestHeader("Authorization") String authHeader) {
        try {
            String username = extractUsernameFromAuth(authHeader);
            User user = userRepository.findByUsername(username).orElseThrow();

            List<Chat> chats;
            if ("DOCTOR".equals(user.getRole())) {
                chats = chatRepository.findByDoctorIdOrderByUpdatedAtDesc(user.getId());
            } else {
                chats = chatRepository.findByPatientIdOrderByUpdatedAtDesc(user.getId());
            }

            // ✅ MELHORADO: Incluir foto de perfil nas respostas
            List<ChatResponse> chatResponses = chats.stream().map(chat -> {
                ChatResponse response = new ChatResponse();
                response.setId(chat.getId());
                response.setPatientId(chat.getPatientId());
                response.setDoctorId(chat.getDoctorId());
                response.setTitle(chat.getTitle());
                response.setUpdatedAt(chat.getUpdatedAt());
                
                // Buscar informações do paciente
                if (chat.getPatientId() != null) {
                    userRepository.findById(chat.getPatientId()).ifPresent(patient -> {
                        response.setPatientName(patient.getFullName());
                        response.setPatientProfilePicture(patient.getProfilePicture()); // ✅ FOTO
                    });
                }
                
                // Buscar informações do médico
                if (chat.getDoctorId() != null) {
                    userRepository.findById(chat.getDoctorId()).ifPresent(doctor -> {
                        response.setDoctorName(doctor.getFullName());
                        response.setDoctorSpecialization(doctor.getEspecializacao());
                        response.setDoctorProfilePicture(doctor.getProfilePicture()); // ✅ FOTO
                    });
                }
                
                // Buscar última mensagem
                List<Message> lastMessages = messageRepository.findTop1ByChatIdOrderByCreatedAtDesc(chat.getId());
                if (!lastMessages.isEmpty()) {
                    response.setLastMessage(lastMessages.get(0).getContent());
                }
                
                return response;
            }).toList();

            return ResponseEntity.ok(chatResponses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao buscar chats: " + e.getMessage());
        }
    }

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<?> getMessages(@PathVariable Long chatId, @RequestHeader("Authorization") String authHeader) {
        try {
            String username = extractUsernameFromAuth(authHeader);
            User user = userRepository.findByUsername(username).orElseThrow();
            
            Chat chat = chatRepository.findById(chatId).orElseThrow();
            if (!chat.getPatientId().equals(user.getId()) && !chat.getDoctorId().equals(user.getId())) {
                return ResponseEntity.status(403).body("Acesso negado a este chat");
            }

            List<Message> messages = messageRepository.findByChatIdOrderByCreatedAtAsc(chatId);
            
            // ✅ MELHORADO: Incluir foto de perfil do remetente
            List<MessageResponse> messageResponses = messages.stream().map(message -> {
                MessageResponse response = new MessageResponse();
                response.setId(message.getId());
                response.setChatId(message.getChatId());
                response.setSenderId(message.getSenderId());
                response.setSenderRole(message.getSenderRole());
                response.setContent(message.getContent());
                response.setCreatedAt(message.getCreatedAt());
                
                // Buscar informações do remetente
                userRepository.findById(message.getSenderId()).ifPresent(sender -> {
                    response.setSenderName(sender.getFullName());
                    response.setSenderProfilePicture(sender.getProfilePicture()); // ✅ FOTO
                });
                
                return response;
            }).toList();

            return ResponseEntity.ok(messageResponses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao buscar mensagens: " + e.getMessage());
        }
    }

    @PostMapping("/{chatId}/message")
    public ResponseEntity<?> sendMessage(
            @PathVariable Long chatId,
            @RequestBody MessageRequest req,
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            String username = extractUsernameFromAuth(authHeader);
            User user = userRepository.findByUsername(username).orElseThrow();

            Chat chat = chatRepository.findById(chatId).orElseThrow();
            if (!chat.getPatientId().equals(user.getId()) && !chat.getDoctorId().equals(user.getId())) {
                return ResponseEntity.status(403).body("Acesso negado a este chat");
            }

            Message message = new Message();
            message.setChatId(chatId);
            message.setContent(req.getContent());
            message.setSenderId(user.getId());
            message.setSenderRole(user.getRole());
            message.setCreatedAt(Instant.now());
            Message savedMessage = messageRepository.save(message);

            chat.setUpdatedAt(Instant.now());
            chatRepository.save(chat);

            // ✅ MELHORADO: Retornar mensagem com foto de perfil
            MessageResponse response = new MessageResponse();
            response.setId(savedMessage.getId());
            response.setChatId(savedMessage.getChatId());
            response.setSenderId(savedMessage.getSenderId());
            response.setSenderRole(savedMessage.getSenderRole());
            response.setContent(savedMessage.getContent());
            response.setCreatedAt(savedMessage.getCreatedAt());
            response.setSenderName(user.getFullName());
            response.setSenderProfilePicture(user.getProfilePicture()); // ✅ FOTO

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao enviar mensagem: " + e.getMessage());
        }
    }

    // ✅ NOVO: Endpoint para atualizar último acesso ao abrir chat
    @PostMapping("/{chatId}/update-access")
    public ResponseEntity<?> updateChatAccess(@PathVariable Long chatId, @RequestHeader("Authorization") String authHeader) {
        try {
            String username = extractUsernameFromAuth(authHeader);
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setLastSeen(Instant.now());
                userRepository.save(user);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao atualizar acesso: " + e.getMessage());
        }
    }
}

// ✅ CLASSES DE RESPONSE ATUALIZADAS COM FOTOS DE PERFIL

class ChatInfoResponse {
    private Long chatId;
    private Long otherUserId;
    private String otherUserName;
    private String otherUserSpecialization;
    private String otherUserRole;
    private String otherUserProfilePicture; // ✅ NOVO
    
    public Long getChatId() { return chatId; }
    public void setChatId(Long chatId) { this.chatId = chatId; }
    
    public Long getOtherUserId() { return otherUserId; }
    public void setOtherUserId(Long otherUserId) { this.otherUserId = otherUserId; }
    
    public String getOtherUserName() { return otherUserName; }
    public void setOtherUserName(String otherUserName) { this.otherUserName = otherUserName; }
    
    public String getOtherUserSpecialization() { return otherUserSpecialization; }
    public void setOtherUserSpecialization(String otherUserSpecialization) { this.otherUserSpecialization = otherUserSpecialization; }
    
    public String getOtherUserRole() { return otherUserRole; }
    public void setOtherUserRole(String otherUserRole) { this.otherUserRole = otherUserRole; }
    
    public String getOtherUserProfilePicture() { return otherUserProfilePicture; }
    public void setOtherUserProfilePicture(String otherUserProfilePicture) { this.otherUserProfilePicture = otherUserProfilePicture; }
}

class ChatResponse {
    private Long id;
    private Long patientId;
    private Long doctorId;
    private String patientName;
    private String doctorName;
    private String doctorSpecialization;
    private String patientProfilePicture; // ✅ NOVO
    private String doctorProfilePicture; // ✅ NOVO
    private String title;
    private String lastMessage;
    private Instant updatedAt;
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    
    public String getDoctorSpecialization() { return doctorSpecialization; }
    public void setDoctorSpecialization(String doctorSpecialization) { this.doctorSpecialization = doctorSpecialization; }
    
    public String getPatientProfilePicture() { return patientProfilePicture; }
    public void setPatientProfilePicture(String patientProfilePicture) { this.patientProfilePicture = patientProfilePicture; }
    
    public String getDoctorProfilePicture() { return doctorProfilePicture; }
    public void setDoctorProfilePicture(String doctorProfilePicture) { this.doctorProfilePicture = doctorProfilePicture; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getLastMessage() { return lastMessage; }
    public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }
    
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}

class MessageResponse {
    private Long id;
    private Long chatId;
    private Long senderId;
    private String senderName;
    private String senderRole;
    private String senderProfilePicture; // ✅ NOVO
    private String content;
    private Instant createdAt;
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getChatId() { return chatId; }
    public void setChatId(Long chatId) { this.chatId = chatId; }
    
    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }
    
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    
    public String getSenderRole() { return senderRole; }
    public void setSenderRole(String senderRole) { this.senderRole = senderRole; }
    
    public String getSenderProfilePicture() { return senderProfilePicture; }
    public void setSenderProfilePicture(String senderProfilePicture) { this.senderProfilePicture = senderProfilePicture; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

class StartChatRequest {
    private Long doctorId;
    
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
}