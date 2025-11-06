package com.example.wellbeing.controller;

import com.example.wellbeing.model.User;
import com.example.wellbeing.repository.UserRepository;
import com.example.wellbeing.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private String extractUsernameFromAuth(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractUsername(token);
    }

    // ✅ Buscar usuário por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        try {
            Optional<User> user = userRepository.findById(id);
            if (user.isPresent()) {
                return ResponseEntity.ok(user.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao buscar usuário: " + e.getMessage());
        }
    }

    // ✅ Atualizar perfil do usuário
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request, @RequestHeader("Authorization") String authHeader) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            User user = userOpt.get();
            
            // Atualizar campos permitidos
            if (request.getFullName() != null) {
                user.setFullName(request.getFullName());
            }
            if (request.getBio() != null) {
                user.setBio(request.getBio());
            }
            if (request.getLocation() != null) {
                user.setLocation(request.getLocation());
            }
            // Campos específicos de médico
            if ("DOCTOR".equals(user.getRole())) {
                if (request.getExperienceYears() != null) {
                    user.setExperienceYears(request.getExperienceYears());
                }
            }

            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao atualizar usuário: " + e.getMessage());
        }
    }

    // ✅ NOVO ENDPOINT: Upload de foto de perfil (Base64)
    @PostMapping("/{id}/profile-image")
    public ResponseEntity<?> uploadProfileImage(
            @PathVariable Long id,
            @RequestBody ProfileImageRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            User user = userOpt.get();
            
            // Validar se é Base64
            if (request.getImageData() != null && request.getImageData().startsWith("data:image")) {
                user.setProfileImage(request.getImageData());
                // Limpar URL se estiver usando Base64
                user.setProfileImageUrl(null);
            } else if (request.getImageUrl() != null) {
                user.setProfileImageUrl(request.getImageUrl());
                // Limpar Base64 se estiver usando URL
                user.setProfileImage(null);
            } else {
                return ResponseEntity.badRequest().body("Dados de imagem inválidos");
            }

            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao atualizar foto de perfil: " + e.getMessage());
        }
    }

    // ✅ NOVO ENDPOINT: Remover foto de perfil
    @DeleteMapping("/{id}/profile-image")
    public ResponseEntity<?> removeProfileImage(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            User user = userOpt.get();
            user.setProfileImage(null);
            user.setProfileImageUrl(null);

            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao remover foto de perfil: " + e.getMessage());
        }
    }

    // ✅ NOVO ENDPOINT: Upload de arquivo de imagem (Multipart)
    @PostMapping("/{id}/profile-image-upload")
    public ResponseEntity<?> uploadProfileImageFile(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Validar tipo de arquivo
            if (!file.getContentType().startsWith("image/")) {
                return ResponseEntity.badRequest().body("Apenas arquivos de imagem são permitidos");
            }

            // Validar tamanho (máximo 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body("A imagem deve ter no máximo 5MB");
            }

            User user = userOpt.get();
            
            // Converter para Base64
            String base64Image = "data:" + file.getContentType() + ";base64," + 
                Base64.getEncoder().encodeToString(file.getBytes());
            
            user.setProfileImage(base64Image);
            user.setProfileImageUrl(null);

            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);

        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Erro ao processar a imagem: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao fazer upload da imagem: " + e.getMessage());
        }
    }
}

// ✅ CLASSES DE REQUEST

class ProfileImageRequest {
    private String imageData; // Base64
    private String imageUrl;  // URL externa
    
    public String getImageData() { return imageData; }
    public void setImageData(String imageData) { this.imageData = imageData; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}

class UpdateUserRequest {
    private String fullName;
    private String bio;
    private String location;
    private Integer experienceYears;

    // Getters e Setters
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }
}