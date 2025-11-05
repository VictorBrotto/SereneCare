package com.example.wellbeing.controller;

import com.example.wellbeing.dto.DailyLogDTO;
import com.example.wellbeing.model.DailyLog;
import com.example.wellbeing.service.DailyLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/daily")
public class DailyLogController {

    @Autowired
    private DailyLogService service;

    @GetMapping
    public List<DailyLog> list() { return service.findAll(); }

    @GetMapping("/{id}")
    public DailyLog get(@PathVariable Long id) { return service.findById(id); }

    @PostMapping
    public DailyLog create(@RequestBody DailyLogDTO dto) { return service.save(dto); }

    @PutMapping("/{id}")
    public DailyLog update(@PathVariable Long id, @RequestBody DailyLogDTO dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}
