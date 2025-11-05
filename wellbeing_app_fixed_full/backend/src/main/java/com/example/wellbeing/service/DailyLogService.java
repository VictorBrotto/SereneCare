package com.example.wellbeing.service;

import com.example.wellbeing.dto.DailyLogDTO;
import com.example.wellbeing.model.DailyLog;
import com.example.wellbeing.model.User;
import com.example.wellbeing.repository.DailyLogRepository;
import com.example.wellbeing.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DailyLogService {

    private final DailyLogRepository repo;
    private final UserRepository userRepo;

    public DailyLogService(DailyLogRepository repo, UserRepository userRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
    }

    public List<DailyLog> findAll() {
        return repo.findAll();
    }

    public DailyLog findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Daily log not found with id: " + id));
    }

    // ⬇️ este método é o que o controller chama no POST
    public DailyLog save(DailyLogDTO dto) {
        User user = userRepo.findById(dto.userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + dto.userId));

        DailyLog e = new DailyLog();
        e.setUser(user);
        e.setPainLevel(dto.painLevel);
        e.setSleepQuality(dto.sleepQuality);
        e.setMood(dto.mood);
        e.setSymptoms(dto.symptoms);
        e.setTriggers(dto.triggers);
        e.setDietMeals(dto.dietMeals);
        e.setPhysicalActivity(dto.physicalActivity);
        e.setMedications(dto.medications);
        e.setAdditionalNotes(dto.additionalNotes);
        e.setCreatedAt(LocalDateTime.now());
        e.setUpdatedAt(LocalDateTime.now());

        return repo.save(e);
    }

    public DailyLog update(Long id, DailyLogDTO dto) {
        DailyLog existing = findById(id);

        if (dto.painLevel != null) existing.setPainLevel(dto.painLevel);
        if (dto.sleepQuality != null) existing.setSleepQuality(dto.sleepQuality);
        if (dto.mood != null) existing.setMood(dto.mood);
        if (dto.symptoms != null) existing.setSymptoms(dto.symptoms);
        if (dto.triggers != null) existing.setTriggers(dto.triggers);
        if (dto.dietMeals != null) existing.setDietMeals(dto.dietMeals);
        if (dto.physicalActivity != null) existing.setPhysicalActivity(dto.physicalActivity);
        if (dto.medications != null) existing.setMedications(dto.medications);
        if (dto.additionalNotes != null) existing.setAdditionalNotes(dto.additionalNotes);

        existing.setUpdatedAt(LocalDateTime.now());
        return repo.save(existing);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Daily log not found with id: " + id);
        }
        repo.deleteById(id);
    }
}
