package com.example.wellbeing.controller;

import com.example.wellbeing.dto.AuthRequest;
import com.example.wellbeing.dto.AuthResponse;
import com.example.wellbeing.dto.RegisterRequest;
import com.example.wellbeing.model.User;
import com.example.wellbeing.repository.UserRepository;
import com.example.wellbeing.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;  // Garantir que o PasswordEncoder esteja correto

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.findByUsername(req.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("❌ Username already in use");
        }
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("❌ Email already in use");
        }

        // Define role padrão
        String role = req.getRole() != null ? req.getRole() : "PATIENT";

        User user = new User();
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword())); // Codifica a senha
        user.setFullName(req.getFullName());
        user.setRole(role);

        userRepository.save(user);

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);

        String token = jwtUtil.generateToken(user.getUsername()); // Geração do token JWT
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest req) {
        try {
            // Verifica se o login é válido usando o AuthenticationManager
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
            );

            // Encontra o usuário no banco
            User user = userRepository.findByUsername(req.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Verifica se a senha fornecida é a mesma que está armazenada no banco (com PasswordEncoder)
            if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
                return ResponseEntity.status(401).body("❌ Invalid credentials");
            }

            // Criação do token JWT com o role do usuário
            String token = jwtUtil.generateToken(user.getUsername());

            return ResponseEntity.ok(new AuthResponse(token));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("❌ Invalid credentials");
        }
    }
}
