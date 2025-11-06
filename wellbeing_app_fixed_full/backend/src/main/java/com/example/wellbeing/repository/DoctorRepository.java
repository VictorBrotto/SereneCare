package com.example.wellbeing.repository;

import com.example.wellbeing.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUsername(String username);
    Optional<Doctor> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    List<Doctor> findByEspecializacaoContainingIgnoreCase(String especializacao);
    List<Doctor> findByFullNameContainingIgnoreCase(String name);

    @Query("SELECT DISTINCT d.especializacao FROM Doctor d WHERE d.especializacao IS NOT NULL")
    List<String> findAllEspecializacoes();
}
