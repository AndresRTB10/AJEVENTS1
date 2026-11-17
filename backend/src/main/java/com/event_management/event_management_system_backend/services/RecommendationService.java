package com.event_management.event_management_system_backend.services;

import com.event_management.event_management_system_backend.model.Attendee;
import com.event_management.event_management_system_backend.model.Event;
import com.event_management.event_management_system_backend.repositories.AttendeeRepository;
import com.event_management.event_management_system_backend.repositories.EventRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class RecommendationService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private AttendeeRepository attendeeRepository;

    @Autowired
    private JavaMailSender mailSender;

    public void sendRecommendations() {

        // 🔹 Obtener todos los eventos
        List<Event> events = eventRepository.findAll();

        // 🔹 Fecha actual
        Date currentDate = new Date();

        // 🔹 Mes y año actual
        Calendar currentCalendar = Calendar.getInstance();

        int currentMonth =
                currentCalendar.get(Calendar.MONTH);

        int currentYear =
                currentCalendar.get(Calendar.YEAR);

        // 🔹 Formato de fecha
        SimpleDateFormat formatter =
                new SimpleDateFormat("dd/MM/yyyy");

        // 🔹 Recorrer eventos
        for (Event currentEvent : events) {

            // 🔹 Obtener asistentes registrados
            List<Attendee> attendees =
                    attendeeRepository.findByEventid(
                            currentEvent.getId()
                    );

            // 🔹 Recorrer asistentes
            for (Attendee attendee : attendees) {

                StringBuilder recommendations =
                        new StringBuilder();

                recommendations.append(
                        "Hola "
                                + attendee.getName()
                                + ",\n\n"
                );

                recommendations.append(
                        "🎉 Eventos recomendados para este mes:\n\n"
                );

                boolean hasRecommendations = false;

                // 🔹 Recorrer todos los eventos
                for (Event recommendedEvent : events) {

                    if (recommendedEvent.getDate() != null) {

                        Calendar eventCalendar =
                                Calendar.getInstance();

                        eventCalendar.setTime(
                                recommendedEvent.getDate()
                        );

                        int eventMonth =
                                eventCalendar.get(Calendar.MONTH);

                        int eventYear =
                                eventCalendar.get(Calendar.YEAR);

                        // 🔥 Restricciones de IO:
                        // ✅ Evento vigente
                        // ✅ Del mes actual
                        // ✅ Del año actual

                        if (
                                !recommendedEvent.getDate().before(currentDate)
                                        && eventMonth == currentMonth
                                        && eventYear == currentYear
                        ) {

                            hasRecommendations = true;

                            recommendations.append(
                                    "🎫 Evento: "
                            );

                            recommendations.append(
                                    recommendedEvent.getName()
                            );

                            recommendations.append("\n");

                            recommendations.append(
                                    "📍 Ciudad: "
                            );

                            recommendations.append(
                                    recommendedEvent.getCity()
                            );

                            recommendations.append(", ");

                            recommendations.append(
                                    recommendedEvent.getCountry()
                            );

                            recommendations.append("\n");

                            recommendations.append(
                                    "📆 Fecha: "
                            );

                            recommendations.append(
                                    formatter.format(
                                            recommendedEvent.getDate()
                                    )
                            );

                            recommendations.append("\n\n");
                        }
                    }
                }

                // 🔹 Si no hay recomendaciones
                if (!hasRecommendations) {

                    recommendations.append(
                            "Actualmente no hay eventos vigentes disponibles.\n\n"
                    );
                }

                recommendations.append(
                        "Gracias por usar AJEVENTS 🚀\n"
                );

                // 🔹 Crear correo
                SimpleMailMessage message =
                        new SimpleMailMessage();

                message.setTo(attendee.getEmail());

                message.setSubject(
                        "🎉 Recomendaciones de eventos vigentes"
                );

                message.setText(
                        recommendations.toString()
                );

                // 🔹 Enviar correo
                mailSender.send(message);

                System.out.println(
                        "✅ Correo enviado a: "
                                + attendee.getEmail()
                );
            }
        }
    }
}