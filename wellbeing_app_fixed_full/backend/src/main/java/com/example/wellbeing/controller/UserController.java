package com.example.wellbeing.controller;

import com.example.wellbeing.model.User;
import com.example.wellbeing.repository.UserRepository;
import com.example.wellbeing.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Base64;
import java.util.Optional;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

// ✅ IMPORT CORRETO para HttpServletResponse
import jakarta.servlet.http.HttpServletResponse;

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

    // ✅ NOVO ENDPOINT: Buscar perfil do usuário autenticado
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            String username = extractUsernameFromAuth(authHeader);
            Optional<User> user = userRepository.findByUsername(username);
            
            if (user.isPresent()) {
                return ResponseEntity.ok(user.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao buscar perfil: " + e.getMessage());
        }
    }

    // ✅ NOVO ENDPOINT: Atualizar configurações de privacidade
    @PutMapping("/privacy-settings")
    public ResponseEntity<?> updatePrivacySettings(
            @RequestBody PrivacySettingsRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String username = extractUsernameFromAuth(authHeader);
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            User user = userOpt.get();
            
            // Atualizar configurações de privacidade
            if (request.getProfileVisibility() != null) {
                user.setProfileVisibility(request.getProfileVisibility());
            }
            if (request.getShowOnlineStatus() != null) {
                user.setShowOnlineStatus(request.getShowOnlineStatus());
            }
            if (request.getAllowMessages() != null) {
                user.setAllowMessages(request.getAllowMessages());
            }
            if (request.getShowActivity() != null) {
                user.setShowActivity(request.getShowActivity());
            }
            if (request.getDataCollection() != null) {
                user.setDataCollection(request.getDataCollection());
            }

            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao atualizar configurações de privacidade: " + e.getMessage());
        }
    }

    // ✅ NOVO ENDPOINT: Excluir conta do usuário
    @DeleteMapping("/account")
    public ResponseEntity<?> deleteAccount(@RequestHeader("Authorization") String authHeader) {
        try {
            String username = extractUsernameFromAuth(authHeader);
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            User user = userOpt.get();
            
            // Aqui você pode adicionar lógica adicional antes de excluir:
            // - Verificar se há dados dependentes
            // - Fazer backup dos dados
            // - Notificar o usuário por email, etc.
            
            userRepository.delete(user);
            
            return ResponseEntity.ok().body("Conta excluída com sucesso");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao excluir conta: " + e.getMessage());
        }
    }

    // ✅ NOVO ENDPOINT: Exportar dados do usuário
    @GetMapping("/export-data")
    public void exportUserData(HttpServletResponse response, @RequestHeader("Authorization") String authHeader) {
        try {
            String username = extractUsernameFromAuth(authHeader);
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (userOpt.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                return;
            }

            User user = userOpt.get();
            
            // Configurar resposta para download
            response.setContentType("application/zip");
            response.setHeader("Content-Disposition", "attachment; filename=\"serenecare-dados-" + username + ".zip\"");
            
            // Criar arquivo ZIP
            ZipOutputStream zipOut = new ZipOutputStream(response.getOutputStream());
            
            // Adicionar dados do usuário como CSV
            ZipEntry userEntry = new ZipEntry("dados-usuario.csv");
            zipOut.putNextEntry(userEntry);
            
            StringBuilder csvData = new StringBuilder();
            csvData.append("Campo,Valor\n");
            csvData.append("ID,").append(user.getId()).append("\n");
            csvData.append("Username,").append(user.getUsername()).append("\n");
            csvData.append("Email,").append(user.getEmail()).append("\n");
            csvData.append("Nome Completo,").append(user.getFullName()).append("\n");
            csvData.append("Role,").append(user.getRole()).append("\n");
            csvData.append("Data de Criação,").append(user.getCreatedAt()).append("\n");
            csvData.append("Bio,").append(user.getBio()).append("\n");
            csvData.append("Localização,").append(user.getLocation()).append("\n");
            csvData.append("Rating,").append(user.getRating()).append("\n");
            csvData.append("Contagem de Reviews,").append(user.getReviewCount()).append("\n");
            
            if ("DOCTOR".equals(user.getRole())) {
                csvData.append("Especialização,").append(user.getEspecializacao()).append("\n");
                csvData.append("CRM,").append(user.getCrm()).append("\n");
                csvData.append("Anos de Experiência,").append(user.getExperienceYears()).append("\n");
            }
            
            // Configurações de privacidade
            csvData.append("Visibilidade do Perfil,").append(user.getProfileVisibility()).append("\n");
            csvData.append("Mostrar Status Online,").append(user.getShowOnlineStatus()).append("\n");
            csvData.append("Permitir Mensagens,").append(user.getAllowMessages()).append("\n");
            csvData.append("Mostrar Atividade,").append(user.getShowActivity()).append("\n");
            csvData.append("Coleta de Dados,").append(user.getDataCollection()).append("\n");
            
            zipOut.write(csvData.toString().getBytes());
            zipOut.closeEntry();
            
            // Adicionar arquivo de informações
            ZipEntry infoEntry = new ZipEntry("LEIA-ME.txt");
            zipOut.putNextEntry(infoEntry);
            String info = "Exportação de dados - SereneCare\n" +
                         "Usuário: " + user.getUsername() + "\n" +
                         "Data da exportação: " + java.time.LocalDateTime.now() + "\n" +
                         "Este arquivo contém os dados pessoais do usuário no sistema SereneCare.";
            zipOut.write(info.getBytes());
            zipOut.closeEntry();
            
            zipOut.close();
            
        } catch (Exception e) {
            try {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                PrintWriter writer = response.getWriter();
                writer.write("Erro ao exportar dados: " + e.getMessage());
            } catch (IOException ioException) {
                // Log do erro
                System.err.println("Erro ao enviar resposta de erro: " + ioException.getMessage());
            }
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

    // ✅ Upload de foto de perfil (Base64)
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

    // ✅ Remover foto de perfil
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

    // ✅ Upload de arquivo de imagem (Multipart)
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

// ✅ NOVA CLASSE: Request para configurações de privacidade
class PrivacySettingsRequest {
    private String profileVisibility;
    private Boolean showOnlineStatus;
    private Boolean allowMessages;
    private Boolean showActivity;
    private Boolean dataCollection;

    // Getters e Setters
    public String getProfileVisibility() { return profileVisibility; }
    public void setProfileVisibility(String profileVisibility) { this.profileVisibility = profileVisibility; }
    
    public Boolean getShowOnlineStatus() { return showOnlineStatus; }
    public void setShowOnlineStatus(Boolean showOnlineStatus) { this.showOnlineStatus = showOnlineStatus; }
    
    public Boolean getAllowMessages() { return allowMessages; }
    public void setAllowMessages(Boolean allowMessages) { this.allowMessages = allowMessages; }
    
    public Boolean getShowActivity() { return showActivity; }
    public void setShowActivity(Boolean showActivity) { this.showActivity = showActivity; }
    
    public Boolean getDataCollection() { return dataCollection; }
    public void setDataCollection(Boolean dataCollection) { this.dataCollection = dataCollection; }
}