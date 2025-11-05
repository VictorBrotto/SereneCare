package com.example.wellbeing.repository;

import com.example.wellbeing.model.DailyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DailyLogRepository extends JpaRepository<DailyLog, Long> {
    List<DailyLog> findByUserIdOrderByCreatedAtDesc(Long userId);
}
