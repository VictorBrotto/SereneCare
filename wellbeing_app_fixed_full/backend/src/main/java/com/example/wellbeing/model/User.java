package com.example.wellbeing.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, unique=true, length=50)
    private String username;

    @Column(nullable=false, unique=true, length=150)
    private String email;

    @Column(nullable=false)
    private String password;

    @Column(name="full_name", length=150)
    private String fullName;

    @Column(name="role", length=50)
    private String role = "PATIENT";

    @Column(name="created_at", nullable=false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Campos específicos para DOCTOR
    private String especializacao;
    private String crm;
    
    @Column(name = "experience_years")
    private Integer experienceYears;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
    
    private String location;
    
    private Double rating = 4.50;
    
    @Column(name = "review_count")
    private Integer reviewCount = 0;

    // ✅ NOVO: Campos para foto de perfil
    @Column(name = "profile_image", columnDefinition = "TEXT")
    private String profileImage; // Base64 ou caminho do arquivo

    @Column(name = "profile_image_url", columnDefinition = "TEXT")
    private String profileImageUrl; // URL da imagem

    // Construtores
    public User() {}

    public User(String username, String email, String password, String fullName, String role) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
        this.createdAt = LocalDateTime.now();
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getEspecializacao() { return especializacao; }
    public void setEspecializacao(String especializacao) { this.especializacao = especializacao; }

    public String getCrm() { return crm; }
    public void setCrm(String crm) { this.crm = crm; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    // ✅ NOVOS GETTERS E SETTERS PARA FOTO DE PERFIL
    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }

    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }
}