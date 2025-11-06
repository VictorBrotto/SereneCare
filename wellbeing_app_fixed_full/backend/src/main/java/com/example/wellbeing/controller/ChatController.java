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
            
            // Verificar se o paciente está tentando iniciar chat
            if (!"PATIENT".equals(patient.getRole())) {
                return ResponseEntity.badRequest().body("Apenas pacientes podem iniciar chats");
            }
            
            // Buscar o médico
            User doctor = userRepository.findById(request.getDoctorId())
                    .orElseThrow(() -> new RuntimeException("Médico não encontrado"));
            
            if (!"DOCTOR".equals(doctor.getRole())) {
                return ResponseEntity.badRequest().body("ID informado não pertence a um médico");
            }
            
            // Verificar se já existe um chat entre este paciente e médico
            Optional<Chat> existingChat = chatRepository.findByPatientIdAndDoctorId(patient.getId(), doctor.getId());
            if (existingChat.isPresent()) {
                return ResponseEntity.ok(existingChat.get());
            }
            
            // Criar novo chat
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

    // ✅ NOVO ENDPOINT: Buscar informações do chat
    @GetMapping("/{chatId}/info")
    public ResponseEntity<?> getChatInfo(@PathVariable Long chatId, @RequestHeader("Authorization") String authHeader) {
        try {
            String username = extractUsernameFromAuth(authHeader);
            User currentUser = userRepository.findByUsername(username).orElseThrow();

            Chat chat = chatRepository.findById(chatId).orElseThrow();
            
            // Verificar se o usuário tem acesso ao chat
            if (!chat.getPatientId().equals(currentUser.getId()) && !chat.getDoctorId().equals(currentUser.getId())) {
                return ResponseEntity.status(403).body("Acesso negado");
            }

            // Buscar informações do outro usuário
            Long otherUserId = currentUser.getRole().equals("DOCTOR") ? chat.getPatientId() : chat.getDoctorId();
            User otherUser = userRepository.findById(otherUserId).orElseThrow();

            ChatInfoResponse response = new ChatInfoResponse();
            response.setOtherUserName(otherUser.getFullName());
            response.setOtherUserSpecialization(otherUser.getEspecializacao());
            response.setOtherUserRole(otherUser.getRole());
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

            // Enriquecer os chats com informações do usuário
            List<ChatResponse> chatResponses = chats.stream().map(chat -> {
                ChatResponse response = new ChatResponse();
                response.setId(chat.getId());
                response.setPatientId(chat.getPatientId());
                response.setDoctorId(chat.getDoctorId());
                response.setTitle(chat.getTitle());
                response.setUpdatedAt(chat.getUpdatedAt());
                
                // Buscar informações do paciente e médico
                if (chat.getPatientId() != null) {
                    userRepository.findById(chat.getPatientId()).ifPresent(patient -> {
                        response.setPatientName(patient.getFullName());
                    });
                }
                
                if (chat.getDoctorId() != null) {
                    userRepository.findById(chat.getDoctorId()).ifPresent(doctor -> {
                        response.setDoctorName(doctor.getFullName());
                        response.setDoctorSpecialization(doctor.getEspecializacao());
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
            // Verificar se o usuário tem acesso ao chat
            String username = extractUsernameFromAuth(authHeader);
            User user = userRepository.findByUsername(username).orElseThrow();
            
            Chat chat = chatRepository.findById(chatId).orElseThrow();
            if (!chat.getPatientId().equals(user.getId()) && !chat.getDoctorId().equals(user.getId())) {
                return ResponseEntity.status(403).body("Acesso negado a este chat");
            }

            List<Message> messages = messageRepository.findByChatIdOrderByCreatedAtAsc(chatId);
            
            // Enriquecer mensagens com informações do remetente
            List<MessageResponse> messageResponses = messages.stream().map(message -> {
                MessageResponse response = new MessageResponse();
                response.setId(message.getId());
                response.setChatId(message.getChatId());
                response.setSenderId(message.getSenderId());
                response.setSenderRole(message.getSenderRole());
                response.setContent(message.getContent());
                response.setCreatedAt(message.getCreatedAt());
                
                // Buscar nome do remetente
                userRepository.findById(message.getSenderId()).ifPresent(sender -> {
                    response.setSenderName(sender.getFullName());
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

            // Verificar se o chat existe e o usuário tem acesso
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

            // Atualizar data de modificação do chat
            chat.setUpdatedAt(Instant.now());
            chatRepository.save(chat);

            // Retornar mensagem enriquecida
            MessageResponse response = new MessageResponse();
            response.setId(savedMessage.getId());
            response.setChatId(savedMessage.getChatId());
            response.setSenderId(savedMessage.getSenderId());
            response.setSenderRole(savedMessage.getSenderRole());
            response.setContent(savedMessage.getContent());
            response.setCreatedAt(savedMessage.getCreatedAt());
            response.setSenderName(user.getFullName());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao enviar mensagem: " + e.getMessage());
        }
    }

    // ✅ ENDPOINT: Deletar chat (opcional)
    @DeleteMapping("/{chatId}")
    public ResponseEntity<?> deleteChat(@PathVariable Long chatId, @RequestHeader("Authorization") String authHeader) {
        try {
            String username = extractUsernameFromAuth(authHeader);
            User user = userRepository.findByUsername(username).orElseThrow();

            Chat chat = chatRepository.findById(chatId).orElseThrow();
            
            // Verificar se o usuário tem acesso ao chat
            if (!chat.getPatientId().equals(user.getId()) && !chat.getDoctorId().equals(user.getId())) {
                return ResponseEntity.status(403).body("Acesso negado");
            }

            // Deletar mensagens primeiro
            List<Message> messages = messageRepository.findByChatIdOrderByCreatedAtAsc(chatId);
            messageRepository.deleteAll(messages);
            
            // Deletar chat
            chatRepository.delete(chat);

            return ResponseEntity.ok("Chat deletado com sucesso");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao deletar chat: " + e.getMessage());
        }
    }
}

// ✅ CLASSES DE REQUEST E RESPONSE

class StartChatRequest {
    private Long doctorId;
    
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
}

class ChatInfoResponse {
    private Long chatId;
    private String otherUserName;
    private String otherUserSpecialization;
    private String otherUserRole;
    
    public Long getChatId() { return chatId; }
    public void setChatId(Long chatId) { this.chatId = chatId; }
    
    public String getOtherUserName() { return otherUserName; }
    public void setOtherUserName(String otherUserName) { this.otherUserName = otherUserName; }
    
    public String getOtherUserSpecialization() { return otherUserSpecialization; }
    public void setOtherUserSpecialization(String otherUserSpecialization) { this.otherUserSpecialization = otherUserSpecialization; }
    
    public String getOtherUserRole() { return otherUserRole; }
    public void setOtherUserRole(String otherUserRole) { this.otherUserRole = otherUserRole; }
}

class ChatResponse {
    private Long id;
    private Long patientId;
    private Long doctorId;
    private String patientName;
    private String doctorName;
    private String doctorSpecialization;
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
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}