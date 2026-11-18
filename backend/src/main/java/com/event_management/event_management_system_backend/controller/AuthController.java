package com.event_management.event_management_system_backend.controller;

import com.event_management.event_management_system_backend.Dto.*;
import com.event_management.event_management_system_backend.config.UserAuthenticationProvider;
import com.event_management.event_management_system_backend.mapper.AttendeeMapper;
import com.event_management.event_management_system_backend.mapper.eventMapper;
import com.event_management.event_management_system_backend.model.Attendee;
import com.event_management.event_management_system_backend.model.Event;
import com.event_management.event_management_system_backend.repositories.AttendeeRepository;
import com.event_management.event_management_system_backend.repositories.EventRepository;
import com.event_management.event_management_system_backend.services.AdminService;
import com.event_management.event_management_system_backend.services.EmailService;
import com.event_management.event_management_system_backend.services.QRCodeGenerator;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class AuthController {
    private final AdminService adminService;
    private final UserAuthenticationProvider userAuthenticationProvider;
    private final EventRepository eventRepository;
    private final eventMapper eventMapper;
    private final AttendeeMapper attendeeMapper;
    private final AttendeeRepository attendeeRepository;
    private final EmailService emailService;


    @PostMapping("/login")
    public ResponseEntity<AdminDto> login(@RequestBody @Valid CredentialsDto credentialsDto){
        AdminDto adminDto = adminService.login(credentialsDto);
        adminDto.setToken(userAuthenticationProvider.createToken(adminDto.getUsername()));
        return  ResponseEntity.ok(adminDto);
    }

    @PostMapping("/register")
    public ResponseEntity<AdminDto> register(@RequestBody @Valid SignUpDto signUpDto) throws MessagingException {
        System.out.println(signUpDto);

        AdminDto newAdmin = adminService.register(signUpDto);
        newAdmin.setToken(userAuthenticationProvider.createToken(newAdmin.getUsername()));

        // Email de bienvenida en HTML
        String subject = "🎉 Bienvenido a AJEVENTS 🎉";
        String body = "<div style='font-family: Arial, sans-serif; color: #333;'>"
                + "<h2 style='color: #4CAF50;'>¡Hola " + newAdmin.getUsername() + "!</h2>"
                + "<p>Tu registro en el <b>Sistema de Gestión de Eventos</b> fue <span style='color: green;'>exitoso</span>. ✅</p>"
                + "<p>Ahora puedes disfrutar de todas nuestras funcionalidades:</p>"
                + "<ul>"
                + "  <li>📅 Crear y gestionar eventos</li>"
                + "  <li>👥 Registrar asistentes</li>"
                + "  <li>💬 Recibir notificaciones importantes</li>"
                + "</ul>"
                + "<p style='margin-top:20px;'>Gracias por confiar en nosotros.<br>"
                + "Atentamente, <br><b>El equipo de AJEVENTS</b></p>"
                + "</div>";

                try {
            emailService.sendConfirmationEmail(newAdmin.getEmail(), subject, body);
        } catch (Exception e) {
            System.err.println("No se pudo enviar el correo de bienvenida: " + e.getMessage());
        }

        return ResponseEntity.created(URI.create("/admins/" + newAdmin.getId()))
                .body(newAdmin);
    }

    @PostMapping("/addevent")
    public ResponseEntity<EventDto> addEvent(@RequestBody @Valid EventDto eventDto){
        System.out.println(eventDto);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Event newEvent = eventMapper.eventDtoToEvent(eventDto);
        System.out.println("new events username: "+ newEvent.getUsername());

        Event savedEvent = eventRepository.save(newEvent);
        System.out.println("saved events date: "+ savedEvent.getDate());
        return ResponseEntity.ok(eventDto);
    }

    @GetMapping("/getevent")
    public ResponseEntity<List<EventDto>> getEvents(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AdminDto adminDto = (AdminDto) authentication.getPrincipal();
        String username = adminDto.getUsername();
        //String username = authentication.getName();
        System.out.println("in get events "+ username);

        List<Event> events = eventRepository.findByUsername(username);
        if(!events.isEmpty()) {
            System.out.println(events.get(0).getDate());
        }
        List<EventDto> eventDtoList = eventMapper.listEventToDto(events);
        if(!events.isEmpty()) {
            System.out.println(eventDtoList.get(0).getDate());
        }
        return ResponseEntity.ok(eventDtoList);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id){
        if(eventRepository.existsById(id)){
            eventRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        else return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<EventDto> updateEvent(@PathVariable Long id, @RequestBody EventDto updatedEventDto){
        System.out.println("Updated event: " + updatedEventDto + " prev id: " + id);
        return eventRepository.findById(id)
                .map(
                        event -> {
                            event.setName( updatedEventDto.getName());
                            event.setCity(updatedEventDto.getCity());
                            event.setCountry(updatedEventDto.getCountry());
                            event.setPlace(updatedEventDto.getPlace());
                            event.setDescription(updatedEventDto.getDescription());
                            event.setDate(updatedEventDto.getDate());

                            Event savedEvent = eventRepository.save(event);
                            return ResponseEntity.ok(eventMapper.eventToEventDto(savedEvent));
                        }
                )
                .orElseGet(()-> ResponseEntity.notFound().build());
    }

    @GetMapping("/getallevents")
    public ResponseEntity<List<EventDto>> getAllEvents(){

        List<Event> events = eventRepository.findAll();
        if(!events.isEmpty()) {
            System.out.println(events.get(0).getDate());
        }
        List<EventDto> eventDtoList = eventMapper.listEventToDto(events);
        if(!events.isEmpty()) {
            System.out.println(eventDtoList.get(0).getDate());
        }
        return ResponseEntity.ok(eventDtoList);
    }

    @PostMapping("/addattendee")
    public ResponseEntity<Attendee> addAttendee(@RequestBody @Valid Attendee attendee){
        System.out.println("Nuevo asistente para evento: " + attendee.getEventid());

        Attendee savedAttendee = attendeeRepository.save(attendee);

        try {
            String qrContent = "Asistente: " + savedAttendee.getName()
                    + " | Email: " + savedAttendee.getEmail()
                    + " | EventoID: " + savedAttendee.getEventid();

            byte[] qrCode = QRCodeGenerator.generateQRCode(qrContent, 300, 300);

            emailService.sendEmailWithQR(
                    savedAttendee.getEmail(),
                    "🎟️ Confirmación de Asistencia - Evento #" + savedAttendee.getEventid(),
                    savedAttendee.getName(),
                    qrCode,
                    true
            );

        } catch (Exception e) {
            System.err.println("❌ Error al enviar correo con QR: " + e.getMessage());
        }

        return ResponseEntity.ok(savedAttendee);
    }


    @GetMapping("/attendees/{id}")
    public ResponseEntity<List<Attendee>> getAllAttendees(@PathVariable Long id){

        List<Attendee> attendees = attendeeRepository.findByEventid(id);
        if(!attendees.isEmpty()) {
            System.out.println(attendees.get(0).getEventid());
        }
        return ResponseEntity.ok(attendees);
    }
    @PostMapping("/contact")
    public ResponseEntity<String> contactForm(@RequestBody ContactDto contactDto) {
        try {
            String subject = "📩 Nuevo mensaje de contacto - AJEVENTS";
            String body = "<div style='font-family: Arial, sans-serif; color: #333;'>"
                    + "<h2>Nuevo mensaje desde el formulario de contacto</h2>"
                    + "<p><b>Nombre:</b> " + contactDto.getNombre() + "</p>"
                    + "<p><b>Email:</b> " + contactDto.getEmail() + "</p>"
                    + "<p><b>Mensaje:</b><br>" + contactDto.getMensaje() + "</p>"
                    + "<br><p>⚡ Este correo fue enviado automáticamente desde el sistema AJEVENTS.</p>"
                    + "</div>";

            // Aquí defines el correo donde quieres recibir los mensajes (administrador)
            String adminEmail = "ajeventsctg@gmail.com";

            emailService.sendConfirmationEmail(adminEmail, subject, body);

            return ResponseEntity.ok("✅ Mensaje enviado con éxito");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Error al enviar el mensaje: " + e.getMessage());
        }
    }
}
