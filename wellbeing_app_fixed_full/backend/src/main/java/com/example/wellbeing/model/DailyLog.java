package com.example.wellbeing.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_log")
public class DailyLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Vários logs pertencem a um único usuário
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "pain_level")
    private Integer painLevel;

    @Column(name = "sleep_quality")
    private Integer sleepQuality;

    @Column(name = "mood")
    private Integer mood;

    @Column(columnDefinition = "TEXT")
    private String symptoms;

    @Column(columnDefinition = "TEXT")
    private String triggers;

    @Column(name = "diet_meals", columnDefinition = "TEXT")
    private String dietMeals;

    @Column(name = "physical_activity", columnDefinition = "TEXT")
    private String physicalActivity;

    @Column(name = "medications", columnDefinition = "TEXT")
    private String medications;

    @Column(name = "additional_notes", columnDefinition = "TEXT")
    private String additionalNotes;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Getters e Setters
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
