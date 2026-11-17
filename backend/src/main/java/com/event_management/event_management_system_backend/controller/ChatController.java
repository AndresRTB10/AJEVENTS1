package com.event_management.event_management_system_backend.controller;


import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.web.bind.annotation.*;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.web.bind.annotation.*;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.ObjectProvider;

@RestController
@RequestMapping("/mcp")
public class ChatController {

    private final ChatClient chatClient;

    public ChatController(ChatClient.Builder builder,
                          ObjectProvider<ToolCallbackProvider> tools) {

        // Si el cliente MCP está desactivado (p. ej. en AWS, donde no hay Docker), no hay tools
        // y el chat responde igualmente, solo que sin consultar la base de datos.
        tools.ifAvailable(t -> builder.defaultToolCallbacks(t));

        this.chatClient = builder
                .defaultSystem("""
Eres un asistente especializado en un sistema de gestión de eventos.

REGLAS ESTRICTAS:

BASE DE DATOS DISPONIBLE:
- admin
- attendee
- event

REGLAS OBLIGATORIAS:
- NUNCA uses la tabla "eventos"
- La tabla correcta para eventos es "event"
- La tabla correcta para asistentes es "attendee"
- La tabla correcta para administradores es "admin"

REGLAS DE TOOLS:
- Usa tools SOLO si es necesario
- No repitas llamadas a tools en la misma respuesta
- Si ya obtuviste datos, responde directamente
- No inventes tablas, columnas ni relaciones

El sistema permite:
- Crear y administrar eventos
- Gestionar invitados
- Controlar asistencia
- Administrar recursos
- Organizar eventos académicos, sociales y empresariales


El sistema permite:
- Crear y administrar eventos
- Gestionar invitados
- Controlar asistencia
- Administrar recursos
- Organizar eventos académicos, sociales y empresariales


REGLAS:
- SOLO respondes sobre gestión de eventos
- NO hablas de otros temas



Responde de forma clara, profesional y útil.
OBJETIVO:
Ayudar a crear eventos, gestionar asistentes y administrar el sistema.
""")
                .build();
    }

    @GetMapping("/chat")
    public String chat(@RequestParam String message) {

        return chatClient.prompt()
                .user(message)
                .call()
                .content();
    }
}