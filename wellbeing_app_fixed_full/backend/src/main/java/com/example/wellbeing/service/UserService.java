package com.example.wellbeing.service;

import com.example.wellbeing.model.User;
import com.example.wellbeing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllDoctors() {
        return userRepository.findByRoleIgnoreCase("DOCTOR");
    }

    public Optional<User> getDoctorById(Long id) {
        return userRepository.findById(id)
                .filter(user -> "DOCTOR".equalsIgnoreCase(user.getRole()));
    }

    public List<User> getDoctorsBySpecialization(String specialization) {
        return userRepository.findDoctorsBySpecialization(specialization);
    }

    public List<User> getDoctorsByLocation(String location) {
        return userRepository.findDoctorsByLocation(location);
    }

    public List<String> getAllSpecializations() {
        return userRepository.findDistinctSpecializations();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}