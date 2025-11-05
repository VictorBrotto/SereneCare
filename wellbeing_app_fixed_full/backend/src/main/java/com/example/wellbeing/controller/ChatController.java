package com.example.wellbeing.controller;

import com.example.wellbeing.dto.MessageRequest;
import com.example.wellbeing.model.Chat;
import com.example.wellbeing.model.Message;
import com.example.wellbeing.repository.ChatRepository;
import com.example.wellbeing.repository.MessageRepository;
import com.example.wellbeing.repository.UserRepository;
import com.example.wellbeing.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private String extractUsernameFromAuth() {
        return (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping("")
    public ResponseEntity<?> listChats(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String username = jwtUtil.extractUsername(token);
        var user = userRepository.findByUsername(username).orElseThrow();

        if ("DOCTOR".equalsIgnoreCase(user.getRole())) {
            List<Chat> chats = chatRepository.findByDoctorIdOrderByUpdatedAtDesc(user.getId());
            return ResponseEntity.ok(chats);
        } else {
            List<Chat> chats = chatRepository.findByPatientIdOrderByUpdatedAtDesc(user.getId());
            return ResponseEntity.ok(chats);
        }
    }

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<?> getMessages(@PathVariable Long chatId) {
        var msgs = messageRepository.findByChatIdOrderByCreatedAtAsc(chatId);
        return ResponseEntity.ok(msgs);
    }

    @PostMapping("/{chatId}/message")
    public ResponseEntity<?> sendMessage(
            @PathVariable Long chatId,
            @RequestBody MessageRequest req,
            @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        String username = jwtUtil.extractUsername(token);
        var user = userRepository.findByUsername(username).orElseThrow();

        Message m = new Message();
        m.setChatId(chatId);
        m.setContent(req.getContent());
        m.setSenderId(user.getId());
        m.setSenderRole(user.getRole());
        m.setCreatedAt(Instant.now());
        messageRepository.save(m);

        // update chat updatedAt
        Chat chat = chatRepository.findById(chatId).orElseThrow();
        chat.setUpdatedAt(Instant.now());
        chatRepository.save(chat);

        return ResponseEntity.ok(m);
    }
}
