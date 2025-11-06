package com.example.wellbeing.dto;

import jakarta.validation.constraints.NotBlank;

public class AuthRequest {

    private String username;  // Pode ser null se usar email

    private String email;     // Pode ser null se usar username

    @NotBlank(message = "Password is mandatory")
    private String password;

    private String role; // ✅ ADICIONE ESTE CAMPO

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // ✅ ADICIONE ESTES GETTER E SETTER PARA ROLE
    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}