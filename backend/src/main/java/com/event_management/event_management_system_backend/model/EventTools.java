package com.event_management.event_management_system_backend.model;



import com.event_management.event_management_system_backend.repositories.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;


import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

@Component
public class EventTools {

    @Tool
    public long countEvents() {
        System.out.println("🔥 TOOL EJECUTÁNDOSE countEvents");
        return 5;
    }
}
