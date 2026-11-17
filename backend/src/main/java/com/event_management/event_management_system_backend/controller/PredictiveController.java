package com.event_management.event_management_system_backend.controller;



import com.event_management.event_management_system_backend.predictive.PredictiveService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/predict")
public class PredictiveController {

    private final PredictiveService predictiveService;

    public PredictiveController(PredictiveService predictiveService) {
        this.predictiveService = predictiveService;
    }

    @GetMapping
    public String predict(
            @RequestParam String name,
            @RequestParam String city,
            @RequestParam String country,
            @RequestParam String place
    ) {
        return predictiveService.predict(name, city, country, place);
    }
}
