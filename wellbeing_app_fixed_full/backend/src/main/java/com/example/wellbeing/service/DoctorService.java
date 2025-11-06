package com.example.wellbeing.service;

import com.example.wellbeing.model.Doctor;
import com.example.wellbeing.repository.DoctorRepository;
import com.example.wellbeing.dto.DoctorDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DoctorDTO> getDoctorsByEspecializacao(String especializacao) {
        return doctorRepository.findByEspecializacaoContainingIgnoreCase(especializacao).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<DoctorDTO> searchDoctorsByName(String name) {
        return doctorRepository.findByFullNameContainingIgnoreCase(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<String> getAllEspecializacoes() {
        return doctorRepository.findAllEspecializacoes();
    }

    public DoctorDTO getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    private DoctorDTO convertToDTO(Doctor doctor) {
        DoctorDTO dto = new DoctorDTO();
        dto.setId(doctor.getId());
        dto.setFullName(doctor.getFullName());
        dto.setEspecializacao(doctor.getEspecializacao());
        dto.setCrm(doctor.getCrm());
        dto.setProfileImage(doctor.getProfileImage());
        dto.setEmail(doctor.getEmail());

        // Campos com valores default (você pode adicionar esses campos na entidade depois)
        dto.setExperienceYears(5);
        dto.setBio("Profissional de saúde dedicado ao cuidado dos pacientes.");
        dto.setLocation("Localização não informada");
        dto.setRating(4.5);
        dto.setReviewCount(0);

        return dto;
    }
}
