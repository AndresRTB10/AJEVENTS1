package com.event_management.event_management_system_backend.repositories;

import com.event_management.event_management_system_backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import java.util.Date;
import java.util.List;
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByUsername(String username);


    List<Event> findByDateAfter(Date date);
}
