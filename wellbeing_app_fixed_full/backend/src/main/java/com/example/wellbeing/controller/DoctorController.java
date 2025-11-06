package com.example.wellbeing.controller;

import com.example.wellbeing.service.DoctorService;
import com.example.wellbeing.dto.DoctorDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:3000")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        try {
            List<DoctorDTO> doctors = doctorService.getAllDoctors();
            return ResponseEntity.ok(doctors);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable Long id) {
        try {
            DoctorDTO doctor = doctorService.getDoctorById(id);
            if (doctor != null) {
                return ResponseEntity.ok(doctor);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/especializacao/{especializacao}")
    public ResponseEntity<List<DoctorDTO>> getDoctorsByEspecializacao(@PathVariable String especializacao) {
        try {
            List<DoctorDTO> doctors = doctorService.getDoctorsByEspecializacao(especializacao);
            return ResponseEntity.ok(doctors);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<DoctorDTO>> searchDoctors(@RequestParam String name) {
        try {
            List<DoctorDTO> doctors = doctorService.searchDoctorsByName(name);
            return ResponseEntity.ok(doctors);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/especializacoes")
    public ResponseEntity<List<String>> getAllEspecializacoes() {
        try {
            List<String> especializacoes = doctorService.getAllEspecializacoes();
            return ResponseEntity.ok(especializacoes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
