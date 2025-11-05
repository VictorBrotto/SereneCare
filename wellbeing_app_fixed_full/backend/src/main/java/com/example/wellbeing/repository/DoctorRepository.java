package com.example.wellbeing.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.wellbeing.model.Doctor;

import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUsername(String username);
    Optional<Doctor> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
