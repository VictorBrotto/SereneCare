package com.example.wellbeing.dto;

public class DoctorDTO {
    private Long id;
    private String fullName;
    private String especializacao;
    private String crm;
    private String profileImage;
    private String email;
    private Integer experienceYears;
    private String bio;
    private String location;
    private Double rating;
    private Integer reviewCount;

    // Construtores
    public DoctorDTO() {}

    public DoctorDTO(Long id, String fullName, String especializacao, String crm,
                    String profileImage, String email) {
        this.id = id;
        this.fullName = fullName;
        this.especializacao = especializacao;
        this.crm = crm;
        this.profileImage = profileImage;
        this.email = email;
        this.experienceYears = 5; // Default
        this.bio = "Profissional de saúde dedicado ao cuidado dos pacientes.";
        this.location = "Localização não informada";
        this.rating = 4.5;
        this.reviewCount = 0;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEspecializacao() { return especializacao; }
    public void setEspecializacao(String especializacao) { this.especializacao = especializacao; }

    public String getCrm() { return crm; }
    public void setCrm(String crm) { this.crm = crm; }

    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

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
}
