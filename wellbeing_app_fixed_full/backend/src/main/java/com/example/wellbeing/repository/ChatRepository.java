package com.example.wellbeing.repository;

import com.example.wellbeing.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findByPatientIdOrderByUpdatedAtDesc(Long patientId);
    List<Chat> findByDoctorIdOrderByUpdatedAtDesc(Long doctorId);
    
    // ✅ Buscar chat específico entre paciente e médico
    Optional<Chat> findByPatientIdAndDoctorId(Long patientId, Long doctorId);
}