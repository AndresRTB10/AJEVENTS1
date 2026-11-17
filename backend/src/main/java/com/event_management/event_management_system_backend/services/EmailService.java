package com.event_management.event_management_system_backend.services;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ByteArrayResource;
import java.io.ByteArrayInputStream;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    // 📌 Correo de confirmación (sin QR)
    public void sendConfirmationEmail(String to, String subject, String username) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;'>"
                + "<div style='max-width: 600px; margin: auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>"
                + "<h2 style='color: #4CAF50; text-align: center;'>🎉 ¡Registro Exitoso!</h2>"
                + "<p style='font-size: 16px; color: #333;'>Hola <b>" + username + "</b>,</p>"
                + "<p style='font-size: 15px; color: #555;'>Gracias por registrarte en <b>AJEVENTS</b>. "
                + "Tu cuenta ha sido creada con éxito y ya puedes empezar a gestionar tus eventos.</p>"
                + "<div style='text-align: center; margin: 20px 0;'>"
                + "<a href='http://localhost:3000/login' style='background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Iniciar Sesión</a>"
                + "</div>"
                + "<p style='font-size: 12px; color: #999; text-align: center;'>Si no fuiste tú quien creó esta cuenta, ignora este mensaje.</p>"
                + "</div></div>";

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true); // true → interpreta HTML
        helper.setFrom("ajeventsctg@gmail.com");

        mailSender.send(mimeMessage);
    }

    // 📌 Correo con QR (adjunto o incrustado en el HTML)

    public void sendEmailWithQR(String to, String subject, String username, byte[] qrCodeBytes, boolean inline) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        // HTML con QR incrustado si inline=true
        String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;'>"
                + "<div style='max-width: 600px; margin: auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>"
                + "<h2 style='color: #2196F3; text-align: center;'>🎟️ Confirmación de Asistencia</h2>"
                + "<p style='font-size: 16px; color: #333;'>Hola <b>" + username + "</b>,</p>"
                + "<p style='font-size: 15px; color: #555;'>Tu asistencia ha sido confirmada. "
                + "Adjuntamos tu <b>código QR</b> para mostrar en la entrada del evento.</p>";

        if (inline) {
            htmlContent += "<div style='text-align: center; margin: 20px 0;'>"
                    + "<img src='cid:qrCodeImage' style='width:200px;height:200px;'/>"
                    + "</div>";
        }

        htmlContent += "<p style='font-size: 12px; color: #999; text-align: center;'>"
                + "Este QR es único e intransferible. Guárdalo bien."
                + "</p></div></div>";

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        helper.setFrom("ajeventsctg@gmail.com");

        if (inline) {
            // incrustar QR en el correo
            helper.addInline("qrCodeImage", new ByteArrayResource(qrCodeBytes), "image/png");
        } else {
            // adjuntar QR como archivo
            helper.addAttachment("asistencia_qr.png", new ByteArrayResource(qrCodeBytes));
        }

        mailSender.send(mimeMessage);
    }
}