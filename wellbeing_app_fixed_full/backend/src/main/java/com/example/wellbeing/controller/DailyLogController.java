package com.example.wellbeing.controller;

import com.example.wellbeing.dto.DailyLogDTO;
import com.example.wellbeing.model.DailyLog;
import com.example.wellbeing.service.DailyLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/daily")
@CrossOrigin(origins = "http://localhost:5173") // ✅ ADICIONAR CORS
public class DailyLogController {

    @Autowired
    private DailyLogService service;

    @GetMapping
    public List<DailyLog> list() { 
        System.out.println("📋 Buscando todos os registros daily...");
        List<DailyLog> logs = service.findAll();
        System.out.println("✅ Encontrados " + logs.size() + " registros");
        return logs; 
    }

    @GetMapping("/{id}")
    public DailyLog get(@PathVariable Long id) { 
        System.out.println("🔍 Buscando daily log com ID: " + id);
        return service.findById(id); 
    }

    @PostMapping
    public DailyLog create(@RequestBody DailyLogDTO dto) { 
        System.out.println("📝 Criando novo daily log para usuário: " + dto.userId);
        System.out.println("📊 Dados - Dor: " + dto.painLevel + ", Sono: " + dto.sleepQuality + ", Humor: " + dto.mood);
        return service.save(dto); 
    }

    @PutMapping("/{id}")
    public DailyLog update(@PathVariable Long id, @RequestBody DailyLogDTO dto) { 
        System.out.println("✏️ Atualizando daily log ID: " + id);
        return service.update(id, dto); 
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { 
        System.out.println("🗑️ Deletando daily log ID: " + id);
        service.delete(id); 
    }
}