package com.event_management.event_management_system_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Ruta simple para comprobar que la API está viva (la usa Elastic Beanstalk como health check).
 */
@RestController
public class HealthController {

    @GetMapping("/")
    public String health() {
        return "AJEVENTS API OK";
    }
}
