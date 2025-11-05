package com.example.wellbeing.model;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "doctors")
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique=true, nullable=false)
    private String username;

    @Column(unique=true, nullable=false)
    private String email;

    @Column(nullable=false)
    private String password; // hashed

    @Column(name="full_name")
    private String fullName;

    private String especializacao;
    private String crm;

    @Column(name="profile_image")
    private String profileImage; // store path/url

    @Column(name="created_at", updatable=false)
    private Instant createdAt = Instant.now();

    @Column(name="updated_at")
    private Instant updatedAt = Instant.now();

    // getters/setters
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
    // constructors / equals / hashCode omitted for brevity
}
