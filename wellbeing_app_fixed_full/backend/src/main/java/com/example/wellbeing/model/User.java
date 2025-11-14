package com.example.wellbeing.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.Instant;

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

    // ✅ NOVO: Campo para último acesso (status online)
    @Column(name = "last_seen")
    private Instant lastSeen = Instant.now();

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

    // ✅ CORREÇÃO: Campo único para foto de perfil
    @Column(name = "profile_picture", columnDefinition = "TEXT")
    private String profilePicture;

    // ✅ NOVOS CAMPOS: Configurações de Privacidade
    @Column(name = "profile_visibility", length = 20)
    private String profileVisibility = "public";

    @Column(name = "show_online_status")
    private Boolean showOnlineStatus = true;

    @Column(name = "allow_messages")
    private Boolean allowMessages = true;

    @Column(name = "show_activity")
    private Boolean showActivity = true;

    @Column(name = "data_collection")
    private Boolean dataCollection = false;

    // Construtores
    public User() {}

    public User(String username, String email, String password, String fullName, String role) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
        this.createdAt = LocalDateTime.now();
        this.lastSeen = Instant.now();
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

    // ✅ NOVO: Getter e Setter para lastSeen
    public Instant getLastSeen() { return lastSeen; }
    public void setLastSeen(Instant lastSeen) { this.lastSeen = lastSeen; }

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

    // ✅ CORREÇÃO: Usar apenas profilePicture
    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }

    // Configurações de privacidade
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

    // ✅ NOVO: Método para verificar se está online
    public boolean isOnline() {
        if (lastSeen == null) return false;
        if (!Boolean.TRUE.equals(showOnlineStatus)) return false;
        
        Instant fiveMinutesAgo = Instant.now().minusSeconds(300); // 5 minutos
        return lastSeen.isAfter(fiveMinutesAgo);
    }
}