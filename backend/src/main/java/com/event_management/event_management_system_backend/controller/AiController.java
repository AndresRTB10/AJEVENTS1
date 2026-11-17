package com.event_management.event_management_system_backend.controller;

import com.event_management.event_management_system_backend.services.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/ai")
public class AiController {


    @Autowired
    private AiService aiService;

    @PostMapping("/preguntar")
    public String preguntar(@RequestBody Map<String, String> body) {
        return aiService.preguntar(body.get("mensaje"));
    }
}
