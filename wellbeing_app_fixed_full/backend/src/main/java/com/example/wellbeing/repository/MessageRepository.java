package com.example.wellbeing.repository;

import com.example.wellbeing.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatIdOrderByCreatedAtAsc(Long chatId);
    
    // ✅ Buscar última mensagem do chat
    @Query("SELECT m FROM Message m WHERE m.chatId = :chatId ORDER BY m.createdAt DESC LIMIT 1")
    List<Message> findTop1ByChatIdOrderByCreatedAtDesc(Long chatId);
}