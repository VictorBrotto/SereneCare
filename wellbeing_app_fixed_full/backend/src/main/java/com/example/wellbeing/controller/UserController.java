package com.example.wellbeing.controller;

import com.example.wellbeing.model.User;
import com.example.wellbeing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*") // permite acesso do frontend (React)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // ✅ Lista todos os usuários (opcional, pode remover se quiser)
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ Lista apenas os DOCTORS (endpoint que o frontend deve chamar)
    @GetMapping("/doctors")
    public List<User> getAllDoctors() {
        return userRepository.findByRoleIgnoreCase("DOCTOR");
    }

    // ✅ (opcional) Lista apenas os PATIENTS
    @GetMapping("/patients")
    public List<User> getAllPatients() {
        return userRepository.findByRoleIgnoreCase("PATIENT");
    }
}
