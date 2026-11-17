package com.event_management.event_management_system_backend.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "event")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    private String name;
    private String city;
    private String country;
    private String place;
    private String description;
    private Date date;


    @Column(length = 10)
    private String attendance;  // valores posibles: "baja", "media", "alta"

    // 🧩 NUEVO: resultado del modelo predictivo (para almacenar predicción)
    @Column(length = 10)
    private String predictedAttendance;  // valores predichos por Weka

    public Event() {
    }

    public Event(Long id, String name, String city, String country, String place,
                 String description, Date date, String username,
                 String attendance, String predictedAttendance) {
        this.id = id;
        this.name = name;
        this.city = city;
        this.country = country;
        this.place = place;
        this.description = description;
        this.date = date;
        this.username = username;
        this.attendance = attendance;
        this.predictedAttendance = predictedAttendance;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getPlace() { return place; }
    public void setPlace(String place) { this.place = place; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }

    public String getAttendance() { return attendance; }
    public void setAttendance(String attendance) { this.attendance = attendance; }

    public String getPredictedAttendance() { return predictedAttendance; }
    public void setPredictedAttendance(String predictedAttendance) { this.predictedAttendance = predictedAttendance; }
}
