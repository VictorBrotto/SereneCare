package com.example.wellbeing.controller;

import com.example.wellbeing.dto.AuthRequest;
import com.example.wellbeing.dto.AuthResponse;
import com.example.wellbeing.dto.RegisterRequest;
import com.example.wellbeing.model.User;
import com.example.wellbeing.repository.UserRepository;
import com.example.wellbeing.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        try {
            System.out.println("Tentativa de registro: " + req.getUsername() + " - " + req.getEmail());

            if (userRepository.findByUsername(req.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body("❌ Username already in use");
            }
            if (userRepository.findByEmail(req.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("❌ Email already in use");
            }

            String role = req.getRole() != null ? req.getRole() : "PATIENT";

            User user = new User();
            user.setUsername(req.getUsername());
            user.setEmail(req.getEmail());
            user.setPassword(passwordEncoder.encode(req.getPassword()));
            user.setFullName(req.getFullName());
            user.setRole(role);

            userRepository.save(user);

            String token = jwtUtil.generateTokenWithRole(user.getUsername(), role);
            System.out.println("Registro bem-sucedido: " + req.getUsername());
            
            AuthResponse response = new AuthResponse(token);
            response.setRole(role);
            response.setUserId(user.getId());
            response.setEmail(user.getEmail());
            response.setUsername(user.getUsername());
            
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("Erro no registro: " + e.getMessage());
            return ResponseEntity.badRequest().body("❌ Registration error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest req) {
        try {
            System.out.println("Tentativa de login - Username: " + req.getUsername() + ", Role esperada: " + req.getRole());

            // ENCONTRAR O USUÁRIO POR USERNAME OU EMAIL
            String loginIdentifier = req.getUsername();
            User user = null;

            // Se username foi fornecido, busca por username
            if (req.getUsername() != null && !req.getUsername().isEmpty()) {
                Optional<User> userByUsername = userRepository.findByUsername(req.getUsername());
                if (userByUsername.isPresent()) {
                    user = userByUsername.get();
                    loginIdentifier = req.getUsername();
                }
            }

            // Se não encontrou por username e email foi fornecido, busca por email
            if (user == null && req.getEmail() != null && !req.getEmail().isEmpty()) {
                Optional<User> userByEmail = userRepository.findByEmail(req.getEmail());
                if (userByEmail.isPresent()) {
                    user = userByEmail.get();
                    loginIdentifier = user.getUsername();
                }
            }

            if (user == null) {
                System.out.println("Usuário não encontrado: " + req.getUsername() + " / " + req.getEmail());
                return ResponseEntity.status(401).body("❌ User not found");
            }

            // ✅ VALIDAÇÃO DA ROLE: Verificar se a role do usuário corresponde à role selecionada
            if (req.getRole() != null && !req.getRole().isEmpty()) {
                if (!user.getRole().equals(req.getRole())) {
                    System.out.println("Tentativa de login com role incorreta. Usuário: " + user.getRole() + ", Selecionada: " + req.getRole());
                    return ResponseEntity.status(403).body("❌ Access denied: Invalid role for this user");
                }
            }

            // VERIFICAÇÃO DE SENHA
            if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
                System.out.println("Senha incorreta para: " + loginIdentifier);
                return ResponseEntity.status(401).body("❌ Invalid credentials");
            }

            // AUTENTICAÇÃO COM SPRING SECURITY
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginIdentifier, req.getPassword())
            );

            // GERAÇÃO DO TOKEN
            String token = jwtUtil.generateTokenWithRole(loginIdentifier, user.getRole());
            System.out.println("Login bem-sucedido: " + loginIdentifier + " - Role: " + user.getRole());

            AuthResponse response = new AuthResponse(token);
            response.setRole(user.getRole());
            response.setUserId(user.getId());
            response.setEmail(user.getEmail());
            response.setUsername(user.getUsername());

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            System.out.println("BadCredentials: " + req.getUsername() + " / " + req.getEmail());
            return ResponseEntity.status(401).body("❌ Invalid credentials");
        } catch (Exception e) {
            System.out.println("Erro no login: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("❌ Login error: " + e.getMessage());
        }
    }
}