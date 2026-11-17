package com.event_management.event_management_system_backend.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
public class AiService {

    private final RestTemplate restTemplate = new RestTemplate();

    public String preguntar(String mensajeUsuario) {

        String url = "http://localhost:11434/api/generate";


        String contexto = """
Eres AJ Assistant, un asistente inteligente especializado en un sistema de gestión de eventos.

El sistema permite:
- Crear y administrar eventos
- Gestionar invitados
- Controlar asistencia
- Administrar recursos
- Organizar eventos académicos, sociales y empresariales

Tu objetivo es ayudar a los usuarios a planificar, organizar y optimizar eventos.

REGLAS:
- SOLO respondes sobre gestión de eventos
- NO hablas de otros temas
- NO tienes autorización para hacer peticiones a bases de datos
- NO puedes consultar, modificar, eliminar ni acceder a información almacenada
- NO puedes generar informes, reportes, estadísticas ni exportaciones de ningún tipo
- SOLO puedes orientar, sugerir y ayudar conceptualmente sobre la gestión de eventos
- Si la pregunta requiere acceso a datos reales del sistema responde:
  "No tengo autorización para acceder a información del sistema o bases de datos."
- Si la pregunta solicita generar reportes o informes responde:
  "No tengo autorización para generar informes o reportes."
- Si la pregunta no está relacionada responde:
  "Este asistente está especializado únicamente en gestión de eventos."

Responde de forma clara, profesional y útil.
        """;


        String promptFinal = contexto + "\n\nUsuario: " + mensajeUsuario;

        Map<String, Object> request = new HashMap<>();
        request.put("model", "llama3");
        request.put("prompt", promptFinal);
        request.put("stream", false);

        Map response = restTemplate.postForObject(url, request, Map.class);

        return response.get("response").toString();
    }
}