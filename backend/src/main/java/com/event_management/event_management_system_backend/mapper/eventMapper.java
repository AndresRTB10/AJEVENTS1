package com.event_management.event_management_system_backend.mapper;

import com.event_management.event_management_system_backend.Dto.EventDto;
import org.mapstruct.Mapper;
import java.util.List;
import com.event_management.event_management_system_backend.model.Event;
@Mapper(componentModel = "spring")
public interface eventMapper {
    Event eventDtoToEvent(EventDto eventDto);
    EventDto eventToEventDto(Event event);
    List<EventDto> listEventToDto(List<Event> events);
}
