package com.example.wellbeing.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_logs")
public class DailyLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // ✅ CORREÇÃO: Adicionar @JsonIgnore para evitar loop infinito
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
    
    private Integer painLevel;
    private Integer sleepQuality;
    private Integer mood;
    private String symptoms;
    private String triggers;
    private String dietMeals;
    private String physicalActivity;
    private String medications;
    private String additionalNotes;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public DailyLog() {}
    
    public DailyLog(User user, Integer painLevel, Integer sleepQuality, Integer mood, 
                   String symptoms, String triggers, String dietMeals, 
                   String physicalActivity, String medications, String additionalNotes) {
        this.user = user;
        this.painLevel = painLevel;
        this.sleepQuality = sleepQuality;
        this.mood = mood;
        this.symptoms = symptoms;
        this.triggers = triggers;
        this.dietMeals = dietMeals;
        this.physicalActivity = physicalActivity;
        this.medications = medications;
        this.additionalNotes = additionalNotes;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Integer getPainLevel() { return painLevel; }
    public void setPainLevel(Integer painLevel) { this.painLevel = painLevel; }
    
    public Integer getSleepQuality() { return sleepQuality; }
    public void setSleepQuality(Integer sleepQuality) { this.sleepQuality = sleepQuality; }
    
    public Integer getMood() { return mood; }
    public void setMood(Integer mood) { this.mood = mood; }
    
    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
    
    public String getTriggers() { return triggers; }
    public void setTriggers(String triggers) { this.triggers = triggers; }
    
    public String getDietMeals() { return dietMeals; }
    public void setDietMeals(String dietMeals) { this.dietMeals = dietMeals; }
    
    public String getPhysicalActivity() { return physicalActivity; }
    public void setPhysicalActivity(String physicalActivity) { this.physicalActivity = physicalActivity; }
    
    public String getMedications() { return medications; }
    public void setMedications(String medications) { this.medications = medications; }
    
    public String getAdditionalNotes() { return additionalNotes; }
    public void setAdditionalNotes(String additionalNotes) { this.additionalNotes = additionalNotes; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}