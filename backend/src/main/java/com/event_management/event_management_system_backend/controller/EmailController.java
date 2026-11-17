package com.event_management.event_management_system_backend.controller;



import com.event_management.event_management_system_backend.services.EmailService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    // Endpoint para enviar correo de confirmación
    @PostMapping("/send-confirmation")
    public ResponseEntity<?> sendConfirmation(
            @RequestParam String email,
            @RequestParam String nombreUsuario
    ) {
        String subject = "✅ Confirmación de Registro";
        String body = "<h2 style='color:#2E86C1;'>¡Hola " + nombreUsuario + " 🎉!</h2>"
                + "<p>Tu registro en el sistema fue <b>exitoso</b>.</p>"
                + "<p>Gracias por confiar en nuestro servicio. 🙌</p>"
                + "<br><i>Atentamente,<br>El equipo de Gestión de AJEVENTS</i>";

        try {
            emailService.sendConfirmationEmail(email, subject, body);
            return ResponseEntity.ok("{\"status\":\"success\",\"message\":\"Correo enviado a " + email + "\"}");
        } catch (MessagingException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"status\":\"error\",\"message\":\"Error al enviar correo: " + e.getMessage() + "\"}");
        }
    }
}
