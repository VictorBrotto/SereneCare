package com.example.wellbeing.repository;

import com.example.wellbeing.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    List<User> findByRoleIgnoreCase(String role);
    
    @Query("SELECT u FROM User u WHERE u.role = 'DOCTOR' AND u.especializacao = :specialization")
    List<User> findDoctorsBySpecialization(String specialization);
    
    @Query("SELECT u FROM User u WHERE u.role = 'DOCTOR' AND u.location LIKE %:location%")
    List<User> findDoctorsByLocation(@Param("location") String location);
    
    @Query("SELECT DISTINCT u.especializacao FROM User u WHERE u.role = 'DOCTOR' AND u.especializacao IS NOT NULL")
    List<String> findDistinctSpecializations();
}