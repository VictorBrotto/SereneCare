package com.example.wellbeing.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class RegisterRequest {

    @NotBlank
    private String username;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    private String fullName;

    // papel do usuário (opcional: "ROLE_PATIENT" ou "ROLE_DOCTOR")
    private String role;

    // usado no frontend para saber se é um doutor
    private boolean doctor;

    // campos adicionais caso seja doutor
    private String especializacao;
    private String crm;

    public RegisterRequest() {}

    public RegisterRequest(String username, String email, String password, String fullName, String role, boolean doctor,
                           String especializacao, String crm) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
        this.doctor = doctor;
        this.especializacao = especializacao;
        this.crm = crm;
    }

    // Getters e Setters
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

    public boolean isDoctor() { return doctor; }
    public void setDoctor(boolean doctor) { this.doctor = doctor; }

    public String getEspecializacao() { return especializacao; }
    public void setEspecializacao(String especializacao) { this.especializacao = especializacao; }

    public String getCrm() { return crm; }
    public void setCrm(String crm) { this.crm = crm; }
}
