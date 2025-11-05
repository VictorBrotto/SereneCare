package com.example.wellbeing.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.wellbeing.model.Chat;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findByPatientIdOrderByUpdatedAtDesc(Long patientId);
    List<Chat> findByDoctorIdOrderByUpdatedAtDesc(Long doctorId);
}