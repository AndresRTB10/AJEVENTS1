package com.event_management.event_management_system_backend.controller;



import com.event_management.event_management_system_backend.services.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/recommendations")
@CrossOrigin("*")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @PostMapping("/send")
    public String sendRecommendations() {

        recommendationService.sendRecommendations();

        return "Correos enviados correctamente";
    }
}